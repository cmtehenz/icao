import { emitCaptainDeltaSuggestion } from "@/lib/captainDelta/events";
import { recallConfidenceLabel } from "@/lib/missionRecall/missionRecallScoring";

export const MISSION_RECALL_START_EVENT = "icao-mission-recall-start";
export const MISSION_RECALL_COMPLETE_EVENT = "icao-mission-recall-complete";

export function emitMissionRecallStart(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(MISSION_RECALL_START_EVENT));
  emitCaptainDeltaSuggestion({
    text: "Fast pace — answer from memory. No model answers first.",
    speechText: "Mission Recall. Answer from memory. Keep it fast.",
    kind: "mission",
  });
}

export function emitMissionRecallProgress(): void {
  if (typeof window === "undefined") return;
}

export function emitMissionRecallComplete(confidenceStars: number): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(MISSION_RECALL_COMPLETE_EVENT, { detail: { confidenceStars } }),
  );
  const line = recallConfidenceLabel(confidenceStars);
  emitCaptainDeltaSuggestion({
    text: line,
    speechText: line,
    kind: "mission",
  });
}
