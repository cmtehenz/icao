import { ALL_PART1_CARD_NUMS } from "@/data/exams/part1";
import { CARDS } from "@/lib/cards";
import { getPart1CoachHistory } from "@/lib/part1CoachHistory";
import { getPeelBlocks } from "@/lib/peelBlocks";
import { getPeelBlockHistory } from "@/lib/peelBlockHistory";
import { SHADOW_PEEL_PASS_SCORE } from "@/lib/studyActivityRecord";

export const PART1_MASTERY_TOTAL = ALL_PART1_CARD_NUMS.length;
export const PART1_COACH_PASS_SCORE = 75;
export const PART1_COACH_PASS_LEVEL = 4;

export type Part1MasteryStage = "new" | "shadowing" | "coaching" | "examReady";

export type Part1CardMastery = {
  cardNum: string;
  stage: Part1MasteryStage;
  peelDone: number;
  peelTotal: number;
  coachBest: number | null;
  coachLevel: number | null;
};

export type Part1MasterySummary = {
  total: number;
  examReady: number;
  shadowing: number;
  coaching: number;
  cards: Part1CardMastery[];
};

function peelBlocksReady(cardNum: string): { done: number; total: number; ready: boolean } {
  const card = CARDS.find((c) => c.num === cardNum);
  if (!card) return { done: 0, total: 0, ready: false };
  const blocks = getPeelBlocks(card);
  const done = blocks.filter(
    (b) => (getPeelBlockHistory(cardNum)[b.id]?.bestAccuracy ?? 0) >= SHADOW_PEEL_PASS_SCORE,
  ).length;
  return { done, total: blocks.length, ready: blocks.length > 0 && done >= blocks.length };
}

/** One card is exam-ready when every PEEL block scored and coach reached ICAO 4 band. */
export function part1CardMastery(cardNum: string): Part1CardMastery {
  const peel = peelBlocksReady(cardNum);
  const coach = getPart1CoachHistory(cardNum);
  const coachBest = coach?.bestOverall ?? null;
  const coachLevel = coach?.bestIcaoLevel ?? null;

  const coachReady =
    (coachBest != null && coachBest >= PART1_COACH_PASS_SCORE) ||
    (coachLevel != null && coachLevel >= PART1_COACH_PASS_LEVEL);

  let stage: Part1MasteryStage = "new";
  if (peel.ready && coachReady) stage = "examReady";
  else if (coachBest != null || (coach?.attempts ?? 0) > 0) stage = "coaching";
  else if (peel.done > 0) stage = "shadowing";

  return {
    cardNum,
    stage,
    peelDone: peel.done,
    peelTotal: peel.total,
    coachBest,
    coachLevel,
  };
}

export function buildPart1MasterySummary(): Part1MasterySummary {
  const cards = ALL_PART1_CARD_NUMS.map(part1CardMastery);
  return {
    total: PART1_MASTERY_TOTAL,
    examReady: cards.filter((c) => c.stage === "examReady").length,
    shadowing: cards.filter((c) => c.stage === "shadowing").length,
    coaching: cards.filter((c) => c.stage === "coaching").length,
    cards,
  };
}

export function part1MasteryStageLabel(stage: Part1MasteryStage): string {
  switch (stage) {
    case "new":
      return "Not started";
    case "shadowing":
      return "Shadowing PEEL";
    case "coaching":
      return "Coach practice";
    case "examReady":
      return "Exam ready";
  }
}
