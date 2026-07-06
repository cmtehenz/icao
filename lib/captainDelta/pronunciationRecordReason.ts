import type { RecognizerLifecycle } from "@/lib/azure/recognizerLifecycle";

export type PronunciationRecordBlockReason =
  | "no_active_word"
  | "azure_not_configured"
  | "already_recording"
  | "assessing_pending"
  | "listen_playing"
  | "captain_speaking"
  | "recognizer_busy"
  | "browser_unsupported"
  | "mic_permission";

const REASON_LABELS: Record<PronunciationRecordBlockReason, string> = {
  no_active_word: "Select a word before recording.",
  azure_not_configured: "Azure Speech is not configured. Recording is unavailable.",
  already_recording: "Recording is already in progress — tap Stop & assess.",
  assessing_pending: "Assessment in progress — wait for the result.",
  listen_playing: "Listen is playing — wait for it to finish or stop it first.",
  captain_speaking: "Captain Delta is speaking — wait or tap Stop on the coaching card.",
  recognizer_busy: "Microphone is busy. Try again.",
  browser_unsupported: "This browser does not support microphone recording.",
  mic_permission: "Microphone permission denied — allow mic access in browser settings.",
};

export function pronunciationRecordBlockLabel(
  reason: PronunciationRecordBlockReason,
): string {
  return REASON_LABELS[reason];
}

export type PronunciationRecordGate = {
  activeWord: boolean;
  azureConfigured: boolean;
  lifecycle: RecognizerLifecycle;
  assessingPending: boolean;
  listenPlaying: boolean;
  captainSpeaking: boolean;
  recognizerBusy?: boolean;
  browserSupported?: boolean;
};

export function resolvePronunciationRecordBlockReason(
  gate: PronunciationRecordGate,
): PronunciationRecordBlockReason | null {
  if (!gate.activeWord) return "no_active_word";
  if (gate.browserSupported === false) return "browser_unsupported";
  if (gate.assessingPending) return "assessing_pending";
  if (gate.lifecycle === "starting") return "already_recording";
  if (gate.lifecycle === "listening") return "already_recording";
  if (gate.lifecycle === "stopping") return "assessing_pending";
  if (gate.listenPlaying) return "listen_playing";
  if (gate.captainSpeaking) return "captain_speaking";
  if (gate.recognizerBusy) return "recognizer_busy";
  return null;
}

export function canStartPronunciationRecord(gate: PronunciationRecordGate): boolean {
  return resolvePronunciationRecordBlockReason(gate) === null;
}

/** Block reasons that must not disable the Record button — click handler recovers instead. */
const NON_DISABLING_REASONS = new Set<PronunciationRecordBlockReason>(["recognizer_busy"]);

/** Reasons that may disable the Record button (excludes stale mutex — recover on click). */
export function resolvePronunciationRecordDisableReason(
  gate: PronunciationRecordGate,
): PronunciationRecordBlockReason | null {
  const reason = resolvePronunciationRecordBlockReason(gate);
  if (!reason || NON_DISABLING_REASONS.has(reason)) return null;
  return reason;
}

export function isPronunciationRecordButtonDisabled(_gate: PronunciationRecordGate): boolean {
  // Record is never hard-disabled — click handler recovers or shows the exact reason.
  return false;
}
