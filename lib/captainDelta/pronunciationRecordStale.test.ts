import { describe, expect, it, vi } from "vitest";
import {
  acquireRecordingSession,
  forceReleaseRecordingSession,
  isRecordingGenerationStale,
  isRecordingMutexHeld,
  releaseRecordingSession,
  safeStopAndCloseRecognizer,
  type AzureRecognizerLike,
} from "@/lib/azure/recognizerSession";

/** Mirrors stale-generation cleanup in useAzurePronunciation.abandonRecordingSession. */
function abandonStalePronunciationSession(
  sessionId: string,
  generation: number,
  recognizer: AzureRecognizerLike,
  onAssessingFalse: () => void,
): void {
  releaseRecordingSession(sessionId);
  onAssessingFalse();
  safeStopAndCloseRecognizer(recognizer, () => {});
}

describe("pronunciation stale generation cleanup", () => {
  it("stale generation releases mutex and clears assessing", async () => {
    const sessionId = "pronunciation-stale";
    const { generation } = await acquireRecordingSession(sessionId);
    expect(isRecordingMutexHeld()).toBe(true);

    const close = vi.fn();
    const stop = vi.fn((ok?: () => void) => ok?.());
    const recognizer: AzureRecognizerLike = {
      stopContinuousRecognitionAsync: stop,
      close,
    };

    forceReleaseRecordingSession();
    expect(isRecordingGenerationStale(generation)).toBe(true);

    const assessing = { value: true };
    abandonStalePronunciationSession(sessionId, generation, recognizer, () => {
      assessing.value = false;
    });

    expect(isRecordingMutexHeld()).toBe(false);
    expect(assessing.value).toBe(false);
    expect(stop).toHaveBeenCalledTimes(1);
    expect(close).toHaveBeenCalledTimes(1);
  });

  it("safeStopAndCloseRecognizer remains idempotent after stale cleanup", () => {
    const close = vi.fn();
    const stop = vi.fn((ok?: () => void) => ok?.());
    const recognizer: AzureRecognizerLike = {
      stopContinuousRecognitionAsync: stop,
      close,
    };

    const done = vi.fn();
    safeStopAndCloseRecognizer(recognizer, done);
    safeStopAndCloseRecognizer(recognizer, done);

    expect(stop).toHaveBeenCalledTimes(1);
    expect(close).toHaveBeenCalledTimes(1);
    expect(done).toHaveBeenCalledTimes(2);
  });
});
