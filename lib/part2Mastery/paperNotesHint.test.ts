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

  it("shows Manaus readback only on listen — not fire/return codes", () => {
    const hint = paperNotesHintForStep(0, PART2_RECOMMENDED_NOTES["23C-s2"]);
    expect(hint.codes).toEqual(["RWY HDG", "↑3000", "FREQ 119.25"]);
    expect(hint.codes).not.toContain("FIRE");
    expect(hint.codes).not.toContain("NEG");
  });

  it("shows ATC follow-up on confirm step — not departure clearance", () => {
    const hint = paperNotesHintForStep(5, PART2_RECOMMENDED_NOTES["23C-s2"]);
    expect(hint.codes).toEqual(["↓FL050", "HD060", "NEG"]);
    expect(hint.codes).not.toContain("RWY HDG");
    expect(hint.codes).not.toContain("FREQ 119.25");
  });

  it("shows hold/confirm on Oakland confirm step", () => {
    const hint = paperNotesHintForStep(5, PART2_RECOMMENDED_NOTES["23C-s1"]);
    expect(hint.codes).toEqual(["HLD", "CFM"]);
  });

  it("shows full Bogota ground readback on listen step", () => {
    const hint = paperNotesHintForStep(0, PART2_RECOMMENDED_NOTES["23C-s3"]);
    expect(hint.codes).toEqual(["TAXI R F", "HOLD SHRT B", "RWY 31R", "FREQ 118.1"]);
    expect(hint.codes).not.toContain("CAB");
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

/** Per-situation expectations — listen / problem / confirm / reported speech steps. */
const ALL_SITUATION_HINTS: Record<
  string,
  { listen: string[]; problem: string[]; confirm: string[]; reported: string[] }
> = {
  "23C-s1": {
    listen: ["SQK IDENT", "RWY HDG", "↑5000", "EXPECT ↑6000"],
    problem: ["GEAR STK", "HLD", "CFM"],
    confirm: ["HLD", "CFM"],
    reported: ["GEAR STK", "HLD", "CFM"],
  },
  "23C-s2": {
    listen: ["RWY HDG", "↑3000", "FREQ 119.25"],
    problem: ["FIRE", "CAB", "RTN", "↓FL050", "HD060", "NEG"],
    confirm: ["↓FL050", "HD060", "NEG"],
    reported: ["FIRE", "CAB", "RTN", "↓FL050", "HD060", "NEG"],
  },
  "23C-s3": {
    listen: ["TAXI R F", "HOLD SHRT B", "RWY 31R", "FREQ 118.1"],
    problem: ["CAB", "RTN", "HLD", "SQK 7700", "↓15000", "DCT BOG", "NEG"],
    confirm: ["HLD", "SQK 7700", "↓15000", "DCT BOG", "NEG"],
    reported: ["CAB", "RTN", "HLD", "SQK 7700", "↓15000", "DCT BOG", "NEG"],
  },
  "23C-s4": {
    listen: ["HD190", "↓4000", "RPT 8000", "RWY 35R"],
    problem: ["BIRD", "HD LEFT 30", "NEG"],
    confirm: ["HD LEFT 30", "NEG"],
    reported: ["BIRD", "HD LEFT 30", "NEG"],
  },
  "23C-s5": {
    listen: ["↑5000", "SQK 3432", "DCT FLL", "FREQ 119.45"],
    problem: ["GPS X", "AFF", "CFM"],
    confirm: ["AFF", "CFM"],
    reported: ["GPS X", "AFF", "CFM"],
  },
  "24C-s1": {
    listen: ["HD010", "↓FL080", "SPD 120"],
    problem: ["LF", "LAND 15", "HD135", "ILS 27R", "VEC", "NEG"],
    confirm: ["HD135", "ILS 27R", "VEC", "NEG"],
    reported: ["LF", "LAND 15", "HD135", "ILS 27R", "VEC", "NEG"],
  },
  "24C-s2": {
    listen: ["↓FL060", "HD160", "HLD WHI"],
    problem: ["ENG", "EM LND", "DCT MAN", "RWY 05L", "NEG"],
    confirm: ["DCT MAN", "RWY 05L", "NEG"],
    reported: ["ENG", "EM LND", "DCT MAN", "RWY 05L", "NEG"],
  },
  "24C-s3": {
    listen: ["BACKTRACK", "RWY 24", "LUAW", "RPT READY"],
    problem: ["PAX↓", "MED", "VACATE C", "PKT 3", "AFF"],
    confirm: ["VACATE C", "PKT 3", "AFF"],
    reported: ["PAX↓", "MED", "VACATE C", "PKT 3", "AFF"],
  },
  "24C-s4": {
    listen: ["APP RWY 18", "CIRCL RWY 36", "RPT DOWNWIND"],
    problem: ["FOD", "MISSED APP", "HD LEFT", "AFF", "CFM"],
    confirm: ["HD LEFT", "AFF", "CFM"],
    reported: ["FOD", "MISSED APP", "HD LEFT", "AFF", "CFM"],
  },
  "24C-s5": {
    listen: ["TAXI G B A", "RWY 01R", "FREQ 118.85"],
    problem: ["DRONE", "HLD", "NEG"],
    confirm: ["HLD", "NEG"],
    reported: ["DRONE", "HLD", "NEG"],
  },
  "25C-s1": {
    listen: ["TAXI H D", "GATE 10", "CROSS RWY 17", "RPT VAC"],
    problem: ["COLLISION", "TOW", "NEG"],
    confirm: ["NEG"],
    reported: ["COLLISION", "TOW", "NEG"],
  },
  "25C-s2": {
    listen: ["↓FL140", "HD160", "HLD CG"],
    problem: ["HOT OIL", "ENG X", "EM LND", "DCT CG", "RWY 14", "AFF"],
    confirm: ["DCT CG", "RWY 14", "AFF"],
    reported: ["HOT OIL", "ENG X", "EM LND", "DCT CG", "RWY 14", "AFF"],
  },
  "25C-s3": {
    listen: ["↓5000", "HD270", "SPD 110"],
    problem: ["VEC", "HD100", "DIV", "NEG"],
    confirm: ["HD100", "DIV", "NEG"],
    reported: ["VEC", "HD100", "DIV", "NEG"],
  },
  "25C-s4": {
    listen: ["APP RWY 18", "CIRCL RWY 36", "RPT DOWNWIND"],
    problem: ["FOD", "MISSED APP", "HD LEFT", "GEAR STK", "NEG"],
    confirm: ["HD LEFT", "GEAR STK", "NEG"],
    reported: ["FOD", "MISSED APP", "HD LEFT", "GEAR STK", "NEG"],
  },
  "25C-s5": {
    listen: ["HD340", "↓5000", "RPT 9000", "ILS 17L"],
    problem: ["BIRD", "HD LEFT 20", "AFF"],
    confirm: ["HD LEFT 20", "AFF"],
    reported: ["BIRD", "HD LEFT 20", "AFF"],
  },
  "26C-s1": {
    listen: ["ARR", "↓4000", "RPT 6000", "QNH 1013", "BIRD"],
    problem: ["HYD↓", "↓2000", "SPD", "NEG"],
    confirm: ["↓2000", "SPD", "NEG"],
    reported: ["HYD↓", "↓2000", "SPD", "NEG"],
  },
  "26C-s2": {
    listen: ["BACKTRACK", "RWY 24", "LUAW", "RPT READY"],
    problem: ["PAX↓", "MED", "VACATE B", "HLD", "NEG"],
    confirm: ["VACATE B", "HLD", "NEG"],
    reported: ["PAX↓", "MED", "VACATE B", "HLD", "NEG"],
  },
  "26C-s3": {
    listen: ["VIS APP RWY 05", "↓5000"],
    problem: ["REQ 15L", "↓6000", "SPD 80", "AFF"],
    confirm: ["↓6000", "SPD 80", "AFF"],
    reported: ["REQ 15L", "↓6000", "SPD 80", "AFF"],
  },
  "26C-s4": {
    listen: ["↑5000", "SQK 3432", "DCT FLL", "FREQ 119.45"],
    problem: ["GPS X", "GPWS", "NEG"],
    confirm: ["GPWS", "NEG"],
    reported: ["GPS X", "GPWS", "NEG"],
  },
  "26C-s5": {
    listen: ["TAXI J B", "RWY 10", "FREQ 118.6"],
    problem: ["DOG", "HLD", "AFF"],
    confirm: ["HLD", "AFF"],
    reported: ["DOG", "HLD", "AFF"],
  },
};

describe("all 20 Part 2 situations — paper notes scopes", () => {
  const situationIds = Object.keys(PART2_RECOMMENDED_NOTES).sort();

  it("covers every curated situation", () => {
    expect(situationIds).toHaveLength(20);
    expect(Object.keys(ALL_SITUATION_HINTS).sort()).toEqual(situationIds);
  });

  it.each(situationIds)("%s has explicit readback scope", (id) => {
    expect(PART2_RECOMMENDED_NOTES[id]?.readback?.idealNotes.length).toBeGreaterThan(0);
  });

  it.each(situationIds)("%s paper hints match exam phases", (id) => {
    const notes = PART2_RECOMMENDED_NOTES[id]!;
    const expected = ALL_SITUATION_HINTS[id]!;

    expect(paperNotesHintForStep(0, notes).codes).toEqual(expected.listen);
    expect(paperNotesHintForStep(3, notes).codes).toEqual(expected.problem);
    expect(paperNotesHintForStep(5, notes).codes).toEqual(expected.confirm);
    expect(paperNotesHintForStep(7, notes).codes).toEqual(expected.reported);
  });

  it.each(situationIds)("%s confirm and reported steps exclude clearance readback", (id) => {
    const notes = PART2_RECOMMENDED_NOTES[id]!;
    const readback = notes.readback!.idealNotes;

    for (const step of [5, 7] as const) {
      const codes = paperNotesHintForStep(step, notes).codes;
      for (const code of codes) {
        expect(readback.some((rb) => codesMatch(rb, code))).toBe(false);
      }
    }
  });
});
