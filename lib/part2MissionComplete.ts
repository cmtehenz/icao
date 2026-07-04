import type { Part2MissionKind } from "@/lib/part2DailyMission";

export type Part2PracticeResult = {
  part2MissionKind: Part2MissionKind;
  situationId?: string;
  accuracy?: number;
  recognizedText?: string;
};

/** Daily Part 2 mission is full simulation only — fragmented practice no longer marks it. */
export function tryMarkPart2DailyMissionPractice(_result: Part2PracticeResult): boolean {
  return false;
}

export function isPart2InTodayMission(_kind: Part2MissionKind, _situationId: string): boolean {
  return false;
}
