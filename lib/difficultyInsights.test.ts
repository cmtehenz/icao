import { describe, expect, it, vi, afterEach } from "vitest";
import {
  RECENT_INSIGHT_DAYS,
  withinInsightScope,
} from "@/lib/difficultyInsights";

describe("withinInsightScope", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("includes all dates when scope is all", () => {
    expect(withinInsightScope("2020-01-01", "all")).toBe(true);
    expect(withinInsightScope(undefined, "all")).toBe(true);
  });

  it("matches only today for today scope", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-10T15:00:00"));

    expect(withinInsightScope("2026-07-10T12:00:00.000Z", "today")).toBe(true);
    expect(withinInsightScope("2026-07-09", "today")).toBe(false);
    expect(withinInsightScope(undefined, "today")).toBe(false);
  });

  it("matches last N days for recent scope", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-10T15:00:00"));

    expect(withinInsightScope("2026-07-10", "recent")).toBe(true);
    expect(withinInsightScope("2026-07-04", "recent")).toBe(true);
    expect(withinInsightScope("2026-07-03", "recent")).toBe(false);
    expect(RECENT_INSIGHT_DAYS).toBe(7);
  });
});
