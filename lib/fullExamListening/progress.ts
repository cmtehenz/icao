import type { FullExamId } from "./types";

const STORAGE_KEY = "icao_full_exam_listening_v1";

export type FullExamListeningProgress = {
  lastExamId: FullExamId | null;
  lastItemIndex: number;
  completedExams: FullExamId[];
  sessionCount: number;
  difficultItemIds: string[];
  lastPlayedAt: string | null;
};

const DEFAULT: FullExamListeningProgress = {
  lastExamId: null,
  lastItemIndex: 0,
  completedExams: [],
  sessionCount: 0,
  difficultItemIds: [],
  lastPlayedAt: null,
};

export function loadListeningProgress(): FullExamListeningProgress {
  if (typeof window === "undefined") return { ...DEFAULT };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT };
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT };
  }
}

export function saveListeningProgress(patch: Partial<FullExamListeningProgress>): FullExamListeningProgress {
  const next = { ...loadListeningProgress(), ...patch };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("icao-full-exam-listening-change"));
  }
  return next;
}

export function markExamCompleted(examId: FullExamId): void {
  const p = loadListeningProgress();
  if (!p.completedExams.includes(examId)) {
    saveListeningProgress({ completedExams: [...p.completedExams, examId] });
  }
}

export function toggleDifficultItem(itemId: string): boolean {
  const p = loadListeningProgress();
  const set = new Set(p.difficultItemIds);
  if (set.has(itemId)) {
    set.delete(itemId);
  } else {
    set.add(itemId);
  }
  saveListeningProgress({ difficultItemIds: [...set] });
  return set.has(itemId);
}

export function isItemDifficult(itemId: string): boolean {
  return loadListeningProgress().difficultItemIds.includes(itemId);
}
