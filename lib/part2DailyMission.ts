import { getTodayExamVersion } from "@/lib/dailyExamRotation";
import { syncDailyMissionLog } from "@/lib/dailyMissionLog";
import type { ExamVersion } from "@/lib/exams/types";
import { clearPart2MissionSession } from "@/lib/part2MissionSession";
import { todayKey } from "@/lib/studyTime";

/** Kept for fragmented Part 2 practice modes (shadow / coach). */
export type Part2MissionKind = "readback" | "interaction" | "reported";

export type Part2DailyMissionState = {
  date: string;
  examVersion: ExamVersion;
  simulationDone: boolean;
};

const STORAGE_KEY = "icao_part2_daily_mission_v2";
export const PART2_DAILY_MISSION_EVENT = "icao-part2-daily-mission-change";

function notify(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PART2_DAILY_MISSION_EVENT));
}

function isValidMission(parsed: unknown, date: string): parsed is Part2DailyMissionState {
  if (!parsed || typeof parsed !== "object") return false;
  const m = parsed as Part2DailyMissionState;
  if ("items" in m) return false;
  return (
    m.date === date &&
    typeof m.examVersion === "string" &&
    m.examVersion === getTodayExamVersion(date) &&
    typeof m.simulationDone === "boolean"
  );
}

export function loadPart2DailyMission(): Part2DailyMissionState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isValidMission(parsed, todayKey())) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function savePart2DailyMission(state: Part2DailyMissionState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  syncDailyMissionLog();
  notify();
}

export function getOrCreatePart2DailyMission(): Part2DailyMissionState {
  const existing = loadPart2DailyMission();
  if (existing) return existing;

  const state: Part2DailyMissionState = {
    date: todayKey(),
    examVersion: getTodayExamVersion(),
    simulationDone: false,
  };
  savePart2DailyMission(state);
  return state;
}

export function markPart2SimulationDailyComplete(examVersion: ExamVersion): Part2DailyMissionState | null {
  const mission = getOrCreatePart2DailyMission();
  if (mission.examVersion !== examVersion || mission.simulationDone) return mission;

  const next: Part2DailyMissionState = { ...mission, simulationDone: true };
  savePart2DailyMission(next);
  return next;
}

/** Restart today's Part 2 exam leg (5 situations). */
export function resetPart2DailyMissionProgress(): Part2DailyMissionState {
  clearPart2MissionSession();
  const mission = getOrCreatePart2DailyMission();
  const next: Part2DailyMissionState = { ...mission, simulationDone: false };
  savePart2DailyMission(next);
  return next;
}

export function part2DailyMissionProgress(mission = getOrCreatePart2DailyMission()): {
  done: number;
  total: number;
  complete: boolean;
  examVersion: ExamVersion;
} {
  return {
    done: mission.simulationDone ? 1 : 0,
    total: 1,
    complete: mission.simulationDone,
    examVersion: mission.examVersion,
  };
}

export function part2MissionLink(_mission = getOrCreatePart2DailyMission()): string {
  return "/part2";
}
