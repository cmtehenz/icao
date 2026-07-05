import { describe, expect, it, vi } from "vitest";
import {
  acquireRecordingSession,
  releaseRecordingSession,
  safeStopAndCloseRecognizer,
  type AzureRecognizerLike,
} from "@/lib/azure/recognizerSession";

describe("Azure recognizer session", () => {
  it("ignores duplicate acquire for the same session id", async () => {
    const first = await acquireRecordingSession("session-a");
    const second = await acquireRecordingSession("session-a");
    expect(first.acquired).toBe(true);
    expect(second.acquired).toBe(false);
    releaseRecordingSession("session-a");
  });

  it("closes recognizer only once", () => {
    const close = vi.fn();
    const stop = vi.fn((ok?: () => void) => ok?.());
    const recognizer: AzureRecognizerLike = {
      stopContinuousRecognitionAsync: stop,
      close,
    };

    let doneCount = 0;
    const done = () => {
      doneCount += 1;
    };

    safeStopAndCloseRecognizer(recognizer, done);
    safeStopAndCloseRecognizer(recognizer, done);

    expect(stop).toHaveBeenCalledTimes(1);
    expect(close).toHaveBeenCalledTimes(1);
    expect(doneCount).toBe(2);
  });
});