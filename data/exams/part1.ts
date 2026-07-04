import type { ExamVersion } from "@/lib/exams/types";

/** Card nums per SDEA Part 1 exam (3 questions each — card nums match question order per prova). */
export const PART1_BY_EXAM: Record<ExamVersion, readonly string[]> = {
  "23C": ["01", "02", "03"],
  "24C": ["04", "05", "06"],
  "25C": ["07", "08", "09"],
  "26C": ["10", "11", "12"],
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
