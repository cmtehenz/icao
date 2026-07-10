import { describe, expect, it } from "vitest";
import {
  codesMatch,
  paperNotesHintForStep,
  pickCodesInIdealOrder,
} from "@/lib/part2Mastery/paperNotesHint";
import { PART2_RECOMMENDED_NOTES } from "@/data/exams/part2RecommendedNotes";

const notes = {
  idealNotes: ["↑5000", "GEAR STK", "HLD", "CFM"],
  requiredCodes: ["↑5000", "GEAR STK", "HLD", "CFM"],
  readback: {
    idealNotes: ["SQK IDENT", "RWY HDG", "↑5000", "EXPECT ↑6000"],
    requiredCodes: ["↑5000", "RWY HDG"],
    optionalCodes: ["SQK IDENT", "EXPECT ↑6000"],
  },
};

describe("pickCodesInIdealOrder", () => {
  it("follows idealNotes order, not required-then-optional", () => {
    const ordered = pickCodesInIdealOrder(
      notes.readback!.idealNotes,
      notes.readback!.requiredCodes,
      notes.readback!.optionalCodes,
    );
    expect(ordered).toEqual(["SQK IDENT", "RWY HDG", "↑5000", "EXPECT ↑6000"]);
  });
});

describe("paperNotesHintForStep", () => {
  it("uses readback idealNotes in clearance order on listen step", () => {
    const hint = paperNotesHintForStep(0, notes);
    expect(hint.phase).toBe("readback");
    expect(hint.codes).toEqual(["SQK IDENT", "RWY HDG", "↑5000", "EXPECT ↑6000"]);
  });

  it("matches 23C-s1 curated order from exam data", () => {
    const hint = paperNotesHintForStep(0, PART2_RECOMMENDED_NOTES["23C-s1"]);
    expect(hint.codes).toEqual(["SQK IDENT", "RWY HDG", "↑5000", "EXPECT ↑6000"]);
  });

  it("uses problem segment order after readback", () => {
    const hint = paperNotesHintForStep(3, PART2_RECOMMENDED_NOTES["23C-s1"]);
    expect(hint.codes).toEqual(["GEAR STK", "HLD", "CFM"]);
  });

  it("shows no codes on examiner question step — paper already filled", () => {
    const hint = paperNotesHintForStep(6, PART2_RECOMMENDED_NOTES["23C-s1"]);
    expect(hint.phase).toBe("reported");
    expect(hint.codes).toEqual([]);
    expect(hint.captainLine).toMatch(/already wrote notes/i);
  });

  it("excludes clearance codes on reported speech step", () => {
    const hint = paperNotesHintForStep(7, PART2_RECOMMENDED_NOTES["23C-s1"]);
    expect(hint.codes).toEqual(["GEAR STK", "HLD", "CFM"]);
    expect(hint.codes).not.toContain("SQK IDENT");
    expect(hint.codes).not.toContain("RWY HDG");
  });

  it("returns generic guidance when notes are missing", () => {
    const hint = paperNotesHintForStep(0);
    expect(hint.codes).toEqual([]);
    expect(hint.captainLine).toMatch(/paper and pen/i);
  });
});

describe("codesMatch", () => {
  it("matches shorthand pool codes to full ideal notes", () => {
    expect(codesMatch("FREQ 119.25", "FREQ")).toBe(true);
    expect(codesMatch("RWY HDG", "RWY HDG")).toBe(true);
  });
});
