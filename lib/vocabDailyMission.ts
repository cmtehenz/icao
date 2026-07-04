import { pickExamVocabTermIds } from "@/lib/examVocabPool";
import { getTodayExamVersion } from "@/lib/dailyExamRotation";
import { syncDailyMissionLog } from "@/lib/dailyMissionLog";
import type { ExamVersion } from "@/lib/exams/types";
import { todayKey } from "@/lib/studyTime";
import { loadVocabProgressStore, type VocabProgressStore } from "@/utils/spacedRepetition";

export const VOCAB_DAILY_WORD_COUNT = 20;

const STORAGE_KEY = "icao_vocab_daily_mission_v2";
export const VOCAB_DAILY_MISSION_EVENT = "icao-vocab-daily-mission-change";

export type VocabDailyMissionState = {
  date: string;
  examVersion: ExamVersion;
  termIds: string[];
  completedIds: string[];
};

function notify(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(VOCAB_DAILY_MISSION_EVENT));
}

function isValidMission(parsed: unknown, date: string): parsed is VocabDailyMissionState {
  if (!parsed || typeof parsed !== "object") return false;
  const m = parsed as VocabDailyMissionState;
  return (
    m.date === date &&
    typeof m.examVersion === "string" &&
    m.examVersion === getTodayExamVersion(date) &&
    Array.isArray(m.termIds) &&
    Array.isArray(m.completedIds)
  );
}

export function pickVocabDailyIds(
  date = todayKey(),
  store: VocabProgressStore = loadVocabProgressStore(),
  examVersion: ExamVersion = getTodayExamVersion(date),
): string[] {
  return pickExamVocabTermIds(examVersion, VOCAB_DAILY_WORD_COUNT, date, store);
}

export function loadVocabDailyMission(): VocabDailyMissionState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isValidMission(parsed, todayKey())) return null;
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

  const date = todayKey();
  const examVersion = getTodayExamVersion(date);
  const state: VocabDailyMissionState = {
    date,
    examVersion,
    termIds: pickVocabDailyIds(date, store, examVersion),
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
  examVersion: ExamVersion;
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
    examVersion: mission.examVersion,
  };
}

export function vocabMissionLink(termId: string): string {
  return `/vocabulario?term=${encodeURIComponent(termId)}`;
}
