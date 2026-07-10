import type { EvaluateFeedback } from "@/lib/evaluate/types";
import type { FlightInstructorReport } from "@/lib/flightInstructor/types";

const STORAGE_KEY = "icao_part1_coach_debrief_v1";

export type Part1CoachDebriefCache = {
  cardNum: string;
  feedback: EvaluateFeedback;
  report: FlightInstructorReport;
  savedAt: string;
};

export function savePart1CoachDebriefCache(entry: Part1CoachDebriefCache): void {
  if (typeof window === "undefined") return;
  const store = loadPart1CoachDebriefStore();
  store[entry.cardNum.padStart(2, "0")] = entry;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function loadPart1CoachDebriefCache(cardNum: string): Part1CoachDebriefCache | null {
  const key = cardNum.padStart(2, "0");
  return loadPart1CoachDebriefStore()[key] ?? null;
}

function loadPart1CoachDebriefStore(): Record<string, Part1CoachDebriefCache> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, Part1CoachDebriefCache>;
  } catch {
    return {};
  }
}
