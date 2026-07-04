import { PART1_BY_EXAM } from "@/data/exams/part1";
import { examIdFromVersion } from "@/data/exams";
import type { SimuladoExamId } from "@/data/exams";
import type { ExamVersion } from "@/lib/exams/types";
import { EXAM_LABELS } from "@/lib/exams/types";
import { daysSinceEpoch } from "@/lib/dailyRotation";
import { todayKey } from "@/lib/studyTime";

/** Daily focus cycles 23C → 24C → 25C → 26C. */
export const DAILY_EXAM_ROTATION: readonly ExamVersion[] = ["23C", "24C", "25C", "26C"];

export function getTodayExamVersion(dateKey?: string): ExamVersion {
  const key = dateKey ?? todayKey();
  const day = daysSinceEpoch(key);
  return DAILY_EXAM_ROTATION[day % DAILY_EXAM_ROTATION.length]!;
}

export function getTodayExamId(dateKey?: string): SimuladoExamId {
  return examIdFromVersion(getTodayExamVersion(dateKey));
}

export function getTodayPart1CardNums(dateKey?: string): readonly string[] {
  return PART1_BY_EXAM[getTodayExamVersion(dateKey)];
}

export function todayExamLabel(dateKey?: string): string {
  const v = getTodayExamVersion(dateKey);
  return EXAM_LABELS[v] ?? `Prova ${v}`;
}
