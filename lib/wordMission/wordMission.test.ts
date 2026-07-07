import { describe, expect, it } from "vitest";
import { recordWordMissionLevelAttempt } from "@/lib/wordMission/progress";
import { WM_LEVEL_NAMES, wmLevelLabel } from "@/lib/wordMission/types";
import { vaultWordFromVocabTerm } from "@/lib/wordMission/vaultAdapter";
import { buildWordMissionLesson, lessonSpeakTextForLevel } from "@/lib/wordMission/lesson/lessonEngine";
import { legacyPronunciationRedirectTarget, legacyVocabRedirectTarget } from "@/lib/wordMission/legacyRedirects";
import { resolveVocabTermIdForWord, wordMissionLink } from "@/lib/wordMission/wordDailyMission";
import { pronunciationMissionLink } from "@/lib/pronunciationDailyMission";
import { getWordMissionVocabulary } from "@/lib/wordMission/wordMissionCatalog";

const sample = getWordMissionVocabulary()[0]!;

describe("word mission levels", () => {
  it("defines L1–L4 labels", () => {
    expect(WM_LEVEL_NAMES[1]).toBe("Meaning");
    expect(WM_LEVEL_NAMES[2]).toBe("Operational Use");
    expect(WM_LEVEL_NAMES[3]).toBe("Say It");
    expect(WM_LEVEL_NAMES[4]).toBe("ICAO Practice");
    expect(wmLevelLabel(3)).toContain("WM-3");
  });

  it("maps vocab term to vault word for recording controller", () => {
    const vault = vaultWordFromVocabTerm(sample);
    const lesson = buildWordMissionLesson(sample);
    expect(vault.word).toBe(sample.term);
    expect(lessonSpeakTextForLevel(lesson, 3)).toBe(vault.contextPack.sentence);
    expect(lessonSpeakTextForLevel(lesson, 4)).toBe(vault.contextPack.fragment);
    expect(vault.contextPack.fragment).not.toMatch(/Pan Pan Pan.*immediate return/i);
  });
});

describe("legacy mission links", () => {
  it("pronunciationMissionLink resolves to word mission", () => {
    expect(pronunciationMissionLink("go around")).toBe(wordMissionLink("0007"));
    expect(pronunciationMissionLink()).toBe("/word-mission");
  });
});

describe("word mission legacy redirects", () => {
  it("redirects pronunciation to word mission", () => {
    expect(legacyPronunciationRedirectTarget({})).toBe("/word-mission");
  });

  it("maps pronunciation word query to premium concept when possible", () => {
    const termId = resolveVocabTermIdForWord("go around");
    expect(termId).toBe("0007");
    expect(legacyPronunciationRedirectTarget({ word: "go around" })).toBe(
      wordMissionLink("0007"),
    );
  });

  it("redirects vocab term query to word mission", () => {
    expect(legacyVocabRedirectTarget({ term: "0001" })).toBe(
      "/word-mission?term=0001",
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
