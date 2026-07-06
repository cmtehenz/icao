export const RECORD_TRACE_EVENT = "icao-pron-record-trace";

export type RecordTraceStep =
  | "onClick"
  | "handlePrimaryRecord"
  | "assessing_stop"
  | "gate_blocked"
  | "gate_pass"
  | "recordNotice"
  | "startRecording"
  | "azureStart"
  | "awaitStop"
  | "acquireSession"
  | "acquireFailed"
  | "getUserMedia"
  | "recognizerStart"
  | "assessingTrue"
  | "error";

export type RecordTracePayload = {
  step: RecordTraceStep;
  reason: string;
  at: number;
};

export function traceRecordStep(step: RecordTraceStep, reason = ""): void {
  console.info(`[RecordTrace] ${step}`, reason || "");
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<RecordTracePayload>(RECORD_TRACE_EVENT, {
      detail: { step, reason, at: Date.now() },
    }),
  );
}

/** Debounce rapid duplicate record clicks (native + React, touch ghost clicks). */
export function createRecordClickGuard(cooldownMs = 500) {
  let lastAt = 0;
  let inFlight = false;

  return {
    tryAcquire(): boolean {
      const now = Date.now();
      if (inFlight || now - lastAt < cooldownMs) return false;
      inFlight = true;
      lastAt = now;
      return true;
    },
    release(): void {
      inFlight = false;
    },
  };
}
