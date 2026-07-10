import { describe, expect, it } from "vitest";
import { getAdaptiveDailyPlan } from "@/lib/trainingProfile/adaptivePlan";
import type { StudentTrainingProfile } from "@/lib/trainingProfile/types";

function profile(partial: Partial<StudentTrainingProfile>): StudentTrainingProfile {
  return {
    version: 1,
    checkrideStatus: "completed",
    phase: "foundation",
    completedAt: null,
    skippedAt: null,
    estimatedScore: 50,
    weakAreas: [],
    focusSounds: [],
    probeResults: [],
    nextCheckrideAt: null,
    ...partial,
  };
}

describe("getAdaptiveDailyPlan", () => {
  it("foundation: lighter Word Mission + pronunciation first", () => {
    const plan = getAdaptiveDailyPlan(profile({ phase: "foundation" }));
    expect(plan.wordMissionTermCount).toBe(2);
    expect(plan.pronunciationFirst).toBe(true);
    expect(plan.preferFoundationTerms).toBe(true);
  });

  it("operational: three terms; pronunciation only if weak", () => {
    const calm = getAdaptiveDailyPlan(profile({ phase: "operational", weakAreas: [] }));
    expect(calm.wordMissionTermCount).toBe(3);
    expect(calm.pronunciationFirst).toBe(false);

    const weak = getAdaptiveDailyPlan(
      profile({ phase: "operational", weakAreas: ["pronunciation"] }),
    );
    expect(weak.pronunciationFirst).toBe(true);
  });

  it("exam: full four-term load", () => {
    const plan = getAdaptiveDailyPlan(profile({ phase: "exam", weakAreas: [] }));
    expect(plan.wordMissionTermCount).toBe(4);
    expect(plan.pronunciationFirst).toBe(false);
  });
});
