import { isDailyMissionComplete } from "@/lib/dailyMission";
import { todayKey } from "@/lib/studyTime";

const STORAGE_KEY = "icao_daily_mission_log_v1";
export const DAILY_MISSION_LOG_EVENT = "icao-daily-mission-log-change";

function notify(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(DAILY_MISSION_LOG_EVENT));
}

export function loadDailyMissionLog(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, boolean>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveDailyMissionLog(log: Record<string, boolean>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  notify();
}

/** Merge completion log from server sync (does not recompute today's mission). */
export function saveDailyMissionLogFromSync(log: Record<string, boolean>): void {
  if (typeof window === "undefined") return;
  const current = loadDailyMissionLog();
  const merged: Record<string, boolean> = { ...current };
  for (const [date, done] of Object.entries(log)) {
    if (done) merged[date] = true;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  notify();
}

export function markDailyMissionComplete(date = todayKey()): void {
  const log = loadDailyMissionLog();
  if (log[date]) return;
  saveDailyMissionLog({ ...log, [date]: true });
}

export function wasDailyMissionComplete(date: string): boolean {
  if (date === todayKey()) return isDailyMissionComplete();
  return !!loadDailyMissionLog()[date];
}

/** Persist today in the log when all mission sections are done. */
export function syncDailyMissionLog(): void {
  if (isDailyMissionComplete()) {
    markDailyMissionComplete(todayKey());
  }
}
