import { describe, expect, it } from "vitest";
import {
  buildCaptainAssessmentDebrief,
  captainFeedbackAfterAttempt,
} from "@/lib/pronunciationCoach";

describe("buildCaptainAssessmentDebrief", () => {
  it("includes scores and success coaching for a strong attempt", () => {
    const feedback = captainFeedbackAfterAttempt(
      {
        word: "complete",
        lowestAccuracy: 0,
        lastAccuracy: 100,
        errorType: "None",
        errorLabel: "",
        context: "",
        timesSeen: 1,
        practiceCount: 1,
        passCount: 1,
        returnCount: 0,
        lastSeenAt: new Date().toISOString(),
      },
      100,
      1,
      "practicing",
    );
    const debrief = buildCaptainAssessmentDebrief(
      {
        accuracyScore: 100,
        fluencyScore: 100,
        completenessScore: 100,
        prosodyScore: 90,
        recognizedText: "Complete.",
        words: [],
      },
      feedback,
      { missionPass: true },
    );
    expect(debrief.message).toContain("Accuracy 100");
    expect(debrief.message).toContain("Fluency 100");
    expect(debrief.message).toContain("Continue to the next word");
    expect(debrief.speechText).toBe(debrief.message);
  });
});
