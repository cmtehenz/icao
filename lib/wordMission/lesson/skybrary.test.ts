import { describe, expect, it } from "vitest";
import { ICAO_VOCABULARY } from "@/data/icaoVocabulary";
import {
  CURATED_SKYBRARY_TOPICS,
  findSkybraryKnowledge,
  listSkybraryTopics,
} from "@/lib/wordMission/lesson/curatedSkybraryContent";
import { buildWordMissionLesson } from "@/lib/wordMission/lesson/lessonEngine";
import {
  KNOWLEDGE_SUMMARY_MAX_CHARS,
  SKYBRARY_ATTRIBUTION,
  SKYBRARY_UI_LABEL,
  isValidKnowledgeSummary,
} from "@/lib/wordMission/lesson/knowledgeSource";
import { skybraryPatchForTerm } from "@/lib/wordMission/lesson/skybraryProvider";
import { readFileSync } from "node:fs";
import path from "node:path";

const sessionSource = readFileSync(
  path.join(__dirname, "../../../components/WordMission/WordMissionSession.tsx"),
  "utf-8",
);

describe("SKYbrary knowledge integration", () => {
  it("curates five pilot-relevant topics", () => {
    expect(listSkybraryTopics()).toHaveLength(5);
    expect(listSkybraryTopics()).toEqual(
      expect.arrayContaining([
        "controlled-flight-into-terrain",
        "loss-of-control",
        "runway-incursion",
        "weather-avoidance",
        "communication-error",
      ]),
    );
  });

  it("stores short summaries with SKYbrary attribution — not full articles", () => {
    for (const topic of listSkybraryTopics()) {
      const entry = CURATED_SKYBRARY_TOPICS[topic];
      expect(entry.attribution).toBe(SKYBRARY_ATTRIBUTION);
      expect(entry.sourceUrl).toMatch(/^https:\/\/skybrary\.aero\//);
      expect(entry.summary.length).toBeLessThanOrEqual(KNOWLEDGE_SUMMARY_MAX_CHARS);
      expect(isValidKnowledgeSummary(entry.summary)).toBe(true);
      expect(entry.summary.split(/\s+/).length).toBeLessThan(60);
    }
  });

  it("Word Mission uses SKYbrary summary when topic matches", () => {
    const windshear = ICAO_VOCABULARY.find((v) => v.term.toLowerCase().includes("windshear"));
    expect(windshear).toBeDefined();

    const lesson = buildWordMissionLesson(windshear!);
    expect(lesson.knowledgeSource?.provider).toBe("skybrary");
    expect(lesson.knowledgeSource?.topic).toBe("Weather Avoidance");
    // Premium Windshear lesson owns teaching copy; SKYbrary attaches attribution.
    expect(lesson.steps[1]!.captainLine).toMatch(/windshear|airspeed|go around/i);
    expect(lesson.steps[3]!.captainLine).toMatch(/windshear|final|ATC/i);
  });

  it("line up and wait maps to runway incursion topic", () => {
    const item = ICAO_VOCABULARY.find((v) => v.term.toLowerCase() === "line up and wait");
    expect(item).toBeDefined();
    const entry = findSkybraryKnowledge(item!.term);
    expect(entry?.topic).toBe("Runway Incursion");
  });

  it("falls back to internal content when no SKYbrary entry exists", () => {
    const lesson = buildWordMissionLesson("battery power");
    expect(lesson.knowledgeSource).toBeUndefined();
    expect(lesson.knowledgeReview?.fallbackUsed).toBe(true);

    const patch = skybraryPatchForTerm("battery power");
    expect(patch).toBeNull();
  });

  it("hand-curated legacy lessons fall back when not in knowledge base", () => {
    const lesson = buildWordMissionLesson("expect");
    expect(lesson.knowledgeReview?.curated).toBe(false);
    expect(lesson.knowledgeReview?.fallbackUsed).toBe(true);
  });

  it("source attribution label appears in Word Mission UI", () => {
    expect(sessionSource).toMatch(/word-mission-source-label/);
    expect(sessionSource).toMatch(/SKYBRARY_UI_LABEL/);
    expect(sessionSource).toMatch(/knowledgeSource\?\.provider === "skybrary"/);
  });
});
