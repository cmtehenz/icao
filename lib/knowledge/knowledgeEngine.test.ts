import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { KnowledgeEngine } from "@/lib/knowledge/engine";
import { findForbiddenPhrases } from "@/lib/knowledge/forbiddenPhrases";
import {
  VOCABULARY_KNOWLEDGE_REGISTRY,
  getVocabularyKnowledgeByTerm,
  listVocabularyKnowledgeIds,
} from "@/lib/knowledge/registry";
import { validateVocabularyEntry } from "@/lib/knowledge/validate";
import { buildWordMissionLesson } from "@/lib/wordMission/lesson/lessonEngine";

const VOCAB_DIR = path.join(process.cwd(), "knowledge/vocabulary");

describe("Aviation Knowledge Engine V1", () => {
  it("loads ten exemplary vocabulary entries", () => {
    expect(KnowledgeEngine.stats().vocabularyCount).toBe(10);
    expect(listVocabularyKnowledgeIds()).toHaveLength(10);
  });

  it("validates all registry entries against schema", () => {
    const result = KnowledgeEngine.validateAll();
    expect(result.ok, result.errors.join("\n")).toBe(true);
  });

  it("validates each vocabulary JSON file on disk", () => {
    const files = readdirSync(VOCAB_DIR).filter((f) => f.endsWith(".json"));
    expect(files).toHaveLength(10);
    for (const file of files) {
      const raw = JSON.parse(readFileSync(path.join(VOCAB_DIR, file), "utf-8"));
      const result = validateVocabularyEntry(raw);
      expect(result.ok, `${file}: ${JSON.stringify(result.issues)}`).toBe(true);
    }
  });

  it("detects missing required fields", () => {
    const result = validateVocabularyEntry({ term: "incomplete" });
    expect(result.ok).toBe(false);
    expect(result.issues.some((i) => i.message === "Missing required field")).toBe(true);
  });

  it("loads vocabulary by term", () => {
    const report = getVocabularyKnowledgeByTerm("report");
    expect(report?.id).toBe("vocab-report");
    expect(report?.realExamples.length).toBeGreaterThan(0);
    expect(report?.references[0]?.source).toBe("icao-delta");
  });

  it("Word Mission builds from knowledge when entry exists", () => {
    const lesson = buildWordMissionLesson("heading");
    expect(lesson.knowledgeReview?.curated).toBe(true);
    expect(lesson.knowledgeReview?.fallbackUsed).toBe(false);
    expect(lesson.knowledgeReview?.entryId).toBe("vocab-heading");
    expect(lesson.steps[0]!.captainLine).toMatch(/direction/i);
    expect(lesson.steps[1]!.detail).toMatch(/Helicopter PT-ABC|heading zero nine zero/i);
  });

  it("falls back when no knowledge entry exists", () => {
    const lesson = buildWordMissionLesson("vectors to final");
    expect(lesson.knowledgeReview?.curated).toBe(false);
    expect(lesson.knowledgeReview?.fallbackUsed).toBe(true);
  });

  it("knowledge entries contain no forbidden meta phrases", () => {
    for (const entry of VOCABULARY_KNOWLEDGE_REGISTRY) {
      const hits = findForbiddenPhrases({
        meaning: entry.meaning,
        simpleMeaning: entry.simpleMeaning,
        captainStory: entry.captainStory,
        pilotResponses: entry.pilotResponses,
        icaoQuestions: entry.icaoQuestions,
        realExamples: entry.realExamples.map((e) => e.text),
      });
      expect(hits, `${entry.id}: ${JSON.stringify(hits)}`).toHaveLength(0);
    }
  });

  it("hold short entry includes SKYbrary attribution reference", () => {
    const entry = getVocabularyKnowledgeByTerm("hold short");
    const sky = entry?.references.find((r) => r.source === "skybrary");
    expect(sky?.attribution).toBe("Source: SKYbrary Aviation Safety");
  });

  it("forbidden phrase patterns cover spec examples", () => {
    expect(findForbiddenPhrases({ line: "In Part 2 we practice" }).length).toBeGreaterThan(0);
    expect(findForbiddenPhrases({ line: "I would explain the term" }).length).toBeGreaterThan(0);
    expect(findForbiddenPhrases({ line: "This lesson covers" }).length).toBeGreaterThan(0);
  });
});
