import { describe, expect, it, beforeEach } from "vitest";
import {
  buildCaptainAssessmentDebrief,
  buildHumanCaptainFeedback,
  answerPronunciationCoachingQuestion,
  coachingCopyIsInstructorSafe,
  isPronunciationCoachingQuestion,
  resetPronunciationCoachSessionForTests,
  spokenFeedbackExcludesRawScores,
  youGlishQueryForLevel,
} from "@/lib/pronunciationCoach";
import {
  assessmentFailure,
  formatAssessmentFailureMessage,
  sanitizeStudentFacingError,
  studentSafeAssessmentMessage,
} from "@/lib/azure/assessmentFailure";

const baseAssessment = {
  prosodyScore: 88,
  completenessScore: 100,
  recognizedText: "The crew discussed critical on before departure.",
  words: [],
};

const METRIC_LABELS = /\b(Accuracy|Fluency|Completeness|Prosody)\b/i;
const FORBIDDEN = /\b(Azure|SDK|Recognizer|Callback|Session|NoMatch|JSON|Scores?)\b/i;

function expectInstructorLesson(debrief: { message: string; speechText: string }) {
  expect(coachingCopyIsInstructorSafe(debrief.message)).toBe(true);
  expect(coachingCopyIsInstructorSafe(debrief.speechText)).toBe(true);
  expect(debrief.message).not.toMatch(METRIC_LABELS);
  expect(debrief.message).not.toMatch(FORBIDDEN);
  expect(debrief.speechText).not.toMatch(METRIC_LABELS);
  expect(debrief.speechText).not.toMatch(FORBIDDEN);
  expect(debrief.message.toLowerCase()).toMatch(/good|nice|strong|almost|nearly/);
  expect(debrief.message.toLowerCase()).toMatch(/repeat|again|ready|sentence|say/);
}

describe("Pronunciation Coaching Engine v1", () => {
  const context = {
    targetWord: "on",
    practiceLevel: 3 as const,
    referenceText: "The crew discussed critical on before departure.",
  };

  it("keeps Azure metrics in technicalDetails only, never in coaching copy", () => {
    const debrief = buildCaptainAssessmentDebrief(
      { ...baseAssessment, accuracyScore: 83, fluencyScore: 99 },
      context,
    );
    expect(spokenFeedbackExcludesRawScores(debrief.message)).toBe(true);
    expect(spokenFeedbackExcludesRawScores(debrief.speechText)).toBe(true);
    expect(debrief.technicalDetails).toContain("Accuracy 83");
    expectInstructorLesson(debrief);
  });

  it("accuracy-low teaches vowel clarity with micro exercise", () => {
    const debrief = buildHumanCaptainFeedback(
      { ...baseAssessment, accuracyScore: 83, fluencyScore: 99 },
      context,
    );
    expect(debrief.focus).toBe("accuracy");
    expect(debrief.message).toContain('"on"');
    expect(debrief.message.toLowerCase()).toMatch(/vowel|sound|mouth|sharp|understood/);
    expect(debrief.message.toLowerCase()).toMatch(/full sentence/);
    expectInstructorLesson(debrief);
  });

  it("climb-like low accuracy sounds like a helicopter instructor", () => {
    const debrief = buildHumanCaptainFeedback(
      { ...baseAssessment, accuracyScore: 83, fluencyScore: 99, prosodyScore: 88 },
      {
        targetWord: "climb",
        practiceLevel: 3,
        referenceText: "Request clearance to climb to flight level three five zero.",
      },
    );
    expect(debrief.message).toMatch(/Good attempt/i);
    expect(debrief.message).toContain('"climb"');
    expect(debrief.message.toLowerCase()).toMatch(/understood/);
    expectInstructorLesson(debrief);
  });

  it("fluency-low teaches rhythm and connected speech", () => {
    const debrief = buildHumanCaptainFeedback(
      { ...baseAssessment, accuracyScore: 92, fluencyScore: 68, prosodyScore: 90 },
      { ...context, targetWord: "complete", referenceText: "Check the engine before flight." },
    );
    expect(debrief.focus).toBe("fluency");
    expect(debrief.message.toLowerCase()).toMatch(/breath|flow|pause|chopped|link/);
    expect(debrief.message.toLowerCase()).toMatch(/full sentence/);
    expectInstructorLesson(debrief);
  });

  it("prosody-low teaches stress with syllable drill", () => {
    const debrief = buildHumanCaptainFeedback(
      {
        ...baseAssessment,
        accuracyScore: 90,
        fluencyScore: 92,
        prosodyScore: 65,
        words: [{ word: "engine", accuracyScore: 72, errorType: "None" }],
      },
      {
        targetWord: "engine",
        practiceLevel: 3,
        referenceText: "Check the engine before departure.",
      },
    );
    expect(debrief.focus).toBe("prosody");
    expect(debrief.message).toContain('"engine"');
    expect(debrief.message.toLowerCase()).toMatch(/understood|natural|stress|syllable|energy/);
    expect(debrief.message).toMatch(/EN.*GINE|Listen carefully/i);
    expectInstructorLesson(debrief);
  });

  it("completeness-low asks for the full sentence in one breath", () => {
    const debrief = buildHumanCaptainFeedback(
      { ...baseAssessment, accuracyScore: 90, fluencyScore: 92, prosodyScore: 88, completenessScore: 72 },
      context,
    );
    expect(debrief.focus).toBe("completeness");
    expect(debrief.message.toLowerCase()).toMatch(/full sentence|before the end|every word|breath/);
    expectInstructorLesson(debrief);
  });

  it("strong result encourages and moves on", () => {
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
    expect(debrief.message).toContain('"complete"');
    expect(debrief.showYouGlish).toBe(false);
    expectInstructorLesson(debrief);
  });

  it("rejects forbidden instructor terms in guard", () => {
    expect(spokenFeedbackExcludesRawScores("Accuracy 83, Fluency 99.")).toBe(false);
    expect(spokenFeedbackExcludesRawScores("The Azure recognizer failed.")).toBe(false);
    expect(spokenFeedbackExcludesRawScores("NoMatch in the JSON session.")).toBe(false);
    expect(
      spokenFeedbackExcludesRawScores(
        'Good attempt. Listen carefully. EN... GINE... Now repeat the full sentence.',
      ),
    ).toBe(true);
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

describe("Ask Captain — pronunciation coaching questions", () => {
  beforeEach(() => {
    resetPronunciationCoachSessionForTests();
  });

  it("detects stress coaching questions", () => {
    expect(isPronunciationCoachingQuestion("How can I make stronger stress?")).toBe(true);
    expect(isPronunciationCoachingQuestion("try again")).toBe(false);
    expect(isPronunciationCoachingQuestion("complete")).toBe(false);
  });

  it("returns instructor stress answer with active word and syllable drill", () => {
    const answer = answerPronunciationCoachingQuestion(
      "How can I make stronger stress?",
      {
        targetWord: "engine",
        referenceText: "Check the engine before departure.",
      },
    );
    expect(answer.message).toMatch(/Good question/i);
    expect(answer.message).toContain('"engine"');
    expect(answer.message).toMatch(/EN.*GINE|Listen carefully/i);
    expect(answer.message.toLowerCase()).toMatch(/louder|longer|higher/);
    expect(answer.message.toLowerCase()).toMatch(/full sentence/);
    expect(coachingCopyIsInstructorSafe(answer.message)).toBe(true);
    expect(coachingCopyIsInstructorSafe(answer.speechText)).toBe(true);
  });

  it("uses last coach session when active word missing from context", () => {
    buildHumanCaptainFeedback(
      {
        accuracyScore: 90,
        fluencyScore: 92,
        prosodyScore: 65,
        completenessScore: 100,
        recognizedText: "Check the engine.",
        words: [],
      },
      {
        targetWord: "engine",
        practiceLevel: 3,
        referenceText: "Check the engine before departure.",
      },
    );
    const answer = answerPronunciationCoachingQuestion("How do I improve stress?");
    expect(answer.message).toContain('"engine"');
  });
});

describe("student-safe assessment errors", () => {
  it("maps drain timeout to student-safe message", () => {
    const msg = studentSafeAssessmentMessage(
      assessmentFailure("session_stopped_before_result"),
    );
    expect(msg).toContain("couldn't get a clear recording");
    expect(msg).not.toMatch(/drain timeout/i);
    expect(msg).not.toMatch(/session ended/i);
  });

  it("formatAssessmentFailureMessage hides technical details", () => {
    const msg = formatAssessmentFailureMessage(
      assessmentFailure("no_recognizer"),
    );
    expect(msg).not.toMatch(/no_recognizer|Recognizer was not active/i);
  });

  it("sanitizeStudentFacingError replaces Azure technical strings", () => {
    expect(
      sanitizeStudentFacingError(
        "Session ended before a final recognized result arrived (drain timeout).",
      ),
    ).toContain("couldn't get a clear recording");
  });
});
