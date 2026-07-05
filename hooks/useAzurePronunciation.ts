"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  acquireRecordingSession,
  createRecordingSessionId,
  isRecordingGenerationStale,
  releaseRecordingSession,
  runRecordingStart,
  safeStopAndCloseRecognizer,
  trackRecognizer,
} from "@/lib/azure/recognizerSession";
import { loadSpeechSdk } from "@/lib/azure/loadSpeechSdk";
import type { AzurePronunciationResult, AzureWordScore } from "@/lib/azure/pronunciation";
import { azureReferenceText, useUnscriptedPronunciation } from "@/lib/azure/pronunciation";
import type { EvaluateType } from "@/lib/evaluate/types";
import { preferredRecorderMime } from "@/lib/recordings/platform";
import { toUniversalPlayableBlob } from "@/lib/recordings/toPlayableBlob";

type Segment = AzurePronunciationResult;

export type AzureStopResult = {
  assessment: AzurePronunciationResult | null;
  audioBlob: Blob | null;
};

function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

function mergeSegments(segments: Segment[]): AzurePronunciationResult | null {
  if (!segments.length) return null;
  const words: AzureWordScore[] = [];
  for (const s of segments) words.push(...s.words);

  return {
    accuracyScore: avg(segments.map((s) => s.accuracyScore)),
    fluencyScore: avg(segments.map((s) => s.fluencyScore)),
    completenessScore: avg(segments.map((s) => s.completenessScore)),
    prosodyScore: avg(segments.map((s) => s.prosodyScore)),
    recognizedText: segments.map((s) => s.recognizedText).filter(Boolean).join(" "),
    words,
  };
}

function parseWordScores(json: {
  NBest?: Array<{
    Words?: Array<{
      Word: string;
      AccuracyScore?: number;
      PronunciationAssessment?: { AccuracyScore?: number; ErrorType?: string };
    }>;
  }>;
}): AzureWordScore[] {
  const words = json.NBest?.[0]?.Words ?? [];
  return words.map((w) => {
    const pa = w.PronunciationAssessment;
    return {
      word: w.Word,
      accuracyScore: Math.round(pa?.AccuracyScore ?? w.AccuracyScore ?? 0),
      errorType: pa?.ErrorType ?? "None",
    };
  });
}

export function useAzurePronunciation() {
  const [configured, setConfigured] = useState(false);
  const [assessing, setAssessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AzurePronunciationResult | null>(null);
  const recognizerRef = useRef<{ close: () => void } | null>(null);
  const segmentsRef = useRef<Segment[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const sessionIdRef = useRef(createRecordingSessionId("pronunciation"));
  const generationRef = useRef(0);
  const stoppingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      const rec = recognizerRef.current;
      recognizerRef.current = null;
      safeStopAndCloseRecognizer(rec, () => {
        releaseRecordingSession(sessionIdRef.current);
      });
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        try {
          recorderRef.current.stop();
        } catch {
          /* ignore */
        }
      }
      recorderRef.current = null;
    };
  }, []);

  useEffect(() => {
    fetch("/api/azure-speech-token")
      .then((r) => r.json())
      .then((d) => setConfigured(!!d.configured))
      .catch(() => setConfigured(false));
  }, []);

  const stopMicCapture = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const recorder = recorderRef.current;
      if (!recorder || recorder.state === "inactive") {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        resolve(null);
        return;
      }

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || "audio/mp4";
        const blob =
          chunksRef.current.length > 0 ? new Blob(chunksRef.current, { type: mimeType }) : null;
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        recorderRef.current = null;
        chunksRef.current = [];
        resolve(blob && blob.size > 0 ? blob : null);
      };

      try {
        recorder.stop();
      } catch {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        recorderRef.current = null;
        chunksRef.current = [];
        resolve(null);
      }
    });
  }, []);

  const startMicCapture = useCallback(async () => {
    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = preferredRecorderMime();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.start(1000);
      recorderRef.current = recorder;
    } catch (e) {
      console.warn("[mic] MediaRecorder failed — Azure transcript will save without audio", e);
    }
  }, []);

  const stop = useCallback((): Promise<AzureStopResult> => {
    if (stoppingRef.current) {
      return Promise.resolve({ assessment: mergeSegments(segmentsRef.current), audioBlob: null });
    }
    stoppingRef.current = true;

    return new Promise((resolve) => {
      const rec = recognizerRef.current;
      const generation = generationRef.current;

      const finish = async () => {
        releaseRecordingSession(sessionIdRef.current);
        stoppingRef.current = false;
        if (!mountedRef.current || isRecordingGenerationStale(generation)) {
          resolve({ assessment: null, audioBlob: null });
          return;
        }
        setAssessing(false);
        const merged = mergeSegments(segmentsRef.current);
        setResult(merged);
        const raw = await stopMicCapture();
        const audioBlob = raw ? await toUniversalPlayableBlob(raw) : null;
        resolve({ assessment: merged, audioBlob });
      };

      if (!rec) {
        void finish();
        return;
      }

      recognizerRef.current = null;
      safeStopAndCloseRecognizer(rec, () => {
        void finish();
      });
    });
  }, [stopMicCapture]);

  const startWithReference = useCallback(
    async (referenceText: string) => {
      return runRecordingStart(async () => {
        const reference = referenceText.trim().slice(0, 500);

        setError(null);
        setResult(null);
        segmentsRef.current = [];

        await stop();

        const { acquired, generation } = await acquireRecordingSession(sessionIdRef.current);
        if (!acquired) return;

        generationRef.current = generation;
        await startMicCapture();

        let tokenData: { configured?: boolean; token?: string; region?: string; error?: string };
        try {
          const res = await fetch("/api/azure-speech-token");
          tokenData = await res.json();
        } catch {
          releaseRecordingSession(sessionIdRef.current);
          if (mountedRef.current && !isRecordingGenerationStale(generation)) {
            setError("Could not connect to Azure Speech.");
            setAssessing(false);
          }
          await stopMicCapture();
          return;
        }

        if (!tokenData.configured || !tokenData.token || !tokenData.region) {
          releaseRecordingSession(sessionIdRef.current);
          if (mountedRef.current && !isRecordingGenerationStale(generation)) {
            setError("Azure Speech is not configured. Add AZURE_SPEECH_KEY and AZURE_SPEECH_REGION.");
            setAssessing(false);
          }
          await stopMicCapture();
          return;
        }

        try {
          const sdk = await loadSpeechSdk();
          const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(
            tokenData.token,
            tokenData.region,
          );
          speechConfig.speechRecognitionLanguage = "en-US";

          const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
          const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

          const pronunciationConfig = new sdk.PronunciationAssessmentConfig(
            reference,
            sdk.PronunciationAssessmentGradingSystem.HundredMark,
            sdk.PronunciationAssessmentGranularity.Phoneme,
            !!reference,
          );
          pronunciationConfig.enableProsodyAssessment = true;
          pronunciationConfig.applyTo(recognizer);

          recognizer.recognized = (_, e) => {
            if (isRecordingGenerationStale(generation)) return;
            if (e.result.reason !== sdk.ResultReason.RecognizedSpeech) return;
            const pa = sdk.PronunciationAssessmentResult.fromResult(e.result);
            const jsonRaw = e.result.properties.getProperty(
              sdk.PropertyId.SpeechServiceResponse_JsonResult,
            );
            let words: AzureWordScore[] = [];
            try {
              words = parseWordScores(JSON.parse(jsonRaw));
            } catch {
              /* ignore parse errors */
            }

            segmentsRef.current.push({
              accuracyScore: Math.round(pa.accuracyScore),
              fluencyScore: Math.round(pa.fluencyScore),
              completenessScore: Math.round(pa.completenessScore),
              prosodyScore: Math.round(pa.prosodyScore ?? 0),
              recognizedText: e.result.text,
              words,
            });
          };

          recognizer.canceled = (_, e) => {
            if (isRecordingGenerationStale(generation)) return;
            if (e.reason === sdk.CancellationReason.Error) {
              if (mountedRef.current) {
                setError(e.errorDetails || "Azure recognition error.");
              }
            }
            if (recognizerRef.current === recognizer) {
              recognizerRef.current = null;
            }
            releaseRecordingSession(sessionIdRef.current);
            if (mountedRef.current) setAssessing(false);
            void stopMicCapture();
            safeStopAndCloseRecognizer(recognizer, () => {});
          };

          trackRecognizer(recognizer, sessionIdRef.current, generation);
          recognizerRef.current = recognizer;
          if (mountedRef.current) setAssessing(true);

          recognizer.startContinuousRecognitionAsync(
            () => {},
            (err) => {
              if (isRecordingGenerationStale(generation)) return;
              if (mountedRef.current) {
                setError(err);
                setAssessing(false);
              }
              if (recognizerRef.current === recognizer) {
                recognizerRef.current = null;
              }
              releaseRecordingSession(sessionIdRef.current);
              void stopMicCapture();
              safeStopAndCloseRecognizer(recognizer, () => {});
            },
          );
        } catch (e) {
          releaseRecordingSession(sessionIdRef.current);
          if (mountedRef.current && !isRecordingGenerationStale(generation)) {
            setError(e instanceof Error ? e.message : "Could not start Azure Speech.");
            setAssessing(false);
          }
          await stopMicCapture();
        }
      });
    },
    [startMicCapture, stop, stopMicCapture],
  );

  const start = useCallback(
    async (modelAnswer: string, evaluateType: EvaluateType) => {
      const unscripted = useUnscriptedPronunciation(evaluateType);
      let reference = azureReferenceText(modelAnswer, evaluateType);
      if (!reference.trim() && !unscripted && modelAnswer.trim()) {
        reference = modelAnswer.trim().slice(0, 500);
      }
      await startWithReference(reference);
    },
    [startWithReference],
  );

  const clear = useCallback(() => {
    void stop();
    setResult(null);
    setError(null);
    segmentsRef.current = [];
  }, [stop]);

  return { configured, assessing, error, result, start, startWithReference, stop, clear };
}
