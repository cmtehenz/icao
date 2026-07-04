import { getTodayStudyTime, loadStudyPlanMode, type StudyPlanMode } from "@/lib/studyTime";

/** Units recorded by one Part 2 full simulation (see FullSimulationMode). */
export const SIMULATE_MISSION_MIN_UNITS = 1;

export const SIMULATE_MISSION_HREF = "/part2?mode=simulation";
export const SIMULATE_ICAO_HREF = "/simulado";

export function isSimulateMissionRequired(mode: StudyPlanMode = loadStudyPlanMode()): boolean {
  return mode === "intense";
}

export function simulateMissionProgress(day = getTodayStudyTime()): {
  done: number;
  total: number;
  complete: boolean;
} {
  const done = Math.min(day.simulate, SIMULATE_MISSION_MIN_UNITS);
  return {
    done,
    total: SIMULATE_MISSION_MIN_UNITS,
    complete: day.simulate >= SIMULATE_MISSION_MIN_UNITS,
  };
}

export function isSimulateMissionDone(day = getTodayStudyTime()): boolean {
  return simulateMissionProgress(day).complete;
}
