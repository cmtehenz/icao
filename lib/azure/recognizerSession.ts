import { logAzureRuntime } from "@/lib/azure/runtimeLog";

export type AzureRecognizerLike = {
  stopContinuousRecognitionAsync?: (
    onSuccess?: () => void,
    onError?: (err: string) => void,
  ) => void;
  close: () => void;
};

type RecognizerHandle = {
  sessionId: string;
  generation: number;
  disposed: boolean;
};

const recognizerHandles = new WeakMap<AzureRecognizerLike, RecognizerHandle>();

let activeSessionId: string | null = null;
let sessionGeneration = 0;
let startInFlight: Promise<void> | null = null;

export const RECORDING_FORCE_RELEASE_EVENT = "icao-recording-force-release";

export function createRecordingSessionId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function isRecordingSessionActive(sessionId: string): boolean {
  return activeSessionId === sessionId;
}

export function isRecordingGenerationStale(generation: number): boolean {
  return generation !== sessionGeneration;
}

/**
 * Claim the global recording slot. Serialization is handled by runRecordingStart;
 * do not await startInFlight here — that deadlocks when called from inside runRecordingStart.
 */
export async function acquireRecordingSession(
  sessionId: string,
): Promise<{ acquired: boolean; generation: number }> {
  if (activeSessionId === sessionId) {
    logAzureRuntime("session", `duplicate start ignored (${sessionId})`);
    return { acquired: false, generation: sessionGeneration };
  }

  sessionGeneration += 1;
  activeSessionId = sessionId;
  logAzureRuntime("session", `recording started (${sessionId})`);
  return { acquired: true, generation: sessionGeneration };
}

export function releaseRecordingSession(sessionId: string): void {
  if (activeSessionId !== sessionId) return;
  activeSessionId = null;
  logAzureRuntime("session", `recording stopped (${sessionId})`);
}

/** Clear a stuck global recording slot so a new session can start. */
export function forceReleaseRecordingSession(sessionId?: string): void {
  if (sessionId && activeSessionId !== sessionId) return;
  if (!activeSessionId) return;
  logAzureRuntime("session", `force release (${activeSessionId})`);
  activeSessionId = null;
  sessionGeneration += 1;
  resetRecordingStartChain();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(RECORDING_FORCE_RELEASE_EVENT));
  }
}

export function isRecordingMutexHeld(): boolean {
  return activeSessionId !== null;
}

export function resetRecordingStartChain(): void {
  startInFlight = null;
}

export async function waitForRecordingIdle(timeoutMs = 2000): Promise<boolean> {
  if (!startInFlight) return true;
  try {
    await Promise.race([
      startInFlight,
      new Promise<void>((_, reject) => {
        setTimeout(() => reject(new Error("timeout")), timeoutMs);
      }),
    ]);
    return true;
  } catch {
    return false;
  }
}

export function runRecordingStart<T>(fn: () => Promise<T>): Promise<T> {
  const chain = (startInFlight ?? Promise.resolve()).then(() => fn());
  startInFlight = chain.then(
    () => undefined,
    () => undefined,
  );
  return chain;
}

export function trackRecognizer(
  recognizer: AzureRecognizerLike,
  sessionId: string,
  generation: number,
): void {
  recognizerHandles.set(recognizer, { sessionId, generation, disposed: false });
  logAzureRuntime("recognizer", `recognizer created (${sessionId})`);
}

export function stopContinuousRecognition(
  recognizer: AzureRecognizerLike,
  onStopped?: () => void,
): void {
  try {
    if (recognizer.stopContinuousRecognitionAsync) {
      recognizer.stopContinuousRecognitionAsync(
        () => onStopped?.(),
        () => onStopped?.(),
      );
    } else {
      onStopped?.();
    }
  } catch {
    onStopped?.();
  }
}

/** Close only — call after assessment drain so late `recognized` callbacks can still fire. */
export function closeRecognizerOnly(
  recognizer: AzureRecognizerLike | null | undefined,
  onDone: () => void,
): void {
  if (!recognizer) {
    onDone();
    return;
  }

  let handle = recognizerHandles.get(recognizer);
  if (!handle) {
    handle = { sessionId: "", generation: 0, disposed: false };
    recognizerHandles.set(recognizer, handle);
  }
  if (handle.disposed) {
    onDone();
    return;
  }

  handle.disposed = true;
  recognizerHandles.set(recognizer, handle);

  try {
    recognizer.close();
    logAzureRuntime("recognizer", "recognizer disposed");
  } catch {
    /* already closed */
  }
  onDone();
}

export function safeStopAndCloseRecognizer(
  recognizer: AzureRecognizerLike | null | undefined,
  onDone: () => void,
): void {
  if (!recognizer) {
    onDone();
    return;
  }

  let handle = recognizerHandles.get(recognizer);
  if (!handle) {
    handle = { sessionId: "", generation: 0, disposed: false };
  }
  if (handle.disposed) {
    onDone();
    return;
  }

  handle.disposed = true;
  recognizerHandles.set(recognizer, handle);

  let finished = false;
  const once = () => {
    if (finished) return;
    finished = true;
    try {
      recognizer.close();
      logAzureRuntime("recognizer", "recognizer disposed");
    } catch {
      /* already closed */
    }
    onDone();
  };

  try {
    if (recognizer.stopContinuousRecognitionAsync) {
      recognizer.stopContinuousRecognitionAsync(once, once);
    } else {
      once();
    }
  } catch {
    once();
  }
}
