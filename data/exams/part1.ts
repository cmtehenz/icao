import type { ExamVersion } from "@/lib/exams/types";

/** Card nums for each real SDEA exam — Part 1 has exactly 3 questions per version. */
export const PART1_BY_EXAM: Record<ExamVersion, readonly string[]> = {
  "23C": ["01", "02", "12"],
  "24C": ["04", "05", "03"],
  "25C": ["06", "07", "08"],
  "26C": ["09", "10", "11"],
};

export const ALL_PART1_CARD_NUMS = [
  ...new Set(Object.values(PART1_BY_EXAM).flat()),
] as string[];

export function getPart1CardsForExam(version: ExamVersion): readonly string[] {
  return PART1_BY_EXAM[version];
}

export function getExamForCard(num: string): ExamVersion | undefined {
  for (const [version, nums] of Object.entries(PART1_BY_EXAM) as [ExamVersion, readonly string[]][]) {
    if (nums.includes(num)) return version;
  }
  return undefined;
}
