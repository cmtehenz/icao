import { describe, expect, it } from "vitest";
import { buildActiveMissionTermLine } from "@/lib/captainDelta/briefing";
import { getActiveMissionTerm } from "@/lib/captainDelta/lessonContext";
import { DEFAULT_LESSON_CONTEXT } from "@/lib/captainDelta/types";

describe("active mission term sync", () => {
  it("buildActiveMissionTermLine uses the same word for vocabulary", () => {
    const line = buildActiveMissionTermLine("route", "vocabulary");
    expect(line.text).toContain('"route"');
    expect(line.speechText).toContain("route");
  });

  it("buildActiveMissionTermLine uses the same word for pronunciation", () => {
    const line = buildActiveMissionTermLine("route", "pronunciation");
    expect(line.text).toMatch(/direction|degrees|operational/i);
    expect(line.text).toContain("route");
    expect(line.speechText).toContain("route");
  });

  it("getActiveMissionTerm reads pronunciationWord from lesson context", () => {
    expect(getActiveMissionTerm({ ...DEFAULT_LESSON_CONTEXT, pronunciationWord: "route" })).toBe(
      "route",
    );
  });
});
