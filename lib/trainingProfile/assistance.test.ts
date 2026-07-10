import { describe, expect, it } from "vitest";
import {
  assistanceFromProfile,
  baseAssistanceForPhase,
  part1AssistanceDefaults,
  wordMissionAssistanceDefaults,
} from "@/lib/trainingProfile/assistance";
import type { StudentTrainingProfile } from "@/lib/trainingProfile/types";

function profile(overrides: Partial<StudentTrainingProfile>): StudentTrainingProfile {
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
    ...overrides,
  };
}

describe("assistanceFromProfile", () => {
  it("maps phase to base assistance ladder", () => {
    expect(baseAssistanceForPhase("foundation")).toBe("full");
    expect(baseAssistanceForPhase("operational")).toBe("keywords");
    expect(baseAssistanceForPhase("exam")).toBe("solo");
  });

  it("adds one scaffold step for weak structure or confidence", () => {
    const operational = assistanceFromProfile(
      profile({ phase: "operational", weakAreas: ["structure"] }),
    );
    expect(operational).toBe("blocks");

    const exam = assistanceFromProfile(
      profile({ phase: "exam", weakAreas: ["confidence"] }),
    );
    expect(exam).toBe("keywords");
  });

  it("foundation Part 1 shows full model scaffolding", () => {
    const p1 = part1AssistanceDefaults(assistanceFromProfile(profile({ phase: "foundation" })));
    expect(p1.showKeywords).toBe(true);
    expect(p1.hideModelAnswers).toBe(false);
    expect(p1.preferredTab).toBe("shadow");
  });

  it("exam solo hides model answers and speak prompts in Word Mission", () => {
    const wm = wordMissionAssistanceDefaults(assistanceFromProfile(profile({ phase: "exam" })));
    expect(wm.showSpeakText).toBe(false);
    expect(wm.expandRichPanels).toBe(false);
  });
});
