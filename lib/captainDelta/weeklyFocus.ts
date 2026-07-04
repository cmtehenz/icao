const START_KEY = "icao_captain_delta_start_v1";

const WEEKLY_FOCUS = [
  "speaking confidence and getting words out clearly",
  "answer structure — situation, action, outcome",
  "natural pilot language instead of translated English",
  "sounding like an experienced helicopter pilot in the oral exam",
] as const;

export function getTrainingWeek(): number {
  if (typeof window === "undefined") return 1;
  try {
    let start = localStorage.getItem(START_KEY);
    if (!start) {
      start = new Date().toISOString().slice(0, 10);
      localStorage.setItem(START_KEY, start);
    }
    const startDate = new Date(`${start}T12:00:00`);
    const now = new Date();
    const days = Math.floor((now.getTime() - startDate.getTime()) / 86400000);
    return Math.min(4, Math.max(1, Math.floor(days / 7) + 1));
  } catch {
    return 1;
  }
}

export function getWeeklyFocusLine(): string {
  const week = getTrainingWeek();
  return WEEKLY_FOCUS[week - 1] ?? WEEKLY_FOCUS[3];
}
