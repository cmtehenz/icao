import type { AcademyStore } from "@/lib/academy/types";

export const ACADEMY_STORAGE_KEY = "icao_academy_v5";
export const ACADEMY_CHANGE_EVENT = "icao-academy-change";

function emptyStore(): AcademyStore {
  return {
    version: 1,
    flights: [],
    achievements: {},
    postExamNote: null,
    postExamLevel: null,
    academyStartDate: new Date().toISOString().slice(0, 10),
    bestStreak: 0,
  };
}

export function notifyAcademyChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ACADEMY_CHANGE_EVENT));
}

export function loadAcademyStore(): AcademyStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = localStorage.getItem(ACADEMY_STORAGE_KEY);
    if (!raw) return emptyStore();
    return { ...emptyStore(), ...(JSON.parse(raw) as AcademyStore) };
  } catch {
    return emptyStore();
  }
}

export function saveAcademyStore(store: AcademyStore): void {
  if (typeof window === "undefined") return;
  const trimmed = {
    ...store,
    flights: store.flights.slice(-200),
  };
  localStorage.setItem(ACADEMY_STORAGE_KEY, JSON.stringify(trimmed));
  notifyAcademyChange();
}

export function nextFlightNumber(): number {
  const store = loadAcademyStore();
  const max = store.flights.reduce((m, f) => Math.max(m, f.flightNumber), 0);
  return max + 1;
}
