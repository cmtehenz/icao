import { describe, expect, it, beforeEach } from "vitest";
import {
  answerPronunciationCoachingQuestion,
  answerPronunciationStudentQuestion,
  buildCaptainAssessmentDebrief,
  buildHumanCaptainFeedback,
  classifyPronunciationStudentIntent,
  coachingCopyIsInstructorSafe,
  isPronunciationCoachingQuestion,
  isPronunciationStudentQuestion,
  resetPronunciationCoachSessionForTests,
  spokenFeedbackExcludesRawScores,
  youGlishQueryForLevel,
} from "@/lib/pronunciationCoach";
import {
  assessmentFailure,
  formatAssessmentFailureMessage,
  sanitizeStudentFacingError,
  STUDENT_SAFE_NO_SPEECH,
  studentSafeAssessmentMessage,
} from "@/lib/azure/assessmentFailure";
import { resetCaptainLessonMemoryForTests } from "@/lib/captainDelta/infinity/lessonMemory";

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
  beforeEach(() => {
    resetPronunciationCoachSessionForTests();
  });

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

describe("Ask Captain — pronunciation V2", () => {
  beforeEach(() => {
    resetPronunciationCoachSessionForTests();
  });

  it("classifies stress help intent", () => {
    expect(classifyPronunciationStudentIntent("How can I make stronger stress?")).toBe(
      "stress_help",
    );
  });

  it("classifies rhythm and sentence explanation intents", () => {
    expect(classifyPronunciationStudentIntent("How do I keep better rhythm?")).toBe(
      "rhythm_help",
    );
    expect(
      classifyPronunciationStudentIntent("What does this sentence mean?"),
    ).toBe("sentence_explanation");
  });

  it("classifies ICAO answer help", () => {
    expect(classifyPronunciationStudentIntent("How should I answer in ICAO?")).toBe(
      "icao_answer_help",
    );
  });

  it("detects student questions but not record commands", () => {
    expect(isPronunciationStudentQuestion("How can I make stronger stress?")).toBe(true);
    expect(isPronunciationCoachingQuestion("How can I make stronger stress?")).toBe(true);
    expect(isPronunciationStudentQuestion("try again")).toBe(false);
  });

  it("returns instructor stress answer with active word and syllable breakdown", () => {
    const { message, speechText, intent } = answerPronunciationStudentQuestion(
      "How can I make stronger stress?",
      "stress_help",
      {
        targetWord: "engine",
        referenceText: "Check the engine before departure.",
      },
    );
    expect(intent).toBe("stress_help");
    expect(message).toMatch(/Good question/i);
    expect(message).toContain('"engine"');
    expect(message).toMatch(/EN.*gine|EN.*GINE/i);
    expect(message.toLowerCase()).toMatch(/stronger|longer|higher/);
    expect(message.toLowerCase()).toMatch(/full sentence/);
    expect(coachingCopyIsInstructorSafe(message)).toBe(true);
    expect(coachingCopyIsInstructorSafe(speechText)).toBe(true);
  });

  it("rhythm question returns linked phrase coaching", () => {
    const { message, intent } = answerPronunciationStudentQuestion(
      "How do I improve rhythm?",
      "rhythm_help",
      {
        targetWord: "engine",
        referenceText: "Check the engine before departure.",
      },
    );
    expect(intent).toBe("rhythm_help");
    expect(message.toLowerCase()).toMatch(/one breath|link/);
    expect(message).toMatch(/check.*engine/i);
  });

  it("sentence explanation uses reference text", () => {
    const { message } = answerPronunciationStudentQuestion(
      "What does this sentence mean?",
      "sentence_explanation",
      {
        targetWord: "engine",
        referenceText: "Check the engine before departure.",
      },
    );
    expect(message).toContain("Check the engine before departure.");
    expect(message.toLowerCase()).toMatch(/operational|briefing/);
  });

  it("ICAO answer help gives short model guidance", () => {
    const { message } = answerPronunciationStudentQuestion(
      "How should I answer in ICAO?",
      "icao_answer_help",
      {
        targetWord: "engine",
        referenceText: "Check the engine before departure.",
      },
    );
    expect(message.toLowerCase()).toMatch(/icao|level 4|short/);
    expect(message).toContain("Check the engine before departure.");
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
    const { message } = answerPronunciationCoachingQuestion("How do I improve stress?");
    expect(message).toContain('"engine"');
  });

  it("technical recording error input returns safe coaching not Azure text", () => {
    const { message } = answerPronunciationStudentQuestion(
      "Session ended before a final recognized result arrived drain timeout",
      "technical_recording_error",
    );
    expect(message).toContain("couldn't get a clear recording");
    expect(message).not.toMatch(/drain timeout/i);
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

  it("maps no speech to dedicated student message", () => {
    const msg = studentSafeAssessmentMessage(assessmentFailure("recognition_no_match"));
    expect(msg).toBe(STUDENT_SAFE_NO_SPEECH);
  });

  it("formatAssessmentFailureMessage hides technical details", () => {
    const msg = formatAssessmentFailureMessage(assessmentFailure("no_recognizer"));
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
