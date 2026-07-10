import type { PeelBlockId } from "@/lib/peelBlocks";
import { SHADOW_PEEL_PASS_SCORE } from "@/lib/studyActivityRecord";

const STORAGE_KEY = "icao_peel_block_history_v1";
export const PEEL_BLOCK_HISTORY_EVENT = "icao-peel-block-history-change";

export type PeelBlockRecord = {
  lastAccuracy: number;
  bestAccuracy: number;
  attempts: number;
  lastAt: string;
};

export type PeelBlockHistoryStore = Record<string, Partial<Record<PeelBlockId, PeelBlockRecord>>>;

function notifyChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PEEL_BLOCK_HISTORY_EVENT));
}

export function loadPeelBlockHistory(): PeelBlockHistoryStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as PeelBlockHistoryStore;
  } catch {
    return {};
  }
}

export function savePeelBlockHistory(store: PeelBlockHistoryStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  notifyChange();
}

export function recordPeelBlockAttempt(
  cardNum: string,
  blockId: PeelBlockId,
  accuracy: number,
): PeelBlockRecord {
  const store = loadPeelBlockHistory();
  const card = store[cardNum] ?? {};
  const prev = card[blockId];
  const next: PeelBlockRecord = {
    lastAccuracy: accuracy,
    bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, accuracy),
    attempts: (prev?.attempts ?? 0) + 1,
    lastAt: new Date().toISOString(),
  };
  savePeelBlockHistory({
    ...store,
    [cardNum]: {
      ...card,
      [blockId]: next,
    },
  });
  return next;
}

export function getPeelBlockHistory(cardNum: string): Partial<Record<PeelBlockId, PeelBlockRecord>> {
  return loadPeelBlockHistory()[cardNum] ?? {};
}

export function clearPeelBlockHistoryForCards(cardNums: string[]): void {
  const store = loadPeelBlockHistory();
  for (const raw of cardNums) {
    delete store[raw.padStart(2, "0")];
    delete store[raw];
  }
  savePeelBlockHistory(store);
}

export function getWeakPeelBlockIds(
  cardNum: string,
  threshold = SHADOW_PEEL_PASS_SCORE,
): PeelBlockId[] {
  const history = getPeelBlockHistory(cardNum);
  return (Object.entries(history) as [PeelBlockId, PeelBlockRecord][])
    .filter(([, record]) => record.lastAccuracy < threshold)
    .sort((a, b) => a[1].lastAccuracy - b[1].lastAccuracy)
    .map(([id]) => id);
}

export function peelBlockLabel(id: PeelBlockId): string {
  const labels: Record<PeelBlockId, string> = {
    opener: "Abertura",
    idea1: "Ideia 1",
    idea2: "Ideia 2",
    idea3: "Ideia 3",
    example: "Exemplo",
    conclusion: "Conclusão",
  };
  return labels[id] ?? id;
}
