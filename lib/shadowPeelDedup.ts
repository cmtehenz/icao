import type { PeelBlockId } from "@/lib/peelBlocks";
import { todayKey } from "@/lib/studyTime";

const STORAGE_KEY = "icao_shadow_peel_scored_v1";

type DedupeStore = {
  date: string;
  blockKeys: string[];
};

function loadStore(): DedupeStore {
  if (typeof window === "undefined") {
    return { date: todayKey(), blockKeys: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: todayKey(), blockKeys: [] };
    const parsed = JSON.parse(raw) as DedupeStore;
    if (parsed.date !== todayKey()) {
      return { date: todayKey(), blockKeys: [] };
    }
    return {
      date: parsed.date,
      blockKeys: Array.isArray(parsed.blockKeys) ? parsed.blockKeys : [],
    };
  } catch {
    return { date: todayKey(), blockKeys: [] };
  }
}

function saveStore(store: DedupeStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function peelBlockActivityKey(cardNum: string, blockId: PeelBlockId): string {
  return `${cardNum}:${blockId}`;
}

export function hasShadowPeelScoredToday(blockKey: string): boolean {
  if (!blockKey) return false;
  const store = loadStore();
  return store.blockKeys.includes(blockKey);
}

export function markShadowPeelScored(blockKey: string): void {
  if (!blockKey || typeof window === "undefined") return;
  const store = loadStore();
  if (store.blockKeys.includes(blockKey)) return;
  saveStore({
    date: todayKey(),
    blockKeys: [...store.blockKeys, blockKey],
  });
}

export function clearShadowPeelScoredForCards(cardNums: string[]): void {
  if (typeof window === "undefined" || !cardNums.length) return;
  const store = loadStore();
  const prefixes = cardNums.map((n) => `${n.padStart(2, "0")}:`);
  saveStore({
    date: todayKey(),
    blockKeys: store.blockKeys.filter((key) => !prefixes.some((prefix) => key.startsWith(prefix))),
  });
}
