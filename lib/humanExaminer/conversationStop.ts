import type {
  ConversationState,
  ConversationStopReason,
  ExaminerProfile,
} from "@/lib/humanExaminer/types";
import type { QuestionContext } from "@/lib/humanExaminer/types";
import {
  maxFollowUpsForDifficulty,
  scoreThresholdForDifficulty,
} from "@/lib/humanExaminer/difficulty";
import { getProfileLimits } from "@/lib/humanExaminer/examinerPersonality";

export type StopDecision = {
  stop: boolean;
  reason?: ConversationStopReason;
  closingMessage?: string;
};

const CLOSINGS: Record<ConversationStopReason, string> = {
  objective_met: "Thank you. That covers this topic well. Let's move to the next question.",
  max_followups: "Thank you. Let's move to the next question.",
  sufficient_answer: "Good. I think we have enough on this. Let's move to the next question.",
  student_stuck: "That's alright. Let's move on to the next question.",
};

export function shouldStopConversation(
  state: ConversationState,
  ctx: QuestionContext,
  lastScore: number,
  lastTranscript: string,
  profile: ExaminerProfile,
): StopDecision {
  const maxFollowUps = maxFollowUpsForDifficulty(ctx.difficulty, profile);
  const threshold = scoreThresholdForDifficulty(ctx.difficulty);
  const wordCount = lastTranscript.trim().split(/\s+/).filter(Boolean).length;

  if (state.recoveryCount >= 3 && lastScore < 40) {
    return {
      stop: true,
      reason: "student_stuck",
      closingMessage: CLOSINGS.student_stuck,
    };
  }

  if (state.followUpCount >= maxFollowUps) {
    return {
      stop: true,
      reason: "max_followups",
      closingMessage: CLOSINGS.max_followups,
    };
  }

  const studentTurns = state.turns.filter((t) => t.role === "student");
  const avgScore =
    studentTurns.length > 0
      ? studentTurns.reduce((s, t) => s + (t.score ?? 0), 0) / studentTurns.length
      : 0;

  if (
    studentTurns.length >= 2 &&
    avgScore >= threshold + 10 &&
    lastScore >= threshold
  ) {
    return {
      stop: true,
      reason: "objective_met",
      closingMessage: CLOSINGS.objective_met,
    };
  }

  if (
    state.followUpCount >= 2 &&
    lastScore >= threshold + 5 &&
    wordCount >= 25
  ) {
    return {
      stop: true,
      reason: "sufficient_answer",
      closingMessage: CLOSINGS.sufficient_answer,
    };
  }

  const limits = getProfileLimits(profile);
  if (
    profile === "time_pressure" &&
    state.followUpCount >= 1 &&
    lastScore >= threshold - 5
  ) {
    return {
      stop: true,
      reason: "sufficient_answer",
      closingMessage: "Right. Let's move to the next question.",
    };
  }

  if (!limits.recoveryFriendly && state.recoveryCount >= 1 && lastScore < 50) {
    return {
      stop: true,
      reason: "student_stuck",
      closingMessage: CLOSINGS.student_stuck,
    };
  }

  return { stop: false };
}
