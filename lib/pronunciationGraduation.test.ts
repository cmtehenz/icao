import { describe, expect, it } from "vitest";
import {
  isPracticeLevelUnlocked,
  recommendedPracticeLevel,
  unlockedPracticeLevel,
} from "@/lib/pronunciationGraduation";
import type { VaultWord } from "@/lib/pronunciationVault";
import { captainFeedbackBelowStoredLevel } from "@/lib/pronunciationCoach";
import { practiceTextForLevel } from "@/lib/pronunciationMission";
import {
  initialPracticeLevelForWord,
  practiceLevelAfterVaultRefresh,
} from "@/lib/pronunciation/practiceLevelSelection";

function baseWord(overrides: Partial<VaultWord> = {}): VaultWord {
  return {
    word: "climb",
    lowestAccuracy: 70,
    lastAccuracy: 85,
    errorType: "None",
    errorLabel: "",
    context: "departure",
    timesSeen: 3,
    practiceCount: 5,
    passCount: 2,
    returnCount: 0,
    lastSeenAt: new Date().toISOString(),
    contextPack: {
      expression: "climb to",
      sentence: "We need to climb to flight level three five zero.",
      icaoPrompt: "Describe a climb after takeoff.",
      fragment: "After takeoff we climbed to cruise altitude.",
    },
    ...overrides,
  };
}

describe("recommendedPracticeLevel", () => {
  it("returns vault practiceLevel when set", () => {
    expect(recommendedPracticeLevel(baseWord({ practiceLevel: 3 }))).toBe(3);
  });

  it("uses use_sentence status when practiceLevel field is stale at 1", () => {
    expect(
      recommendedPracticeLevel(
        baseWord({ practiceLevel: 1, status: "use_sentence" }),
      ),
    ).toBe(3);
  });

  it("uses use_icao status for level 4", () => {
    expect(
      recommendedPracticeLevel(
        baseWord({ practiceLevel: 3, status: "use_icao" }),
      ),
    ).toBe(4);
  });
});

describe("practice level selection", () => {
  it("opens word at current unlocked level 3", () => {
    const word = baseWord({ practiceLevel: 3 });
    expect(initialPracticeLevelForWord(word)).toBe(3);
  });

  it("uses L3 sentence as recorder reference when level is 3", () => {
    const word = baseWord({ practiceLevel: 3 });
    const level = initialPracticeLevelForWord(word);
    expect(level).toBe(3);
    expect(practiceTextForLevel(word, level)).toBe(
      "We need to climb to flight level three five zero.",
    );
  });

  it("uses L4 spoken answer (fragment), not the coaching question", () => {
    const word = baseWord({ practiceLevel: 4 });
    expect(practiceTextForLevel(word, 4)).toBe(
      "After takeoff we climbed to cruise altitude.",
    );
  });

  it("changing word resets to that word's current level", () => {
    const climb = baseWord({ word: "climb", practiceLevel: 3 });
    const route = baseWord({ word: "route", practiceLevel: 2 });
    expect(initialPracticeLevelForWord(climb)).toBe(3);
    expect(initialPracticeLevelForWord(route)).toBe(2);
  });

  it("vault refresh bumps UI up when progress advanced without override", () => {
    const word = baseWord({ practiceLevel: 3 });
    expect(practiceLevelAfterVaultRefresh(word, 1, false)).toBe(3);
  });

  it("vault refresh respects manual unlocked level selection", () => {
    const word = baseWord({ practiceLevel: 3 });
    expect(practiceLevelAfterVaultRefresh(word, 2, true)).toBe(2);
  });

  it("blocks locked level selection", () => {
    const word = baseWord({ practiceLevel: 2 });
    expect(isPracticeLevelUnlocked(word, 1)).toBe(true);
    expect(isPracticeLevelUnlocked(word, 2)).toBe(true);
    expect(isPracticeLevelUnlocked(word, 3)).toBe(false);
    expect(isPracticeLevelUnlocked(word, 4)).toBe(false);
  });

  it("Captain stored level matches recommended level for UI", () => {
    const word = baseWord({ practiceLevel: 3 });
    const attempt = captainFeedbackBelowStoredLevel(word, 1);
    expect(attempt).not.toBeNull();
    expect(attempt!.message).toContain("level 3");
    expect(unlockedPracticeLevel(word)).toBe(3);
  });
});
