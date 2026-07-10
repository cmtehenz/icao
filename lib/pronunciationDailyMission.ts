import { buildDailyPronunciationMission } from "@/lib/pronunciationMission";
import { loadVault, VAULT_PASS_SCORE } from "@/lib/pronunciationVault";
import {
  FOUNDATION_BOOTSTRAP_WORDS,
  getAdaptiveDailyPlan,
} from "@/lib/trainingProfile/adaptivePlan";
import { getTrainingProfile } from "@/lib/trainingProfile/store";
import { resolveVocabTermIdForWord, wordMissionLink } from "@/lib/wordMission/wordDailyMission";
import { syncDailyMissionLog } from "@/lib/dailyMissionLog";
import { todayKey } from "@/lib/studyTime";

export const PRONUNCIATION_DAILY_WORD_COUNT = 5;

const STORAGE_KEY = "icao_pronunciation_daily_mission_v1";
export const PRONUNCIATION_DAILY_MISSION_EVENT = "icao-pronunciation-daily-mission-change";

export type PronunciationDailyMissionState = {
  date: string;
  words: string[];
  completedWords: string[];
};

function notify(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PRONUNCIATION_DAILY_MISSION_EVENT));
}

function isValidMission(parsed: unknown, date: string): parsed is PronunciationDailyMissionState {
  if (!parsed || typeof parsed !== "object") return false;
  const m = parsed as PronunciationDailyMissionState;
  return (
    m.date === date &&
    Array.isArray(m.words) &&
    Array.isArray(m.completedWords)
  );
}

export function loadPronunciationDailyMission(): PronunciationDailyMissionState | null {
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

export function savePronunciationDailyMission(state: PronunciationDailyMissionState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  syncDailyMissionLog();
  notify();
}

export function getOrCreatePronunciationDailyMission(): PronunciationDailyMissionState {
  const existing = loadPronunciationDailyMission();
  if (existing) return existing;

  const plan = getAdaptiveDailyPlan();
  const built = buildDailyPronunciationMission(loadVault());
  let words = built.words.map((w) => w.word.word);

  // Foundation / pronunciation-first: bootstrap when vault is empty (RFC-004).
  if (words.length === 0 && plan.pronunciationFirst) {
    const focus = getTrainingProfile().focusSounds.filter(Boolean);
    const bootstrap = [
      ...focus,
      ...FOUNDATION_BOOTSTRAP_WORDS,
    ].filter((w, i, arr) => arr.findIndex((x) => x.toLowerCase() === w.toLowerCase()) === i);
    words = bootstrap.slice(0, plan.pronunciationWordCount);
  } else if (words.length > plan.pronunciationWordCount) {
    words = words.slice(0, plan.pronunciationWordCount);
  }

  const state: PronunciationDailyMissionState = {
    date: todayKey(),
    words,
    completedWords: [],
  };
  savePronunciationDailyMission(state);
  return state;
}

export function markPronunciationDailyWordComplete(word: string): PronunciationDailyMissionState {
  const mission = getOrCreatePronunciationDailyMission();
  const key = word.trim().toLowerCase();
  if (!mission.words.some((w) => w.toLowerCase() === key)) return mission;
  if (mission.completedWords.some((w) => w.toLowerCase() === key)) return mission;

  const next: PronunciationDailyMissionState = {
    ...mission,
    completedWords: [...mission.completedWords, key],
  };
  savePronunciationDailyMission(next);
  return next;
}

export function isPronunciationWordInTodayMission(word: string): boolean {
  const key = word.trim().toLowerCase();
  return getOrCreatePronunciationDailyMission().words.some((w) => w.toLowerCase() === key);
}

/** Daily mission word counts only after a valid Azure pass (Mission Engine). */
export function passesDailyMissionWordAttempt(score: number, assessed: boolean): boolean {
  return assessed && score >= VAULT_PASS_SCORE;
}

export function pronunciationDailyMissionProgress(
  mission = getOrCreatePronunciationDailyMission(),
): {
  done: number;
  total: number;
  complete: boolean;
  currentWord: string | null;
} {
  const total = mission.words.length;
  const done = mission.completedWords.length;
  const currentWord =
    mission.words.find((w) => !mission.completedWords.includes(w.toLowerCase())) ?? null;
  return {
    done,
    total,
    complete: total > 0 && done >= total,
    currentWord,
  };
}

export function pronunciationMissionLink(word?: string): string {
  const target = word?.trim() ?? pronunciationDailyMissionProgress().currentWord ?? "";
  if (target) {
    const termId = resolveVocabTermIdForWord(target);
    if (termId) return wordMissionLink(termId);
  }
  return "/word-mission";
}
