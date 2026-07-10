import {
  getOrCreatePronunciationDailyMission,
  pronunciationDailyMissionProgress,
} from "@/lib/pronunciationDailyMission";
import { getAdaptiveDailyPlan } from "@/lib/trainingProfile/adaptivePlan";
import { getOrCreateWordDailyMission, wordDailyMissionProgress } from "@/lib/wordMission/wordDailyMission";

/**
 * Pronunciation warm-up runs before Word Mission only (RFC-004).
 * Once vocabulary leg is complete, Part 1 must not be blocked by skipped warm-up.
 */
export function isPronunciationWarmupBlocking(): boolean {
  const plan = getAdaptiveDailyPlan();
  if (!plan.pronunciationFirst) return false;

  const wordMission = wordDailyMissionProgress(getOrCreateWordDailyMission());
  if (wordMission.complete) return false;

  const pron = pronunciationDailyMissionProgress(getOrCreatePronunciationDailyMission());
  return pron.total > 0 && !pron.complete;
}
