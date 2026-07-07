import { describe, expect, it, afterEach } from "vitest";
import { BATCH01_DEV_ENTRIES } from "@/lib/knowledge/devKnowledge/batch01Entries";
import { getDevKnowledgeTermIds, lookupDevKnowledgeByTerm } from "@/lib/knowledge/devKnowledge";
import { isDevKnowledgeEnabled } from "@/lib/knowledge/devKnowledgeFlag";
import { buildWordMissionLesson } from "@/lib/wordMission/lesson/lessonEngine";
import { getWordMissionVocabulary } from "@/lib/wordMission/wordMissionCatalog";

const ENV_KEY = "NEXT_PUBLIC_DEV_KNOWLEDGE";

describe("developer knowledge mode", () => {
  const previous = process.env[ENV_KEY];

  afterEach(() => {
    if (previous === undefined) {
      delete process.env[ENV_KEY];
    } else {
      process.env[ENV_KEY] = previous;
    }
  });

  it("is disabled by default", () => {
    delete process.env[ENV_KEY];
    expect(isDevKnowledgeEnabled()).toBe(false);
  });

  it("bundles ten premium batch-01 concepts", () => {
    expect(BATCH01_DEV_ENTRIES).toHaveLength(10);
    expect(BATCH01_DEV_ENTRIES[0]?.term).toBe("fly direct");
    expect(BATCH01_DEV_ENTRIES[9]?.term).toBe("radar vectors");
    expect(getDevKnowledgeTermIds()).toHaveLength(10);
  });

  it("limits Word Mission vocabulary when flag is enabled", () => {
    process.env[ENV_KEY] = "true";
    const catalog = getWordMissionVocabulary();
    expect(catalog).toHaveLength(10);
    expect(catalog.map((t) => t.term)).toContain("hold short");
    expect(catalog.map((t) => t.term)).not.toContain("engine failure");
  });

  it("loads premium draft lesson content for fly direct when flag is enabled", () => {
    process.env[ENV_KEY] = "true";
    const entry = lookupDevKnowledgeByTerm("fly direct");
    expect(entry?.example).toContain("fly direct NITUX");
    const item = getWordMissionVocabulary().find((t) => t.term === "fly direct")!;
    const lesson = buildWordMissionLesson(item);
    expect(lesson.steps[0]!.captainLine).toContain("waypoint");
    expect(lesson.knowledgeReview?.entryId).toBe("dev-0001");
    expect(lesson.knowledgeReview?.fallbackUsed).toBe(false);
  });

  it("uses production vocabulary when flag is disabled", () => {
    delete process.env[ENV_KEY];
    expect(getWordMissionVocabulary().length).toBeGreaterThan(10);
    const lesson = buildWordMissionLesson("heading");
    expect(lesson.knowledgeReview?.entryId).toBe("vocab-heading");
  });
});
