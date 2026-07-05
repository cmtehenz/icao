import { loadAcademyStore, nextFlightNumber, saveAcademyStore } from "@/lib/academy/store";
import type { LogbookFlight } from "@/lib/academy/types";
import { buildImprovementLines } from "@/lib/captainDelta/memory/improvements";

export function recordLogbookFlight(input: {
  durationMinutes: number;
  mission: string;
  score?: number;
  activities?: string[];
}): LogbookFlight {
  const store = loadAcademyStore();
  const improvements = buildImprovementLines();
  const result: LogbookFlight["result"] =
    (input.score ?? 75) >= 80 ? "excellent" : (input.score ?? 60) >= 65 ? "good" : "developing";

  const captainNotes =
    improvements[0] ??
    (result === "excellent"
      ? "Today you sounded much more confident."
      : "Solid flight — keep building natural pilot language.");

  const flight: LogbookFlight = {
    flightNumber: nextFlightNumber(),
    date: new Date().toISOString(),
    durationMinutes: input.durationMinutes,
    mission: input.mission,
    result,
    captainNotes,
    activities: input.activities ?? [],
  };

  saveAcademyStore({
    ...store,
    flights: [...store.flights, flight],
  });

  return flight;
}

export function loadLogbookFlights(limit = 20): LogbookFlight[] {
  return loadAcademyStore()
    .flights.slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

export function getLogbookFlight(flightNumber: number): LogbookFlight | null {
  return loadAcademyStore().flights.find((f) => f.flightNumber === flightNumber) ?? null;
}
