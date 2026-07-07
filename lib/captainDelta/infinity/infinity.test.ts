import { beforeEach, describe, expect, it } from "vitest";
import { classifyCaptainIntent } from "@/lib/captainDelta/infinity/intentEngine";
import {
  getCaptainLessonMemory,
  recordCoachingTurn,
  rememberCaptainLesson,
  resetCaptainLessonMemoryForTests,
} from "@/lib/captainDelta/infinity/lessonMemory";
import { passesInstructorQualityGate } from "@/lib/captainDelta/infinity/qualityGate";
import {
  buildCaptainTeachingResponse,
  pickTeachingStrategy,
} from "@/lib/captainDelta/infinity/teachingEngine";
import { respondAsCaptainInstructor } from "@/lib/captainDelta/infinity/respond";

const FORBIDDEN = /\b(Accuracy|Fluency|Completeness|Prosody|Score|Azure|Recognizer|SDK|Session|NoMatch|JSON)\b/i;

describe("Captain Delta Infinity — intent engine", () => {
  it("classifies stress, rhythm, and frustration intents", () => {
    expect(classifyCaptainIntent("How do I stress engine?").intent).toBe("stress_help");
    expect(classifyCaptainIntent("How do I keep better rhythm?").intent).toBe("rhythm_help");
    expect(classifyCaptainIntent("I'm stuck, this is too hard").intent).toBe("student_frustration");
    expect(classifyCaptainIntent("I'm nervous about the exam").intent).toBe("confidence");
  });

  it("classifies connected speech and consonant help", () => {
    expect(classifyCaptainIntent("How do I link the words?").intent).toBe("connected_speech");
    expect(classifyCaptainIntent("Help with the TH sound").intent).toBe("consonant_help");
  });

  it("returns unknown for ambiguous input", () => {
    expect(classifyCaptainIntent("hmm").intent).toBe("unknown");
  });
});

describe("Captain Delta Infinity — quality gate", () => {
  it("rejects technical and score-reading copy", () => {
    expect(passesInstructorQualityGate("Accuracy 83, Fluency 99.")).toBe(false);
    expect(passesInstructorQualityGate("The Azure recognizer failed.")).toBe(false);
    expect(
      passesInstructorQualityGate(
        "Good attempt. EN... gine... Now repeat the full sentence.",
      ),
    ).toBe(true);
  });
});

describe("Captain Delta Infinity — teaching engine", () => {
  beforeEach(() => {
    resetCaptainLessonMemoryForTests();
  });

  it("teaches engine stress like a helicopter instructor", () => {
    const memory = rememberCaptainLesson({
      currentWord: "engine",
      referenceText: "Check the engine before departure.",
      practiceLevel: 3,
    });
    const strategy = pickTeachingStrategy("stress_help", memory);
    const response = buildCaptainTeachingResponse("stress_help", memory, strategy);
    expect(response.message).toMatch(/Good question|engine/i);
    expect(response.message).toMatch(/EN.*gine|EN.*GINE/i);
    expect(response.message).not.toMatch(FORBIDDEN);
    expect(passesInstructorQualityGate(response.message)).toBe(true);
  });

  it("progressive help escalates on explain again", () => {
    let memory = rememberCaptainLesson({
      currentWord: "engine",
      referenceText: "Check the engine before departure.",
    });
    memory = recordCoachingTurn(
      memory,
      "stress_help",
      "First coaching line about EN-gine stress.",
      "stress_help:engine",
    );
    const strategy = pickTeachingStrategy("explain_again", memory);
    expect(strategy).toBe("progressive");
    const response = buildCaptainTeachingResponse("explain_again", memory, strategy);
    expect(response.message.toLowerCase()).toMatch(/different angle|another way|because/);
  });

  it("frustration coaching encourages and reduces difficulty", () => {
    const memory = rememberCaptainLesson({ currentWord: "engine" });
    const response = buildCaptainTeachingResponse(
      "student_frustration",
      memory,
      "encourage",
    );
    expect(response.message.toLowerCase()).toMatch(/slow down|tricky|quality before speed/);
    expect(response.message).not.toMatch(FORBIDDEN);
  });
});

describe("Captain Delta Infinity — respond orchestrator", () => {
  beforeEach(() => {
    resetCaptainLessonMemoryForTests();
  });

  it("engine pronunciation question follows teach-demo-retry loop", () => {
    const response = respondAsCaptainInstructor({
      question: "How do I stress engine?",
      currentWord: "engine",
      referenceText: "Check the engine before departure.",
    });
    expect(response.intent).toBe("stress_help");
    expect(response.message).toContain('"engine"');
    expect(response.message.toLowerCase()).toMatch(/full sentence|again/);
    expect(getCaptainLessonMemory()?.explainedTopics).toContain("stress_help:engine");
  });

  it("unknown intent asks one clarification question", () => {
    const response = respondAsCaptainInstructor({
      question: "hmm",
      currentWord: "engine",
    });
    expect(response.needsClarification).toBe(true);
    expect(response.message).toMatch(/pronunciation|meaning|sentence/i);
  });

  it("multi-turn explain again does not repeat verbatim", () => {
    respondAsCaptainInstructor({
      question: "How do I stress engine?",
      currentWord: "engine",
      referenceText: "Check the engine before departure.",
    });
    const second = respondAsCaptainInstructor({
      question: "Can you explain again?",
      currentWord: "engine",
      referenceText: "Check the engine before departure.",
    });
    expect(second.intent).toBe("explain_again");
    expect(second.message.toLowerCase()).toMatch(/different|another way|because/);
  });
});
