import { ALL_EXAM_SITUATIONS } from "@/data/exams/part2Data";
import type { ExamSituation } from "@/lib/exams/types";
import { pickDailySlice } from "@/lib/dailyRotation";
import { getPart2ItemProgress, loadPart2Progress, type Part2ProgressStore } from "@/lib/part2/progress";
import { syncDailyMissionLog } from "@/lib/dailyMissionLog";
import { todayKey } from "@/lib/studyTime";

export const PART2_DAILY_READBACK = 2;
export const PART2_DAILY_INTERACTION = 1;
export const PART2_DAILY_REPORTED = 1;

export type Part2MissionKind = "readback" | "interaction" | "reported";

export type Part2DailyMissionItem = {
  id: string;
  kind: Part2MissionKind;
  scenarioId: string;
  label: string;
};

export type Part2DailyMissionState = {
  date: string;
  items: Part2DailyMissionItem[];
  completedIds: string[];
};

const STORAGE_KEY = "icao_part2_daily_mission_v1";
export const PART2_DAILY_MISSION_EVENT = "icao-part2-daily-mission-change";

function notify(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PART2_DAILY_MISSION_EVENT));
}

function scenarioPriority(store: Part2ProgressStore, scenario: ExamSituation, suffix: string): number {
  const status = getPart2ItemProgress(store, `${scenario.id}-${suffix}`).status;
  switch (status) {
    case "difficult":
      return 0;
    case "new":
      return 1;
    case "learning":
      return 2;
    default:
      return 3;
  }
}

function pickScenarios(
  scenarios: ExamSituation[],
  progress: Part2ProgressStore,
  suffix: string,
  count: number,
  date: string,
  salt: number,
): ExamSituation[] {
  const sorted = [...scenarios].sort((a, b) => {
    const diff = scenarioPriority(progress, a, suffix) - scenarioPriority(progress, b, suffix);
    if (diff !== 0) return diff;
    return a.id.localeCompare(b.id);
  });
  const rotated = pickDailySlice(sorted, Math.max(count, 1), date, salt);
  return rotated.slice(0, count);
}

export function buildPart2DailyItems(
  date = todayKey(),
  progress: Part2ProgressStore = loadPart2Progress(),
  scenarios: ExamSituation[] = ALL_EXAM_SITUATIONS,
): Part2DailyMissionItem[] {
  const readbacks = pickScenarios(scenarios, progress, "rb", PART2_DAILY_READBACK, date, 3);
  const interactions = pickScenarios(scenarios, progress, "int", PART2_DAILY_INTERACTION, date, 11);
  const reported = pickScenarios(scenarios, progress, "rep", PART2_DAILY_REPORTED, date, 19);

  const items: Part2DailyMissionItem[] = [];

  for (const s of readbacks) {
    items.push({
      id: `rb-${s.id}`,
      kind: "readback",
      scenarioId: s.id,
      label: `Readback · ${s.examVersion} · ${s.title}`,
    });
  }
  for (const s of interactions) {
    items.push({
      id: `int-${s.id}`,
      kind: "interaction",
      scenarioId: s.id,
      label: `Interaction · ${s.examVersion} · ${s.title}`,
    });
  }
  for (const s of reported) {
    items.push({
      id: `rep-${s.id}`,
      kind: "reported",
      scenarioId: s.id,
      label: `Reported · ${s.examVersion} · ${s.title}`,
    });
  }

  return items;
}

export function loadPart2DailyMission(): Part2DailyMissionState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Part2DailyMissionState;
    if (parsed.date !== todayKey()) return null;
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

export function getOrCreatePart2DailyMission(
  progress: Part2ProgressStore = loadPart2Progress(),
): Part2DailyMissionState {
  const existing = loadPart2DailyMission();
  if (existing) return existing;

  const state: Part2DailyMissionState = {
    date: todayKey(),
    items: buildPart2DailyItems(todayKey(), progress),
    completedIds: [],
  };
  savePart2DailyMission(state);
  return state;
}

export function markPart2DailyComplete(itemId: string): Part2DailyMissionState | null {
  const mission = getOrCreatePart2DailyMission();
  if (!mission.items.some((i) => i.id === itemId)) return mission;
  if (mission.completedIds.includes(itemId)) return mission;

  const next: Part2DailyMissionState = {
    ...mission,
    completedIds: [...mission.completedIds, itemId],
  };
  savePart2DailyMission(next);
  return next;
}

export function markPart2DailyCompleteByScenario(
  kind: Part2MissionKind,
  scenarioId: string,
): Part2DailyMissionState | null {
  const prefix = kind === "readback" ? "rb" : kind === "interaction" ? "int" : "rep";
  return markPart2DailyComplete(`${prefix}-${scenarioId}`);
}

export function part2DailyMissionProgress(mission = getOrCreatePart2DailyMission()): {
  done: number;
  total: number;
  complete: boolean;
  byKind: Record<Part2MissionKind, { done: number; total: number }>;
} {
  const total = mission.items.length;
  const done = mission.completedIds.length;
  const byKind: Record<Part2MissionKind, { done: number; total: number }> = {
    readback: { done: 0, total: 0 },
    interaction: { done: 0, total: 0 },
    reported: { done: 0, total: 0 },
  };

  for (const item of mission.items) {
    byKind[item.kind].total += 1;
    if (mission.completedIds.includes(item.id)) {
      byKind[item.kind].done += 1;
    }
  }

  return {
    done,
    total,
    complete: done >= total && total > 0,
    byKind,
  };
}

export function part2MissionLink(item: Part2DailyMissionItem): string {
  const params = new URLSearchParams({
    mode: item.kind,
    scenario: item.scenarioId,
    practice: "1",
  });
  if (item.kind === "readback" || item.kind === "interaction") {
    params.set("shadow", "1");
  }
  return `/part2?${params.toString()}`;
}
