import { getTodayExamVersion } from "@/lib/dailyExamRotation";
import type { ExamVersion } from "@/lib/exams/types";
import type { EvaluateFeedback } from "@/lib/evaluate/types";
import type { SimulationStepResult } from "@/lib/part2/aggregateSimulation";
import { todayKey } from "@/lib/studyTime";

const SESSION_KEY = "icao_part2_mission_session_v1";
export const PART2_MISSION_SESSION_EVENT = "icao-part2-mission-session-change";

export type Part2MissionSessionSnapshot = {
  schemaVersion: 1;
  savedAt: string;
  date: string;
  examVersion: ExamVersion;
  activeVersion: ExamVersion;
  situationIdx: number;
  /** -2 sound check, -1 intro, 0–8 situation steps */
  step: number;
  recordings: Record<string, EvaluateFeedback>;
  stepResults: SimulationStepResult[];
  showNotesReview: boolean;
  showResults: boolean;
};

function notify(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PART2_MISSION_SESSION_EVENT));
}

function isExamVersion(value: unknown): value is ExamVersion {
  return value === "23C" || value === "24C" || value === "25C" || value === "26C";
}

function isValidSnapshot(parsed: unknown, date: string): parsed is Part2MissionSessionSnapshot {
  if (!parsed || typeof parsed !== "object") return false;
  const s = parsed as Part2MissionSessionSnapshot;
  return (
    s.schemaVersion === 1 &&
    s.date === date &&
    isExamVersion(s.examVersion) &&
    s.examVersion === getTodayExamVersion(date) &&
    isExamVersion(s.activeVersion) &&
    typeof s.situationIdx === "number" &&
    typeof s.step === "number" &&
    s.recordings != null &&
    typeof s.recordings === "object" &&
    Array.isArray(s.stepResults)
  );
}

function normalizeSnapshot(
  snapshot: Part2MissionSessionSnapshot,
): Part2MissionSessionSnapshot | null {
  if (snapshot.step < -2 || snapshot.step > 8) return null;
  if (snapshot.situationIdx < 0 || snapshot.situationIdx > 4) return null;
  return {
    ...snapshot,
    situationIdx: Math.min(4, Math.max(0, snapshot.situationIdx)),
    step: Math.max(-2, Math.min(8, snapshot.step)),
    showNotesReview: !!snapshot.showNotesReview,
    showResults: !!snapshot.showResults,
  };
}

export function loadPart2MissionSession(): Part2MissionSessionSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    const date = todayKey();
    if (!isValidSnapshot(parsed, date)) return null;
    return normalizeSnapshot(parsed);
  } catch {
    return null;
  }
}

export function savePart2MissionSession(
  snapshot: Omit<Part2MissionSessionSnapshot, "schemaVersion" | "savedAt" | "date"> & {
    date?: string;
  },
): void {
  if (typeof window === "undefined") return;
  try {
    const payload: Part2MissionSessionSnapshot = {
      schemaVersion: 1,
      savedAt: new Date().toISOString(),
      date: snapshot.date ?? todayKey(),
      examVersion: snapshot.examVersion,
      activeVersion: snapshot.activeVersion,
      situationIdx: snapshot.situationIdx,
      step: snapshot.step,
      recordings: snapshot.recordings,
      stepResults: snapshot.stepResults,
      showNotesReview: snapshot.showNotesReview,
      showResults: snapshot.showResults,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
    notify();
  } catch {
    /* quota or private mode */
  }
}

export function clearPart2MissionSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  notify();
}

export function hasPart2MissionSession(): boolean {
  return loadPart2MissionSession() != null;
}

export function formatPart2MissionSessionSummary(
  snapshot: Part2MissionSessionSnapshot,
): string {
  const saved = new Date(snapshot.savedAt);
  const time = saved.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const sit = snapshot.situationIdx + 1;
  const stepLabel = snapshot.step >= 0 ? ` · passo ${snapshot.step + 1}/9` : "";
  return `Prova ${snapshot.examVersion} · situação ${sit}/5${stepLabel} · salvo ${time}`;
}
