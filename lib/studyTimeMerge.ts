import {
  emptyStudyDay,
  STUDY_ACTIVITY_ORDER,
  type StudyDayRecord,
  type StudyDaysMap,
} from "@/lib/studyTime";

export type { StudyDayRecord, StudyDaysMap };

function normalizeCount(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(Math.floor(n), 9999);
}

export function normalizeStudyDay(day: Partial<StudyDayRecord>): StudyDayRecord {
  const base = emptyStudyDay();
  for (const key of STUDY_ACTIVITY_ORDER) {
    base[key] = normalizeCount(day[key]);
  }
  return base;
}

export function mergeStudyDays(local: StudyDaysMap, remote: StudyDaysMap): StudyDaysMap {
  const merged: StudyDaysMap = {};

  for (const [date, day] of Object.entries(remote)) {
    merged[date] = normalizeStudyDay(day);
  }

  for (const [date, day] of Object.entries(local)) {
    const left = normalizeStudyDay(day);
    const right = merged[date] ?? emptyStudyDay();
    const next = emptyStudyDay();
    for (const key of STUDY_ACTIVITY_ORDER) {
      next[key] = Math.max(left[key], right[key]);
    }
    merged[date] = next;
  }

  return merged;
}

export function studyDaysToMap(
  rows: Array<{
    date: Date;
    shadowCount: number;
    shadowPart2Count: number;
    simulateCount: number;
    pronunciationCount: number;
    vocabularyCount: number;
  }>,
): StudyDaysMap {
  const map: StudyDaysMap = {};
  for (const row of rows) {
    const key = row.date.toISOString().slice(0, 10);
    map[key] = normalizeStudyDay({
      shadow: row.shadowCount,
      shadowPart2: row.shadowPart2Count,
      simulate: row.simulateCount,
      pronunciation: row.pronunciationCount,
      vocabulary: row.vocabularyCount,
    });
  }
  return map;
}

export function studyDayToDbFields(day: StudyDayRecord) {
  return {
    shadowCount: day.shadow,
    shadowPart2Count: day.shadowPart2,
    simulateCount: day.simulate,
    pronunciationCount: day.pronunciation,
    vocabularyCount: day.vocabulary,
  };
}

export function dateKeyFromInput(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return value;
}
