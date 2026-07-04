import type { EvaluateType } from "@/lib/evaluate/types";
import type { FlightInstructorReport } from "@/lib/flightInstructor/types";
import type { ConfidenceLevel } from "@/lib/captainDelta/memory/types";

export const CAPTAIN_DELTA_SESSION_RECORD = "icao-captain-delta-session-record";

export type CaptainDeltaSessionRecordPayload = {
  type: EvaluateType;
  cardNum?: string;
  situationId?: string;
  question: string;
  label: string;
  transcript: string;
  overallScore: number;
  icaoLevel: number;
  durationSeconds?: number;
  report: FlightInstructorReport;
  confidence?: ConfidenceLevel;
};

export function emitCaptainDeltaSessionRecord(
  payload: CaptainDeltaSessionRecordPayload,
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(CAPTAIN_DELTA_SESSION_RECORD, { detail: payload }),
  );
}
