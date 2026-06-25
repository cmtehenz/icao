import { ALL_PART1_CARD_NUMS } from "@/data/exams/part1";

/** All 12 Part 1 questions from the 4 real SDEA exams (23C–26C). */
export const HELICOPTER_CORE_NUMS = ALL_PART1_CARD_NUMS;

export type CoreQuestionNum = (typeof HELICOPTER_CORE_NUMS)[number];

export function isCoreQuestion(num: string): boolean {
  return (HELICOPTER_CORE_NUMS as readonly string[]).includes(num);
}
