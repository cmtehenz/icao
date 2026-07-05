import { syncDailyMissionLog } from "@/lib/dailyMissionLog";
import { isFlightDebriefAvailable } from "@/lib/flightDebrief/buildFlightDebrief";
import type { FlightDebriefProgress, FlightDebriefState } from "@/lib/flightDebrief/flightDebriefTypes";
import {
  emitFlightDebriefAvailable,
  emitFlightDebriefComplete,
} from "@/lib/flightDebrief/events";
import { todayKey } from "@/lib/studyTime";

const STORAGE_KEY = "icao_flight_debrief_v1";
export const FLIGHT_DEBRIEF_EVENT = "icao-flight-debrief-change";

function notify(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(FLIGHT_DEBRIEF_EVENT));
}

function isValidState(parsed: unknown, date: string): parsed is FlightDebriefState {
  if (!parsed || typeof parsed !== "object") return false;
  const s = parsed as FlightDebriefState;
  return s.date === date && typeof s.complete === "boolean" && typeof s.viewed === "boolean";
}

export function loadFlightDebriefState(): FlightDebriefState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isValidState(parsed, todayKey())) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveFlightDebriefState(state: FlightDebriefState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  syncDailyMissionLog();
  notify();
}

export function getOrCreateFlightDebriefState(dateKey = todayKey()): FlightDebriefState {
  const existing = loadFlightDebriefState();
  if (existing) return existing;
  return { date: dateKey, viewed: false, complete: false };
}

export function isFlightDebriefComplete(): boolean {
  const state = loadFlightDebriefState();
  return !!state?.complete;
}

export function flightDebriefProgress(
  state = getOrCreateFlightDebriefState(),
): FlightDebriefProgress {
  return {
    done: state.complete ? 1 : 0,
    total: 1,
    complete: state.complete,
  };
}

export function markFlightDebriefViewed(): FlightDebriefState {
  const state = getOrCreateFlightDebriefState();
  const next = { ...state, viewed: true };
  saveFlightDebriefState(next);
  if (isFlightDebriefAvailable()) emitFlightDebriefAvailable();
  return next;
}

export function markFlightDebriefComplete(): FlightDebriefState {
  const state = getOrCreateFlightDebriefState();
  const next: FlightDebriefState = {
    ...state,
    viewed: true,
    complete: true,
    completedAt: new Date().toISOString(),
  };
  saveFlightDebriefState(next);
  emitFlightDebriefComplete();
  return next;
}

export function flightDebriefLink(): string {
  return "/flight-debrief";
}
