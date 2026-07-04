const EXAM_DATE_KEY = "icao_exam_target_date_v1";
const DEFAULT_DAYS = 45;

export function getExamTargetDate(): Date {
  if (typeof window === "undefined") {
    const d = new Date();
    d.setDate(d.getDate() + DEFAULT_DAYS);
    return d;
  }
  try {
    const raw = localStorage.getItem(EXAM_DATE_KEY);
    if (raw) {
      const parsed = new Date(`${raw}T12:00:00`);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
  } catch {
    /* ignore */
  }
  const d = new Date();
  d.setDate(d.getDate() + DEFAULT_DAYS);
  saveExamTargetDate(d);
  return d;
}

export function saveExamTargetDate(date: Date): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(EXAM_DATE_KEY, date.toISOString().slice(0, 10));
}

export function daysUntilExam(from = new Date()): number {
  const target = getExamTargetDate();
  const start = new Date(`${from.toISOString().slice(0, 10)}T12:00:00`);
  const end = new Date(`${target.toISOString().slice(0, 10)}T12:00:00`);
  return Math.max(0, Math.ceil((end.getTime() - start.getTime()) / 86400000));
}
