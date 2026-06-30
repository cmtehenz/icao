import { todayKey } from "@/lib/studyTime";

const STORAGE_KEY = "icao_shadow_part2_scored_v1";

type DedupeStore = {
  date: string;
  /** `${kind}:${situationId}` — readback/interaction/reported count separately. */
  keys: string[];
};

function part2ActivityKey(kind: string, situationId: string): string {
  return `${kind}:${situationId}`;
}

function loadStore(): DedupeStore {
  if (typeof window === "undefined") {
    return { date: todayKey(), keys: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: todayKey(), keys: [] };
    const parsed = JSON.parse(raw) as DedupeStore & { situationIds?: string[] };
    if (parsed.date !== todayKey()) {
      return { date: todayKey(), keys: [] };
    }
    if (Array.isArray(parsed.keys)) {
      return { date: parsed.date, keys: parsed.keys };
    }
    // Migrate legacy store (situationId only → treated as readback)
    const legacy = Array.isArray(parsed.situationIds) ? parsed.situationIds : [];
    return {
      date: parsed.date,
      keys: legacy.map((id) => part2ActivityKey("readback", id)),
    };
  } catch {
    return { date: todayKey(), keys: [] };
  }
}

function saveStore(store: DedupeStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function hasShadowPart2ScoredToday(
  situationId: string,
  kind = "readback",
): boolean {
  if (!situationId) return false;
  const store = loadStore();
  return store.keys.includes(part2ActivityKey(kind, situationId));
}

export function markShadowPart2Scored(situationId: string, kind = "readback"): void {
  if (!situationId || typeof window === "undefined") return;
  const key = part2ActivityKey(kind, situationId);
  const store = loadStore();
  if (store.keys.includes(key)) return;
  saveStore({
    date: todayKey(),
    keys: [...store.keys, key],
  });
}
