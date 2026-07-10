import { describe, expect, it } from "vitest";
import { buildPart1MasterySummary, part1CardMastery } from "@/lib/part1Mastery/summary";

describe("part1 mastery", () => {
  it("tracks twelve SDEA questions", () => {
    const summary = buildPart1MasterySummary();
    expect(summary.total).toBe(12);
    expect(summary.cards).toHaveLength(12);
  });

  it("starts new cards as not exam ready", () => {
    expect(part1CardMastery("01").stage).toBe("new");
  });
});
