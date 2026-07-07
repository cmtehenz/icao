import { describe, expect, it } from "vitest";
import { ICAO_VOCABULARY } from "@/data/icaoVocabulary";
import { recordWordMissionLevelAttempt } from "@/lib/wordMission/progress";
import { WM_LEVEL_NAMES, wmLevelLabel } from "@/lib/wordMission/types";
import { vaultWordFromVocabTerm } from "@/lib/wordMission/vaultAdapter";
import { pronunciationMissionLink } from "@/lib/pronunciationDailyMission";
import { legacyPronunciationRedirectTarget, legacyVocabRedirectTarget } from "@/lib/wordMission/legacyRedirects";
import { resolveVocabTermIdForWord, wordMissionLink } from "@/lib/wordMission/wordDailyMission";
import { practiceTextForLevel } from "@/lib/pronunciationMission";

const sample = ICAO_VOCABULARY[0]!;

describe("word mission levels", () => {
  it("defines L1–L4 labels", () => {
    expect(WM_LEVEL_NAMES[1]).toBe("Meaning");
    expect(WM_LEVEL_NAMES[2]).toBe("Pilot phrase");
    expect(WM_LEVEL_NAMES[3]).toBe("Sentence");
    expect(WM_LEVEL_NAMES[4]).toBe("ICAO use");
    expect(wmLevelLabel(3)).toContain("WM-3");
  });

  it("maps vocab term to vault word for recording controller", () => {
    const vault = vaultWordFromVocabTerm(sample);
    expect(vault.word).toBe(sample.term);
    expect(practiceTextForLevel(vault, 1)).toBe(sample.levels[1]);
    expect(practiceTextForLevel(vault, 2)).toBe(sample.levels[2]);
    expect(practiceTextForLevel(vault, 3)).toBe(sample.levels[3]);
    expect(practiceTextForLevel(vault, 4)).toBe(sample.levels[4]);
  });
});

describe("legacy mission links", () => {
  it("pronunciationMissionLink resolves to word mission", () => {
    expect(pronunciationMissionLink("engine failure")).toBe(wordMissionLink("icao-01"));
    expect(pronunciationMissionLink()).toBe("/word-mission");
  });
});

describe("word mission legacy redirects", () => {
  it("redirects pronunciation to word mission", () => {
    expect(legacyPronunciationRedirectTarget({})).toBe("/word-mission");
  });

  it("maps pronunciation word query to vocab term when possible", () => {
    const termId = resolveVocabTermIdForWord("engine failure");
    expect(termId).toBe("icao-01");
    expect(legacyPronunciationRedirectTarget({ word: "engine failure" })).toBe(
      wordMissionLink("icao-01"),
    );
  });

  it("redirects vocab term query to word mission", () => {
    expect(legacyVocabRedirectTarget({ term: "icao-01" })).toBe(
      "/word-mission?term=icao-01",
    );
  });
});

describe("recordWordMissionLevelAttempt", () => {
  it("marks level passed at ≥75%", () => {
    const assessment = {
      accuracyScore: 80,
      fluencyScore: 80,
      completenessScore: 80,
      recognizedText: sample.levels[1],
      words: [],
    };
    const result = recordWordMissionLevelAttempt(sample.id, 1, assessment);
    expect(result.passed).toBe(true);
    expect(result.progress.levelsPassed?.[1]).toBe(true);
  });
});
