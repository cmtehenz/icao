import { describe, expect, it } from "vitest";
import {
  isVocabMissionTermComplete,
  nextVocabMissionLevel,
  vbLevelCode,
  vbLevelLabel,
  vocabTermMissionProgress,
} from "@/lib/vocabGraduation";
import type { VocabItemProgress } from "@/utils/spacedRepetition";

function progress(overrides: Partial<VocabItemProgress> = {}): VocabItemProgress {
  return {
    attempts: 0,
    bestScore: 0,
    averageScore: 0,
    lastScore: 0,
    lastAttemptDate: "",
    highScoreDates: [],
    nextReviewDate: "2026-07-05",
    currentLevel: 1,
    levelsPassed: {},
    masteryLevel: 0,
    status: "new",
    markedDifficult: false,
    manuallyMastered: false,
    recordings: [],
    ...overrides,
  };
}

describe("vocabGraduation", () => {
  it("labels VB levels correctly", () => {
    expect(vbLevelCode(1)).toBe("VB-1");
    expect(vbLevelLabel(2)).toContain("VB-2");
    expect(vbLevelLabel(4)).toContain("ICAO Use");
  });

  it("requires all four VB levels for mission term complete", () => {
    expect(isVocabMissionTermComplete(progress())).toBe(false);
    expect(
      isVocabMissionTermComplete(
        progress({ levelsPassed: { 1: true, 2: true, 3: true, 4: true } }),
      ),
    ).toBe(true);
  });

  it("returns next unpassed VB level", () => {
    expect(nextVocabMissionLevel(progress())).toBe(1);
    expect(nextVocabMissionLevel(progress({ levelsPassed: { 1: true, 2: true } }))).toBe(3);
  });

  it("tracks mission term progress", () => {
    const p = vocabTermMissionProgress(progress({ levelsPassed: { 1: true } }));
    expect(p.levelsDone).toBe(1);
    expect(p.total).toBe(4);
    expect(p.complete).toBe(false);
    expect(p.currentLevel).toBe(2);
  });
});
