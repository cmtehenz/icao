export type StudyPlanMode = "standard" | "intense";

export const STUDY_PLAN_CHANGE_EVENT = "icao-study-plan-change";

const PLAN_MODE_KEY = "icao_study_plan_mode_v1";

export function loadStudyPlanMode(): StudyPlanMode {
  if (typeof window === "undefined") return "standard";
  try {
    const raw = localStorage.getItem(PLAN_MODE_KEY);
    return raw === "intense" ? "intense" : "standard";
  } catch {
    return "standard";
  }
}

export function saveStudyPlanMode(mode: StudyPlanMode): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PLAN_MODE_KEY, mode);
  window.dispatchEvent(new Event(STUDY_PLAN_CHANGE_EVENT));
}

export function studyPlanGoalPoints(mode: StudyPlanMode): number {
  return mode === "intense" ? STUDY_INTENSE_DAY_POINTS : STUDY_DAILY_GOAL_POINTS;
}

export type StudyActivity =
  | "shadow"
  | "shadowPart2"
  | "simulate"
  | "pronunciation"
  | "vocabulary";

/** Minutos estimados por repetição concluída. */
export const STUDY_ACTIVITY_MINUTES: Record<StudyActivity, number> = {
  shadow: 2,
  shadowPart2: 5,
  simulate: 10,
  pronunciation: 5,
  vocabulary: 4,
};

export const STUDY_ACTIVITY_POINTS: Record<StudyActivity, number> = {
  shadow: 1,
  shadowPart2: 2,
  simulate: 4,
  pronunciation: 2,
  vocabulary: 1,
};

/** Meta diária padrão em pontos. */
export const STUDY_DAILY_GOAL_POINTS = 20;

/** Dia bom — mais repetições. */
export const STUDY_INTENSE_DAY_POINTS = 45;

/** Referência de tempo (só dica na agenda, meta é em pontos). */
export const STUDY_DAILY_GOAL_MINUTES = 40;
export const STUDY_INTENSE_DAY_MINUTES = 90;

export const SIMULATE_PART2_UNITS = 3;

export const STUDY_ACTIVITY_LABELS: Record<StudyActivity, string> = {
  shadow: "Shadow PEEL (Part 1)",
  shadowPart2: "Shadow Part 2",
  simulate: "Simulado",
  pronunciation: "Pronúncia",
  vocabulary: "Vocabulário",
};

export const STUDY_ACTIVITY_ORDER: StudyActivity[] = [
  "shadow",
  "shadowPart2",
  "pronunciation",
  "vocabulary",
  "simulate",
];

export const STUDY_TIME_CHANGE_EVENT = "icao-study-time-change";

const STORAGE_KEY = "icao_daily_study_activities_v1";
const MAX_HISTORY_DAYS = 365;

export type StudyDayRecord = Record<StudyActivity, number>;
export type StudyDaysMap = Record<string, StudyDayRecord>;

type StudyActivityStore = { days: StudyDaysMap };

export function emptyStudyDay(): StudyDayRecord {
  return { shadow: 0, shadowPart2: 0, simulate: 0, pronunciation: 0, vocabulary: 0 };
}

export function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
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

export function studyActivityMinutes(activity: StudyActivity, count: number): number {
  return count * STUDY_ACTIVITY_MINUTES[activity];
}

export function studyDayMinutes(day: StudyDayRecord): number {
  return STUDY_ACTIVITY_ORDER.reduce(
    (sum, key) => sum + studyActivityMinutes(key, day[key]),
    0,
  );
}

export function studyDayPoints(day: StudyDayRecord): number {
  return STUDY_ACTIVITY_ORDER.reduce(
    (sum, key) => sum + studyActivityPoints(key, day[key]),
    0,
  );
}

export function studyDayGoalPoints(mode: StudyPlanMode = "standard"): number {
  return studyPlanGoalPoints(mode);
}

export function studyDayRemainingPoints(
  day: StudyDayRecord,
  mode: StudyPlanMode = "standard",
): number {
  return Math.max(0, studyDayGoalPoints(mode) - studyDayPoints(day));
}

export function studyDayMaxGoal(mode: StudyPlanMode = "standard"): number {
  return studyDayGoalPoints(mode);
}

export function studyDayRemaining(day: StudyDayRecord, mode: StudyPlanMode = "standard"): number {
  return studyDayRemainingPoints(day, mode);
}

/** @deprecated meta em pontos — use studyDayGoalPoints */
export function studyDayGoalMinutes(mode: StudyPlanMode = "standard"): number {
  return studyDayGoalPoints(mode);
}

/** @deprecated */
export function studyDayRemainingMinutes(
  day: StudyDayRecord,
  mode: StudyPlanMode = "standard",
): number {
  return studyDayRemainingPoints(day, mode);
}

export function formatStudyMinutes(total: number): string {
  const m = Math.max(0, Math.floor(total));
  const h = Math.floor(m / 60);
  const min = m % 60;
  if (h > 0 && min > 0) return `${h}h${min}m`;
  if (h > 0) return `${h}h`;
  return `${min} min`;
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

export function studyDayLevel(day: StudyDayRecord, mode: StudyPlanMode = "standard"): StudyHeatLevel {
  const total = studyDayPoints(day);
  const max = studyDayGoalPoints(mode);
  if (total <= 0) return 0;
  if (total >= max) return 4;
  if (total >= max * 0.75) return 3;
  if (total >= max * 0.35) return 2;
  return 1;
}

export function studyDayGoalMet(day: StudyDayRecord, mode: StudyPlanMode = "standard"): boolean {
  return studyDayPoints(day) >= studyDayGoalPoints(mode);
}

export type StudyCalendarCell = StudyDayRecord & {
  date: string;
  level: StudyHeatLevel;
  goalMet: boolean;
  points: number;
};

export function buildStudyCalendar(weeks = 26, mode: StudyPlanMode = "standard"): StudyCalendarCell[] {
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
      points: studyDayPoints(day),
      level: studyDayLevel(day, mode),
      goalMet: studyDayGoalMet(day, mode),
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return cells;
}

export function studyStreak(
  days: StudyDaysMap = loadStudyDays(),
  mode: StudyPlanMode = "standard",
): number {
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  let streak = 0;

  while (true) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
    const day = days[key];
    if (!day || !studyDayGoalMet(normalizeDay(day), mode)) break;
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

/** Meta de dias bons na semana corrente (domingo a sábado). */
export const STUDY_WEEKLY_GOAL_DAYS = 4;

export function studyWeekGoodDays(
  days: StudyDaysMap = loadStudyDays(),
  mode: StudyPlanMode = "standard",
): { good: number; target: number } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  let good = 0;
  for (let i = 0; i < 7; i++) {
    const cursor = new Date(weekStart);
    cursor.setDate(weekStart.getDate() + i);
    if (cursor > today) break;
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
    const day = normalizeDay(days[key]);
    if (studyDayGoalMet(day, mode)) good += 1;
  }

  return { good, target: STUDY_WEEKLY_GOAL_DAYS };
}

export function formatStudyDaySummary(day: StudyDayRecord): string {
  const parts = STUDY_ACTIVITY_ORDER.filter((key) => day[key] > 0).map(
    (key) =>
      `${STUDY_ACTIVITY_LABELS[key]} ${day[key]} (${studyActivityPoints(key, day[key])} pts)`,
  );
  const total = studyDayPoints(day);
  return parts.length ? `${parts.join(", ")} — ${total} pts` : "Nenhuma atividade";
}
