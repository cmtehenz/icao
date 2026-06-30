import { ALL_EXAM_SITUATIONS } from "@/data/exams/part2Data";
import type { ExamSituation } from "@/lib/exams/types";
import { buildStudyAgenda } from "@/lib/studyAgenda";
import { getPart2ItemProgress, type Part2ProgressStore } from "@/lib/part2/progress";
import { getTodayStudyTime, loadStudyPlanMode, todayKey } from "@/lib/studyTime";

const QUEUE_STORAGE_KEY = "icao_readback_queue_v1";
export const READBACK_QUEUE_CHANGE_EVENT = "icao-readback-queue-change";

export type ReadbackQueueState = {
  date: string;
  scenarioIds: string[];
  completedIds: string[];
};

function notifyQueueChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(READBACK_QUEUE_CHANGE_EVENT));
}

function scenarioPriority(store: Part2ProgressStore, scenario: ExamSituation): number {
  const status = getPart2ItemProgress(store, `${scenario.id}-rb`).status;
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

export function todayReadbackQueueSize(): number {
  const mode = loadStudyPlanMode();
  const today = getTodayStudyTime();
  const agenda = buildStudyAgenda(today.date, mode);
  const task = agenda.tasks.find((t) => t.activity === "shadowPart2");
  if (!task) return 3;
  const remaining = Math.max(0, task.targetCount - today.shadowPart2);
  return remaining > 0 ? remaining : task.targetCount;
}

export function pickReadbackQueue(
  scenarios: ExamSituation[] = ALL_EXAM_SITUATIONS,
  progress: Part2ProgressStore,
  count: number,
): string[] {
  const sorted = [...scenarios].sort((a, b) => {
    const diff = scenarioPriority(progress, a) - scenarioPriority(progress, b);
    if (diff !== 0) return diff;
    return a.id.localeCompare(b.id);
  });
  return sorted.slice(0, Math.max(1, count)).map((s) => s.id);
}

export function loadReadbackQueue(): ReadbackQueueState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ReadbackQueueState;
    if (parsed.date !== todayKey()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveReadbackQueue(state: ReadbackQueueState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(state));
  notifyQueueChange();
}

export function getOrCreateReadbackQueue(
  progress: Part2ProgressStore,
  scenarios: ExamSituation[] = ALL_EXAM_SITUATIONS,
): ReadbackQueueState {
  const existing = loadReadbackQueue();
  if (existing) return existing;

  const size = todayReadbackQueueSize();
  const state: ReadbackQueueState = {
    date: todayKey(),
    scenarioIds: pickReadbackQueue(scenarios, progress, size),
    completedIds: [],
  };
  saveReadbackQueue(state);
  return state;
}

export function markReadbackQueueComplete(scenarioId: string): ReadbackQueueState | null {
  const queue = loadReadbackQueue();
  if (!queue || !queue.scenarioIds.includes(scenarioId)) return queue;
  if (queue.completedIds.includes(scenarioId)) return queue;

  const next: ReadbackQueueState = {
    ...queue,
    completedIds: [...queue.completedIds, scenarioId],
  };
  saveReadbackQueue(next);
  return next;
}

export function readbackQueueProgress(queue: ReadbackQueueState): {
  done: number;
  total: number;
  complete: boolean;
  currentId: string | null;
} {
  const total = queue.scenarioIds.length;
  const done = queue.completedIds.length;
  const currentId =
    queue.scenarioIds.find((id) => !queue.completedIds.includes(id)) ?? null;
  return {
    done,
    total,
    complete: done >= total,
    currentId,
  };
}

export function findScenarioIndex(scenarios: ExamSituation[], scenarioId: string): number {
  return scenarios.findIndex((s) => s.id === scenarioId);
}
