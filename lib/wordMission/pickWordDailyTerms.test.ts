import { describe, expect, it } from "vitest";
import { examCorpus } from "@/lib/examVocabPool";
import { lookupDevKnowledgeById } from "@/lib/knowledge/devKnowledge";
import {
  pickWordDailyTermIds,
  WORD_DAILY_MISSION_TERM_COUNT,
  WORD_DAILY_MIN_EXAM_TERMS,
} from "@/lib/wordMission/pickWordDailyTerms";
import type { VocabProgressStore } from "@/utils/spacedRepetition";

function emptyStore(): VocabProgressStore {
  return { items: {}, dailyAttempts: {}, dailyPhrases: {}, dailyScoreSum: {}, streak: 0 };
}

function termMatchesExam(id: string, examVersion: "23C" | "24C" | "25C" | "26C"): boolean {
  const corpus = examCorpus(examVersion);
  const entry = lookupDevKnowledgeById(id);
  if (!entry) return false;
  const haystack = [
    entry.term,
    entry.displayTerm,
    entry.sayPhrase,
    entry.example,
    ...(entry.atcPhraseology ?? []),
  ]
    .join(" ")
    .toLowerCase();
  return corpus.split(/\s+/).some((word) => word.length > 3 && haystack.includes(word));
}

describe("pickWordDailyTermIds", () => {
  it("returns four terms per day (~15 min leg)", () => {
    const ids = pickWordDailyTermIds("2026-07-08", "25C", WORD_DAILY_MISSION_TERM_COUNT, emptyStore());
    expect(ids).toHaveLength(WORD_DAILY_MISSION_TERM_COUNT);
    expect(new Set(ids).size).toBe(WORD_DAILY_MISSION_TERM_COUNT);
  });

  it("includes at least two exam-aligned terms when corpus matches exist", () => {
    const ids = pickWordDailyTermIds("2026-07-08", "25C", WORD_DAILY_MISSION_TERM_COUNT, emptyStore());
    const examHits = ids.filter((id) => termMatchesExam(id, "25C")).length;
    expect(examHits).toBeGreaterThanOrEqual(WORD_DAILY_MIN_EXAM_TERMS);
  });

  it("prioritizes marked difficult terms within the daily cap", () => {
    const store = emptyStore();
    store.items["0007"] = {
      attempts: 2,
      bestScore: 40,
      averageScore: 40,
      lastScore: 40,
      masteryLevel: 1,
      nextReviewDate: "2026-07-08",
      status: "review",
      highScoreDates: [],
      currentLevel: 3,
      levelsPassed: { 1: true },
      markedDifficult: true,
      manuallyMastered: false,
      recordings: [],
    };
    const ids = pickWordDailyTermIds("2026-07-08", "25C", WORD_DAILY_MISSION_TERM_COUNT, store);
    expect(ids).toContain("0007");
  });

  it("is stable for the same date and exam version", () => {
    const a = pickWordDailyTermIds("2026-07-08", "24C", WORD_DAILY_MISSION_TERM_COUNT, emptyStore());
    const b = pickWordDailyTermIds("2026-07-08", "24C", WORD_DAILY_MISSION_TERM_COUNT, emptyStore());
    expect(a).toEqual(b);
  });

  it("respects explicit phase-adaptive count (Foundation = 2)", () => {
    const ids = pickWordDailyTermIds("2026-07-08", "25C", {
      count: 2,
      minExamTerms: 1,
      maxReviewTerms: 1,
      preferFoundationTerms: true,
      store: emptyStore(),
    });
    expect(ids).toHaveLength(2);
  });
});
