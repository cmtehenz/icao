import { describe, expect, it, vi } from "vitest";
import { createRecordClickGuard } from "@/lib/captainDelta/pronunciationRecordTrace";

describe("createRecordClickGuard", () => {
  it("allows the first click and blocks duplicates within cooldown", () => {
    vi.useFakeTimers();
    const guard = createRecordClickGuard(500);

    expect(guard.tryAcquire()).toBe(true);
    expect(guard.tryAcquire()).toBe(false);

    guard.release();
    expect(guard.tryAcquire()).toBe(false);

    vi.advanceTimersByTime(500);
    expect(guard.tryAcquire()).toBe(true);

    guard.release();
    vi.useRealTimers();
  });
});
