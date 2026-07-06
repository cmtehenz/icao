import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import type { RecognizerLifecycle } from "@/lib/azure/recognizerLifecycle";

/** Single pronunciation recording state machine — sole UI source on /pronunciation. */
export type PronunciationRecordingPhase =
  | "idle"
  | "starting"
  | "recording"
  | "assessing"
  | "success"
  | "error";

export type PronunciationRecordingControllerState = {
  phase: PronunciationRecordingPhase;
  word: string | null;
  referenceText: string | null;
  practiceLevel: number | null;
  assessment: AzurePronunciationResult | null;
  score: number | null;
  error: string | null;
  phaseLabel: string | null;
};

export type PronunciationRecorderVisualState =
  | "idle"
  | "starting"
  | "listening"
  | "assessing"
  | "success"
  | "error";

export type PronunciationRecorderUiState = {
  phase: PronunciationRecordingPhase;
  visualState: PronunciationRecorderVisualState;
  phaseLabel: string | null;
  micStatusLine: string;
  primaryLabel: string;
  primaryDisabled: boolean;
  canStart: boolean;
  canStop: boolean;
  hasError: boolean;
  isMicPressed: boolean;
  /** Bridge compat — maps recording phase to Azure lifecycle for gate helpers. */
  lifecycle: RecognizerLifecycle;
};

export const INITIAL_PRONUNCIATION_RECORDING_STATE: PronunciationRecordingControllerState =
  {
    phase: "idle",
    word: null,
    referenceText: null,
    practiceLevel: null,
    assessment: null,
    score: null,
    error: null,
    phaseLabel: null,
  };

export type PronunciationRecordingAction =
  | {
      type: "start_requested";
      word: string;
      referenceText: string;
      practiceLevel: number;
      phaseLabel?: string | null;
    }
  | { type: "recording_started"; phaseLabel?: string | null }
  | { type: "assessing_started"; phaseLabel?: string | null }
  | {
      type: "assessment_success";
      assessment: AzurePronunciationResult;
      score: number;
    }
  | { type: "assessment_error"; message: string }
  | { type: "start_failed"; message: string }
  | { type: "notice"; message: string }
  | { type: "reset" };

export function isPronunciationRecordingActive(
  phase: PronunciationRecordingPhase,
): boolean {
  return phase === "starting" || phase === "recording" || phase === "assessing";
}

export function canStartPronunciationRecording(
  state: PronunciationRecordingControllerState,
): boolean {
  return (
    state.phase === "idle" ||
    state.phase === "success" ||
    state.phase === "error"
  );
}

export function canStopPronunciationRecording(
  state: PronunciationRecordingControllerState,
): boolean {
  return state.phase === "recording";
}

export function reducePronunciationRecording(
  state: PronunciationRecordingControllerState,
  action: PronunciationRecordingAction,
): PronunciationRecordingControllerState {
  switch (action.type) {
    case "start_requested":
      return {
        ...state,
        phase: "starting",
        word: action.word,
        referenceText: action.referenceText,
        practiceLevel: action.practiceLevel,
        assessment: null,
        score: null,
        error: null,
        phaseLabel: action.phaseLabel ?? "Opening microphone…",
      };
    case "recording_started":
      return {
        ...state,
        phase: "recording",
        phaseLabel: action.phaseLabel ?? "Recording — speak now",
      };
    case "assessing_started":
      return {
        ...state,
        phase: "assessing",
        phaseLabel: action.phaseLabel ?? "Assessing your pronunciation…",
      };
    case "assessment_success":
      return {
        ...state,
        phase: "success",
        assessment: action.assessment,
        score: action.score,
        error: null,
        phaseLabel: null,
      };
    case "assessment_error":
    case "start_failed":
      return {
        ...state,
        phase: "error",
        error: action.message,
        phaseLabel: action.message,
      };
    case "notice":
      return {
        ...state,
        error: action.message,
        phaseLabel: action.message,
      };
    case "reset":
      return { ...INITIAL_PRONUNCIATION_RECORDING_STATE };
    default:
      return state;
  }
}

export function phaseToGateLifecycle(
  phase: PronunciationRecordingPhase,
): RecognizerLifecycle {
  switch (phase) {
    case "starting":
      return "starting";
    case "recording":
      return "listening";
    case "assessing":
      return "stopping";
    default:
      return "idle";
  }
}

/** Captain mic + mission card — derived only from controller state. */
export function derivePronunciationRecorderUi(
  state: PronunciationRecordingControllerState,
): PronunciationRecorderUiState {
  const lifecycle = phaseToGateLifecycle(state.phase);

  switch (state.phase) {
    case "starting":
      return {
        phase: state.phase,
        lifecycle,
        visualState: "starting",
        phaseLabel: state.phaseLabel ?? "Starting microphone…",
        micStatusLine: "Opening microphone",
        primaryLabel: "Starting microphone…",
        primaryDisabled: true,
        canStart: false,
        canStop: false,
        hasError: false,
        isMicPressed: false,
      };
    case "recording":
      return {
        phase: state.phase,
        lifecycle,
        visualState: "listening",
        phaseLabel: state.phaseLabel ?? "Recording — speak now",
        micStatusLine: "Mic live — speak now",
        primaryLabel: "● Recording",
        primaryDisabled: false,
        canStart: false,
        canStop: true,
        hasError: false,
        isMicPressed: true,
      };
    case "assessing":
      return {
        phase: state.phase,
        lifecycle,
        visualState: "assessing",
        phaseLabel: state.phaseLabel ?? "Assessing your pronunciation…",
        micStatusLine: "Evaluating pronunciation",
        primaryLabel: "Assessing…",
        primaryDisabled: true,
        canStart: false,
        canStop: false,
        hasError: false,
        isMicPressed: false,
      };
    case "success":
      return {
        phase: state.phase,
        lifecycle,
        visualState: "success",
        phaseLabel: null,
        micStatusLine: "Assessment complete",
        primaryLabel: "🎤 Record next",
        primaryDisabled: false,
        canStart: true,
        canStop: false,
        hasError: false,
        isMicPressed: false,
      };
    case "error":
      return {
        phase: state.phase,
        lifecycle,
        visualState: "error",
        phaseLabel: state.error,
        micStatusLine: "Mic error — try again",
        primaryLabel: "🎤 Try again",
        primaryDisabled: false,
        canStart: true,
        canStop: false,
        hasError: true,
        isMicPressed: false,
      };
    default:
      return {
        phase: "idle",
        lifecycle: "idle",
        visualState: "idle",
        phaseLabel: null,
        micStatusLine: "Mic off",
        primaryLabel: "🎤 Record",
        primaryDisabled: false,
        canStart: true,
        canStop: false,
        hasError: false,
        isMicPressed: false,
      };
  }
}

/** Stable key for lesson-context sync — emit only when this changes. */
export function pronunciationRecorderUiSnapshot(
  ui: PronunciationRecorderUiState,
  word: string | null | undefined,
  recording: boolean,
): string {
  return [
    word ?? "",
    recording ? "1" : "0",
    ui.phase,
    ui.visualState,
    ui.primaryLabel,
    ui.micStatusLine,
    ui.canStart ? "1" : "0",
    ui.canStop ? "1" : "0",
    ui.isMicPressed ? "1" : "0",
    ui.hasError ? "1" : "0",
  ].join("|");
}

export function sameStringList(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((v, i) => v.toLowerCase() === b[i].toLowerCase());
}

