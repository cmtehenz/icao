export type StudyActivity = "shadow" | "simulate" | "pronunciation" | "vocabulary";

export const STUDY_ACTIVITY_POINTS: Record<StudyActivity, number> = {
  shadow: 1,
  simulate: 4,
  pronunciation: 2,
  vocabulary: 1,
};

/** Meta diária — ~30 min de estudo focado. */
export const STUDY_DAILY_GOAL_POINTS = 12;

/** Simulação Part 2 completa equivale a 3 perguntas Part 1 em esforço. */
export const SIMULATE_PART2_UNITS = 3;

export const STUDY_ACTIVITY_LABELS: Record<StudyActivity, string> = {
  shadow: "Shadowing PEEL",
  simulate: "Simulado",
  pronunciation: "Pronúncia",
  vocabulary: "Vocabulário",
};

export const STUDY_ACTIVITY_ORDER: StudyActivity[] = [
  "shadow",
  "simulate",
  "pronunciation",
  "vocabulary",
];

export const STUDY_TIME_CHANGE_EVENT = "icao-study-time-change";

const STORAGE_KEY = "icao_daily_study_activities_v1";
const MAX_HISTORY_DAYS = 365;

export type StudyDayRecord = Record<StudyActivity, number>;
export type StudyDaysMap = Record<string, StudyDayRecord>;

type StudyActivityStore = { days: StudyDaysMap };

export function emptyStudyDay(): StudyDayRecord {
  return { shadow: 0, simulate: 0, pronunciation: 0, vocabulary: 0 };
}

export function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function emptyStore(): StudyActivityStore {
  return { days: {} };
}

export function loadStudyDays(): StudyDaysMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as StudyActivityStore;
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

function normalizeDay(day: Partial<StudyDayRecord> | undefined): StudyDayRecord {
  const base = emptyStudyDay();
  if (!day) return base;
  for (const key of STUDY_ACTIVITY_ORDER) {
    const n = typeof day[key] === "number" ? day[key] : Number(day[key]);
    base[key] = Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  }
  return base;
}

export function getTodayStudyTime(): StudyDayRecord & { date: string } {
  const date = todayKey();
  const day = normalizeDay(loadStudyDays()[date]);
  return { date, ...day };
}

export function recordStudyActivity(activity: StudyActivity, count = 1): void {
  if (count <= 0 || typeof window === "undefined") return;
  const days = loadStudyDays();
  const date = todayKey();
  const day = normalizeDay(days[date]);
  days[date] = {
    ...day,
    [activity]: day[activity] + count,
  };
  saveStudyDays(days);
}

export function studyActivityPoints(activity: StudyActivity, count: number): number {
  return count * STUDY_ACTIVITY_POINTS[activity];
}

export function studyDayPoints(day: StudyDayRecord): number {
  return STUDY_ACTIVITY_ORDER.reduce(
    (sum, key) => sum + studyActivityPoints(key, day[key]),
    0,
  );
}

export function studyDayRemaining(day: StudyDayRecord): number {
  return Math.max(0, STUDY_DAILY_GOAL_POINTS - studyDayPoints(day));
}

export function studyDayMaxGoal(): number {
  return STUDY_DAILY_GOAL_POINTS;
}

export function studyProgressPercent(elapsed: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((elapsed / goal) * 100));
}

export function getStudyHistory(days = 7): Array<StudyDayRecord & { date: string }> {
  const store = loadStudyDays();
  const keys = Object.keys(store).sort().slice(-days);
  return keys.map((date) => ({
    date,
    ...normalizeDay(store[date]),
  }));
}

export type StudyHeatLevel = 0 | 1 | 2 | 3 | 4;

export function studyDayLevel(day: StudyDayRecord): StudyHeatLevel {
  const total = studyDayPoints(day);
  const max = STUDY_DAILY_GOAL_POINTS;
  if (total <= 0) return 0;
  if (total >= max) return 4;
  if (total >= max * 0.75) return 3;
  if (total >= max * 0.35) return 2;
  return 1;
}

export function studyDayGoalMet(day: StudyDayRecord): boolean {
  return studyDayPoints(day) >= STUDY_DAILY_GOAL_POINTS;
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
    const day = normalizeDay(store[key]);
    cells.push({
      date: key,
      ...day,
      level: studyDayLevel(day),
      goalMet: studyDayGoalMet(day),
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
    if (!day || !studyDayGoalMet(normalizeDay(day))) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function studyDaysThisMonth(days: StudyDaysMap = loadStudyDays()): number {
  const prefix = todayKey().slice(0, 7);
  return Object.entries(days).filter(([date, day]) => {
    if (!date.startsWith(prefix)) return false;
    return studyDayPoints(normalizeDay(day)) > 0;
  }).length;
}

export function formatStudyDaySummary(day: StudyDayRecord): string {
  const parts = STUDY_ACTIVITY_ORDER.filter((key) => day[key] > 0).map(
    (key) => `${STUDY_ACTIVITY_LABELS[key]} ${day[key]} (${studyActivityPoints(key, day[key])} pts)`,
  );
  const total = studyDayPoints(day);
  return parts.length ? `${parts.join(", ")} — ${total} pts` : "Nenhuma atividade";
}
