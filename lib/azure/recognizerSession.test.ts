import { describe, expect, it, vi } from "vitest";
import {
  acquireRecordingSession,
  forceReleaseRecordingSession,
  releaseRecordingSession,
  resetRecordingStartChain,
  runRecordingStart,
  safeStopAndCloseRecognizer,
  waitForRecordingIdle,
  type AzureRecognizerLike,
} from "@/lib/azure/recognizerSession";
import { MIC_START_FAILED } from "@/lib/azure/recordingStartup";

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

  it("force release clears a stuck mutex", async () => {
    const first = await acquireRecordingSession("session-a");
    expect(first.acquired).toBe(true);
    forceReleaseRecordingSession("session-a");
    const second = await acquireRecordingSession("session-b");
    expect(second.acquired).toBe(true);
    releaseRecordingSession("session-b");
  });

  it("acquireRecordingSession does not deadlock inside runRecordingStart", async () => {
    await runRecordingStart(async () => {
      const { acquired } = await acquireRecordingSession("session-inner");
      expect(acquired).toBe(true);
      releaseRecordingSession("session-inner");
    });
  });

  it("waitForRecordingIdle times out when start chain is stuck", async () => {
    vi.useFakeTimers();
    let releaseStart!: () => void;
    const stuck = new Promise<void>((resolve) => {
      releaseStart = resolve;
    });
    void runRecordingStart(() => stuck);
    const idlePromise = waitForRecordingIdle(2000);
    await vi.advanceTimersByTimeAsync(2000);
    await expect(idlePromise).resolves.toBe(false);
    releaseStart();
    resetRecordingStartChain();
    vi.useRealTimers();
  });

  it("waitForRecordingIdle returns true when no start is in flight", async () => {
    resetRecordingStartChain();
    await expect(waitForRecordingIdle()).resolves.toBe(true);
  });

  it("exposes mic start failure message for timeout handling", () => {
    expect(MIC_START_FAILED).toContain("Microphone did not start");
  });
});
