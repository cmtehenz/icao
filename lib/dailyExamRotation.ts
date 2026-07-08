import { PART1_BY_EXAM } from "@/data/exams/part1";
import { examIdFromVersion } from "@/data/exams";
import type { SimuladoExamId } from "@/data/exams";
import type { ExamVersion } from "@/lib/exams/types";
import { EXAM_LABELS } from "@/lib/exams/types";
import { todayKey } from "@/lib/studyTime";

/** Daily focus cycles Mon→23C, Tue→24C, Wed→25C, Thu→26C, then repeats. */
export const DAILY_EXAM_ROTATION: readonly ExamVersion[] = ["23C", "24C", "25C", "26C"];

/** Monday = 0 … Sunday = 6 (ISO weekday order). */
export function weekdayIndex(dateKey: string): number {
  const jsDay = new Date(`${dateKey}T12:00:00`).getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

export function getTodayExamVersion(dateKey?: string): ExamVersion {
  const key = dateKey ?? todayKey();
  return DAILY_EXAM_ROTATION[weekdayIndex(key) % DAILY_EXAM_ROTATION.length]!;
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
