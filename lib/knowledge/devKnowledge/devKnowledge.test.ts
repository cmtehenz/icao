import { describe, expect, it } from "vitest";
import { BATCH01_DEV_ENTRIES } from "@/lib/knowledge/devKnowledge/batch01Entries";
import { getDevKnowledgeTermIds, lookupDevKnowledgeByTerm } from "@/lib/knowledge/devKnowledge";
import { buildWordMissionLesson } from "@/lib/wordMission/lesson/lessonEngine";
import { getWordMissionVocabulary } from "@/lib/wordMission/wordMissionCatalog";

describe("premium word mission knowledge", () => {
  it("bundles completed premium concepts", () => {
    expect(BATCH01_DEV_ENTRIES.length).toBeGreaterThanOrEqual(10);
    expect(BATCH01_DEV_ENTRIES[0]?.displayTerm).toBe("Fly Direct");
    expect(BATCH01_DEV_ENTRIES[0]?.term).toBe("fly direct");
    expect(BATCH01_DEV_ENTRIES[0]?.id).toBe("0001");
    expect(getDevKnowledgeTermIds()[0]).toBe("0001");
  });

  it("limits Word Mission vocabulary to premium catalog", () => {
    const catalog = getWordMissionVocabulary();
    expect(catalog.length).toBe(BATCH01_DEV_ENTRIES.length);
    expect(catalog.map((t) => t.term)).toContain("hold short");
    expect(catalog.map((t) => t.term)).not.toContain("turn left");
  });

  it("loads premium lesson content for fly direct", () => {
    const entry = lookupDevKnowledgeByTerm("fly direct");
    expect(entry?.example).toContain("fly direct NITUX");
    const item = getWordMissionVocabulary().find((t) => t.term === "fly direct")!;
    const lesson = buildWordMissionLesson(item);
    expect(lesson.steps[0]!.captainLine).toContain("waypoint");
    expect(lesson.knowledgeReview?.entryId).toBe("0001");
    expect(lesson.knowledgeReview?.fallbackUsed).toBe(false);
  });
});
