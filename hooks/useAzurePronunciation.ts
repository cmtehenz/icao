"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  acquireRecordingSession,
  forceReleaseRecordingSession,
  isRecordingGenerationStale,
  isRecordingSessionActive,
  releaseRecordingSession,
  resetRecordingStartChain,
  runRecordingStart,
  closeRecognizerOnly,
  stopContinuousRecognition,
  safeStopAndCloseRecognizer,
  trackRecognizer,
  waitForRecordingIdle,
} from "@/lib/azure/recognizerSession";
import {
  ASSESSMENT_DRAIN_MS,
  createAssessmentDrainWait,
  type AssessmentDrainSignal,
} from "@/lib/azure/assessmentDrain";
import { assessmentFailure, type AssessmentFailure } from "@/lib/azure/assessmentFailure";
import {
  AZURE_SPEECH_SDK_PACKAGE_VERSION,
  traceAssessmentError,
  traceAssessmentStep,
} from "@/lib/azure/assessmentTrace";
import { traceAzureStartError, traceAzureStartStep } from "@/lib/azure/azureStartTrace";
import {
  collectSpeechResultPropertyIds,
  hasValidStoredSegments,
  isDuplicateAssessmentSegment,
  isNonSpeechTrailingSegment,
  isTerminalRecognizedCallback,
  isValidAssessmentSegment,
  mergeAssessmentSegments,
  mergeSdkAndJsonAssessment,
  parsePronunciationAssessmentJson,
  parseSdkPronunciationScores,
  resolveStopAssessmentFailure,
} from "@/lib/azure/parsePronunciationAssessment";
import {
  type AzureRecordingPhase,
  MIC_PERMISSION_GUIDANCE,
  MIC_START_FAILED,
  RECORD_STARTUP_TIMEOUTS,
  recordingPhaseLabel as getRecordingPhaseLabel,
  withStartupTimeout,
} from "@/lib/azure/recordingStartup";
import {
  shouldDrainRecognizerOnStop,
  type RecognizerLifecycle,
} from "@/lib/azure/recognizerLifecycle";
import {
  emptyAssessmentMeta,
  ensurePronunciationForceReleaseListener,
  getPronunciationRecordingStore,
  registerPronunciationHookMount,
  scheduleDeferredPronunciationTeardown,
  subscribePronunciationForceRelease,
  teardownPronunciationRecordingStore,
  type AzureStopResult,
} from "@/lib/azure/pronunciationRecordingStore";
import {
  azureConfigStartErrorMessage,
  AZURE_TOKEN_REQUEST_FAILED_MESSAGE,
  isAzureEnvMissing,
  resolveAzureConfigFromResponse,
  traceAzureConfig,
  fetchAzureSpeechConfig,
} from "@/lib/azure/azureSpeechConfig";
import type { AzureSpeechTokenResponse } from "@/lib/azure/speechToken";
import { traceRecordStep } from "@/lib/captainDelta/pronunciationRecordTrace";
import {
  shouldAllowPronunciationStop,
  type PronunciationStopSource,
} from "@/lib/azure/pronunciationStop";
import { loadSpeechSdk } from "@/lib/azure/loadSpeechSdk";
import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import { azureReferenceText, useUnscriptedPronunciation } from "@/lib/azure/pronunciation";
import type { EvaluateType } from "@/lib/evaluate/types";
import { preferredRecorderMime } from "@/lib/recordings/platform";
import { toUniversalPlayableBlob } from "@/lib/recordings/toPlayableBlob";

type Segment = AzurePronunciationResult;

export type { PronunciationStopSource };

export type { AzureRecordingPhase, AssessmentFailure, AzureStopResult };

function rs() {
  return getPronunciationRecordingStore();
}

function isMicPermissionError(err: unknown): boolean {
  if (!(err instanceof DOMException)) return false;
  return err.name === "NotAllowedError" || err.name === "PermissionDeniedError";
}

export function useAzurePronunciation() {
  const [envConfigured, setEnvConfigured] = useState<boolean | null>(null);
  const [configured, setConfigured] = useState(false);
  const [assessing, setAssessing] = useState(false);
  const [recordingPhase, setRecordingPhase] = useState<AzureRecordingPhase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AzurePronunciationResult | null>(null);
  const [recordingReady, setRecordingReady] = useState(false);
  const [lifecycle, setLifecycle] = useState<RecognizerLifecycle>("idle");
  const assessmentDrainSignalRef = useRef<AssessmentDrainSignal | null>(null);
  const mountedRef = useRef(true);

  const starting =
    recordingPhase === "preparing" ||
    recordingPhase === "permission" ||
    recordingPhase === "connecting";

  const recordingPhaseLabel = getRecordingPhaseLabel(recordingPhase);

  const syncReactFromStore = useCallback(() => {
    const s = rs();
    setLifecycle(s.lifecycle);
    if (s.lifecycle === "listening") {
      setRecordingReady(true);
      setAssessing(true);
      setRecordingPhase("recording");
    } else if (s.lifecycle === "stopping") {
      setRecordingReady(false);
      setAssessing(true);
      setRecordingPhase("assessing");
    } else if (s.lifecycle === "starting") {
      setRecordingReady(false);
      setAssessing(false);
      setRecordingPhase((prev) => (prev === "idle" ? "connecting" : prev));
    } else {
      setRecordingReady(false);
      if (s.lifecycle === "idle") setAssessing(false);
    }
  }, []);

  const resetLifecycle = useCallback(() => {
    const s = rs();
    s.lifecycle = "idle";
    s.listeningReady = false;
    s.startListeningPromise = null;
    setRecordingReady(false);
  }, []);

  const waitForSessionIdle = useCallback(async (): Promise<void> => {
    const s = rs();
    if (s.stopPromise) {
      traceRecordStep("awaitStop", "waiting for in-flight stop");
      await s.stopPromise;
    }
    if (s.startListeningPromise && s.lifecycle === "starting") {
      traceRecordStep("awaitStop", "waiting for recognizer start to settle");
      try {
        await s.startListeningPromise;
      } catch {
        /* start failed */
      }
    }
  }, []);

  ensurePronunciationForceReleaseListener();

  useEffect(() => {
    let cancelled = false;
    void fetchAzureSpeechConfig().then((status) => {
      if (cancelled || !mountedRef.current) return;
      if (isAzureEnvMissing(status)) {
        setEnvConfigured(false);
        setConfigured(false);
        return;
      }
      setEnvConfigured(true);
      if (status.hasToken) {
        setConfigured(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const unregisterMount = registerPronunciationHookMount();
    mountedRef.current = true;
    syncReactFromStore();

    const unsubForceRelease = subscribePronunciationForceRelease(() => {
      if (!mountedRef.current) return;
      setAssessing(false);
      setRecordingReady(false);
      setRecordingPhase("idle");
    });

    return () => {
      mountedRef.current = false;
      unsubForceRelease();
      unregisterMount();
      scheduleDeferredPronunciationTeardown(() => {
        teardownPronunciationRecordingStore();
      });
    };
  }, [syncReactFromStore]);

  const stopMicCapture = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const recorder = rs().recorder;
      if (!recorder || recorder.state === "inactive") {
        rs().stream?.getTracks().forEach((t) => t.stop());
        rs().stream = null;
        resolve(null);
        return;
      }

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || "audio/mp4";
        const blob =
          rs().chunks.length > 0 ? new Blob(rs().chunks, { type: mimeType }) : null;
        rs().stream?.getTracks().forEach((t) => t.stop());
        rs().stream = null;
        rs().recorder = null;
        rs().chunks = [];
        resolve(blob && blob.size > 0 ? blob : null);
      };

      try {
        recorder.stop();
      } catch {
        rs().stream?.getTracks().forEach((t) => t.stop());
        rs().stream = null;
        rs().recorder = null;
        rs().chunks = [];
        resolve(null);
      }
    });
  }, []);

  const requestMicCapture = useCallback(async () => {
    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      traceAzureStartStep(2, "before getUserMedia() — skipped (no MediaRecorder/getUserMedia)");
      return;
    }

    traceAzureStartStep(2, "before getUserMedia()");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    traceAzureStartStep(3, "after getUserMedia()", {
      trackCount: stream.getTracks().length,
      labels: stream.getTracks().map((t) => t.label),
    });
    rs().stream = stream;
    const mimeType = preferredRecorderMime();
    const recorder = mimeType
      ? new MediaRecorder(stream, { mimeType })
      : new MediaRecorder(stream);
    rs().chunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) rs().chunks.push(e.data);
    };
    recorder.start(1000);
    rs().recorder = recorder;
  }, []);

  const abandonRecordingSession = useCallback(
    (recognizer: { close: () => void } | null) => {
      releaseRecordingSession(rs().sessionId);
      if (recognizer && rs().recognizer === recognizer) {
        rs().recognizer = null;
      }
      rs().lifecycle = "idle";
      rs().listeningReady = false;
      rs().startListeningPromise = null;
      if (mountedRef.current) {
        setAssessing(false);
        setRecordingReady(false);
        setRecordingPhase("idle");
      }
      void stopMicCapture();
      if (recognizer) safeStopAndCloseRecognizer(recognizer, () => {});
    },
    [stopMicCapture],
  );

  const cleanupStartupFailure = useCallback(async () => {
    rs().stopPromise = null;
    rs().stopping = false;
    const rec = rs().recognizer;
    rs().recognizer = null;
    resetLifecycle();
    if (rec) safeStopAndCloseRecognizer(rec, () => {});
    resetRecordingStartChain();
    forceReleaseRecordingSession(rs().sessionId);
    await stopMicCapture();
    if (mountedRef.current) {
      setAssessing(false);
      setRecordingReady(false);
      setRecordingPhase("idle");
    }
  }, [resetLifecycle, stopMicCapture]);

  const failStartup = useCallback(
    async (message: string) => {
      await cleanupStartupFailure();
      if (mountedRef.current) setError(message);
      throw new Error(message);
    },
    [cleanupStartupFailure],
  );

  const stop = useCallback((source: PronunciationStopSource = "unknown"): Promise<AzureStopResult> => {
    const lifecycleNow = rs().lifecycle;
    traceAssessmentStep(6, "stop requested", { source, lifecycle: lifecycleNow });

    if (!shouldAllowPronunciationStop(lifecycleNow, source)) {
      traceAssessmentStep(6, "stop ignored — not allowed for lifecycle/source", {
        source,
        lifecycle: lifecycleNow,
      });
      return Promise.resolve({ assessment: null, audioBlob: null, failure: null });
    }

    const inFlight = rs().stopPromise;
    if (inFlight) return inFlight;

    const promise = new Promise<AzureStopResult>((resolve) => {
      void (async () => {
        const rec = rs().recognizer;
        const generation = rs().generation;
        const lifecycle = rs().lifecycle;

        if (source === "user_click" && lifecycle !== "listening") {
          traceAssessmentStep(6, "stop ignored — user_click outside listening", {
            source,
            lifecycle,
          });
          rs().stopPromise = null;
          resolve({ assessment: null, audioBlob: null, failure: null });
          return;
        }

        const metaAtStop = { ...rs().assessmentMeta };
        const canDrain = shouldDrainRecognizerOnStop(lifecycle) && !!rec;

        if (!canDrain) {
          const idleNoop =
            lifecycle === "idle" &&
            !rec &&
            rs().segments.length === 0 &&
            !rs().assessmentMeta.sawNoMatch;
          if (idleNoop) {
            rs().stopPromise = null;
            resolve({ assessment: null, audioBlob: null, failure: null });
            return;
          }

          const merged = mergeAssessmentSegments(
            rs().segments,
            rs().assessmentMeta.referenceText,
          );
          const failure =
            merged == null
              ? resolveStopAssessmentFailure(merged, {
                  segmentCount: rs().assessmentMeta.segmentCount,
                  staleGeneration: isRecordingGenerationStale(generation),
                  hadRecognizer: false,
                  sawNoMatch: metaAtStop.sawNoMatch,
                  sawCancellation: metaAtStop.sawCancellation,
                  configAttached: metaAtStop.configAttached,
                  recognizerMatch: true,
                  referenceText: metaAtStop.referenceText,
                  scripted: metaAtStop.scripted,
                  lifecycle,
                })
              : null;
          traceAssessmentStep(7, "stop skipped — no active recognizer", {
            source,
            lifecycle,
            hasSegments: !!merged,
            failure,
          });
          rs().stopping = false;
          rs().stopPromise = null;
          if (mountedRef.current) {
            setAssessing(false);
            setRecordingReady(false);
            setRecordingPhase("idle");
            resetLifecycle();
          }
          const raw = await stopMicCapture();
          const audioBlob = raw ? await toUniversalPlayableBlob(raw) : null;
          resolve({ assessment: merged, audioBlob, failure });
          return;
        }

        rs().stopping = true;
        rs().lifecycle = "stopping";
        if (mountedRef.current) setRecordingPhase("assessing");

        const finish = async () => {
          releaseRecordingSession(rs().sessionId);
          rs().stopping = false;
          rs().stopPromise = null;
          rs().recognizer = null;
          rs().lifecycle = "idle";
          rs().listeningReady = false;
          rs().startListeningPromise = null;

          const staleGeneration = isRecordingGenerationStale(generation);
          const merged = staleGeneration
            ? null
            : mergeAssessmentSegments(rs().segments, metaAtStop.referenceText);
          const failure =
            merged == null
              ? resolveStopAssessmentFailure(merged, {
                  segmentCount: rs().segments.length,
                  staleGeneration,
                  hadRecognizer: true,
                  sawNoMatch: metaAtStop.sawNoMatch,
                  sawCancellation: metaAtStop.sawCancellation,
                  configAttached: metaAtStop.configAttached,
                  recognizerMatch: metaAtStop.configuredRecognizer === rec,
                  referenceText: metaAtStop.referenceText,
                  scripted: metaAtStop.scripted,
                  lifecycle: "stopping",
                })
              : null;

          if (failure) {
            traceAssessmentStep(7, "assessment null — reason", failure);
          } else if (merged) {
            traceAssessmentStep(7, "parsed assessment", {
              accuracy: merged.accuracyScore,
              fluency: merged.fluencyScore,
              completeness: merged.completenessScore,
              prosody: merged.prosodyScore,
              recognizedText: merged.recognizedText,
              wordCount: merged.words.length,
            });
          }

          if (!mountedRef.current) {
            resolve({ assessment: null, audioBlob: null, failure });
            return;
          }
          setRecordingPhase("idle");
          setAssessing(false);
          setRecordingReady(false);
          setResult(merged);
          const raw = await stopMicCapture();
          const audioBlob = raw ? await toUniversalPlayableBlob(raw) : null;
          resolve({ assessment: merged, audioBlob, failure });
        };

        const segmentCountBefore = rs().segments.length;
        const drain = createAssessmentDrainWait(ASSESSMENT_DRAIN_MS);
        assessmentDrainSignalRef.current = drain.signal;

        traceAssessmentStep(6, "stop requested — draining for late recognized", {
          source,
          segmentCountBefore,
          lifecycle,
        });

        stopContinuousRecognition(rec!, () => {
          traceAssessmentStep(6, "stopContinuousRecognitionAsync completed — still draining");
        });

        const drainResult = await drain.wait();
        assessmentDrainSignalRef.current = null;

        traceAssessmentStep(6, "drain complete — closing recognizer", {
          ...drainResult,
          segmentCountAfter: rs().segments.length,
          gainedSegments: rs().segments.length - segmentCountBefore,
        });

        closeRecognizerOnly(rec!, () => {});
        await finish();
      })();
    });
    rs().stopPromise = promise;
    return promise;
  }, [resetLifecycle, stopMicCapture]);

  const startWithReference = useCallback(
    async (referenceText: string) => {
      if (mountedRef.current) {
        setError(null);
        setRecordingPhase("preparing");
      }
      traceRecordStep("azureStart", referenceText.slice(0, 40));

      const idle = await waitForRecordingIdle(RECORD_STARTUP_TIMEOUTS.waitIdle);
      traceAzureStartStep(1, "after waitForRecordingIdle", { idle });
      if (!idle) {
        await failStartup(MIC_START_FAILED);
        return;
      }

      return runRecordingStart(async () => {
        const reference = referenceText.trim().slice(0, 500);

        setError(null);
        setResult(null);
        rs().segments = [];
        rs().assessmentMeta = emptyAssessmentMeta();
        resetLifecycle();
        if (mountedRef.current) setRecordingPhase("preparing");

        await waitForSessionIdle();

        if (rs().recognizer && shouldDrainRecognizerOnStop(rs().lifecycle)) {
          traceRecordStep("awaitStop", "stopping stale listening recognizer");
          const stale = rs().recognizer;
          rs().recognizer = null;
          rs().stopPromise = null;
          rs().stopping = false;
          safeStopAndCloseRecognizer(stale, () => {});
          resetLifecycle();
          await waitForSessionIdle();
        } else if (rs().recognizer) {
          const stale = rs().recognizer;
          rs().recognizer = null;
          rs().stopPromise = null;
          rs().stopping = false;
          safeStopAndCloseRecognizer(stale, () => {});
          resetLifecycle();
        }

        traceRecordStep("awaitStop", "done");
        traceAzureStartStep(1, "after awaitStop");

        traceRecordStep("acquireSession", rs().sessionId);
        let acquired = false;
        let generation = rs().generation;
        try {
          ({ acquired, generation } = await withStartupTimeout(
            acquireRecordingSession(rs().sessionId),
            RECORD_STARTUP_TIMEOUTS.acquire,
            "acquireSession",
          ));
        } catch (e) {
          traceAzureStartError(1, "acquireRecordingSession failed", e);
          await failStartup(MIC_START_FAILED);
          return;
        }
        traceAzureStartStep(1, "after acquireSession", { acquired, generation });

        if (!acquired) {
          try {
            forceReleaseRecordingSession(rs().sessionId);
            ({ acquired, generation } = await withStartupTimeout(
              acquireRecordingSession(rs().sessionId),
              RECORD_STARTUP_TIMEOUTS.acquire,
              "acquireSession",
            ));
          } catch (e) {
            traceAzureStartError(1, "acquireRecordingSession retry failed", e);
            await failStartup(MIC_START_FAILED);
            return;
          }
        }

        if (!acquired) {
          traceRecordStep("acquireFailed", "mutex busy");
          traceAzureStartStep(1, "BLOCKED at acquireSession — mutex busy");
          await failStartup("Microphone is busy. Try again.");
          return;
        }

        rs().generation = generation;

        if (mountedRef.current) setRecordingPhase("permission");
        try {
          await withStartupTimeout(
            requestMicCapture(),
            RECORD_STARTUP_TIMEOUTS.getUserMedia,
            "getUserMedia",
          );
        } catch (e) {
          traceAzureStartError(3, "getUserMedia() failed", e);
          if (isMicPermissionError(e)) {
            await failStartup(MIC_PERMISSION_GUIDANCE);
            return;
          }
          await failStartup(MIC_START_FAILED);
          return;
        }

        if (mountedRef.current) setRecordingPhase("connecting");

        let tokenData: AzureSpeechTokenResponse;
        let tokenStatus: ReturnType<typeof resolveAzureConfigFromResponse>;
        try {
          traceAzureStartStep(1, "before fetch /api/azure-speech-token");
          const res = await fetch("/api/azure-speech-token");
          tokenData = (await res.json()) as AzureSpeechTokenResponse;
          tokenStatus = resolveAzureConfigFromResponse(res, tokenData);
          traceAzureConfig(tokenStatus);
          traceAzureStartStep(1, "after fetch /api/azure-speech-token", {
            ok: res.ok,
            status: res.status,
            configured: tokenStatus.configured,
            hasToken: tokenStatus.hasToken,
            region: tokenStatus.region,
          });
        } catch (e) {
          traceAzureStartError(1, "fetch /api/azure-speech-token failed", e);
          await failStartup(AZURE_TOKEN_REQUEST_FAILED_MESSAGE);
          return;
        }

        if (isAzureEnvMissing(tokenStatus)) {
          setEnvConfigured(false);
          setConfigured(false);
          traceAzureStartStep(1, "BLOCKED at token check — env missing", tokenStatus);
          releaseRecordingSession(rs().sessionId);
          await stopMicCapture();
          const message = azureConfigStartErrorMessage(tokenStatus);
          if (mountedRef.current && !isRecordingGenerationStale(generation)) {
            setError(message);
          }
          throw new Error(message);
        }

        if (!tokenStatus.hasToken) {
          traceAzureStartStep(1, "BLOCKED at token check — token unavailable", tokenStatus);
          releaseRecordingSession(rs().sessionId);
          await stopMicCapture();
          const message = azureConfigStartErrorMessage(tokenStatus);
          if (mountedRef.current && !isRecordingGenerationStale(generation)) {
            setError(message);
          }
          throw new Error(message);
        }

        setEnvConfigured(true);
        setConfigured(true);

        try {
          traceAzureStartStep(1, "before loadSpeechSdk()");
          const sdk = await loadSpeechSdk();
          traceAzureStartStep(1, "after loadSpeechSdk()");

          traceAssessmentStep(1, "SpeechConfig created", {
            sdkPackageVersion: AZURE_SPEECH_SDK_PACKAGE_VERSION,
            region: tokenData!.region,
            language: "en-US",
          });
          traceAzureStartStep(4, "before SpeechConfig");
          const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(
            tokenData!.token!,
            tokenData!.region!,
          );
          speechConfig.speechRecognitionLanguage = "en-US";
          traceAzureStartStep(5, "after SpeechConfig");

          traceAzureStartStep(6, "before AudioConfig.fromDefaultMicrophoneInput()");
          const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
          traceAzureStartStep(7, "after AudioConfig");

          traceAzureStartStep(8, "before new SpeechRecognizer()");
          const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
          traceAzureStartStep(9, "after recognizer created");
          rs().lifecycle = "starting";

          const pronunciationConfig = new sdk.PronunciationAssessmentConfig(
            reference,
            sdk.PronunciationAssessmentGradingSystem.HundredMark,
            sdk.PronunciationAssessmentGranularity.Phoneme,
            !!reference,
          );
          pronunciationConfig.enableProsodyAssessment = true;
          traceAssessmentStep(2, "PronunciationAssessmentConfig created", {
            referenceText: reference,
            gradingSystem: "HundredMark",
            granularity: "Phoneme",
            phonemeAlphabet:
              "phonemeAlphabet" in pronunciationConfig
                ? (pronunciationConfig as { phonemeAlphabet?: string }).phonemeAlphabet
                : "IPA (default)",
            enableMiscue: !!reference,
            enableProsodyAssessment: pronunciationConfig.enableProsodyAssessment,
            scripted: !!reference,
          });

          pronunciationConfig.applyTo(recognizer);
          rs().assessmentMeta = {
            referenceText: reference,
            scripted: !!reference,
            configAttached: true,
            configuredRecognizer: recognizer,
            sawNoMatch: false,
            sawCancellation: false,
            segmentCount: 0,
          };
          traceAssessmentStep(3, "PronunciationAssessmentConfig.applyTo(recognizer) success", {
            recognizerIdentity: "single-recognizer",
            sameRecognizer: rs().assessmentMeta.configuredRecognizer === recognizer,
          });

          recognizer.recognized = (_, e) => {
            const propertyDump = collectSpeechResultPropertyIds(
              e.result.properties,
              sdk.PropertyId as Record<string, unknown>,
            );
            traceAssessmentStep(5, "recognized callback — complete result", {
              reason: e.result.reason,
              text: e.result.text,
              duration: e.result.duration,
              offset: e.result.offset,
              properties: propertyDump,
              jsonResult: propertyDump.SpeechServiceResponse_JsonResult?.slice(0, 1200),
              jsonError: propertyDump.SpeechServiceResponse_JsonErrorDetails,
            });
            if (isRecordingGenerationStale(generation)) {
              traceAssessmentStep(5, "recognized ignored — stale generation", { generation });
              return;
            }

            const jsonRaw = e.result.properties.getProperty(
              sdk.PropertyId.SpeechServiceResponse_JsonResult,
            );
            let sdkScores = null;
            try {
              const pa = sdk.PronunciationAssessmentResult.fromResult(e.result);
              sdkScores = parseSdkPronunciationScores(pa);
              if (sdkScores) {
                traceAssessmentStep(6, "PronunciationAssessmentResult.fromResult", sdkScores);
              }
            } catch (parseErr) {
              traceAssessmentError(6, "PronunciationAssessmentResult.fromResult failed", parseErr);
            }

            const hasValidStored = hasValidStoredSegments(rs().segments);
            if (
              hasValidStored &&
              (e.result.reason === sdk.ResultReason.NoMatch ||
                isTerminalRecognizedCallback({
                  recognizedText: e.result.text,
                  jsonRaw,
                  sdkScores,
                }))
            ) {
              traceAssessmentStep(5, "ignored terminal recognized callback", {
                reason: e.result.reason,
                text: e.result.text,
                hasValidStored,
              });
              return;
            }

            if (e.result.reason === sdk.ResultReason.NoMatch) {
              rs().assessmentMeta.sawNoMatch = true;
              traceAssessmentStep(5, "recognized NoMatch — no assessment segment", {
                text: e.result.text,
              });
              return;
            }
            if (e.result.reason !== sdk.ResultReason.RecognizedSpeech) {
              traceAssessmentStep(5, "recognized skipped — unexpected reason", {
                reason: e.result.reason,
              });
              return;
            }

            if (
              isTerminalRecognizedCallback({
                recognizedText: e.result.text,
                jsonRaw,
                sdkScores,
              })
            ) {
              traceAssessmentStep(5, "ignored terminal recognized callback", {
                reason: e.result.reason,
                text: e.result.text,
                hasValidStored,
              });
              return;
            }

            const jsonParsed = parsePronunciationAssessmentJson(jsonRaw, e.result.text);
            if (jsonParsed.failure) {
              traceAssessmentStep(6, "JSON pronunciation parse failure", jsonParsed.failure);
            } else if (jsonParsed.assessment) {
              traceAssessmentStep(6, "JSON pronunciation parse success", {
                accuracy: jsonParsed.assessment.accuracyScore,
                fluency: jsonParsed.assessment.fluencyScore,
                completeness: jsonParsed.assessment.completenessScore,
                prosody: jsonParsed.assessment.prosodyScore,
              });
            }

            const merged = mergeSdkAndJsonAssessment(sdkScores, jsonParsed, e.result.text);
            if (!merged.assessment || !isValidAssessmentSegment(merged.assessment)) {
              if (
                isNonSpeechTrailingSegment(
                  merged.assessment ?? {
                    accuracyScore: sdkScores?.accuracyScore ?? 0,
                    fluencyScore: sdkScores?.fluencyScore ?? 0,
                    completenessScore: sdkScores?.completenessScore ?? 0,
                    prosodyScore: sdkScores?.prosodyScore ?? 0,
                    recognizedText: e.result.text,
                    words: [],
                  },
                )
              ) {
                traceAssessmentStep(5, "ignored non-speech trailing segment", {
                  text: e.result.text,
                  hasValidStored,
                });
              } else {
                traceAssessmentStep(6, "segment not stored — no assessment", merged.failure);
              }
              return;
            }

            if (isDuplicateAssessmentSegment(rs().segments, merged.assessment)) {
              traceAssessmentStep(5, "ignored duplicate assessment segment", {
                text: merged.assessment.recognizedText,
                accuracy: merged.assessment.accuracyScore,
              });
              return;
            }

            rs().segments.push(merged.assessment);
            rs().assessmentMeta.segmentCount = rs().segments.length;
            const storedIndex = rs().segments.length - 1;
            traceAssessmentStep(6, "segment stored", {
              segmentIndex: storedIndex,
              segmentCount: rs().segments.length,
              accuracy: merged.assessment.accuracyScore,
              recognizedText: merged.assessment.recognizedText,
              duringDrain: rs().stopping,
            });
            if (rs().stopping) {
              assessmentDrainSignalRef.current?.onLateRecognized();
            }
          };

          recognizer.sessionStopped = (_, e) => {
            traceAzureStartStep(13, "sessionStopped", e);
            traceAssessmentStep(6, "sessionStopped", {
              duringDrain: rs().stopping,
            });
            if (rs().stopping) {
              assessmentDrainSignalRef.current?.onSessionStopped();
            }
          };

          recognizer.canceled = (_, e) => {
            rs().assessmentMeta.sawCancellation = true;
            traceAzureStartStep(14, "canceled", {
              reason: e.reason,
              errorCode: e.errorCode,
              errorDetails: e.errorDetails,
            });
            traceAssessmentStep(6, "recognition cancelled", {
              reason: e.reason,
              errorDetails: e.errorDetails,
            });
            if (isRecordingGenerationStale(generation)) {
              abandonRecordingSession(recognizer);
              return;
            }
            if (e.reason === sdk.CancellationReason.Error) {
              if (mountedRef.current) {
                setError(e.errorDetails || "Azure recognition error.");
              }
            }
            abandonRecordingSession(recognizer);
          };

          if (rs().assessmentMeta.configuredRecognizer !== recognizer) {
            traceAssessmentError(4, "recognizer mismatch before start", {
              configured: rs().assessmentMeta.configuredRecognizer,
              active: recognizer,
            });
            await failStartup(
              assessmentFailure("recognizer_mismatch").userMessage,
            );
            return;
          }

          trackRecognizer(recognizer, rs().sessionId, generation);
          rs().recognizer = recognizer;

          traceRecordStep("assessingTrue", "pending startContinuousRecognitionAsync");
          traceAssessmentStep(4, "before startContinuousRecognitionAsync()", {
            sameRecognizer:
              rs().assessmentMeta.configuredRecognizer === recognizer &&
              rs().recognizer === recognizer,
            referenceText: rs().assessmentMeta.referenceText,
            lifecycle: rs().lifecycle,
          });
          traceAzureStartStep(10, "before startContinuousRecognitionAsync()");

          const startListening = new Promise<void>((resolve, reject) => {
            recognizer.startContinuousRecognitionAsync(
              () => {
                rs().lifecycle = "listening";
                rs().listeningReady = true;
                traceAzureStartStep(11, "recognizer started");
                traceRecordStep("recognizerStart");
                if (mountedRef.current) {
                  setAssessing(true);
                  setRecordingReady(true);
                  setRecordingPhase("recording");
                }
                resolve();
              },
              (err) => {
                console.error(
                  "[AzureStart] STEP 11 ERROR: startContinuousRecognitionAsync error callback",
                  err,
                );
                reject(err);
              },
            );
          });
          rs().startListeningPromise = startListening;
          await startListening;
          rs().startListeningPromise = null;
        } catch (e) {
          console.error("[AzureStart] STEP 0 ERROR: startWithReference inner try failed", e);
          if (e instanceof Error) {
            console.error("[AzureStart] STEP 0 ERROR stack:", e.stack);
          }
          await failStartup(
            e instanceof Error && e.message ? e.message : MIC_START_FAILED,
          );
        }
      });
    },
    [abandonRecordingSession, failStartup, requestMicCapture, resetLifecycle, stop, stopMicCapture, waitForSessionIdle],
  );

  const start = useCallback(
    async (modelAnswer: string, evaluateType: EvaluateType) => {
      const unscripted = useUnscriptedPronunciation(evaluateType, modelAnswer);
      let reference = azureReferenceText(modelAnswer, evaluateType);
      if (!reference.trim() && !unscripted && modelAnswer.trim()) {
        reference = modelAnswer.trim().slice(0, 500);
      }
      await startWithReference(reference);
    },
    [startWithReference],
  );

  const clear = useCallback((source: PronunciationStopSource = "word_clear") => {
    const s = rs();
    const busy =
      s.lifecycle === "starting" ||
      s.lifecycle === "listening" ||
      s.lifecycle === "stopping";
    if (busy) {
      traceAssessmentStep(6, "clear skipped — recorder busy", {
        source,
        lifecycle: s.lifecycle,
      });
      return;
    }
    s.stopPromise = null;
    s.stopping = false;
    if (s.recognizer) {
      const stale = s.recognizer;
      s.recognizer = null;
      safeStopAndCloseRecognizer(stale, () => {});
    }
    setResult(null);
    setError(null);
    setRecordingPhase("idle");
    s.segments = [];
    s.assessmentMeta = emptyAssessmentMeta();
    resetLifecycle();
  }, [resetLifecycle]);

  return {
    configured,
    envConfigured,
    envMissing: envConfigured === false,
    assessing,
    recordingReady,
    lifecycle,
    starting,
    recordingPhase,
    recordingPhaseLabel,
    error,
    result,
    start,
    startWithReference,
    stop,
    clear,
  };
}
