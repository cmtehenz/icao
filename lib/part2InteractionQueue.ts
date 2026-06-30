import { ALL_EXAM_SITUATIONS } from "@/data/exams/part2Data";
import type { ExamSituation } from "@/lib/exams/types";
import { todayReadbackQueueSize } from "@/lib/part2ReadbackQueue";
import { getPart2ItemProgress, type Part2ProgressStore } from "@/lib/part2/progress";
import { todayKey } from "@/lib/studyTime";

const QUEUE_STORAGE_KEY = "icao_interaction_queue_v1";
export const INTERACTION_QUEUE_CHANGE_EVENT = "icao-interaction-queue-change";

export type InteractionQueueState = {
  date: string;
  scenarioIds: string[];
  completedIds: string[];
};

function notifyQueueChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(INTERACTION_QUEUE_CHANGE_EVENT));
}

function scenarioPriority(store: Part2ProgressStore, scenario: ExamSituation): number {
  const status = getPart2ItemProgress(store, `${scenario.id}-int`).status;
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

export function pickInteractionQueue(
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

export function loadInteractionQueue(): InteractionQueueState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as InteractionQueueState;
    if (parsed.date !== todayKey()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveInteractionQueue(state: InteractionQueueState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(state));
  notifyQueueChange();
}

export function getOrCreateInteractionQueue(
  progress: Part2ProgressStore,
  scenarios: ExamSituation[] = ALL_EXAM_SITUATIONS,
): InteractionQueueState {
  const existing = loadInteractionQueue();
  if (existing) return existing;

  const size = todayReadbackQueueSize();
  const state: InteractionQueueState = {
    date: todayKey(),
    scenarioIds: pickInteractionQueue(scenarios, progress, size),
    completedIds: [],
  };
  saveInteractionQueue(state);
  return state;
}

export function markInteractionQueueComplete(scenarioId: string): InteractionQueueState | null {
  const queue = loadInteractionQueue();
  if (!queue || !queue.scenarioIds.includes(scenarioId)) return queue;
  if (queue.completedIds.includes(scenarioId)) return queue;

  const next: InteractionQueueState = {
    ...queue,
    completedIds: [...queue.completedIds, scenarioId],
  };
  saveInteractionQueue(next);
  return next;
}

export function interactionQueueProgress(queue: InteractionQueueState): {
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
