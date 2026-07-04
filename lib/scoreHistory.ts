import { todayKey } from "@/lib/studyTime";

export type ScoreArea = "part1" | "part2" | "pronunciation" | "vocabulary" | "simulado";

export type ScoreHistoryBucket = { sum: number; count: number };

export type ScoreHistoryStore = {
  days: Record<string, Partial<Record<ScoreArea, ScoreHistoryBucket>>>;
};

export type TrendPoint = {
  date: string;
  label: string;
  score: number | null;
};

export type TrendSummary = {
  area: ScoreArea;
  label: string;
  series: TrendPoint[];
  recentAvg: number | null;
  priorAvg: number | null;
  delta: number | null;
  direction: "up" | "down" | "flat" | "unknown";
};

const STORAGE_KEY = "icao_score_history_v1";
export const SCORE_HISTORY_CHANGE_EVENT = "icao-score-history-change";

const MAX_DAYS = 90;

const AREA_LABELS: Record<ScoreArea, string> = {
  part1: "Part 1",
  part2: "Part 2 speaking",
  pronunciation: "Pronúncia",
  vocabulary: "Vocabulário",
  simulado: "Simulado ICAO",
};

function notify(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SCORE_HISTORY_CHANGE_EVENT));
}

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function trimStore(store: ScoreHistoryStore): ScoreHistoryStore {
  const keys = Object.keys(store.days).sort();
  if (keys.length <= MAX_DAYS) return store;
  const keep = new Set(keys.slice(-MAX_DAYS));
  const days: ScoreHistoryStore["days"] = {};
  for (const key of keep) days[key] = store.days[key]!;
  return { days };
}

export function loadScoreHistory(): ScoreHistoryStore {
  if (typeof window === "undefined") return { days: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { days: {} };
    const parsed = JSON.parse(raw) as ScoreHistoryStore;
    if (!parsed?.days || typeof parsed.days !== "object") return { days: {} };
    return parsed;
  } catch {
    return { days: {} };
  }
}

function saveScoreHistory(store: ScoreHistoryStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimStore(store)));
  notify();
}

export function recordScoreSnapshot(
  area: ScoreArea,
  score: number,
  dateKey = todayKey(),
): void {
  if (typeof window === "undefined") return;
  const clamped = clampScore(score);
  const store = loadScoreHistory();
  const day = store.days[dateKey] ?? {};
  const bucket = day[area] ?? { sum: 0, count: 0 };
  store.days[dateKey] = {
    ...day,
    [area]: {
      sum: bucket.sum + clamped,
      count: bucket.count + 1,
    },
  };
  saveScoreHistory(store);
}

export function averageForDay(dateKey: string, area: ScoreArea): number | null {
  const bucket = loadScoreHistory().days[dateKey]?.[area];
  if (!bucket || bucket.count <= 0) return null;
  return clampScore(bucket.sum / bucket.count);
}

function dateKeysBack(count: number, offset = 0): string[] {
  const keys: string[] = [];
  const base = new Date();
  base.setHours(12, 0, 0, 0);
  for (let i = count - 1 + offset; i >= offset; i -= 1) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    keys.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
    );
  }
  return keys;
}

function shortLabel(dateKey: string): string {
  const d = new Date(`${dateKey}T12:00:00`);
  return d.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
}

export function buildTrendSeries(area: ScoreArea, dayCount = 14): TrendPoint[] {
  return dateKeysBack(dayCount).map((date) => ({
    date,
    label: shortLabel(date),
    score: averageForDay(date, area),
  }));
}

function windowAverage(area: ScoreArea, offset: number, length: number): number | null {
  const keys = dateKeysBack(length, offset);
  const vals = keys.map((k) => averageForDay(k, area)).filter((v): v is number => v != null);
  if (!vals.length) return null;
  return clampScore(vals.reduce((s, v) => s + v, 0) / vals.length);
}

export function summarizeTrend(area: ScoreArea, dayCount = 14): TrendSummary {
  const series = buildTrendSeries(area, dayCount);
  const recentAvg = windowAverage(area, 0, 7);
  const priorAvg = windowAverage(area, 7, 7);

  let delta: number | null = null;
  let direction: TrendSummary["direction"] = "unknown";

  if (recentAvg != null && priorAvg != null) {
    delta = recentAvg - priorAvg;
    if (delta >= 5) direction = "up";
    else if (delta <= -5) direction = "down";
    else direction = "flat";
  } else if (recentAvg != null && series.filter((p) => p.score != null).length >= 2) {
    direction = "flat";
    delta = 0;
  }

  return {
    area,
    label: AREA_LABELS[area],
    series,
    recentAvg,
    priorAvg,
    delta,
    direction,
  };
}

export function buildAllTrends(dayCount = 14): TrendSummary[] {
  const areas: ScoreArea[] = ["part1", "part2", "pronunciation", "vocabulary", "simulado"];
  return areas.map((area) => summarizeTrend(area, dayCount));
}

export function trendDirectionLabel(direction: TrendSummary["direction"], delta: number | null): string {
  if (direction === "up") return `↑ +${delta ?? 0} pts — melhorando`;
  if (direction === "down") return `↓ ${delta ?? 0} pts — atenção`;
  if (direction === "flat") return "→ estável";
  return "dados insuficientes";
}
