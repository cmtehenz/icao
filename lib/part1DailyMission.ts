import { getTodayPart1CardNums, getTodayExamVersion } from "@/lib/dailyExamRotation";
import { CARDS } from "@/lib/cards";
import { getPeelBlocks } from "@/lib/peelBlocks";
import { hasShadowPeelScoredToday, peelBlockActivityKey } from "@/lib/shadowPeelDedup";
import { syncDailyMissionLog } from "@/lib/dailyMissionLog";
import type { ExamVersion } from "@/lib/exams/types";
import { todayKey } from "@/lib/studyTime";

export const PART1_DAILY_CARD_COUNT = 3;

const STORAGE_KEY = "icao_part1_daily_mission_v2";
export const PART1_DAILY_MISSION_EVENT = "icao-part1-daily-mission-change";

export type Part1CardMission = {
  cardNum: string;
  shadowDone: boolean;
  coachDone: boolean;
};

export type Part1DailyMissionState = {
  date: string;
  examVersion: ExamVersion;
  cards: Part1CardMission[];
};

function notify(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PART1_DAILY_MISSION_EVENT));
}

function expectedCardNums(date: string): string[] {
  return [...getTodayPart1CardNums(date)];
}

function missionMatchesToday(mission: Part1DailyMissionState, date: string): boolean {
  if (mission.date !== date) return false;
  const expected = expectedCardNums(date);
  const nums = mission.cards.map((c) => c.cardNum);
  return (
    mission.examVersion === getTodayExamVersion(date) &&
    nums.length === expected.length &&
    expected.every((n, i) => nums[i] === n)
  );
}

export function part1CardNumsForDate(date = todayKey()): string[] {
  return expectedCardNums(date);
}

export function loadPart1DailyMission(): Part1DailyMissionState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Part1DailyMissionState;
    if (!missionMatchesToday(parsed, todayKey())) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function savePart1DailyMission(state: Part1DailyMissionState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  syncDailyMissionLog();
  notify();
}

export function getOrCreatePart1DailyMission(date = todayKey()): Part1DailyMissionState {
  const existing = loadPart1DailyMission();
  if (existing) return existing;

  const examVersion = getTodayExamVersion(date);
  const cardNums = part1CardNumsForDate(date);
  const state: Part1DailyMissionState = {
    date,
    examVersion,
    cards: cardNums.map((cardNum) => ({
      cardNum,
      shadowDone: false,
      coachDone: false,
    })),
  };
  savePart1DailyMission(state);
  return state;
}

function updateCard(
  cardNum: string,
  patch: Partial<Pick<Part1CardMission, "shadowDone" | "coachDone">>,
): Part1DailyMissionState | null {
  const mission = getOrCreatePart1DailyMission();
  const idx = mission.cards.findIndex((c) => c.cardNum === cardNum);
  if (idx < 0) return null;

  const next: Part1DailyMissionState = {
    ...mission,
    cards: mission.cards.map((c, i) => (i === idx ? { ...c, ...patch } : c)),
  };
  savePart1DailyMission(next);
  return next;
}

export function part1CardPeelProgress(cardNum: string): { done: number; total: number } {
  const card = CARDS.find((c) => c.num === cardNum);
  if (!card) return { done: 0, total: 0 };
  const blocks = getPeelBlocks(card);
  const done = blocks.filter((b) =>
    hasShadowPeelScoredToday(peelBlockActivityKey(cardNum, b.id)),
  ).length;
  return { done, total: blocks.length };
}

export function part1CardAllPeelBlocksDoneToday(cardNum: string): boolean {
  const { done, total } = part1CardPeelProgress(cardNum);
  return total > 0 && done >= total;
}

export function markPart1ShadowDone(cardNum: string): Part1DailyMissionState | null {
  return updateCard(cardNum, { shadowDone: true });
}

/** Mark shadow only when all PEEL blocks for the card scored ≥70% today. */
export function tryMarkPart1ShadowComplete(cardNum: string): Part1DailyMissionState | null {
  if (!isPart1CardInTodayMission(cardNum)) return null;
  const mission = getOrCreatePart1DailyMission();
  const card = mission.cards.find((c) => c.cardNum === cardNum);
  if (!card || card.shadowDone) return mission;
  if (!part1CardAllPeelBlocksDoneToday(cardNum)) return mission;
  return markPart1ShadowDone(cardNum);
}

export function markPart1CoachDone(cardNum: string): Part1DailyMissionState | null {
  return updateCard(cardNum, { coachDone: true });
}

export function isPart1CardInTodayMission(cardNum: string): boolean {
  return getOrCreatePart1DailyMission().cards.some((c) => c.cardNum === cardNum);
}

export function part1DailyMissionProgress(mission = getOrCreatePart1DailyMission()): {
  shadowDone: number;
  coachDone: number;
  bothDone: number;
  total: number;
  complete: boolean;
  examVersion: ExamVersion;
} {
  const total = mission.cards.length;
  const shadowDone = mission.cards.filter((c) => c.shadowDone).length;
  const coachDone = mission.cards.filter((c) => c.coachDone).length;
  const bothDone = mission.cards.filter((c) => c.shadowDone && c.coachDone).length;
  return {
    shadowDone,
    coachDone,
    bothDone,
    total,
    complete: bothDone >= total && total > 0,
    examVersion: mission.examVersion,
  };
}

export function part1MissionLink(cardNum: string, mode: "shadow" | "coach"): string {
  const params = new URLSearchParams({ card: cardNum });
  if (mode === "shadow") params.set("shadow", "1");
  else params.set("coach", "1");
  return `/part1?${params.toString()}`;
}
