export type StudySection = "part1" | "part2";

export const STUDY_GOAL_SECONDS = 60 * 60;
export const STUDY_TIME_CHANGE_EVENT = "icao-study-time-change";

const STORAGE_KEY = "icao_daily_study_time_v1";
const MAX_HISTORY_DAYS = 60;

type DayRecord = { part1: number; part2: number };
type StudyTimeStore = { days: Record<string, DayRecord> };

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function emptyStore(): StudyTimeStore {
  return { days: {} };
}

function loadStore(): StudyTimeStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as StudyTimeStore;
    if (!parsed?.days || typeof parsed.days !== "object") return emptyStore();
    return parsed;
  } catch {
    return emptyStore();
  }
}

function saveStore(store: StudyTimeStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(new Event(STUDY_TIME_CHANGE_EVENT));
}

function trimHistory(store: StudyTimeStore): void {
  const keys = Object.keys(store.days).sort();
  if (keys.length <= MAX_HISTORY_DAYS) return;
  for (const old of keys.slice(0, keys.length - MAX_HISTORY_DAYS)) {
    delete store.days[old];
  }
}

export function getTodayStudyTime(): DayRecord & { date: string } {
  const store = loadStore();
  const date = todayKey();
  const day = store.days[date] ?? { part1: 0, part2: 0 };
  return {
    date,
    part1: Math.max(0, Math.floor(day.part1)),
    part2: Math.max(0, Math.floor(day.part2)),
  };
}

export function addStudySeconds(section: StudySection, seconds: number): void {
  if (seconds <= 0 || typeof window === "undefined") return;
  const store = loadStore();
  const date = todayKey();
  const day = store.days[date] ?? { part1: 0, part2: 0 };
  store.days[date] = {
    ...day,
    [section]: day[section] + seconds,
  };
  trimHistory(store);
  saveStore(store);
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

export function getStudyHistory(days = 7): Array<DayRecord & { date: string }> {
  const store = loadStore();
  const keys = Object.keys(store.days).sort().slice(-days);
  return keys.map((date) => ({
    date,
    part1: store.days[date]?.part1 ?? 0,
    part2: store.days[date]?.part2 ?? 0,
  }));
}
