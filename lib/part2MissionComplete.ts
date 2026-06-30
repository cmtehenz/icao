import {
  getOrCreatePart2DailyMission,
  markPart2DailyComplete,
  type Part2MissionKind,
} from "@/lib/part2DailyMission";

export type Part2PracticeResult = {
  part2MissionKind: Part2MissionKind;
  situationId?: string;
  accuracy?: number;
  recognizedText?: string;
};

/** Mark today's Part 2 daily mission item — independent of shadow study-activity dedup. */
export function tryMarkPart2DailyMissionPractice(result: Part2PracticeResult): boolean {
  const { part2MissionKind, situationId, accuracy = 0, recognizedText } = result;
  if (!situationId?.trim()) return false;
  if (!recognizedText?.trim() || accuracy <= 0) return false;

  const mission = getOrCreatePart2DailyMission();
  const item = mission.items.find(
    (i) => i.kind === part2MissionKind && i.scenarioId === situationId,
  );
  if (!item) return false;
  if (mission.completedIds.includes(item.id)) return true;

  markPart2DailyComplete(item.id);
  return true;
}

export function isPart2InTodayMission(kind: Part2MissionKind, situationId: string): boolean {
  const mission = getOrCreatePart2DailyMission();
  return mission.items.some((i) => i.kind === kind && i.scenarioId === situationId);
}
