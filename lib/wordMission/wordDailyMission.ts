import { getTodayExamVersion } from "@/lib/dailyExamRotation";
import { syncDailyMissionLog } from "@/lib/dailyMissionLog";
import type { ExamVersion } from "@/lib/exams/types";
import { getDevKnowledgeTermIds } from "@/lib/knowledge/devKnowledge";
import {
  findWordMissionVocabItem,
  getWordMissionTermLabel,
  getWordMissionVocabulary,
  getWordMissionVocabularyCount,
} from "@/lib/wordMission/wordMissionCatalog";
import { todayKey } from "@/lib/studyTime";
import {
  vocabDailyMissionProgress,
  VOCAB_DAILY_MISSION_EVENT,
  type VocabDailyMissionState,
} from "@/lib/vocabDailyMission";

export const WORD_DAILY_MISSION_EVENT = VOCAB_DAILY_MISSION_EVENT;

const PREMIUM_MISSION_STORAGE_KEY = "icao_word_premium_daily_mission_v1";
const LEGACY_DEV_MISSION_STORAGE_KEY = "icao_word_dev_daily_mission_v1";

function notifyMissionChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(VOCAB_DAILY_MISSION_EVENT));
}

function clearLegacyMissionStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LEGACY_DEV_MISSION_STORAGE_KEY);
  localStorage.removeItem("icao_vocab_daily_mission_v2");
}

function isValidPremiumMission(parsed: unknown, date: string): parsed is VocabDailyMissionState {
  if (!parsed || typeof parsed !== "object") return false;
  const m = parsed as VocabDailyMissionState;
  const examVersion = getTodayExamVersion(date) as ExamVersion;
  const expectedIds = seededShuffle(getDevKnowledgeTermIds(), `${date}|${examVersion}`);
  return (
    m.date === date &&
    m.examVersion === examVersion &&
    Array.isArray(m.termIds) &&
    Array.isArray(m.completedIds) &&
    m.termIds.length === expectedIds.length &&
    m.termIds.every((id, i) => id === expectedIds[i])
  );
}

function hashStringToUint32(input: string): number {
  // FNV-1a 32-bit
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], seed: string): T[] {
  const out = arr.slice();
  const rng = mulberry32(hashStringToUint32(seed));
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
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
  const termIds = seededShuffle(getDevKnowledgeTermIds(), `${date}|${examVersion}`);
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
