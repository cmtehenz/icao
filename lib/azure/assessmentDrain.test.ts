import { describe, expect, it, vi } from "vitest";
import {
  createAssessmentDrainWait,
  RECOGNIZED_GRACE_MS,
  SESSION_STOPPED_GRACE_MS,
} from "@/lib/azure/assessmentDrain";

describe("assessment drain", () => {
  it("resolves on late recognized after grace period", async () => {
    vi.useFakeTimers();
    const { signal, wait } = createAssessmentDrainWait(5000, 200, 800);
    const resultPromise = wait();
    signal.onLateRecognized();
    await vi.advanceTimersByTimeAsync(200);
    await expect(resultPromise).resolves.toMatchObject({ reason: "recognized" });
    vi.useRealTimers();
  });

  it("waits grace after sessionStopped before resolving", async () => {
    vi.useFakeTimers();
    const { signal, wait } = createAssessmentDrainWait(5000, 200, 800);
    const resultPromise = wait();
    signal.onSessionStopped();
    await vi.advanceTimersByTimeAsync(SESSION_STOPPED_GRACE_MS - 1);
    let settled = false;
    void resultPromise.then(() => {
      settled = true;
    });
    await vi.advanceTimersByTimeAsync(1);
    await resultPromise;
    expect(settled).toBe(true);
    vi.useRealTimers();
  });

  it("late recognized cancels sessionStopped grace and wins", async () => {
    vi.useFakeTimers();
    const { signal, wait } = createAssessmentDrainWait(5000, 200, 800);
    const resultPromise = wait();
    signal.onSessionStopped();
    await vi.advanceTimersByTimeAsync(400);
    signal.onLateRecognized();
    await vi.advanceTimersByTimeAsync(200);
    await expect(resultPromise).resolves.toMatchObject({ reason: "recognized" });
    vi.useRealTimers();
  });

  it("times out when no callback arrives", async () => {
    vi.useFakeTimers();
    const { wait } = createAssessmentDrainWait(1000, 200, 800);
    const resultPromise = wait();
    await vi.advanceTimersByTimeAsync(1000);
    await expect(resultPromise).resolves.toMatchObject({ reason: "timeout" });
    vi.useRealTimers();
  });
});
