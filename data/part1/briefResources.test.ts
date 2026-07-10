import { describe, expect, it } from "vitest";
import { assertPart1BriefResourcesComplete, getPart1BriefPack } from "./briefResources";

describe("Part 1 brief resources", () => {
  it("covers all 12 SDEA cards with media and lead copy", () => {
    expect(() => assertPart1BriefResourcesComplete()).not.toThrow();
  });

  it("returns card #02 weather/decision pack", () => {
    const pack = getPart1BriefPack("02");
    expect(pack.videos.length).toBeGreaterThan(0);
    expect(pack.links.some((l) => l.href.includes("decision-making"))).toBe(true);
    expect(pack.lead.toLowerCase()).toContain("story");
  });
});
