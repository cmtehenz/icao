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

vi.mock("@/lib/trainingProfile/adaptivePlan", () => ({
  FOUNDATION_BOOTSTRAP_WORDS: ["turbulence", "approach", "altitude", "hold short", "go around"],
  getAdaptiveDailyPlan: () => ({
    phase: "foundation",
    wordMissionTermCount: 2,
    wordMissionMinExamTerms: 1,
    wordMissionMaxReviewTerms: 1,
    pronunciationFirst: true,
    pronunciationWordCount: 5,
    preferFoundationTerms: true,
  }),
}));

vi.mock("@/lib/trainingProfile/store", () => ({
  getTrainingProfile: () => ({
    version: 1,
    checkrideStatus: "skipped",
    phase: "foundation",
    weakAreas: ["pronunciation"],
    focusSounds: ["turbulence"],
    probeResults: [],
  }),
}));

import {
  getOrCreatePronunciationDailyMission,
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

describe("getOrCreatePronunciationDailyMission bootstrap", () => {
  beforeEach(() => {
    vi.stubGlobal("window", {
      dispatchEvent: vi.fn(),
      localStorage: {
        store: {} as Record<string, string>,
        getItem(key: string) {
          return this.store[key] ?? null;
        },
        setItem(key: string, value: string) {
          this.store[key] = value;
        },
        removeItem(key: string) {
          delete this.store[key];
        },
      },
    });
    vi.stubGlobal("localStorage", window.localStorage);
  });

  it("bootstraps foundation words when vault is empty", () => {
    const mission = getOrCreatePronunciationDailyMission();
    expect(mission.words.length).toBe(5);
    expect(mission.words[0]!.toLowerCase()).toBe("turbulence");
    expect(mission.words).toContain("approach");
  });
});
