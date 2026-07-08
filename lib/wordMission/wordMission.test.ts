import { describe, expect, it } from "vitest";
import { recordWordMissionLevelAttempt } from "@/lib/wordMission/progress";
import { WM_LEVEL_NAMES, wmLevelLabel } from "@/lib/wordMission/types";
import { vaultWordFromVocabTerm } from "@/lib/wordMission/vaultAdapter";
import { buildWordMissionLesson, lessonSpeakTextForLevel } from "@/lib/wordMission/lesson/lessonEngine";
import { legacyPronunciationRedirectTarget, legacyVocabRedirectTarget } from "@/lib/wordMission/legacyRedirects";
import {
  pickWordDailyTermIds,
  WORD_DAILY_MISSION_TERM_COUNT,
} from "@/lib/wordMission/pickWordDailyTerms";
import {
  effectiveMissionCompletedIds,
  nextWordMissionTermId,
  resolveVocabTermIdForWord,
  wordMissionLink,
} from "@/lib/wordMission/wordDailyMission";
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

describe("word daily mission slice", () => {
  it("picks four terms per day from the premium catalog", () => {
    const ids = pickWordDailyTermIds("2026-07-08", "23C", WORD_DAILY_MISSION_TERM_COUNT, {
      items: {},
      dailyAttempts: {},
      dailyPhrases: {},
      dailyScoreSum: {},
      streak: 0,
    });
    expect(ids).toHaveLength(WORD_DAILY_MISSION_TERM_COUNT);
    expect(new Set(ids).size).toBe(WORD_DAILY_MISSION_TERM_COUNT);
  });

  it("is stable for the same date and exam version", () => {
    const store = { items: {}, dailyAttempts: {}, dailyPhrases: {}, dailyScoreSum: {}, streak: 0 };
    const a = pickWordDailyTermIds("2026-07-08", "24C", WORD_DAILY_MISSION_TERM_COUNT, store);
    const b = pickWordDailyTermIds("2026-07-08", "24C", WORD_DAILY_MISSION_TERM_COUNT, store);
    expect(a).toEqual(b);
  });

  it("rotates by exam version on different weekdays", () => {
    const store = { items: {}, dailyAttempts: {}, dailyPhrases: {}, dailyScoreSum: {}, streak: 0 };
    const a = pickWordDailyTermIds("2026-07-08", "25C", WORD_DAILY_MISSION_TERM_COUNT, store);
    const b = pickWordDailyTermIds("2026-07-08", "26C", WORD_DAILY_MISSION_TERM_COUNT, store);
    expect(a).not.toEqual(b);
  });
});

describe("word daily mission advance", () => {
  const mission = {
    date: "2026-07-08",
    examVersion: "v1" as const,
    termIds: ["0001", "0006", "0007"],
    completedIds: ["0001"],
  };

  it("ignores empty completed override (pronunciation vault bug)", () => {
    expect(effectiveMissionCompletedIds(mission, [])).toEqual(["0001"]);
    expect(nextWordMissionTermId(mission, [])).toBe("0006");
  });

  it("uses non-empty override when provided", () => {
    expect(nextWordMissionTermId(mission, ["0001", "0006"])).toBe("0007");
  });

  it("returns null when all terms are done", () => {
    expect(nextWordMissionTermId(mission, ["0001", "0006", "0007"])).toBeNull();
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
