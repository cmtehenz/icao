import type { CaptainDeltaLessonContext } from "@/lib/captainDelta/types";
import { DEFAULT_LESSON_CONTEXT } from "@/lib/captainDelta/types";

export const CAPTAIN_DELTA_LESSON_CONTEXT = "icao-captain-delta-lesson-context";
export const CAPTAIN_DELTA_START_RECORD = "icao-captain-delta-start-record";
export const CAPTAIN_DELTA_STOP_RECORD = "icao-captain-delta-stop-record";
export const CAPTAIN_DELTA_SECONDARY_ACTION = "icao-captain-delta-secondary-action";

export type CaptainDeltaRecordBridge = {
  canRecord: () => boolean;
  startRecord: () => void;
  stopRecord: () => void;
  isRecording: () => boolean;
};

let recordBridge: CaptainDeltaRecordBridge | null = null;

export function registerCaptainDeltaRecordBridge(bridge: CaptainDeltaRecordBridge | null): void {
  recordBridge = bridge;
}

export function getCaptainDeltaRecordBridge(): CaptainDeltaRecordBridge | null {
  return recordBridge;
}

export function emitLessonContext(context: Partial<CaptainDeltaLessonContext>): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(CAPTAIN_DELTA_LESSON_CONTEXT, {
      detail: context,
    }),
  );
}

export function emitStartRecord(): boolean {
  if (recordBridge?.canRecord()) {
    recordBridge.startRecord();
    return true;
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CAPTAIN_DELTA_START_RECORD));
  }
  return false;
}

export function emitStopRecord(): boolean {
  if (recordBridge?.isRecording()) {
    recordBridge.stopRecord();
    return true;
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CAPTAIN_DELTA_STOP_RECORD));
  }
  return false;
}

export function emitSecondaryAction(actionId: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(CAPTAIN_DELTA_SECONDARY_ACTION, { detail: { actionId } }),
  );
}

export function mergeLessonContext(
  current: CaptainDeltaLessonContext,
  patch: Partial<CaptainDeltaLessonContext>,
): CaptainDeltaLessonContext {
  return { ...DEFAULT_LESSON_CONTEXT, ...current, ...patch };
}
