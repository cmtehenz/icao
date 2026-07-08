import { getTodayExamVersion } from "@/lib/dailyExamRotation";
import { syncDailyMissionLog } from "@/lib/dailyMissionLog";
import type { ExamVersion } from "@/lib/exams/types";
import {
  findWordMissionVocabItem,
  getWordMissionTermLabel,
  getWordMissionVocabulary,
  getWordMissionVocabularyCount,
} from "@/lib/wordMission/wordMissionCatalog";
import {
  pickWordDailyTermIds,
  WORD_DAILY_MISSION_TERM_COUNT,
} from "@/lib/wordMission/pickWordDailyTerms";
import { todayKey } from "@/lib/studyTime";
import {
  vocabDailyMissionProgress,
  VOCAB_DAILY_MISSION_EVENT,
  type VocabDailyMissionState,
} from "@/lib/vocabDailyMission";

export const WORD_DAILY_MISSION_EVENT = VOCAB_DAILY_MISSION_EVENT;

export {
  pickWordDailyTermIds,
  WORD_DAILY_MISSION_TERM_COUNT,
  WORD_DAILY_MIN_EXAM_TERMS,
  WORD_DAILY_MAX_REVIEW_TERMS,
} from "@/lib/wordMission/pickWordDailyTerms";

const PREMIUM_MISSION_STORAGE_KEY = "icao_word_premium_daily_mission_v3";
const LEGACY_DEV_MISSION_STORAGE_KEY = "icao_word_dev_daily_mission_v1";

function notifyMissionChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(VOCAB_DAILY_MISSION_EVENT));
}

function clearLegacyMissionStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LEGACY_DEV_MISSION_STORAGE_KEY);
  localStorage.removeItem("icao_vocab_daily_mission_v2");
  localStorage.removeItem("icao_word_premium_daily_mission_v1");
  localStorage.removeItem("icao_word_premium_daily_mission_v2");
}

function isValidPremiumMission(parsed: unknown, date: string): parsed is VocabDailyMissionState {
  if (!parsed || typeof parsed !== "object") return false;
  const m = parsed as VocabDailyMissionState;
  const examVersion = getTodayExamVersion(date) as ExamVersion;
  return (
    m.date === date &&
    m.examVersion === examVersion &&
    Array.isArray(m.termIds) &&
    Array.isArray(m.completedIds) &&
    m.termIds.length === WORD_DAILY_MISSION_TERM_COUNT &&
    m.termIds.every((id) => Boolean(findWordMissionVocabItem(id))) &&
    m.completedIds.every((id) => m.termIds.includes(id))
  );
}

function loadPremiumWordDailyMission(): VocabDailyMissionState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PREMIUM_MISSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isValidPremiumMission(parsed, todayKey())) return null;
    return parsed;
  } catch {
    return null;
  }
}

function savePremiumWordDailyMission(state: VocabDailyMissionState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREMIUM_MISSION_STORAGE_KEY, JSON.stringify(state));
  syncDailyMissionLog();
  notifyMissionChange();
}

function getOrCreatePremiumWordDailyMission(): VocabDailyMissionState {
  const existing = loadPremiumWordDailyMission();
  if (existing) return existing;

  clearLegacyMissionStorage();

  const date = todayKey();
  const examVersion = getTodayExamVersion(date) as ExamVersion;
  const termIds = pickWordDailyTermIds(date, examVersion);
  const state: VocabDailyMissionState = {
    date,
    examVersion,
    termIds,
    completedIds: [],
  };
  savePremiumWordDailyMission(state);
  return state;
}

export function getOrCreateWordDailyMission(): VocabDailyMissionState {
  return getOrCreatePremiumWordDailyMission();
}

export function wordDailyMissionProgress(mission = getOrCreateWordDailyMission()) {
  return vocabDailyMissionProgress(mission);
}

export function isWordMissionTermInTodayMission(termId: string): boolean {
  return getOrCreatePremiumWordDailyMission().termIds.includes(termId);
}

/**
 * Pronunciation vault passes completed word lists; Word Mission must not treat `[]` as override.
 * An empty array previously reset progress and re-selected term 1 (stuck on "Mission complete").
 */
export function effectiveMissionCompletedIds(
  mission: VocabDailyMissionState,
  completedOverride?: string[],
): string[] {
  if (completedOverride !== undefined && completedOverride.length > 0) {
    return completedOverride;
  }
  return mission.completedIds;
}

export function nextWordMissionTermId(
  mission: VocabDailyMissionState,
  completedOverride?: string[],
): string | null {
  const done = effectiveMissionCompletedIds(mission, completedOverride);
  if (done.length >= mission.termIds.length) return null;
  return mission.termIds.find((id) => !done.includes(id)) ?? null;
}

export function markWordMissionTermComplete(termId: string): VocabDailyMissionState | null {
  const mission = getOrCreatePremiumWordDailyMission();
  if (!mission.termIds.includes(termId) || mission.completedIds.includes(termId)) {
    return mission;
  }
  const next: VocabDailyMissionState = {
    ...mission,
    completedIds: [...mission.completedIds, termId],
  };
  savePremiumWordDailyMission(next);
  return next;
}

export function wordMissionLink(termId: string): string {
  return `/word-mission?term=${encodeURIComponent(termId)}`;
}

export function wordMissionBrowseLink(): string {
  return "/word-mission";
}

/** Map pronunciation vault word to a premium concept id when possible. */
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

export function getWordMissionTodayTermLabels(
  mission = getOrCreateWordDailyMission(),
): string[] {
  return mission.termIds
    .map((id) => {
      const item = findWordMissionVocabItem(id);
      return item ? getWordMissionTermLabel(item) : null;
    })
    .filter((label): label is string => Boolean(label));
}

export function getWordMissionDailyWordCount(): number {
  return getWordMissionVocabularyCount();
}

export function loadWordDailyMission(): VocabDailyMissionState | null {
  return loadPremiumWordDailyMission();
}

export function saveWordDailyMission(state: VocabDailyMissionState): void {
  savePremiumWordDailyMission(state);
}
