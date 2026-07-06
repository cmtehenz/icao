import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  __resetPronunciationRecordingStoreForTests,
  cancelDeferredPronunciationTeardown,
  getPronunciationRecordingStore,
  PRONUNCIATION_STRICT_REMOUNT_GRACE_MS,
  registerPronunciationHookMount,
  scheduleDeferredPronunciationTeardown,
} from "@/lib/azure/pronunciationRecordingStore";

describe("pronunciation recording store (Strict Mode)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    __resetPronunciationRecordingStoreForTests();
  });

  afterEach(() => {
    cancelDeferredPronunciationTeardown();
    vi.useRealTimers();
  });

  it("defers teardown until grace elapses when no hook is mounted", () => {
    const teardown = vi.fn();
    scheduleDeferredPronunciationTeardown(teardown);
    expect(teardown).not.toHaveBeenCalled();
    vi.advanceTimersByTime(PRONUNCIATION_STRICT_REMOUNT_GRACE_MS - 1);
    expect(teardown).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(teardown).toHaveBeenCalledTimes(1);
  });

  it("cancels deferred teardown when hook remounts within grace (Strict Mode)", () => {
    const teardown = vi.fn();
    const unregister = registerPronunciationHookMount();
    unregister();
    scheduleDeferredPronunciationTeardown(teardown);

    registerPronunciationHookMount();
    vi.advanceTimersByTime(PRONUNCIATION_STRICT_REMOUNT_GRACE_MS);

    expect(teardown).not.toHaveBeenCalled();
    expect(getPronunciationRecordingStore().hookMountCount).toBe(1);
  });

  it("persists recognizer across simulated remount", () => {
    const recognizer = { close: vi.fn() };
    const unregister = registerPronunciationHookMount();
    const store = getPronunciationRecordingStore();
    store.recognizer = recognizer;
    store.lifecycle = "listening";

    unregister();
    registerPronunciationHookMount();

    expect(getPronunciationRecordingStore().recognizer).toBe(recognizer);
    expect(getPronunciationRecordingStore().lifecycle).toBe("listening");
  });
});
