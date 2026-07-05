import { processStudentAnswer, buildConversationMetrics } from "@/lib/humanExaminer/buildConversation";
import type { ConversationState, QuestionContext } from "@/lib/humanExaminer/types";
import type { ProcessAnswerResult } from "@/lib/humanExaminer/buildConversation";
import { examinerRecoveryLine } from "@/lib/aiPresence/conversationPresence";
import { formatExaminerLine } from "@/lib/humanExaminer/examinerPersonality";
import { addExaminerTurn, addStudentTurn } from "@/lib/humanExaminer/conversationMemory";
import { shouldStopConversation } from "@/lib/humanExaminer/conversationStop";

/** Safe HEX answer processing with graceful recovery (Sprint 6.1). */
export function processHexAnswerSafe(
  state: ConversationState,
  ctx: QuestionContext,
  transcript: string,
  score: number,
): ProcessAnswerResult {
  try {
    const result = processStudentAnswer(state, ctx, transcript, score);
    if (result.examinerLine) return result;
    return buildRecoveryResult(state, ctx, transcript, score);
  } catch {
    return buildRecoveryResult(state, ctx, transcript, score);
  }
}

function buildRecoveryResult(
  state: ConversationState,
  ctx: QuestionContext,
  transcript: string,
  score: number,
): ProcessAnswerResult {
  let next = addStudentTurn(state, transcript, score);
  const stop = shouldStopConversation(next, ctx, score, transcript, next.profile);
  const recoveryLine = formatExaminerLine(next.profile, examinerRecoveryLine());

  if (stop.stop) {
    next = {
      ...next,
      complete: true,
      closingMessage: stop.closingMessage ?? recoveryLine,
    };
    if (next.closingMessage) {
      next = addExaminerTurn(next, next.closingMessage, undefined);
    }
    return {
      state: next,
      examinerLine: next.closingMessage,
      metrics: buildConversationMetrics(next, ctx),
    };
  }

  next = addExaminerTurn(next, recoveryLine, "recovery");
  return { state: next, examinerLine: recoveryLine };
}
