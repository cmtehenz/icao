export type StudySection = "part1" | "part2";

export const STUDY_GOAL_SECONDS = 60 * 60;
export const STUDY_TIME_CHANGE_EVENT = "icao-study-time-change";

const STORAGE_KEY = "icao_daily_study_time_v1";
const MAX_HISTORY_DAYS = 365;

export type StudyDayRecord = { part1: number; part2: number };
export type StudyDaysMap = Record<string, StudyDayRecord>;

type StudyTimeStore = { days: StudyDaysMap };

export function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function emptyStore(): StudyTimeStore {
  return { days: {} };
}

export function loadStudyDays(): StudyDaysMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as StudyTimeStore;
    if (!parsed?.days || typeof parsed.days !== "object") return {};
    return parsed.days;
  } catch {
    return {};
  }
}

export function saveStudyDays(days: StudyDaysMap): void {
  if (typeof window === "undefined") return;
  const trimmed = trimHistory(days);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ days: trimmed }));
  window.dispatchEvent(new Event(STUDY_TIME_CHANGE_EVENT));
}

function trimHistory(days: StudyDaysMap): StudyDaysMap {
  const keys = Object.keys(days).sort();
  if (keys.length <= MAX_HISTORY_DAYS) return days;
  const next: StudyDaysMap = {};
  for (const key of keys.slice(-MAX_HISTORY_DAYS)) {
    next[key] = days[key];
  }
  return next;
}

export function getTodayStudyTime(): StudyDayRecord & { date: string } {
  const date = todayKey();
  const day = loadStudyDays()[date] ?? { part1: 0, part2: 0 };
  return {
    date,
    part1: Math.max(0, Math.floor(day.part1)),
    part2: Math.max(0, Math.floor(day.part2)),
  };
}

export function addStudySeconds(section: StudySection, seconds: number): void {
  if (seconds <= 0 || typeof window === "undefined") return;
  const days = loadStudyDays();
  const date = todayKey();
  const day = days[date] ?? { part1: 0, part2: 0 };
  days[date] = {
    ...day,
    [section]: day[section] + seconds,
  };
  saveStudyDays(days);
}

export function formatStudyClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function studyProgressPercent(
  elapsed: number,
  goal = STUDY_GOAL_SECONDS,
): number {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((elapsed / goal) * 100));
}

export function getStudyHistory(days = 7): Array<StudyDayRecord & { date: string }> {
  const store = loadStudyDays();
  const keys = Object.keys(store).sort().slice(-days);
  return keys.map((date) => ({
    date,
    part1: store[date]?.part1 ?? 0,
    part2: store[date]?.part2 ?? 0,
  }));
}

export type StudyHeatLevel = 0 | 1 | 2 | 3 | 4;

export function studyDayLevel(part1: number, part2: number): StudyHeatLevel {
  const total = part1 + part2;
  const dailyGoal = STUDY_GOAL_SECONDS * 2;
  if (total <= 0) return 0;
  if (total >= dailyGoal) return 4;
  if (total >= dailyGoal * 0.75) return 3;
  if (total >= dailyGoal * 0.35) return 2;
  return 1;
}

export function studyDayGoalMet(part1: number, part2: number): boolean {
  return part1 >= STUDY_GOAL_SECONDS && part2 >= STUDY_GOAL_SECONDS;
}

export type StudyCalendarCell = StudyDayRecord & {
  date: string;
  level: StudyHeatLevel;
  goalMet: boolean;
};

export function buildStudyCalendar(weeks = 26): StudyCalendarCell[] {
  const store = loadStudyDays();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(today);
  start.setDate(start.getDate() - weeks * 7 + 1);
  start.setDate(start.getDate() - start.getDay());

  const cells: StudyCalendarCell[] = [];
  const cursor = new Date(start);

  while (cursor <= today) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, "0");
    const d = String(cursor.getDate()).padStart(2, "0");
    const key = `${y}-${m}-${d}`;
    const day = store[key] ?? { part1: 0, part2: 0 };
    cells.push({
      date: key,
      part1: day.part1,
      part2: day.part2,
      level: studyDayLevel(day.part1, day.part2),
      goalMet: studyDayGoalMet(day.part1, day.part2),
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return cells;
}

export function studyStreak(days: StudyDaysMap = loadStudyDays()): number {
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  let streak = 0;

  while (true) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
    const day = days[key];
    if (!day || !studyDayGoalMet(day.part1, day.part2)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function studyDaysThisMonth(days: StudyDaysMap = loadStudyDays()): number {
  const prefix = todayKey().slice(0, 7);
  return Object.entries(days).filter(([date, day]) => {
    if (!date.startsWith(prefix)) return false;
    return day.part1 + day.part2 > 0;
  }).length;
}
