import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("Ask Captain pronunciation routing", () => {
  it("CaptainDeltaProvider routes coaching questions locally on pronunciation", () => {
    const src = readFileSync(
      join(process.cwd(), "components/CaptainDelta/CaptainDeltaProvider.tsx"),
      "utf8",
    );
    expect(src).toMatch(/isPronunciationCoachingQuestion\(question\)/);
    expect(src).toMatch(/answerPronunciationCoachingQuestion/);
    expect(src).toMatch(
      /routeContext === "pronunciation"[\s\S]*isPronunciationCoachingQuestion/,
    );
  });

  it("recording controller uses student-safe assessment speechText", () => {
    const src = readFileSync(
      join(process.cwd(), "hooks/usePronunciationRecordingController.ts"),
      "utf8",
    );
    expect(src).toMatch(/studentSafeAssessmentMessage/);
    expect(src).not.toMatch(/speechText:\s*failure\?\.userMessage/);
  });
});
