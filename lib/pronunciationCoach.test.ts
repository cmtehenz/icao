import { describe, expect, it } from "vitest";
import {
  buildCaptainAssessmentDebrief,
  buildHumanCaptainFeedback,
  spokenFeedbackExcludesRawScores,
  youGlishQueryForLevel,
} from "@/lib/pronunciationCoach";

const baseAssessment = {
  prosodyScore: 88,
  completenessScore: 100,
  recognizedText: "The crew discussed critical on before departure.",
  words: [],
};

describe("human Captain pronunciation feedback", () => {
  const context = {
    targetWord: "on",
    practiceLevel: 3 as const,
    referenceText: "The crew discussed critical on before departure.",
  };

  it("does not include raw scores in Captain spoken feedback", () => {
    const debrief = buildCaptainAssessmentDebrief(
      { ...baseAssessment, accuracyScore: 83, fluencyScore: 99 },
      context,
    );
    expect(spokenFeedbackExcludesRawScores(debrief.message)).toBe(true);
    expect(spokenFeedbackExcludesRawScores(debrief.speechText)).toBe(true);
    expect(debrief.message).not.toMatch(/Accuracy\s+83/i);
    expect(debrief.message).not.toMatch(/Fluency\s+99/i);
    expect(debrief.technicalDetails).toContain("Accuracy 83");
  });

  it("accuracy-low feedback gives sound clarity advice with target word", () => {
    const debrief = buildHumanCaptainFeedback(
      { ...baseAssessment, accuracyScore: 83, fluencyScore: 99 },
      context,
    );
    expect(debrief.focus).toBe("accuracy");
    expect(debrief.focusLabel).toBe("word clarity");
    expect(debrief.message).toContain('"on"');
    expect(debrief.message.toLowerCase()).toMatch(/weak|clear|repeat/);
  });

  it("fluency-low feedback gives rhythm advice", () => {
    const debrief = buildHumanCaptainFeedback(
      { ...baseAssessment, accuracyScore: 92, fluencyScore: 68, prosodyScore: 90 },
      { ...context, targetWord: "complete", referenceText: "Complete the checklist." },
    );
    expect(debrief.focus).toBe("fluency");
    expect(debrief.focusLabel).toBe("fluency");
    expect(debrief.message.toLowerCase()).toMatch(/choppy|pause|flow/);
  });

  it("prosody-low feedback gives stress advice", () => {
    const debrief = buildHumanCaptainFeedback(
      { ...baseAssessment, accuracyScore: 90, fluencyScore: 92, prosodyScore: 65 },
      context,
    );
    expect(debrief.focus).toBe("prosody");
    expect(debrief.focusLabel).toBe("stress");
    expect(debrief.message.toLowerCase()).toMatch(/stress|flat|pressure/);
  });

  it("completeness-low feedback asks for full sentence", () => {
    const debrief = buildHumanCaptainFeedback(
      { ...baseAssessment, accuracyScore: 90, fluencyScore: 92, prosodyScore: 88, completenessScore: 72 },
      context,
    );
    expect(debrief.focus).toBe("completeness");
    expect(debrief.focusLabel).toBe("full sentence");
    expect(debrief.message.toLowerCase()).toMatch(/full sentence|every word/);
  });

  it("strong result gives positive continue message", () => {
    const debrief = buildCaptainAssessmentDebrief(
      {
        accuracyScore: 96,
        fluencyScore: 97,
        prosodyScore: 90,
        completenessScore: 100,
        recognizedText: "Complete.",
        words: [],
      },
      {
        targetWord: "complete",
        practiceLevel: 1,
        referenceText: "complete",
        missionPass: true,
      },
    );
    expect(debrief.focus).toBe("strong");
    expect(debrief.message.toLowerCase()).toMatch(/nice work|continue/);
    expect(debrief.showYouGlish).toBe(false);
  });

  it("YouGlish action uses target word for L1/L2", () => {
    expect(youGlishQueryForLevel("on", 1, "on")).toBe("on");
    expect(youGlishQueryForLevel("critical on", 2, "critical on")).toBe("critical on");
  });

  it("YouGlish action uses phrase for L3 when short enough", () => {
    const query = youGlishQueryForLevel(
      "on",
      3,
      "The crew discussed critical on before departure.",
    );
    expect(query.toLowerCase()).toContain("on");
    expect(query.split(/\s+/).length).toBeLessThanOrEqual(3);
  });
});
