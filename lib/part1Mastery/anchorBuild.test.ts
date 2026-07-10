import { describe, expect, it } from "vitest";
import { CARDS } from "@/lib/cards";
import {
  anchorBuildActivityKey,
  getAnchorBuildSteps,
  getStoryConnectSections,
} from "@/lib/part1Mastery/anchorBuild";

describe("anchorBuild", () => {
  const card = CARDS.find((c) => c.num === "01")!;

  it("builds four short anchor steps from level4Steps", () => {
    const steps = getAnchorBuildSteps(card);
    expect(steps).toHaveLength(4);
    expect(steps[0]?.label).toBe("Clear");
    expect(steps[0]?.starter.length).toBeLessThan(steps[0]?.hint.length);
  });

  it("uses stable activity keys for daily progress", () => {
    expect(anchorBuildActivityKey("1", 0)).toBe("01:build-0");
  });

  it("maps story connect sections from anchors", () => {
    const sections = getStoryConnectSections(card, card.keywords ?? []);
    expect(sections).toHaveLength(4);
    expect(sections[1]?.connector).toContain("First");
  });
});
