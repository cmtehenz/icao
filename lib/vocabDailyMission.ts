import { ICAO_VOCABULARY } from "@/data/icaoVocabulary";
import { pickDailySlice } from "@/lib/dailyRotation";
import { syncDailyMissionLog } from "@/lib/dailyMissionLog";
import { todayKey } from "@/lib/studyTime";
import {
  getItemProgress,
  isDueForReview,
  loadVocabProgressStore,
  type VocabProgressStore,
} from "@/utils/spacedRepetition";

export const VOCAB_DAILY_WORD_COUNT = 20;

const STORAGE_KEY = "icao_vocab_daily_mission_v1";
export const VOCAB_DAILY_MISSION_EVENT = "icao-vocab-daily-mission-change";

export type VocabDailyMissionState = {
  date: string;
  termIds: string[];
  completedIds: string[];
};

function notify(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(VOCAB_DAILY_MISSION_EVENT));
}

function vocabPriority(store: VocabProgressStore, id: string): number {
  const p = getItemProgress(store, id);
  if (p.markedDifficult || p.status === "review") return 0;
  if (isDueForReview(p)) return 1;
  if (p.status === "learning") return 2;
  if (p.status === "new") return 3;
  return 4;
}

export function pickVocabDailyIds(
  date = todayKey(),
  store: VocabProgressStore = loadVocabProgressStore(),
): string[] {
  const rotated = pickDailySlice(
    ICAO_VOCABULARY.map((t) => t.id),
    VOCAB_DAILY_WORD_COUNT,
    date,
    7,
  );

  const dueFirst = [...ICAO_VOCABULARY]
    .sort((a, b) => vocabPriority(store, a.id) - vocabPriority(store, b.id))
    .filter((t) => vocabPriority(store, t.id) <= 2)
    .map((t) => t.id);

  const picked = new Set<string>();
  const result: string[] = [];

  for (const id of dueFirst) {
    if (result.length >= VOCAB_DAILY_WORD_COUNT) break;
    if (!picked.has(id)) {
      picked.add(id);
      result.push(id);
    }
  }

  for (const id of rotated) {
    if (result.length >= VOCAB_DAILY_WORD_COUNT) break;
    if (!picked.has(id)) {
      picked.add(id);
      result.push(id);
    }
  }

  for (const item of ICAO_VOCABULARY) {
    if (result.length >= VOCAB_DAILY_WORD_COUNT) break;
    if (!picked.has(item.id)) {
      picked.add(item.id);
      result.push(item.id);
    }
  }

  return result.slice(0, VOCAB_DAILY_WORD_COUNT);
}

export function loadVocabDailyMission(): VocabDailyMissionState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as VocabDailyMissionState;
    if (parsed.date !== todayKey()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveVocabDailyMission(state: VocabDailyMissionState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  syncDailyMissionLog();
  notify();
}

export function getOrCreateVocabDailyMission(
  store: VocabProgressStore = loadVocabProgressStore(),
): VocabDailyMissionState {
  const existing = loadVocabDailyMission();
  if (existing) return existing;

  const state: VocabDailyMissionState = {
    date: todayKey(),
    termIds: pickVocabDailyIds(todayKey(), store),
    completedIds: [],
  };
  saveVocabDailyMission(state);
  return state;
}

export function markVocabDailyComplete(termId: string): VocabDailyMissionState | null {
  const mission = getOrCreateVocabDailyMission();
  if (!mission.termIds.includes(termId)) return mission;
  if (mission.completedIds.includes(termId)) return mission;

  const next: VocabDailyMissionState = {
    ...mission,
    completedIds: [...mission.completedIds, termId],
  };
  saveVocabDailyMission(next);
  return next;
}

export function isVocabTermInTodayMission(termId: string): boolean {
  return getOrCreateVocabDailyMission().termIds.includes(termId);
}

export function vocabDailyMissionProgress(mission = getOrCreateVocabDailyMission()): {
  done: number;
  total: number;
  complete: boolean;
  currentId: string | null;
} {
  const total = mission.termIds.length;
  const done = mission.completedIds.length;
  const currentId =
    mission.termIds.find((id) => !mission.completedIds.includes(id)) ?? null;
  return {
    done,
    total,
    complete: done >= total && total > 0,
    currentId,
  };
}

export function vocabMissionLink(termId: string): string {
  return `/vocabulario?term=${encodeURIComponent(termId)}`;
}
