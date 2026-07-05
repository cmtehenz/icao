import { buildDailyPronunciationMission } from "@/lib/pronunciationMission";
import { loadVault } from "@/lib/pronunciationVault";
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

  const built = buildDailyPronunciationMission(loadVault());
  const state: PronunciationDailyMissionState = {
    date: todayKey(),
    words: built.words.map((w) => w.word.word),
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
    complete: total === 0 || (total > 0 && done >= total),
    currentWord,
  };
}

export function pronunciationMissionLink(word?: string): string {
  if (!word) {
    const { currentWord } = pronunciationDailyMissionProgress();
    if (currentWord) return `/pronunciation?word=${encodeURIComponent(currentWord)}`;
    return "/pronunciation";
  }
  return `/pronunciation?word=${encodeURIComponent(word)}`;
}
