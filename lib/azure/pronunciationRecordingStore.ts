import type { AssessmentFailure } from "@/lib/azure/assessmentFailure";
import type { RecognizerLifecycle } from "@/lib/azure/recognizerLifecycle";
import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import {
  createRecordingSessionId,
  RECORDING_FORCE_RELEASE_EVENT,
  releaseRecordingSession,
  safeStopAndCloseRecognizer,
} from "@/lib/azure/recognizerSession";

/** Grace window for React Strict Mode remount (mount → cleanup → mount). */
export const PRONUNCIATION_STRICT_REMOUNT_GRACE_MS = 200;

export type AssessmentSessionMeta = {
  referenceText: string;
  scripted: boolean;
  configAttached: boolean;
  configuredRecognizer: object | null;
  sawNoMatch: boolean;
  sawCancellation: boolean;
  segmentCount: number;
};

export type AzureStopResult = {
  assessment: AzurePronunciationResult | null;
  audioBlob: Blob | null;
  failure: AssessmentFailure | null;
};

export function emptyAssessmentMeta(): AssessmentSessionMeta {
  return {
    referenceText: "",
    scripted: false,
    configAttached: false,
    configuredRecognizer: null,
    sawNoMatch: false,
    sawCancellation: false,
    segmentCount: 0,
  };
}

/** Survives React Strict Mode remount — recognizer must not live only in hook refs. */
export type PronunciationRecordingStore = {
  sessionId: string;
  recognizer: { close: () => void } | null;
  lifecycle: RecognizerLifecycle;
  generation: number;
  segments: AzurePronunciationResult[];
  assessmentMeta: AssessmentSessionMeta;
  listeningReady: boolean;
  startListeningPromise: Promise<void> | null;
  stopping: boolean;
  stopPromise: Promise<AzureStopResult> | null;
  stream: MediaStream | null;
  recorder: MediaRecorder | null;
  chunks: Blob[];
  hookMountCount: number;
};

function createStore(): PronunciationRecordingStore {
  return {
    sessionId: createRecordingSessionId("pronunciation"),
    recognizer: null,
    lifecycle: "idle",
    generation: 0,
    segments: [],
    assessmentMeta: emptyAssessmentMeta(),
    listeningReady: false,
    startListeningPromise: null,
    stopping: false,
    stopPromise: null,
    stream: null,
    recorder: null,
    chunks: [],
    hookMountCount: 0,
  };
}

let store: PronunciationRecordingStore = createStore();

let deferredTeardownTimer: ReturnType<typeof setTimeout> | null = null;

const forceReleaseSubscribers = new Set<() => void>();

export function getPronunciationRecordingStore(): PronunciationRecordingStore {
  return store;
}

/** Test-only reset. */
export function __resetPronunciationRecordingStoreForTests(): void {
  cancelDeferredPronunciationTeardown();
  const rec = store.recognizer;
  if (rec) safeStopAndCloseRecognizer(rec, () => {});
  store.stream?.getTracks().forEach((t) => t.stop());
  forceReleaseSubscribers.clear();
  store = createStore();
}

export function cancelDeferredPronunciationTeardown(): void {
  if (deferredTeardownTimer) {
    clearTimeout(deferredTeardownTimer);
    deferredTeardownTimer = null;
  }
}

export function registerPronunciationHookMount(): () => void {
  cancelDeferredPronunciationTeardown();
  store.hookMountCount += 1;
  return () => {
    store.hookMountCount = Math.max(0, store.hookMountCount - 1);
  };
}

export function scheduleDeferredPronunciationTeardown(
  teardown: () => void,
  graceMs = PRONUNCIATION_STRICT_REMOUNT_GRACE_MS,
): void {
  cancelDeferredPronunciationTeardown();
  deferredTeardownTimer = setTimeout(() => {
    deferredTeardownTimer = null;
    if (store.hookMountCount > 0) return;
    teardown();
  }, graceMs);
}

export function subscribePronunciationForceRelease(listener: () => void): () => void {
  forceReleaseSubscribers.add(listener);
  return () => {
    forceReleaseSubscribers.delete(listener);
  };
}

export function notifyPronunciationForceReleaseSubscribers(): void {
  for (const listener of forceReleaseSubscribers) {
    listener();
  }
}

export function teardownPronunciationRecordingStore(): void {
  const rec = store.recognizer;
  store.recognizer = null;
  store.lifecycle = "idle";
  store.listeningReady = false;
  store.startListeningPromise = null;
  store.stopping = false;
  store.stopPromise = null;
  store.segments = [];
  store.assessmentMeta = emptyAssessmentMeta();

  if (rec) {
    safeStopAndCloseRecognizer(rec, () => {
      releaseRecordingSession(store.sessionId);
    });
  } else {
    releaseRecordingSession(store.sessionId);
  }

  store.stream?.getTracks().forEach((t) => t.stop());
  store.stream = null;
  if (store.recorder && store.recorder.state !== "inactive") {
    try {
      store.recorder.stop();
    } catch {
      /* ignore */
    }
  }
  store.recorder = null;
  store.chunks = [];
}

export function applyForceReleaseToStore(): void {
  const rec = store.recognizer;
  store.recognizer = null;
  store.stopPromise = null;
  store.stopping = false;
  store.lifecycle = "idle";
  store.listeningReady = false;
  store.startListeningPromise = null;
  if (rec) safeStopAndCloseRecognizer(rec, () => {});
  releaseRecordingSession(store.sessionId);
  notifyPronunciationForceReleaseSubscribers();
}

let forceReleaseBound = false;

export function ensurePronunciationForceReleaseListener(): void {
  if (forceReleaseBound || typeof window === "undefined") return;
  forceReleaseBound = true;
  window.addEventListener(RECORDING_FORCE_RELEASE_EVENT, () => {
    applyForceReleaseToStore();
  });
}
