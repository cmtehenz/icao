import type {
  CaptainDeltaAfterAnswerPayload,
  CaptainDeltaDebriefPayload,
  CaptainDeltaSuggestionPayload,
} from "@/lib/captainDelta/types";

export const CAPTAIN_DELTA_SUGGESTION = "icao-captain-delta-suggestion";
export const CAPTAIN_DELTA_AFTER_ANSWER = "icao-captain-delta-after-answer";
export const CAPTAIN_DELTA_DEBRIEF = "icao-captain-delta-debrief";

export function emitCaptainDeltaSuggestion(payload: CaptainDeltaSuggestionPayload): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CAPTAIN_DELTA_SUGGESTION, { detail: payload }));
}

export function emitCaptainDeltaAfterAnswer(payload: CaptainDeltaAfterAnswerPayload): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CAPTAIN_DELTA_AFTER_ANSWER, { detail: payload }));
}

export function emitCaptainDeltaDebrief(payload: CaptainDeltaDebriefPayload): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CAPTAIN_DELTA_DEBRIEF, { detail: payload }));
}
