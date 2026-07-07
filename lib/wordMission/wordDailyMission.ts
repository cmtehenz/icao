import { getTodayExamVersion } from "@/lib/dailyExamRotation";
import { syncDailyMissionLog } from "@/lib/dailyMissionLog";
import type { ExamVersion } from "@/lib/exams/types";
import { getDevKnowledgeTermIds } from "@/lib/knowledge/devKnowledge";
import { isDevKnowledgeEnabled } from "@/lib/knowledge/devKnowledgeFlag";
import { findWordMissionVocabItem, getWordMissionVocabulary } from "@/lib/wordMission/wordMissionCatalog";
import { todayKey } from "@/lib/studyTime";
import {
  getOrCreateVocabDailyMission,
  isVocabTermInTodayMission,
  markVocabDailyComplete,
  vocabDailyMissionProgress,
  VOCAB_DAILY_MISSION_EVENT,
  VOCAB_DAILY_WORD_COUNT,
  type VocabDailyMissionState,
} from "@/lib/vocabDailyMission";

export { VOCAB_DAILY_WORD_COUNT };
export const WORD_DAILY_MISSION_EVENT = VOCAB_DAILY_MISSION_EVENT;

const DEV_MISSION_STORAGE_KEY = "icao_word_dev_daily_mission_v1";

function notifyMissionChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(VOCAB_DAILY_MISSION_EVENT));
}

function isValidDevMission(parsed: unknown, date: string): parsed is VocabDailyMissionState {
  if (!parsed || typeof parsed !== "object") return false;
  const m = parsed as VocabDailyMissionState;
  const expectedIds = getDevKnowledgeTermIds();
  return (
    m.date === date &&
    Array.isArray(m.termIds) &&
    Array.isArray(m.completedIds) &&
    m.termIds.length === expectedIds.length &&
    m.termIds.every((id, i) => id === expectedIds[i])
  );
}

function loadDevWordDailyMission(): VocabDailyMissionState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DEV_MISSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isValidDevMission(parsed, todayKey())) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveDevWordDailyMission(state: VocabDailyMissionState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEV_MISSION_STORAGE_KEY, JSON.stringify(state));
  syncDailyMissionLog();
  notifyMissionChange();
}

function getOrCreateDevWordDailyMission(): VocabDailyMissionState {
  const existing = loadDevWordDailyMission();
  if (existing) return existing;

  const date = todayKey();
  const examVersion = getTodayExamVersion(date) as ExamVersion;
  const state: VocabDailyMissionState = {
    date,
    examVersion,
    termIds: getDevKnowledgeTermIds(),
    completedIds: [],
  };
  saveDevWordDailyMission(state);
  return state;
}

export function getOrCreateWordDailyMission(): VocabDailyMissionState {
  if (isDevKnowledgeEnabled()) {
    return getOrCreateDevWordDailyMission();
  }
  return getOrCreateVocabDailyMission();
}

export function wordDailyMissionProgress(mission = getOrCreateWordDailyMission()) {
  return vocabDailyMissionProgress(mission);
}

export function isWordMissionTermInTodayMission(termId: string): boolean {
  if (isDevKnowledgeEnabled()) {
    return getOrCreateDevWordDailyMission().termIds.includes(termId);
  }
  return isVocabTermInTodayMission(termId);
}

export function markWordMissionTermComplete(termId: string): VocabDailyMissionState | null {
  if (isDevKnowledgeEnabled()) {
    const mission = getOrCreateDevWordDailyMission();
    if (!mission.termIds.includes(termId) || mission.completedIds.includes(termId)) {
      return mission;
    }
    const next: VocabDailyMissionState = {
      ...mission,
      completedIds: [...mission.completedIds, termId],
    };
    saveDevWordDailyMission(next);
    return next;
  }
  return markVocabDailyComplete(termId);
}

export function wordMissionLink(termId: string): string {
  return `/word-mission?term=${encodeURIComponent(termId)}`;
}

export function wordMissionBrowseLink(): string {
  return "/word-mission";
}

/** Map legacy pronunciation vault word to a vocab term id when possible. */
export function resolveVocabTermIdForWord(word: string): string | null {
  const normalized = word.trim().toLowerCase();
  const catalog = getWordMissionVocabulary();
  const exact = catalog.find((t) => t.term.toLowerCase() === normalized);
  if (exact) return exact.id;
  const partial = catalog.find((t) => t.term.toLowerCase().includes(normalized));
  return partial?.id ?? null;
}

export function findWordMissionItemById(termId: string) {
  return findWordMissionVocabItem(termId);
}
