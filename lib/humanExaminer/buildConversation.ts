import type {
  ConversationMetrics,
  ConversationState,
  ExaminerProfile,
  QuestionContext,
} from "@/lib/humanExaminer/types";
import {
  DEFAULT_EXAMINER_PROFILE,
  formatExaminerLine,
} from "@/lib/humanExaminer/examinerPersonality";
import { getQuestionContext } from "@/lib/humanExaminer/questionContext";
import { selectFollowUp } from "@/lib/humanExaminer/followUpEngine";
import { addExaminerTurn, addStudentTurn } from "@/lib/humanExaminer/conversationMemory";
import { shouldStopConversation } from "@/lib/humanExaminer/conversationStop";

export function createConversation(
  cardNum: string,
  profile: ExaminerProfile = DEFAULT_EXAMINER_PROFILE,
): ConversationState {
  return {
    cardNum,
    profile,
    turns: [],
    followUpCount: 0,
    usedCategories: [],
    recoveryCount: 0,
    memoryPhrases: [],
    complete: false,
  };
}

export type ProcessAnswerResult = {
  state: ConversationState;
  examinerLine?: string;
  metrics?: ConversationMetrics;
};

export function processStudentAnswer(
  state: ConversationState,
  ctx: QuestionContext,
  transcript: string,
  score: number,
): ProcessAnswerResult {
  let next = addStudentTurn(state, transcript, score);

  const stop = shouldStopConversation(next, ctx, score, transcript, next.profile);
  if (stop.stop) {
    next = {
      ...next,
      complete: true,
      closingMessage: stop.closingMessage,
    };
    if (stop.closingMessage) {
      next = addExaminerTurn(next, stop.closingMessage, undefined);
    }
    return {
      state: next,
      examinerLine: stop.closingMessage,
      metrics: buildConversationMetrics(next, ctx),
    };
  }

  const followUp = selectFollowUp(ctx, next, transcript, score);
  const line = formatExaminerLine(next.profile, followUp.question);
  next = addExaminerTurn(next, line, followUp.category);

  return { state: next, examinerLine: line };
}

export function buildConversationMetrics(
  state: ConversationState,
  ctx: QuestionContext,
): ConversationMetrics {
  const studentTurns = state.turns.filter((t) => t.role === "student");
  const scores = studentTurns.map((t) => t.score ?? 0);
  const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const followUpTurns = state.turns.filter((t) => t.role === "examiner" && t.category);
  const recoveryRatio =
    state.followUpCount > 0 ? state.recoveryCount / state.followUpCount : 0;

  const conversationQuality = Math.round(
    Math.min(100, avg * 0.6 + studentTurns.length * 8 + state.followUpCount * 5),
  );
  const followUpHandling = Math.round(
    Math.min(100, avg * 0.7 + (state.followUpCount > 0 ? 20 : 0) - recoveryRatio * 30),
  );
  const naturalness = Math.round(
    Math.min(100, 50 + studentTurns.length * 10 + Math.min(state.memoryPhrases.length * 5, 25)),
  );
  const operationalReasoning = Math.round(
    Math.min(
      100,
      avg * 0.5 +
        (studentTurns.some((t) =>
          /\b(brief|crew|procedure|risk|safety|weather|fuel)\b/i.test(t.text),
        )
          ? 25
          : 0),
    ),
  );
  const confidence = Math.round(Math.min(100, avg * 0.8 + (recoveryRatio < 0.3 ? 15 : -10)));

  const weak =
    followUpHandling < conversationQuality
      ? "practice responding to examiner follow-ups without hesitation"
      : operationalReasoning < 60
        ? "link answers to operational risk and crew briefing"
        : naturalness < 60
          ? "extend answers with examples from your own flights"
          : "maintain clear structure when the examiner probes deeper";

  return {
    conversationQuality,
    followUpHandling,
    naturalness,
    operationalReasoning,
    confidence,
    priorityImprovement: weak,
    tomorrowFocus: `Part 1 · ${ctx.operationalTopic} — ${weak}`,
  };
}

export function resolveQuestionContext(cardNum: string): QuestionContext | null {
  return getQuestionContext(cardNum);
}
