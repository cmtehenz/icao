import {
  part1DailyMissionProgress,
  getOrCreatePart1DailyMission,
} from "@/lib/part1DailyMission";
import {
  part2DailyMissionProgress,
  getOrCreatePart2DailyMission,
} from "@/lib/part2DailyMission";
import {
  vocabDailyMissionProgress,
  getOrCreateVocabDailyMission,
} from "@/lib/vocabDailyMission";
import { syncDailyMissionLog } from "@/lib/dailyMissionLog";

export type DailyMissionSummary = {
  part1: ReturnType<typeof part1DailyMissionProgress>;
  part2: ReturnType<typeof part2DailyMissionProgress>;
  vocabulary: ReturnType<typeof vocabDailyMissionProgress>;
  complete: boolean;
  completedSections: number;
  totalSections: number;
};

export function getDailyMissionSummary(): DailyMissionSummary {
  const part1 = part1DailyMissionProgress(getOrCreatePart1DailyMission());
  const part2 = part2DailyMissionProgress(getOrCreatePart2DailyMission());
  const vocabulary = vocabDailyMissionProgress(getOrCreateVocabDailyMission());

  const sections = [part1.complete, part2.complete, vocabulary.complete];
  const completedSections = sections.filter(Boolean).length;
  const complete = completedSections === sections.length;

  if (complete) syncDailyMissionLog();

  return {
    part1,
    part2,
    vocabulary,
    complete,
    completedSections,
    totalSections: sections.length,
  };
}

export function isDailyMissionComplete(): boolean {
  return getDailyMissionSummary().complete;
}
