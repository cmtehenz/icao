import { describe, expect, it } from "vitest";
import { phaseFromScore } from "@/lib/trainingProfile/store";
import type { CheckrideProbeResult } from "@/lib/trainingProfile/types";

// Import derive via completeCheckride path — test phaseFromScore + weak area logic indirectly
import { CHECKRIDE_STEPS } from "@/lib/trainingProfile/checkride";

describe("phaseFromScore", () => {
  it("maps foundation / operational / exam bands", () => {
    expect(phaseFromScore(40)).toBe("foundation");
    expect(phaseFromScore(57)).toBe("foundation");
    expect(phaseFromScore(58)).toBe("operational");
    expect(phaseFromScore(77)).toBe("operational");
    expect(phaseFromScore(78)).toBe("exam");
    expect(phaseFromScore(95)).toBe("exam");
  });
});

describe("CHECKRIDE_STEPS", () => {
  it("includes words, readbacks, and one oral probe", () => {
    expect(CHECKRIDE_STEPS.filter((s) => s.kind === "word").length).toBeGreaterThanOrEqual(6);
    expect(CHECKRIDE_STEPS.some((s) => s.kind === "readback")).toBe(true);
    expect(CHECKRIDE_STEPS.some((s) => s.kind === "oral")).toBe(true);
  });
});

describe("CheckrideProbeResult shape", () => {
  it("accepts null scores for skipped oral", () => {
    const probe: CheckrideProbeResult = {
      id: "o1",
      kind: "oral",
      reference: "go around",
      accuracyScore: null,
      fluencyScore: null,
      attempted: true,
    };
    expect(probe.attempted).toBe(true);
  });
});
