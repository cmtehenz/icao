import { describe, it, expect, beforeEach } from "vitest";
import {
  createConversation,
  processStudentAnswer,
  buildConversationMetrics,
  resolveQuestionContext,
} from "@/lib/humanExaminer/buildConversation";
import {
  extractMemoryPhrases,
  buildMemoryFollowUp,
  addStudentTurn,
  addExaminerTurn,
} from "@/lib/humanExaminer/conversationMemory";
import { selectFollowUp, FOLLOW_UP_PATTERNS } from "@/lib/humanExaminer/followUpEngine";
import { shouldStopConversation } from "@/lib/humanExaminer/conversationStop";
import {
  difficultyFromCard,
  maxFollowUpsForDifficulty,
} from "@/lib/humanExaminer/difficulty";
import {
  getProfileLimits,
  formatExaminerLine,
  DEFAULT_EXAMINER_PROFILE,
} from "@/lib/humanExaminer/examinerPersonality";
import { buildQuestionContext, getQuestionContext } from "@/lib/humanExaminer/questionContext";
import type { Card } from "@/lib/types";
import type { ConversationState, QuestionContext } from "@/lib/humanExaminer/types";

const SAMPLE_CARD: Card = {
  num: "1",
  question: "How do you brief passengers before flight?",
  answer: "I brief passengers on safety equipment and procedures.",
  memory: "PEEL structure",
  memoryLabels: ["briefing", "safety"],
  keywords: ["briefing", "passengers", "safety"],
  category: "helicopter",
  ideas: ["1 - Briefing: explain exits and harness"],
  opener: "Before every flight",
  example: "For example, I show the life vest location.",
  conclusion: "That keeps everyone prepared.",
  verbs: ["brief", "explain"],
  vocab: [],
  difficulty: "Medium",
  tags: [],
  targetWords: 80,
};

function sampleCtx(): QuestionContext {
  return buildQuestionContext(SAMPLE_CARD);
}

describe("questionContext", () => {
  it("builds metadata from card", () => {
    const ctx = buildQuestionContext(SAMPLE_CARD);
    expect(ctx.cardNum).toBe("1");
    expect(ctx.knowledgeDomain).toBe("Helicopter Operations");
    expect(ctx.keywords).toContain("briefing");
    expect(ctx.suggestedFollowUps.length).toBeGreaterThan(0);
    expect(ctx.difficulty).toBe(2);
    expect(ctx.graphRefs.length).toBeGreaterThan(0);
  });

  it("resolves context by card num", () => {
    const ctx = getQuestionContext("01");
    expect(ctx).not.toBeNull();
    expect(ctx?.question.length).toBeGreaterThan(0);
  });
});

describe("conversationMemory", () => {
  it("extracts negative habit phrases", () => {
    const phrases = extractMemoryPhrases("I don't usually brief passengers before takeoff.");
    expect(phrases.some((p) => p.includes("brief"))).toBe(true);
  });

  it("builds memory follow-up from prior answer", () => {
    const q = buildMemoryFollowUp(
      ["brief passengers"],
      "I don't usually brief passengers.",
      new Set(),
    );
    expect(q).toMatch(/brief passengers/i);
  });

  it("accumulates turns and memory", () => {
    let state = createConversation("1");
    state = addStudentTurn(state, "I don't usually brief passengers.", 55);
    expect(state.turns).toHaveLength(1);
    expect(state.memoryPhrases.length).toBeGreaterThan(0);
    state = addExaminerTurn(state, "Why not?", "clarification");
    expect(state.followUpCount).toBe(1);
    expect(state.usedCategories).toContain("clarification");
  });
});

describe("followUpEngine", () => {
  it("selects recovery for very low scores", () => {
    const state = createConversation("1");
    const ctx = sampleCtx();
    const { category } = selectFollowUp(ctx, state, "um", 30);
    expect(category).toBe("recovery");
  });

  it("does not repeat the same follow-up text", () => {
    const ctx = sampleCtx();
    let state = createConversation("1");
    const first = selectFollowUp(ctx, state, "I brief the crew before every flight.", 70);
    state = addExaminerTurn(state, first.question, first.category);
    const second = selectFollowUp(ctx, state, "We cover weather and fuel.", 72);
    expect(second.question.toLowerCase()).not.toBe(first.question.toLowerCase());
  });

  it("includes reusable patterns for each category", () => {
    expect(FOLLOW_UP_PATTERNS.clarification).toContain("Could you explain that?");
    expect(FOLLOW_UP_PATTERNS.recovery).toContain("Take your time.");
  });
});

describe("conversationStop", () => {
  it("stops at max follow-ups", () => {
    const ctx = sampleCtx();
    let state: ConversationState = {
      ...createConversation("1"),
      followUpCount: maxFollowUpsForDifficulty(ctx.difficulty, "neutral"),
    };
    const stop = shouldStopConversation(
      state,
      ctx,
      70,
      "A detailed operational answer with crew briefing and risk assessment included.",
      "neutral",
    );
    expect(stop.stop).toBe(true);
    expect(stop.reason).toBe("max_followups");
  });

  it("stops when student is repeatedly stuck", () => {
    const ctx = sampleCtx();
    const state: ConversationState = {
      ...createConversation("1"),
      recoveryCount: 3,
      followUpCount: 3,
    };
    const stop = shouldStopConversation(state, ctx, 35, "um", "supportive");
    expect(stop.stop).toBe(true);
    expect(stop.reason).toBe("student_stuck");
  });
});

describe("difficulty", () => {
  it("maps card difficulty to levels", () => {
    expect(difficultyFromCard({ ...SAMPLE_CARD, difficulty: "Easy" })).toBe(1);
    expect(difficultyFromCard(SAMPLE_CARD)).toBe(2);
    expect(difficultyFromCard({ ...SAMPLE_CARD, difficulty: "Hard" })).toBe(3);
  });

  it("increases follow-up budget for harder cards", () => {
    const easy = maxFollowUpsForDifficulty(1, "neutral");
    const hard = maxFollowUpsForDifficulty(3, "neutral");
    expect(hard).toBeGreaterThan(easy);
  });
});

describe("examinerPersonality", () => {
  it("limits follow-ups by profile", () => {
    expect(getProfileLimits("time_pressure").maxFollowUps).toBeLessThan(
      getProfileLimits("curious").maxFollowUps,
    );
  });

  it("applies tone prefix", () => {
    const line = formatExaminerLine("curious", "Tell me more.");
    expect(line).toMatch(/^Interesting\./);
  });

  it("defaults to neutral profile", () => {
    const state = createConversation("1");
    expect(state.profile).toBe(DEFAULT_EXAMINER_PROFILE);
  });
});

describe("buildConversation", () => {
  it("processes answer and returns examiner follow-up", () => {
    const ctx = sampleCtx();
    const state = createConversation("1");
    const result = processStudentAnswer(
      state,
      ctx,
      "I brief passengers on exits and life vests.",
      68,
    );
    expect(result.examinerLine).toBeTruthy();
    expect(result.state.followUpCount).toBe(1);
    expect(result.state.complete).toBe(false);
  });

  it("builds conversation metrics on completion", () => {
    const ctx = sampleCtx();
    let state = createConversation("1");
    state = addStudentTurn(state, "Full briefing with crew coordination and risk.", 85);
    state = addExaminerTurn(state, "Good.", undefined);
    state = { ...state, complete: true, followUpCount: 2 };
    const metrics = buildConversationMetrics(state, ctx);
    expect(metrics.conversationQuality).toBeGreaterThan(0);
    expect(metrics.priorityImprovement.length).toBeGreaterThan(10);
    expect(metrics.tomorrowFocus).toMatch(/Part 1/);
  });

  it("resolves question context for known cards", () => {
    expect(resolveQuestionContext("01")).not.toBeNull();
  });
});
