import type { FollowUpCategory, ConversationState } from "@/lib/humanExaminer/types";
import { maxFollowUpsForDifficulty } from "@/lib/humanExaminer/difficulty";
import type { QuestionContext } from "@/lib/humanExaminer/types";
import type {
  AIPresenceSnapshot,
  CaptainStandbyCopy,
  ConversationProgressView,
  ConversationSessionPhase,
} from "@/lib/aiPresence/types";

const STAGE_PIPELINE = [
  "Question",
  "Clarification",
  "Operational Discussion",
  "Wrap-up",
  "Captain Debrief",
] as const;

const CATEGORY_STAGE: Partial<Record<FollowUpCategory, number>> = {
  clarification: 1,
  expansion: 1,
  recovery: 1,
  personal: 2,
  operational: 2,
  example: 2,
  comparison: 2,
  opinion: 2,
  hypothetical: 2,
};

export function maxDiscussionTurns(
  ctx: QuestionContext,
  profile: ConversationState["profile"],
): number {
  return maxFollowUpsForDifficulty(ctx.difficulty, profile);
}

export function buildConversationProgress(
  conversation: ConversationState,
  ctx: QuestionContext,
): ConversationProgressView {
  const total = maxDiscussionTurns(ctx, conversation.profile);
  const studentTurns = conversation.turns.filter((t) => t.role === "student").length;
  const current = Math.min(studentTurns, total);
  const lastExaminer = [...conversation.turns].reverse().find((t) => t.role === "examiner");
  const lastCategory = lastExaminer?.category;
  let stageIndex = 0;
  if (conversation.complete) {
    stageIndex = 4;
  } else if (conversation.followUpCount >= total - 1) {
    stageIndex = 3;
  } else if (lastCategory && CATEGORY_STAGE[lastCategory] != null) {
    stageIndex = CATEGORY_STAGE[lastCategory]!;
  } else if (studentTurns > 0) {
    stageIndex = Math.min(2, studentTurns);
  }
  return {
    discussionLabel: "Discussion",
    current,
    total,
    stageIndex,
    stages: [...STAGE_PIPELINE],
  };
}

export type PhaseInput = {
  hexActive: boolean;
  hexComplete: boolean;
  loading: boolean;
  azureAssessing: boolean;
  examinerThinking: boolean;
  closingActive: boolean;
  instructorLoading: boolean;
  hasInstructorReport: boolean;
  hasExaminerFollowUp: boolean;
};

export function deriveConversationPhase(input: PhaseInput): ConversationSessionPhase {
  if (!input.hexActive) {
    if (input.hasInstructorReport) return "captain_debrief";
    if (input.instructorLoading) return "captain_standby";
    return "idle";
  }
  if (input.closingActive) return "conversation_closing";
  if (input.instructorLoading) return "captain_standby";
  if (input.hasInstructorReport) return "captain_debrief";
  if (input.examinerThinking || input.loading) return "examiner_thinking";
  if (input.azureAssessing) return "student_speaking";
  if (input.hasExaminerFollowUp && !input.loading) return "examiner_speaking";
  if (input.hexComplete) return "captain_standby";
  return "listening";
}

export function presenceFromPhase(phase: ConversationSessionPhase): AIPresenceSnapshot {
  switch (phase) {
    case "examiner_speaking":
      return {
        actor: "examiner",
        phase,
        statusLine: "Oral assessment in progress",
        subLine: "Captain Delta is listening",
        hexActive: true,
      };
    case "examiner_thinking":
      return {
        actor: "examiner",
        phase,
        statusLine: "Preparing the next question",
        subLine: "Captain Delta is listening",
        hexActive: true,
      };
    case "student_speaking":
      return {
        actor: "examiner",
        phase,
        statusLine: "Oral assessment in progress",
        subLine: "Your turn — speak when ready",
        hexActive: true,
      };
    case "listening":
      return {
        actor: "examiner",
        phase,
        statusLine: "Oral assessment in progress",
        subLine: "Captain Delta is listening",
        hexActive: true,
      };
    case "conversation_closing":
      return {
        actor: "examiner",
        phase,
        statusLine: "Closing the discussion",
        subLine: "Captain Delta is preparing your debrief",
        hexActive: true,
      };
    case "captain_standby":
      return {
        actor: "captain",
        phase,
        statusLine: "Preparing your debrief",
        subLine: "Observing communication",
        hexActive: true,
      };
    case "captain_debrief":
      return {
        actor: "captain",
        phase,
        statusLine: "Your debrief is ready",
        subLine: "Review coaching below",
        hexActive: true,
      };
    case "idle":
    default:
      return {
        actor: "captain",
        phase: "idle",
        statusLine: "Monitoring today's mission",
      };
  }
}

export function defaultRoutePresence(): AIPresenceSnapshot {
  return {
    actor: "captain",
    phase: "idle",
    statusLine: "Monitoring today's mission",
  };
}

export function captainStandbyCopy(phase: ConversationSessionPhase): CaptainStandbyCopy {
  if (phase === "captain_standby" || phase === "conversation_closing") {
    return {
      title: "Captain Delta",
      body: "I'm listening to this discussion. We'll review everything right after.",
      hint: "Preparing your debrief…",
    };
  }
  if (
    phase === "examiner_speaking" ||
    phase === "examiner_thinking" ||
    phase === "listening" ||
    phase === "student_speaking"
  ) {
    return {
      title: "Captain Delta",
      body: "Complete this conversation first. I'll help you immediately after.",
      hint: "Observing operational reasoning…",
    };
  }
  return {
    title: "Captain Delta",
    body: "I'm leading today's flight. Follow my next instruction — or hold the button if you need a quick question.",
    hint: "Continue your mission",
  };
}

export function examinerThinkingLine(): string {
  return "Examiner is preparing the next question…";
}

export function examinerRecoveryLine(): string {
  return "Let's continue.";
}
