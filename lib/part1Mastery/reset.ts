import { ALL_PART1_CARD_NUMS } from "@/data/exams/part1";
import { clearPeelBlockHistoryForCards } from "@/lib/peelBlockHistory";
import { clearPart1CoachHistoryForCards } from "@/lib/part1CoachHistory";
import {
  part1CardNumsForDate,
  resetPart1DailyMissionProgress,
} from "@/lib/part1DailyMission";
import { clearPart1CardStudyProgress } from "@/lib/part1Mastery/progress";
import { clearShadowPeelScoredForCards } from "@/lib/shadowPeelDedup";

export const PART1_RESET_EVENT = "icao-part1-reset";

function notifyReset(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PART1_RESET_EVENT));
}

function resetCards(cardNums: string[]): void {
  resetPart1DailyMissionProgress();
  clearPart1CardStudyProgress(cardNums);
  clearShadowPeelScoredForCards(cardNums);
  clearPeelBlockHistoryForCards(cardNums);
  clearPart1CoachHistoryForCards(cardNums);
  notifyReset();
}

/** Restart today's Part 1 leg from Brief on question 1. */
export function resetPart1Today(): string {
  const cardNums = part1CardNumsForDate();
  resetCards(cardNums);
  return cardNums[0]?.padStart(2, "0") ?? "01";
}

/** Clear all 12 SDEA questions — mastery bank and coach history. */
export function resetPart1AllMastery(): void {
  resetCards([...ALL_PART1_CARD_NUMS]);
}
