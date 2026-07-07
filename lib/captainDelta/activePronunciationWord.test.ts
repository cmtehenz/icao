import { describe, expect, it, beforeEach } from "vitest";
import { buildActiveMissionTermLine } from "@/lib/captainDelta/briefing";
import {
  clearActivePronunciationWord,
  getAuthoritativePronunciationWord,
  isPronunciationTermSynced,
  mergeLessonContext,
  pronunciationWordChanged,
  publishActivePronunciationWord,
  resetActivePronunciationWordForTests,
  resolveCaptainActiveTerm,
} from "@/lib/captainDelta/lessonContext";
import { DEFAULT_LESSON_CONTEXT } from "@/lib/captainDelta/types";

describe("active pronunciation word single source", () => {
  beforeEach(() => {
    resetActivePronunciationWordForTests();
  });

  it("publishActivePronunciationWord stores authoritative term", () => {
    const eventId = publishActivePronunciationWord("route");
    expect(getAuthoritativePronunciationWord()).toBe("route");
    expect(eventId).toMatch(/^pronunciation-word:route:\d+$/);
  });

  it("publishActivePronunciationWord returns null for duplicate word", () => {
    publishActivePronunciationWord("route");
    expect(publishActivePronunciationWord("route")).toBeNull();
  });

  it("activeWord route → Captain resolves route even if lesson is stale", () => {
    publishActivePronunciationWord("route");
    const term = resolveCaptainActiveTerm("pronunciation", {
      ...DEFAULT_LESSON_CONTEXT,
      pronunciationWord: "descend",
    });
    expect(term).toBe("route");
  });

  it("activeWord changes route → descend → authoritative updates", () => {
    publishActivePronunciationWord("route");
    publishActivePronunciationWord("descend");
    expect(getAuthoritativePronunciationWord()).toBe("descend");
    expect(
      resolveCaptainActiveTerm("pronunciation", {
        ...DEFAULT_LESSON_CONTEXT,
        pronunciationWord: "route",
      }),
    ).toBe("descend");
  });

  it("pronunciation patch without pronunciationWord clears stale word", () => {
    const merged = mergeLessonContext(
      { ...DEFAULT_LESSON_CONTEXT, mode: "pronunciation", pronunciationWord: "descend" },
      { mode: "pronunciation" },
    );
    expect(merged.pronunciationWord).toBeUndefined();
  });

  it("pronunciation patch with word replaces stale lesson word", () => {
    const merged = mergeLessonContext(
      { ...DEFAULT_LESSON_CONTEXT, mode: "pronunciation", pronunciationWord: "descend" },
      { mode: "pronunciation", pronunciationWord: "route" },
    );
    expect(merged.pronunciationWord).toBe("route");
  });

  it("isPronunciationTermSynced is false when lesson lags authoritative word", () => {
    publishActivePronunciationWord("route");
    expect(
      isPronunciationTermSynced({
        ...DEFAULT_LESSON_CONTEXT,
        pronunciationWord: "descend",
      }),
    ).toBe(false);
    expect(
      isPronunciationTermSynced({
        ...DEFAULT_LESSON_CONTEXT,
        pronunciationWord: "route",
      }),
    ).toBe(true);
  });

  it("pronunciationWordChanged detects word switch", () => {
    expect(pronunciationWordChanged("route", "descend")).toBe(true);
    expect(pronunciationWordChanged("route", "route")).toBe(false);
    expect(pronunciationWordChanged(null, "route")).toBe(false);
  });

  it("clearActivePronunciationWord resets authoritative source", () => {
    publishActivePronunciationWord("route");
    clearActivePronunciationWord();
    expect(getAuthoritativePronunciationWord()).toBeNull();
  });

  it("Give me an example line uses resolveCaptainActiveTerm pronunciation word", () => {
    publishActivePronunciationWord("route");
    const term = resolveCaptainActiveTerm("pronunciation", {
      ...DEFAULT_LESSON_CONTEXT,
      pronunciationWord: "descend",
    });
    const prompt = `Give me a short ICAO operational example sentence using "${term}".`;
    expect(prompt).toContain('"route"');
    expect(prompt).not.toContain("descend");
  });

  it("buildActiveMissionTermLine matches authoritative pronunciation word", () => {
    publishActivePronunciationWord("route");
    const term = resolveCaptainActiveTerm("pronunciation", DEFAULT_LESSON_CONTEXT);
    const line = buildActiveMissionTermLine(term!, "pronunciation");
    expect(line.text).toMatch(/direction|degrees|operational/i);
    expect(line.text).toContain("route");
    expect(line.speechText).toContain("route");
  });
});
