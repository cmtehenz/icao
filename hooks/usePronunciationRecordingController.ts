"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useCaptainDelta } from "@/components/CaptainDelta/CaptainDeltaProvider";
import { useAzurePronunciation } from "@/hooks/useAzurePronunciation";
import { useAzureSpeech } from "@/hooks/useAzureSpeech";
import { studentSafeAssessmentMessage } from "@/lib/azure/assessmentFailure";
import { forceReleaseRecordingSession, isRecordingMutexHeld } from "@/lib/azure/recognizerSession";
import { emitCaptainDeltaSuggestion, CAPTAIN_DELTA_CLEAR_PRONUNCIATION_ERROR } from "@/lib/captainDelta/events";
import { emitStopCaptainVoice, CAPTAIN_DELTA_RECORD_BLOCKED } from "@/lib/captainDelta/lessonContext";
import {
  pronunciationRecordBlockLabel,
  resolvePronunciationRecordBlockReason,
} from "@/lib/captainDelta/pronunciationRecordReason";
import { traceRecordStep } from "@/lib/captainDelta/pronunciationRecordTrace";
import { buildPronunciationFocusPlan } from "@/lib/captainDelta/visual/plans";
import { emitVisualPlan } from "@/lib/captainDelta/visual/events";
import { splitSyllables } from "@/lib/captainDelta/visual/syllables";
import type { CaptainAssessmentDebrief } from "@/lib/pronunciationCoach";
import {
  captainFeedbackBelowStoredLevel,
  buildCaptainAssessmentDebrief,
} from "@/lib/pronunciationCoach";
import { recommendedPracticeLevel } from "@/lib/pronunciationGraduation";
import { youGlishUrl } from "@/lib/youglish";
import {
  isPronunciationWordInTodayMission,
  markPronunciationDailyWordComplete,
  passesDailyMissionWordAttempt,
} from "@/lib/pronunciationDailyMission";
import { practiceTextForLevel } from "@/lib/pronunciationMission";
import { WM_PASS_SCORE } from "@/lib/wordMission/types";
import { PronunciationRecordingError } from "@/lib/pronunciation/PronunciationRecordingError";
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
import type { PronunciationRecordingHandles } from "@/lib/pronunciation/pronunciationRecordingRegistration";
import { assertReferenceTextForRecording } from "@/lib/pronunciation/validateReferenceText";
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
  azureEnvMissing: boolean;
  captainNote: string | null;
  captainDebrief: CaptainAssessmentDebrief | null;
  recordNotice: string | null;
  activityNote: string | null;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  reset: () => void;
  listen: () => Promise<void>;
  playSlow: () => Promise<void>;
  replay: () => Promise<void>;
};

type Options = {
  activeWord: VaultWord | null;
  practiceLevel: PracticeLevel;
  missionLegActive: boolean;
  mission: PronunciationMission | null;
  /** Word Mission — records vocab progress and uses WM pass threshold. */
  wordMissionTermId?: string | null;
  onWordMissionRecord?: (
    assessment: import("@/lib/azure/pronunciation").AzurePronunciationResult,
    score: number,
    level: PracticeLevel,
  ) => { levelPassed: boolean; termComplete: boolean };
  onVaultRefresh: () => void;
  onMissionProgress: (completed: string[]) => void;
  onSelectNextMissionWord: (completed: string[]) => void;
  onWordAdvanced: (word: VaultWord, level: PracticeLevel) => void;
  onWordCleared: () => void;
  onPracticeLevelBelowStored?: (level: PracticeLevel) => void;
};

function browserSupportsRecording(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof MediaRecorder !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia
  );
}

/** Single owner of /pronunciation recording — Azure I/O + Captain registration. */
export function usePronunciationRecordingController(
  options: Options,
): PronunciationRecordingControllerApi {
  const { activeWord, practiceLevel } = options;
  const { registerPronunciationRecording } = useCaptainDelta();

  const azure = useAzurePronunciation();
  const speech = useAzureSpeech();
  const [state, dispatch] = useReducer(
    reducePronunciationRecording,
    INITIAL_PRONUNCIATION_RECORDING_STATE,
  );
  const stateRef = useRef(state);
  stateRef.current = state;
  const [captainNote, setCaptainNote] = useState<string | null>(null);
  const [captainDebrief, setCaptainDebrief] = useState<CaptainAssessmentDebrief | null>(null);
  const youGlishQueryRef = useRef<string | null>(null);
  const [recordNotice, setRecordNotice] = useState<string | null>(null);
  const [activityNote, setActivityNote] = useState<string | null>(null);
  const startInFlightRef = useRef(false);
  const stopInFlightRef = useRef(false);
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const lastReferenceRef = useRef<string | null>(null);

  const micUi = useMemo(() => derivePronunciationRecorderUi(state), [state]);

  useEffect(() => {
    const onBlocked = (e: Event) => {
      const reason = (e as CustomEvent<{ reason: string }>).detail?.reason;
      if (reason) setRecordNotice(reason);
    };
    const onClearError = () => {
      setRecordNotice(null);
      setCaptainNote(null);
    };
    window.addEventListener(CAPTAIN_DELTA_RECORD_BLOCKED, onBlocked);
    window.addEventListener(CAPTAIN_DELTA_CLEAR_PRONUNCIATION_ERROR, onClearError);
    return () => {
      window.removeEventListener(CAPTAIN_DELTA_RECORD_BLOCKED, onBlocked);
      window.removeEventListener(CAPTAIN_DELTA_CLEAR_PRONUNCIATION_ERROR, onClearError);
    };
  }, []);

  const recordGate = useCallback(
    () => ({
      activeWord: !!activeWord,
      azureConfigured: true,
      lifecycle: phaseToGateLifecycle(stateRef.current.phase),
      assessingPending: stateRef.current.phase === "assessing",
      listenPlaying: speech.speaking,
      captainSpeaking: false,
      recognizerBusy: isRecordingMutexHeld() && stateRef.current.phase === "idle",
      browserSupported: browserSupportsRecording(),
    }),
    [activeWord, speech.speaking],
  );

  const getBlockReason = useCallback((): string | null => {
    if (!micUi.canStart) {
      if (stateRef.current.phase === "starting") return "Starting microphone…";
      if (stateRef.current.phase === "assessing") return "Assessment in progress.";
      if (stateRef.current.phase === "recording") {
        return "Recording is in progress — use Stop & assess.";
      }
    }
    const reason = resolvePronunciationRecordBlockReason(recordGate());
    return reason ? pronunciationRecordBlockLabel(reason) : null;
  }, [micUi.canStart, recordGate]);

  const reset = useCallback(() => {
    dispatch({ type: "reset" });
    setCaptainNote(null);
    setCaptainDebrief(null);
    youGlishQueryRef.current = null;
    setRecordNotice(null);
    if (!isPronunciationRecordingActive(stateRef.current.phase)) {
      azure.clear("word_clear");
    }
  }, [azure]);

  const speakPracticeText = useCallback(async () => {
    if (!activeWord) return;
    const text = practiceTextForLevel(activeWord, practiceLevel);
    lastReferenceRef.current = text;
    await speech.speak(text);
  }, [activeWord, practiceLevel, speech]);

  const listen = useCallback(async () => {
    try {
      await speakPracticeText();
    } catch {
      /* speech.error */
    }
  }, [speakPracticeText]);

  const playSlow = useCallback(async () => {
    try {
      await speakPracticeText();
    } catch {
      /* speech.error */
    }
  }, [speakPracticeText]);

  const replay = useCallback(async () => {
    const text =
      lastReferenceRef.current ??
      (activeWord ? practiceTextForLevel(activeWord, practiceLevel) : null);
    if (!text) return;
    try {
      await speech.speak(text);
    } catch {
      /* speech.error */
    }
  }, [activeWord, practiceLevel, speech]);

  const start = useCallback(async () => {
    if (startInFlightRef.current) return;
    if (!canStartPronunciationRecording(stateRef.current)) return;
    if (!activeWord) {
      setRecordNotice(pronunciationRecordBlockLabel("no_active_word"));
      return;
    }

    startInFlightRef.current = true;
    traceRecordStep("handlePrimaryRecord", "controllerStart");

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

      const sentenceUsed = practiceTextForLevel(activeWord, practiceLevel);
      let referenceText: string;
      try {
        referenceText = assertReferenceTextForRecording(sentenceUsed, {
          currentWord: activeWord.word,
          missionId: optionsRef.current.mission?.date ?? null,
          practiceLevel,
          sentenceUsed,
        });
      } catch (err) {
        const message =
          err instanceof PronunciationRecordingError
            ? err.message
            : "Missing referenceText.";
        traceRecordStep("error", message);
        dispatch({ type: "start_failed", message });
        setRecordNotice(message);
        return;
      }

      lastReferenceRef.current = referenceText;
      setCaptainNote(null);
      setRecordNotice(null);
      setActivityNote(null);

      dispatch({
        type: "start_requested",
        word: activeWord.word,
        referenceText,
        practiceLevel,
        phaseLabel: "Opening microphone…",
      });

      traceRecordStep("gate_pass");
      traceRecordStep("startRecording");

      try {
        await azure.startWithReference(referenceText);
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
        const message = studentSafeAssessmentMessage(failure, AZURE_RECOVERY_GUIDANCE);
        traceRecordStep("error", failure?.code ?? "assessment_unavailable");
        dispatch({ type: "assessment_error", message });
        setCaptainNote(message);
        emitCaptainDeltaSuggestion({
          text: message,
          speechText: message,
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
      const belowLevel =
        updated && captainFeedbackBelowStoredLevel(updated, practiceLevel);

      const missionPass =
        optionsRef.current.missionLegActive &&
        !optionsRef.current.wordMissionTermId &&
        optionsRef.current.mission &&
        isPronunciationWordInTodayMission(activeWord.word) &&
        passesDailyMissionWordAttempt(score, true);

      let wordMissionPass = false;
      let wordMissionTermComplete = false;
      if (optionsRef.current.wordMissionTermId && optionsRef.current.onWordMissionRecord) {
        const wm = optionsRef.current.onWordMissionRecord(assessment, score, practiceLevel);
        wordMissionPass = wm.levelPassed;
        wordMissionTermComplete = wm.termComplete;
      }

      const showMissionContinue =
        (missionPass || (wordMissionPass && wordMissionTermComplete)) &&
        optionsRef.current.missionLegActive;

      if (belowLevel && !optionsRef.current.wordMissionTermId) {
        setCaptainDebrief(null);
        youGlishQueryRef.current = null;
        setCaptainNote(belowLevel.message);
        const stored = recommendedPracticeLevel(updated!);
        optionsRef.current.onPracticeLevelBelowStored?.(stored);
        emitCaptainDeltaSuggestion({
          text: belowLevel.message,
          speechText: belowLevel.speechText,
          kind: "coaching",
          primaryAction: { id: "try_again", label: "Try again", primary: true },
          secondaryActions: [{ id: "slow_audio", label: "🎧 Slow Audio", primary: false }],
        });
      } else {
      const referenceText = practiceTextForLevel(activeWord, practiceLevel);
      const debrief = buildCaptainAssessmentDebrief(assessment, {
        targetWord: activeWord.word,
        practiceLevel,
        referenceText,
        missionPass: !!showMissionContinue,
      });
      youGlishQueryRef.current = debrief.youGlishQuery;
      setCaptainDebrief(debrief);
      setCaptainNote(debrief.message);
      emitCaptainDeltaSuggestion({
        text: debrief.message,
        speechText: debrief.speechText,
        kind: "coaching",
        primaryAction: showMissionContinue
          ? { id: "ready", label: "Continue", primary: true }
          : { id: "try_again", label: "Try again", primary: true },
        secondaryActions: [
          ...(score < (optionsRef.current.wordMissionTermId ? WM_PASS_SCORE : VAULT_PASS_SCORE)
            ? [{ id: "slow_audio" as const, label: "🎧 Slow Audio", primary: false }]
            : []),
          ...(debrief.showYouGlish && debrief.youGlishQuery
            ? [
                {
                  id: "watch_real_examples" as const,
                  label: "Watch real examples",
                  primary: false,
                },
              ]
            : []),
        ],
      });
      }

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

      if (wordMissionPass && wordMissionTermComplete) {
        setTimeout(() => optionsRef.current.onSelectNextMissionWord([]), 800);
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

  const handlesRef = useRef<PronunciationRecordingHandles>({
    start: () => {},
    stop: () => {},
    listen: () => {},
    playSlow: () => {},
    replay: () => {},
    canStart: () => false,
    canStop: () => false,
    isRecording: () => false,
    getBlockReason: () => null,
  });
  handlesRef.current = {
    start: () => void start(),
    stop: () => void stop(),
    listen: () => void listen(),
    playSlow: () => void playSlow(),
    replay: () => void replay(),
    openYouGlish: () => {
      const query = youGlishQueryRef.current;
      if (!query) return;
      window.open(youGlishUrl(query), "_blank", "noopener,noreferrer");
    },
    canStart: () => micUi.canStart && resolvePronunciationRecordBlockReason(recordGate()) === null,
    canStop: () => micUi.canStop,
    isRecording: () => stateRef.current.phase === "recording",
    getBlockReason,
  };

  useEffect(() => {
    registerPronunciationRecording({ handles: handlesRef.current, micUi });
    return () => registerPronunciationRecording(null);
  }, [micUi, registerPronunciationRecording]);

  return useMemo(
    () => ({
      state,
      micUi,
      configured: azure.configured,
      azureEnvMissing: azure.envMissing,
      captainNote,
      captainDebrief,
      recordNotice: recordNotice ?? azure.error,
      activityNote,
      start,
      stop,
      reset,
      listen,
      playSlow,
      replay,
    }),
    [
      activityNote,
      azure.configured,
      azure.envMissing,
      azure.error,
      captainNote,
      captainDebrief,
      listen,
      micUi,
      playSlow,
      recordNotice,
      replay,
      reset,
      start,
      state,
      stop,
    ],
  );
}
