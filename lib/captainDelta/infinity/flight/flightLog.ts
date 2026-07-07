import type { CaptainDeltaMemoryStore } from "@/lib/captainDelta/memory/types";
import { loadCaptainDeltaMemory, saveCaptainDeltaMemory } from "@/lib/captainDelta/memory/store";
import { todayKey } from "@/lib/studyTime";
import type { FlightLogEntry } from "@/lib/captainDelta/infinity/flight/types";

function nextFlightNumber(store: CaptainDeltaMemoryStore): number {
  const logs = store.flightLog ?? [];
  if (!logs.length) return 1;
  return Math.max(...logs.map((l) => l.flightNumber)) + 1;
}

export function recordFlightLogEntry(
  entry: Omit<FlightLogEntry, "flightNumber" | "date">,
  store?: CaptainDeltaMemoryStore,
): CaptainDeltaMemoryStore {
  const base = store ?? loadCaptainDeltaMemory();
  const log: FlightLogEntry = {
    ...entry,
    flightNumber: nextFlightNumber(base),
    date: todayKey(),
  };
  const next: CaptainDeltaMemoryStore = {
    ...base,
    flightLog: [...(base.flightLog ?? []), log].slice(-50),
  };
  if (!store) saveCaptainDeltaMemory(next);
  return next;
}

export function formatFlightLogEntry(entry: FlightLogEntry): string {
  return [
    `Flight ${entry.flightNumber}`,
    `Mission: ${entry.missionWord}`,
    entry.completed ? "Completed." : "Incomplete.",
    `Difficulty: ${entry.difficulty.charAt(0).toUpperCase()}${entry.difficulty.slice(1)}.`,
    `Improvement: ${entry.improvement}.`,
    `Next: ${entry.nextFocus}.`,
  ].join(" ");
}

export function lastFlightLogEntry(store?: CaptainDeltaMemoryStore): FlightLogEntry | null {
  const logs = (store ?? loadCaptainDeltaMemory()).flightLog ?? [];
  return logs[logs.length - 1] ?? null;
}

export function missionHistoryLine(store?: CaptainDeltaMemoryStore): string | null {
  const last = lastFlightLogEntry(store);
  if (!last) return null;
  if (last.completed) {
    return `Yesterday's ${last.missionWord} sortie went well — ${last.improvement.toLowerCase()} is moving forward.`;
  }
  return `Last sortie on "${last.missionWord}" still needs work — we'll build on that today.`;
}
