import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("Ask Captain pronunciation routing", () => {
  it("CaptainDeltaProvider routes student questions locally on pronunciation", () => {
    const src = readFileSync(
      join(process.cwd(), "components/CaptainDelta/CaptainDeltaProvider.tsx"),
      "utf8",
    );
    expect(src).toMatch(/isPronunciationStudentQuestion\(question\)/);
    expect(src).toMatch(/answerPronunciationStudentQuestion/);
    expect(src).toMatch(/classifyPronunciationStudentIntent/);
    expect(src).toMatch(/emitClearPronunciationRecordError/);
    expect(src).toMatch(/source: "pronunciation-ask"/);
    expect(src).not.toMatch(/fetch\("\/api\/captain-delta"[\s\S]*isPronunciationStudentQuestion/);
  });

  it("recording controller uses student-safe assessment speechText", () => {
    const src = readFileSync(
      join(process.cwd(), "hooks/usePronunciationRecordingController.ts"),
      "utf8",
    );
    expect(src).toMatch(/studentSafeAssessmentMessage/);
    expect(src).toMatch(/CAPTAIN_DELTA_CLEAR_PRONUNCIATION_ERROR/);
    expect(src).not.toMatch(/speechText:\s*failure\?\.userMessage/);
  });
});
