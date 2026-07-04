import type { CaptainDeltaMemoryStore } from "@/lib/captainDelta/memory/types";

export const CAPTAIN_DELTA_MEMORY_KEY = "icao_captain_delta_memory_v3";
export const CAPTAIN_DELTA_MEMORY_EVENT = "icao-captain-delta-memory-change";

const MAX_LOG = 200;
const MAX_STORIES = 24;
const MAX_BEST = 12;

function emptyStore(): CaptainDeltaMemoryStore {
  return {
    version: 1,
    questionHistory: {},
    confidenceLog: [],
    learningStyle: {
      speaking: 0,
      listening: 0,
      shadowing: 0,
      pictures: 0,
      keywords: 0,
    },
    preferredMode: null,
    aviationStories: [],
    connectorUsage: {},
    vocabularyRepeats: {},
    grammarMistakes: {},
    sessionDates: [],
    lastSessionCloseAt: null,
    lastWeeklyDebriefAt: null,
    bestAnswers: [],
    estimatedIcaoHistory: [],
  };
}

export function notifyMemoryChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CAPTAIN_DELTA_MEMORY_EVENT));
}

export function loadCaptainDeltaMemory(): CaptainDeltaMemoryStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = localStorage.getItem(CAPTAIN_DELTA_MEMORY_KEY);
    if (!raw) return emptyStore();
    return { ...emptyStore(), ...(JSON.parse(raw) as CaptainDeltaMemoryStore) };
  } catch {
    return emptyStore();
  }
}

export function saveCaptainDeltaMemory(store: CaptainDeltaMemoryStore): void {
  if (typeof window === "undefined") return;
  const trimmed: CaptainDeltaMemoryStore = {
    ...store,
    confidenceLog: store.confidenceLog.slice(-MAX_LOG),
    aviationStories: store.aviationStories.slice(-MAX_STORIES),
    bestAnswers: store.bestAnswers.slice(-MAX_BEST),
    estimatedIcaoHistory: store.estimatedIcaoHistory.slice(-90),
    sessionDates: [...new Set(store.sessionDates)].slice(-120),
  };
  localStorage.setItem(CAPTAIN_DELTA_MEMORY_KEY, JSON.stringify(trimmed));
  notifyMemoryChange();
}
