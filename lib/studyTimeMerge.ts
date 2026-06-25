export type StudyDayRecord = {
  part1: number;
  part2: number;
};

export type StudyDaysMap = Record<string, StudyDayRecord>;

function normalizeSeconds(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(Math.floor(n), 86400);
}

export function normalizeStudyDay(day: StudyDayRecord): StudyDayRecord {
  return {
    part1: normalizeSeconds(day.part1),
    part2: normalizeSeconds(day.part2),
  };
}

export function mergeStudyDays(local: StudyDaysMap, remote: StudyDaysMap): StudyDaysMap {
  const merged: StudyDaysMap = {};

  for (const [date, day] of Object.entries(remote)) {
    merged[date] = normalizeStudyDay(day);
  }

  for (const [date, day] of Object.entries(local)) {
    const left = normalizeStudyDay(day);
    const right = merged[date] ?? { part1: 0, part2: 0 };
    merged[date] = {
      part1: Math.max(left.part1, right.part1),
      part2: Math.max(left.part2, right.part2),
    };
  }

  return merged;
}

export function studyDaysToMap(
  rows: Array<{ date: Date; part1Seconds: number; part2Seconds: number }>,
): StudyDaysMap {
  const map: StudyDaysMap = {};
  for (const row of rows) {
    const key = row.date.toISOString().slice(0, 10);
    map[key] = normalizeStudyDay({
      part1: row.part1Seconds,
      part2: row.part2Seconds,
    });
  }
  return map;
}

export function dateKeyFromInput(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return value;
}
