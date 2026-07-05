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

export function createRecordingSessionId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function isRecordingSessionActive(sessionId: string): boolean {
  return activeSessionId === sessionId;
}

export function isRecordingGenerationStale(generation: number): boolean {
  return generation !== sessionGeneration;
}

/** Wait for any in-flight start, then claim the global recording slot. */
export async function acquireRecordingSession(
  sessionId: string,
): Promise<{ acquired: boolean; generation: number }> {
  if (startInFlight) await startInFlight;

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
