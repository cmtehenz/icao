import { getTodayExamId, getTodayExamVersion } from "@/lib/dailyExamRotation";
import { loadSimuladoHistory } from "@/lib/simulado/progress";
import { getOrCreatePart2DailyMission, part2MissionLink } from "@/lib/part2DailyMission";
import { loadStudyPlanMode, type StudyPlanMode } from "@/lib/studyTime";
import { todayKey } from "@/lib/studyTime";

export function getSimuladoIcaoHref(dateKey?: string): string {
  return `/simulado?exam=${getTodayExamId(dateKey)}`;
}

/** Part 2 full simulation for today's exam (daily mission step 3). */
export function getPart2SimulationMissionHref(): string {
  return part2MissionLink(getOrCreatePart2DailyMission());
}

export function isSimulateMissionRequired(mode: StudyPlanMode = loadStudyPlanMode()): boolean {
  return mode === "intense";
}

export function isSimulateMissionDone(dateKey = todayKey()): boolean {
  const examVersion = getTodayExamVersion(dateKey);
  return loadSimuladoHistory().some(
    (r) => r.date === dateKey && r.examVersion === examVersion && r.mode === "full",
  );
}

export function simulateMissionProgress(dateKey = todayKey()): {
  done: number;
  total: number;
  complete: boolean;
} {
  const complete = isSimulateMissionDone(dateKey);
  return {
    done: complete ? 1 : 0,
    total: 1,
    complete,
  };
}
