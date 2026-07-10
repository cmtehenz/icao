import { describe, expect, it, vi } from "vitest";
import { isPronunciationWarmupBlocking } from "@/lib/dailyMission/pronunciationWarmup";

vi.mock("@/lib/trainingProfile/adaptivePlan", () => ({
  getAdaptiveDailyPlan: () => ({ pronunciationFirst: true }),
}));

vi.mock("@/lib/wordMission/wordDailyMission", () => ({
  getOrCreateWordDailyMission: () => ({ termIds: ["t1"], completedIds: ["t1"] }),
  wordDailyMissionProgress: () => ({ done: 1, total: 1, complete: true }),
}));

vi.mock("@/lib/pronunciationDailyMission", () => ({
  getOrCreatePronunciationDailyMission: () => ({
    date: "2026-07-10",
    words: ["alpha"],
    completedWords: [],
  }),
  pronunciationDailyMissionProgress: () => ({
    done: 0,
    total: 1,
    complete: false,
    currentWord: "alpha",
  }),
}));

describe("isPronunciationWarmupBlocking", () => {
  it("does not block after Word Mission is complete", () => {
    expect(isPronunciationWarmupBlocking()).toBe(false);
  });
});
