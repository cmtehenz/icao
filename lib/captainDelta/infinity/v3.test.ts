import { beforeEach, describe, expect, it } from "vitest";
import { applyAdaptiveDebrief } from "@/lib/captainDelta/infinity/adaptiveDebrief";
import { planAdaptiveResponse } from "@/lib/captainDelta/infinity/adaptivePlan";
import { aviationHookForWord, aviationStoryForWord } from "@/lib/captainDelta/infinity/aviationCoach";
import { enhanceLessonWithAdaptivePlan } from "@/lib/captainDelta/infinity/adaptiveEnhance";
import {
  resetCaptainLessonMemoryForTests,
  rememberCaptainLesson,
  patchCaptainLessonMemory,
} from "@/lib/captainDelta/infinity/lessonMemory";
import { isGenericPraise, specificPraiseForSuccess } from "@/lib/captainDelta/infinity/praise";
import { captainSelfCheck } from "@/lib/captainDelta/infinity/selfCheck";
import { buildCaptainStudentModel } from "@/lib/captainDelta/infinity/studentModel";

describe("Captain Delta V3 — student model", () => {
  beforeEach(() => resetCaptainLessonMemoryForTests());

  it("detects low confidence when student is frustrated", () => {
    const memory = rememberCaptainLesson({
      currentWord: "engine",
      referenceText: "Check the engine.",
    });
    memory.frustrationSignals = 2;
    const model = buildCaptainStudentModel({ ...memory, frustrationSignals: 2 }, {}, "student_frustration");
    expect(model.confidence).toBe("low");
    expect(model.primaryNeed).toBe("confidence");
  });

  it("increases challenge when word is mastered", () => {
    const memory = rememberCaptainLesson({ currentWord: "climb" });
    const model = buildCaptainStudentModel(
      { ...memory, successesToday: 2 },
      { wordMastered: true, lastAttemptSucceeded: true },
    );
    expect(model.primaryNeed).toBe("challenge");
  });
});

describe("Captain Delta V3 — adaptive plan", () => {
  beforeEach(() => resetCaptainLessonMemoryForTests());

  it("plans syllable-level lesson when student repeats same mistake", () => {
    const memory = rememberCaptainLesson({ currentWord: "engine", lastMistake: "prosody" });
    const model = buildCaptainStudentModel(
      { ...memory, consecutiveSameMistake: 2 },
      { consecutiveSameFocus: 2 },
    );
    const plan = planAdaptiveResponse(model, { ...memory, consecutiveSameMistake: 2 }, "stress_help");
    expect(plan.smallestLesson).toBe("syllable");
    expect(plan.activeIntervention).toMatch(/stop for a second/i);
  });

  it("plans micro challenge when student succeeds easily", () => {
    const memory = rememberCaptainLesson({ currentWord: "climb", practiceLevel: 3 });
    const model = buildCaptainStudentModel(
      { ...memory, successesToday: 2 },
      { lastAttemptSucceeded: true, wordMastered: true },
    );
    const plan = planAdaptiveResponse(model, { ...memory, successesToday: 2 }, "pronunciation_question");
    expect(plan.microChallenge).toMatch(/Tower|faster/i);
  });
});

describe("Captain Delta V3 — praise and aviation", () => {
  it("rejects generic praise", () => {
    expect(isGenericPraise("Good job.")).toBe(true);
    expect(isGenericPraise("Nice — your rhythm improved a lot.")).toBe(false);
  });

  it("connects climb to tower clearance", () => {
    expect(aviationHookForWord("climb")).toMatch(/Tower|Climb and maintain/i);
    expect(aviationStoryForWord("climb")).toMatch(/native pilots/i);
  });

  it("specific praise mentions the improvement", () => {
    const praise = specificPraiseForSuccess(
      buildCaptainStudentModel(rememberCaptainLesson({ currentWord: "engine" }), {
        lastAttemptSucceeded: true,
      }),
      "engine",
      { focus: "rhythm" },
    );
    expect(praise.toLowerCase()).toMatch(/rhythm|flow/);
    expect(praise).toContain('"engine"');
  });
});

describe("Captain Delta V3 — self check", () => {
  it("rewrites lecture-like copy", () => {
    const result = captainSelfCheck(
      "Furthermore, it is important to note that the definition of climb refers to vertical movement.",
      "Furthermore, it is important to note.",
      "Say climb once slowly, then in a clearance line.",
    );
    expect(result.rewritten).toBe(true);
    expect(result.message).toContain("climb");
  });
});

describe("Captain Delta V3 — adaptive debrief", () => {
  beforeEach(() => resetCaptainLessonMemoryForTests());

  it("adds specific praise on strong attempts", () => {
    const result = applyAdaptiveDebrief(
      {
        message: "Nice work. Continue to the next word when you're ready.",
        speechText: "Nice work.",
      },
      {
        targetWord: "complete",
        referenceText: "complete",
        practiceLevel: 1,
        focus: "strong",
        missionPass: true,
      },
    );
    expect(result.message.toLowerCase()).toMatch(/nice|clear|solid|strong/);
    expect(result.message).not.toMatch(/Accuracy|Azure/i);
  });

  it("interrupts repeated same pronunciation habit", () => {
    rememberCaptainLesson({ currentWord: "engine", lastMistake: "prosody" });
    patchCaptainLessonMemory({ consecutiveSameMistake: 2 });

    const result = applyAdaptiveDebrief(
      {
        message: "Good attempt. Let's clean up the sound in \"engine\".",
        speechText: "Good attempt.",
      },
      {
        targetWord: "engine",
        referenceText: "Check the engine.",
        practiceLevel: 3,
        focus: "prosody",
        assessment: { accuracyScore: 72, fluencyScore: 90, prosodyScore: 60, completenessScore: 100, words: [] },
      },
    );
    expect(result.message).toMatch(/stop for a second/i);
    expect(result.message).toMatch(/isolate just one sound/i);
  });
});

describe("Captain Delta V3 — lesson enhancement", () => {
  beforeEach(() => resetCaptainLessonMemoryForTests());

  it("rotates opener when topic was already explained", () => {
    const memory = rememberCaptainLesson({ currentWord: "climb", referenceText: "Climb to three thousand." });
    memory.turnCount = 2;
    memory.explainedTopics = ["stress_help:climb"];
    const plan = {
      ...planAdaptiveResponse(
        buildCaptainStudentModel(memory),
        memory,
        "explain_again",
      ),
      useAviationHook: true,
    };
    const lesson = enhanceLessonWithAdaptivePlan(
      {
        positive: "Good question.",
        focus: "Stress the first syllable.",
        teach: "Make CLIMB stronger.",
        exercise: "",
        repeat: "Try again.",
      },
      memory,
      plan,
      "climb",
    );
    expect(lesson.positive).toMatch(/another way|one step|Right/i);
    expect(lesson.teach).toMatch(/Tower|Climb and maintain/i);
  });
});
