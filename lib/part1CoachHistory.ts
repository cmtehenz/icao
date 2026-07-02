const STORAGE_KEY = "icao_part1_coach_history_v1";
export const PART1_COACH_HISTORY_EVENT = "icao-part1-coach-history-change";

export type Part1CoachRecord = {
  lastOverall: number;
  bestOverall: number;
  lastIcaoLevel: number;
  bestIcaoLevel: number;
  attempts: number;
  lastAt: string;
};

export type Part1CoachHistoryStore = Record<string, Part1CoachRecord>;

function notifyChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PART1_COACH_HISTORY_EVENT));
}

export function loadPart1CoachHistory(): Part1CoachHistoryStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Part1CoachHistoryStore;
  } catch {
    return {};
  }
}

export function savePart1CoachHistory(store: Part1CoachHistoryStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  notifyChange();
}

export function recordPart1CoachAttempt(
  cardNum: string,
  overallScore: number,
  icaoLevel: number,
): Part1CoachRecord {
  const level = Math.max(1, Math.min(6, Math.round(icaoLevel)));
  const overall = Math.max(0, Math.min(100, Math.round(overallScore)));
  const store = loadPart1CoachHistory();
  const prev = store[cardNum];
  const next: Part1CoachRecord = {
    lastOverall: overall,
    bestOverall: Math.max(prev?.bestOverall ?? 0, overall),
    lastIcaoLevel: level,
    bestIcaoLevel: Math.max(prev?.bestIcaoLevel ?? 0, level),
    attempts: (prev?.attempts ?? 0) + 1,
    lastAt: new Date().toISOString(),
  };
  savePart1CoachHistory({ ...store, [cardNum]: next });
  return next;
}

export function getPart1CoachHistory(cardNum: string): Part1CoachRecord | null {
  return loadPart1CoachHistory()[cardNum] ?? null;
}
