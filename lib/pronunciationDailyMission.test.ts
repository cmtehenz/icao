import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/pronunciationMission", () => ({
  buildDailyPronunciationMission: vi.fn(() => ({ words: [] })),
}));

vi.mock("@/lib/pronunciationVault", () => ({
  loadVault: vi.fn(() => []),
  VAULT_PASS_SCORE: 80,
}));

vi.mock("@/lib/dailyMissionLog", () => ({
  syncDailyMissionLog: vi.fn(),
}));

vi.mock("@/lib/studyTime", () => ({
  todayKey: () => "2026-07-05",
}));

import {
  passesDailyMissionWordAttempt,
  pronunciationDailyMissionProgress,
} from "@/lib/pronunciationDailyMission";

describe("pronunciationDailyMissionProgress", () => {
  it("empty word list is not complete", () => {
    const progress = pronunciationDailyMissionProgress({
      date: "2026-07-05",
      words: [],
      completedWords: [],
    });
    expect(progress.complete).toBe(false);
    expect(progress.total).toBe(0);
    expect(progress.done).toBe(0);
  });

  it("marks complete only when all words are passed", () => {
    const progress = pronunciationDailyMissionProgress({
      date: "2026-07-05",
      words: ["alpha", "bravo"],
      completedWords: ["alpha", "bravo"],
    });
    expect(progress.complete).toBe(true);
  });
});

describe("passesDailyMissionWordAttempt", () => {
  it("requires assessment and pass score", () => {
    expect(passesDailyMissionWordAttempt(90, true)).toBe(true);
    expect(passesDailyMissionWordAttempt(79, true)).toBe(false);
    expect(passesDailyMissionWordAttempt(90, false)).toBe(false);
  });
});
