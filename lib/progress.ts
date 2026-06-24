export type CardProgressStatus = "new" | "learning" | "difficult" | "mastered";

export type CardProgress = {
  status: CardProgressStatus;
  reviews: number;
  lastReviewed?: string;
};

export type ProgressStore = {
  cards: Record<string, CardProgress>;
  dailyCount: Record<string, number>;
};

const PROGRESS_KEY = "icao_delta_progress_v1";
const LEGACY_DONE_KEY = "icao_done_v2";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function defaultCard(): CardProgress {
  return { status: "new", reviews: 0 };
}

export function loadProgress(): ProgressStore {
  if (typeof window === "undefined") {
    return { cards: {}, dailyCount: {} };
  }
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) return JSON.parse(raw) as ProgressStore;
  } catch {
    /* ignore */
  }
  try {
    const legacy = JSON.parse(localStorage.getItem(LEGACY_DONE_KEY) || "[]") as string[];
    const cards: Record<string, CardProgress> = {};
    for (const num of legacy) {
      cards[num] = { status: "mastered", reviews: 1, lastReviewed: todayKey() };
    }
    return { cards, dailyCount: {} };
  } catch {
    return { cards: {}, dailyCount: {} };
  }
}

export function saveProgress(store: ProgressStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(store));
}

export function getCardProgress(store: ProgressStore, num: string): CardProgress {
  return store.cards[num] ?? defaultCard();
}

export function setCardStatus(
  store: ProgressStore,
  num: string,
  status: CardProgressStatus,
): ProgressStore {
  const existing = getCardProgress(store, num);
  const next: ProgressStore = {
    ...store,
    cards: {
      ...store.cards,
      [num]: {
        ...existing,
        status,
        reviews: existing.reviews + (status !== existing.status ? 1 : 0),
        lastReviewed: todayKey(),
      },
    },
    dailyCount: {
      ...store.dailyCount,
      [todayKey()]: (store.dailyCount[todayKey()] ?? 0) + 1,
    },
  };
  saveProgress(next);
  return next;
}

export function recordPractice(store: ProgressStore, num: string): ProgressStore {
  const existing = getCardProgress(store, num);
  const status: CardProgressStatus =
    existing.status === "new" ? "learning" : existing.status;
  const next: ProgressStore = {
    ...store,
    cards: {
      ...store.cards,
      [num]: {
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
  saveProgress(next);
  return next;
}

export function progressStats(store: ProgressStore, total: number) {
  const values = Object.values(store.cards);
  const mastered = values.filter((c) => c.status === "mastered").length;
  const difficult = values.filter((c) => c.status === "difficult").length;
  const learning = values.filter((c) => c.status === "learning").length;
  const tracked = values.length;
  const fresh = Math.max(0, total - tracked);
  return {
    total,
    mastered,
    difficult,
    learning,
    new: fresh + values.filter((c) => c.status === "new").length,
    daily: store.dailyCount[todayKey()] ?? 0,
  };
}

export const PROGRESS_LABELS: Record<CardProgressStatus, string> = {
  new: "New",
  learning: "Learning",
  difficult: "Difficult",
  mastered: "Mastered",
};
