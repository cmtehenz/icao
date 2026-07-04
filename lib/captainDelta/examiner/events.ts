import type { CaptainDeltaRole } from "@/lib/captainDelta/examiner/types";

export const CAPTAIN_DELTA_ROLE = "icao-captain-delta-role";
export const CAPTAIN_DELTA_EXAM_STEP = "icao-captain-delta-exam-step";
export const CAPTAIN_DELTA_EXAM_FINISHED = "icao-captain-delta-exam-finished";

export function emitCaptainDeltaRole(role: CaptainDeltaRole): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CAPTAIN_DELTA_ROLE, { detail: { role } }));
}

export function emitCaptainDeltaExamFinished(reportId: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(CAPTAIN_DELTA_EXAM_FINISHED, { detail: { reportId } }),
  );
}
