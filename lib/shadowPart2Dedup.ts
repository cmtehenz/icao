import { todayKey } from "@/lib/studyTime";

const STORAGE_KEY = "icao_shadow_part2_scored_v1";

type DedupeStore = {
  date: string;
  situationIds: string[];
};

function loadStore(): DedupeStore {
  if (typeof window === "undefined") {
    return { date: todayKey(), situationIds: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: todayKey(), situationIds: [] };
    const parsed = JSON.parse(raw) as DedupeStore;
    if (parsed.date !== todayKey()) {
      return { date: todayKey(), situationIds: [] };
    }
    return {
      date: parsed.date,
      situationIds: Array.isArray(parsed.situationIds) ? parsed.situationIds : [],
    };
  } catch {
    return { date: todayKey(), situationIds: [] };
  }
}

function saveStore(store: DedupeStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function hasShadowPart2ScoredToday(situationId: string): boolean {
  if (!situationId) return false;
  const store = loadStore();
  return store.situationIds.includes(situationId);
}

export function markShadowPart2Scored(situationId: string): void {
  if (!situationId || typeof window === "undefined") return;
  const store = loadStore();
  if (store.situationIds.includes(situationId)) return;
  saveStore({
    date: todayKey(),
    situationIds: [...store.situationIds, situationId],
  });
}
