import type { ConversationMetrics, ConversationState } from "@/lib/humanExaminer/types";

const CONV_KEY = "icao_hex_conversation_v1";
const METRICS_KEY = "icao_hex_metrics_v1";

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota */
  }
}

type Store = Record<string, ConversationState>;

export function loadConversation(cardNum: string): ConversationState | null {
  const store = readJson<Store>(CONV_KEY);
  return store?.[cardNum] ?? null;
}

export function saveConversation(state: ConversationState): void {
  const store = readJson<Store>(CONV_KEY) ?? {};
  store[state.cardNum] = state;
  writeJson(CONV_KEY, store);
}

export function clearConversation(cardNum: string): void {
  const store = readJson<Store>(CONV_KEY);
  if (!store?.[cardNum]) return;
  delete store[cardNum];
  writeJson(CONV_KEY, store);
}

type MetricsStore = Record<string, ConversationMetrics>;

export function saveConversationMetrics(cardNum: string, metrics: ConversationMetrics): void {
  const store = readJson<MetricsStore>(METRICS_KEY) ?? {};
  store[cardNum] = metrics;
  writeJson(METRICS_KEY, store);
}

export function loadConversationMetrics(cardNum: string): ConversationMetrics | null {
  const store = readJson<MetricsStore>(METRICS_KEY);
  return store?.[cardNum] ?? null;
}

export function loadAllConversationMetrics(): ConversationMetrics[] {
  const store = readJson<MetricsStore>(METRICS_KEY);
  if (!store) return [];
  return Object.values(store);
}

export function clearConversationMetrics(cardNum: string): void {
  const store = readJson<MetricsStore>(METRICS_KEY);
  if (!store?.[cardNum]) return;
  delete store[cardNum];
  writeJson(METRICS_KEY, store);
}
