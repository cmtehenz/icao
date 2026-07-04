import type { Part2ItemProgress, Part2ProgressStatus, Part2ProgressStore } from "@/lib/part2/types";
import { recordScoreSnapshot } from "@/lib/scoreHistory";

export type { Part2ProgressStore };

const PART2_PROGRESS_KEY = "icao_delta_part2_progress_v1";
export const PART2_PROGRESS_EVENT = "icao-part2-progress-change";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function defaultItem(): Part2ItemProgress {
  return { status: "new", reviews: 0 };
}

export function loadPart2Progress(): Part2ProgressStore {
  if (typeof window === "undefined") {
    return { items: {}, vocabularyKnown: [], dailyCount: {} };
  }
  try {
    const raw = localStorage.getItem(PART2_PROGRESS_KEY);
    if (raw) return JSON.parse(raw) as Part2ProgressStore;
  } catch {
    /* ignore */
  }
  return { items: {}, vocabularyKnown: [], dailyCount: {} };
}

export function savePart2Progress(store: Part2ProgressStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PART2_PROGRESS_KEY, JSON.stringify(store));
  window.dispatchEvent(new Event(PART2_PROGRESS_EVENT));
}

export function getPart2ItemProgress(store: Part2ProgressStore, id: string): Part2ItemProgress {
  return store.items[id] ?? defaultItem();
}

export function setPart2ItemStatus(
  store: Part2ProgressStore,
  id: string,
  status: Part2ProgressStatus,
): Part2ProgressStore {
  const existing = getPart2ItemProgress(store, id);
  const next: Part2ProgressStore = {
    ...store,
    items: {
      ...store.items,
      [id]: {
        ...existing,
        status,
        reviews: existing.reviews + 1,
        lastReviewed: todayKey(),
      },
    },
    dailyCount: {
      ...store.dailyCount,
      [todayKey()]: (store.dailyCount[todayKey()] ?? 0) + 1,
    },
  };
  savePart2Progress(next);
  return next;
}

export function markVocabularyKnown(store: Part2ProgressStore, id: string): Part2ProgressStore {
  const known = store.vocabularyKnown.includes(id)
    ? store.vocabularyKnown
    : [...store.vocabularyKnown, id];
  const next = setPart2ItemStatus({ ...store, vocabularyKnown: known }, id, "mastered");
  return next;
}

export function markVocabularyReview(store: Part2ProgressStore, id: string): Part2ProgressStore {
  return setPart2ItemStatus(store, id, "difficult");
}

export function recordPart2ItemScore(
  situationId: string,
  kind: "readback" | "interaction" | "reported",
  score: number,
): Part2ProgressStore {
  const suffix = kind === "readback" ? "rb" : kind === "interaction" ? "int" : "rep";
  const id = `${situationId}-${suffix}`;
  const store = loadPart2Progress();
  const existing = getPart2ItemProgress(store, id);
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const nextStatus =
    clamped >= 75 ? "mastered" : clamped >= 55 ? "learning" : existing.status === "difficult" ? "difficult" : "learning";

  const next: Part2ProgressStore = {
    ...store,
    items: {
      ...store.items,
      [id]: {
        ...existing,
        status: nextStatus,
        reviews: existing.reviews + 1,
        lastReviewed: todayKey(),
        lastScore: clamped,
        bestScore: Math.max(existing.bestScore ?? 0, clamped),
      },
    },
  };
  savePart2Progress(next);
  recordScoreSnapshot("part2", clamped);
  return next;
}

export function part2Stats(store: Part2ProgressStore, totalVocab: number) {
  const values = Object.values(store.items);
  return {
    mastered: values.filter((v) => v.status === "mastered").length,
    difficult: values.filter((v) => v.status === "difficult").length,
    learning: values.filter((v) => v.status === "learning").length,
    vocabKnown: store.vocabularyKnown.length,
    vocabTotal: totalVocab,
    daily: store.dailyCount[todayKey()] ?? 0,
  };
}
