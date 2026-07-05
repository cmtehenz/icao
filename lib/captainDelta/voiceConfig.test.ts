import { describe, expect, it } from "vitest";
import { buildPart2StepCoaching } from "@/lib/captainDelta/part2StepCoaching";
import { isCaptainDeltaVoiceEnabled } from "@/lib/captainDelta/voiceConfig";

describe("captain voice config", () => {
  it("defaults voice enabled when env unset", () => {
    expect(isCaptainDeltaVoiceEnabled()).toBe(true);
  });
});

describe("part2 step coaching", () => {
  it("returns encouraging line for strong scores", () => {
    const line = buildPart2StepCoaching(
      {
        scores: { overall: 80, structure: 80, content: 80, phraseology: 80, pronunciation: 80 },
        transcript: "Roger.",
        summary: "Good",
        strengths: [],
        improvements: [],
        missingKeywords: [],
        source: "local",
        icaoLevel: { overall: 5, criteria: {} as never },
      },
      "Your readback",
    );
    expect(line.text).toMatch(/Good your readback/i);
  });
});
