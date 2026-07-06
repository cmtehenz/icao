/** Wait for late Azure `recognized` callbacks after Stop — do not close before drain. */

export const ASSESSMENT_DRAIN_MS = 5000;
export const RECOGNIZED_GRACE_MS = 400;
export const SESSION_STOPPED_GRACE_MS = 1200;

export type AssessmentDrainReason =
  | "recognized"
  | "session_stopped"
  | "timeout"
  | "stop_error";

export type AssessmentDrainResult = {
  reason: AssessmentDrainReason;
  waitedMs: number;
};

export type AssessmentDrainSignal = {
  onLateRecognized: () => void;
  onSessionStopped: () => void;
};

export function createAssessmentDrainWait(
  timeoutMs = ASSESSMENT_DRAIN_MS,
  recognizedGraceMs = RECOGNIZED_GRACE_MS,
  sessionStoppedGraceMs = SESSION_STOPPED_GRACE_MS,
): {
  signal: AssessmentDrainSignal;
  wait: () => Promise<AssessmentDrainResult>;
} {
  let recognizeGraceTimer: ReturnType<typeof setTimeout> | null = null;
  let sessionGraceTimer: ReturnType<typeof setTimeout> | null = null;
  let hardTimer: ReturnType<typeof setTimeout> | null = null;
  let resolveWait: ((result: AssessmentDrainResult) => void) | null = null;
  const startedAt = Date.now();
  let settled = false;

  const settle = (reason: AssessmentDrainReason) => {
    if (settled) return;
    settled = true;
    if (recognizeGraceTimer) clearTimeout(recognizeGraceTimer);
    if (sessionGraceTimer) clearTimeout(sessionGraceTimer);
    if (hardTimer) clearTimeout(hardTimer);
    resolveWait?.({
      reason,
      waitedMs: Date.now() - startedAt,
    });
  };

  const signal: AssessmentDrainSignal = {
    onLateRecognized: () => {
      if (sessionGraceTimer) {
        clearTimeout(sessionGraceTimer);
        sessionGraceTimer = null;
      }
      if (recognizeGraceTimer) clearTimeout(recognizeGraceTimer);
      recognizeGraceTimer = setTimeout(() => settle("recognized"), recognizedGraceMs);
    },
    onSessionStopped: () => {
      if (sessionGraceTimer) clearTimeout(sessionGraceTimer);
      sessionGraceTimer = setTimeout(
        () => settle("session_stopped"),
        sessionStoppedGraceMs,
      );
    },
  };

  const wait = () =>
    new Promise<AssessmentDrainResult>((resolve) => {
      resolveWait = resolve;
      hardTimer = setTimeout(() => settle("timeout"), timeoutMs);
    });

  return { signal, wait };
}
