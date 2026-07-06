"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useAzurePronunciation } from "@/hooks/useAzurePronunciation";
import { useAzureSpeech } from "@/hooks/useAzureSpeech";
import { usePronunciationCaptainBridge } from "@/hooks/usePronunciationCaptainBridge";
import { formatAssessmentFailureMessage } from "@/lib/azure/assessmentFailure";
import { forceReleaseRecordingSession, isRecordingMutexHeld } from "@/lib/azure/recognizerSession";
import { emitCaptainDeltaSuggestion } from "@/lib/captainDelta/events";
import { emitStopCaptainVoice, CAPTAIN_DELTA_RECORD_BLOCKED } from "@/lib/captainDelta/lessonContext";
import {
  pronunciationRecordBlockLabel,
  resolvePronunciationRecordBlockReason,
} from "@/lib/captainDelta/pronunciationRecordReason";
import { traceRecordStep } from "@/lib/captainDelta/pronunciationRecordTrace";
import { buildPronunciationFocusPlan } from "@/lib/captainDelta/visual/plans";
import { emitVisualPlan } from "@/lib/captainDelta/visual/events";
import { splitSyllables } from "@/lib/captainDelta/visual/syllables";
import {
  captainFeedbackAfterAttempt,
  captainFeedbackBelowStoredLevel,
  buildCaptainAssessmentDebrief,
} from "@/lib/pronunciationCoach";
import { practiceTextForLevel } from "@/lib/pronunciationMission";
import {
  isPronunciationWordInTodayMission,
  markPronunciationDailyWordComplete,
  passesDailyMissionWordAttempt,
} from "@/lib/pronunciationDailyMission";
import {
  canStartPronunciationRecording,
  canStopPronunciationRecording,
  derivePronunciationRecorderUi,
  INITIAL_PRONUNCIATION_RECORDING_STATE,
  isPronunciationRecordingActive,
  phaseToGateLifecycle,
  reducePronunciationRecording,
  type PronunciationRecordingControllerState,
  type PronunciationRecorderUiState,
} from "@/lib/pronunciation/pronunciationRecordingController";
import { markWarmupSatisfied } from "@/lib/part2Warmup";
import {
  loadVault,
  recordWordPractice,
  VAULT_PASS_SCORE,
  type PracticeLevel,
  type VaultWord,
} from "@/lib/pronunciationVault";
import {
  studyActivityRejectReason,
  tryRecordStudyActivity,
} from "@/lib/studyActivityRecord";
import type { PronunciationMission } from "@/lib/pronunciationMission";

const AZURE_RECOVERY_GUIDANCE = "Listen → slow down → retry.";

export type PronunciationRecordingControllerApi = {
  state: PronunciationRecordingControllerState;
  micUi: PronunciationRecorderUiState;
  configured: boolean;
  captainNote: string | null;
  recordNotice: string | null;
  activityNote: string | null;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  reset: () => void;
  listen: () => Promise<void>;
};

type Options = {
  activeWord: VaultWord | null;
  practiceLevel: PracticeLevel;
  missionLegActive: boolean;
  mission: PronunciationMission | null;
  onVaultRefresh: () => void;
  onMissionProgress: (completed: string[]) => void;
  onSelectNextMissionWord: (completed: string[]) => void;
  onWordAdvanced: (word: VaultWord, level: PracticeLevel) => void;
  onWordCleared: () => void;
};

function browserSupportsRecording(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof MediaRecorder !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia
  );
}

/** Single controller for /pronunciation recording — owns state machine + Azure I/O. */
export function usePronunciationRecordingController(
  options: Options,
): PronunciationRecordingControllerApi {
  const {
    activeWord,
    practiceLevel,
  } = options;

  const azure = useAzurePronunciation();
  const speech = useAzureSpeech();
  const [state, dispatch] = useReducer(
    reducePronunciationRecording,
    INITIAL_PRONUNCIATION_RECORDING_STATE,
  );
  const stateRef = useRef(state);
  stateRef.current = state;
  const [captainNote, setCaptainNote] = useState<string | null>(null);
  const [recordNotice, setRecordNotice] = useState<string | null>(null);
  const [activityNote, setActivityNote] = useState<string | null>(null);
  const startInFlightRef = useRef(false);
  const stopInFlightRef = useRef(false);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const micUi = useMemo(() => derivePronunciationRecorderUi(state), [state]);

  useEffect(() => {
    const onBlocked = (e: Event) => {
      const reason = (e as CustomEvent<{ reason: string }>).detail?.reason;
      if (reason) setRecordNotice(reason);
    };
    window.addEventListener(CAPTAIN_DELTA_RECORD_BLOCKED, onBlocked);
    return () => window.removeEventListener(CAPTAIN_DELTA_RECORD_BLOCKED, onBlocked);
  }, []);

  const recordGate = useCallback(
    () => ({
      activeWord: !!activeWord,
      azureConfigured: azure.configured,
      lifecycle: phaseToGateLifecycle(stateRef.current.phase),
      assessingPending: stateRef.current.phase === "assessing",
      listenPlaying: speech.speaking,
      captainSpeaking: false,
      recognizerBusy: isRecordingMutexHeld() && stateRef.current.phase === "idle",
      browserSupported: browserSupportsRecording(),
    }),
    [activeWord, azure.configured, speech.speaking],
  );

  const reset = useCallback(() => {
    dispatch({ type: "reset" });
    setCaptainNote(null);
    setRecordNotice(null);
    if (!isPronunciationRecordingActive(stateRef.current.phase)) {
      azure.clear("word_clear");
    }
  }, [azure]);

  const start = useCallback(async () => {
    if (startInFlightRef.current) return;
    if (!canStartPronunciationRecording(stateRef.current)) return;
    if (!activeWord) {
      const label = pronunciationRecordBlockLabel("no_active_word");
      setRecordNotice(label);
      return;
    }

    startInFlightRef.current = true;
    traceRecordStep("handlePrimaryRecord", "captainStart");

    try {
      emitStopCaptainVoice();
      if (speech.speaking) speech.stopSpeaking();

      if (isRecordingMutexHeld()) {
        forceReleaseRecordingSession();
      }

      let blockReason = resolvePronunciationRecordBlockReason(recordGate());
      if (blockReason === "recognizer_busy") {
        forceReleaseRecordingSession();
        blockReason = resolvePronunciationRecordBlockReason(recordGate());
      }
      if (blockReason) {
        const label = pronunciationRecordBlockLabel(blockReason);
        traceRecordStep("gate_blocked", `${blockReason}: ${label}`);
        setRecordNotice(label);
        return;
      }

      const text = practiceTextForLevel(activeWord, practiceLevel);
      const type = practiceLevel >= 4 ? "part1" : "part2-readback";

      setCaptainNote(null);
      setRecordNotice(null);
      setActivityNote(null);

      dispatch({
        type: "start_requested",
        word: activeWord.word,
        referenceText: text,
        practiceLevel,
        phaseLabel: azure.recordingPhaseLabel,
      });

      traceRecordStep("gate_pass");
      traceRecordStep("startRecording");

      try {
        await azure.start(text, type);
        dispatch({
          type: "recording_started",
          phaseLabel: "Recording — speak now",
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Recording failed to start.";
        traceRecordStep("error", message);
        dispatch({ type: "start_failed", message });
        setRecordNotice(message);
      }
    } finally {
      startInFlightRef.current = false;
    }
  }, [activeWord, azure, practiceLevel, recordGate, speech]);

  const stop = useCallback(async () => {
    if (stopInFlightRef.current) return;
    if (!canStopPronunciationRecording(stateRef.current)) {
      traceRecordStep("error", "recognizer_not_ready");
      return;
    }
    if (!activeWord) return;

    stopInFlightRef.current = true;
    dispatch({ type: "assessing_started" });

    try {
      const { assessment, failure } = await azure.stop("user_click");

      if (!assessment) {
        const message = formatAssessmentFailureMessage(failure, AZURE_RECOVERY_GUIDANCE);
        traceRecordStep("error", failure?.code ?? "assessment_unavailable");
        dispatch({ type: "assessment_error", message });
        setCaptainNote(message);
        emitCaptainDeltaSuggestion({
          text: message,
          speechText: failure?.userMessage ?? "Assessment unavailable.",
          kind: "coaching",
          primaryAction: { id: "try_again", label: "Try again", primary: true },
          secondaryActions: [{ id: "slow_audio", label: "🎧 Slow Audio", primary: false }],
        });
        return;
      }

      const score = assessment.accuracyScore ?? 0;
      dispatch({ type: "assessment_success", assessment, score });

      const outcome = recordWordPractice(activeWord.word, score, practiceLevel);
      optionsRef.current.onVaultRefresh();

      const updated = loadVault().find(
        (w) => w.word.toLowerCase() === activeWord.word.toLowerCase(),
      );
      const status = outcome.status;
      const belowLevel =
        updated && captainFeedbackBelowStoredLevel(updated, practiceLevel);
      const feedback =
        belowLevel ??
        captainFeedbackAfterAttempt(updated ?? activeWord, score, practiceLevel, status);

      const missionPass =
        optionsRef.current.missionLegActive &&
        optionsRef.current.mission &&
        isPronunciationWordInTodayMission(activeWord.word) &&
        passesDailyMissionWordAttempt(score, true);

      const recoveryHint = score < VAULT_PASS_SCORE ? ` ${AZURE_RECOVERY_GUIDANCE}` : "";
      const debrief = buildCaptainAssessmentDebrief(assessment, feedback, {
        missionPass: !!missionPass,
      });
      const coachingText = debrief.message + recoveryHint;
      setCaptainNote(coachingText);
      emitCaptainDeltaSuggestion({
        text: coachingText,
        speechText: debrief.speechText,
        kind: "coaching",
        primaryAction: missionPass
          ? { id: "ready", label: "Continue", primary: true }
          : { id: "try_again", label: "Try again", primary: true },
        secondaryActions:
          score < VAULT_PASS_SCORE
            ? [{ id: "slow_audio", label: "🎧 Slow Audio", primary: false }]
            : [],
      });

      const ctx = { accuracy: score, recognizedText: assessment.recognizedText };
      const counted = tryRecordStudyActivity("pronunciation", ctx);
      setActivityNote(counted ? null : studyActivityRejectReason("pronunciation", ctx));

      if (score >= VAULT_PASS_SCORE) markWarmupSatisfied();

      if (score < 80 && practiceLevel === 1) {
        const syllables = splitSyllables(activeWord.word);
        const weakWord = assessment.words
          ?.slice()
          .sort((a, b) => a.accuracyScore - b.accuracyScore)[0]?.word;
        const weakSyllable =
          syllables.find((s) => weakWord?.toLowerCase().includes(s.toLowerCase())) ??
          syllables[0];
        emitVisualPlan(buildPronunciationFocusPlan(activeWord.word, weakSyllable));
      }

      if (missionPass) {
        const daily = markPronunciationDailyWordComplete(activeWord.word);
        const next = [...daily.completedWords];
        optionsRef.current.onMissionProgress(next);
        if (outcome.removed) {
          setTimeout(() => optionsRef.current.onSelectNextMissionWord(next), 1200);
        } else {
          setTimeout(() => optionsRef.current.onSelectNextMissionWord(next), 800);
        }
        return;
      }

      if (outcome.removed) {
        setTimeout(() => optionsRef.current.onWordCleared(), 2800);
      } else if (outcome.advancedLevel && updated) {
        optionsRef.current.onWordAdvanced(updated, updated.practiceLevel ?? practiceLevel);
      }
    } finally {
      stopInFlightRef.current = false;
    }
  }, [activeWord, azure, practiceLevel]);

  const listen = useCallback(async () => {
    if (!activeWord) return;
    try {
      await speech.speak(practiceTextForLevel(activeWord, practiceLevel));
    } catch {
      /* speech.error */
    }
  }, [activeWord, practiceLevel, speech]);

  const startRef = useRef(start);
  const stopRef = useRef(stop);
  const listenRef = useRef(listen);
  startRef.current = start;
  stopRef.current = stop;
  listenRef.current = listen;

  usePronunciationCaptainBridge({
    activeWord,
    micUi,
    recordGate,
    onStartRecord: () => void startRef.current(),
    onStopRecord: () => void stopRef.current(),
    onListen: () => void listenRef.current(),
  });

  return useMemo(
    () => ({
      state,
      micUi,
      configured: azure.configured,
      captainNote,
      recordNotice: recordNotice ?? azure.error,
      activityNote,
      start,
      stop,
      reset,
      listen,
    }),
    [
      activityNote,
      azure.configured,
      azure.error,
      captainNote,
      listen,
      micUi,
      recordNotice,
      reset,
      start,
      state,
      stop,
    ],
  );
}
