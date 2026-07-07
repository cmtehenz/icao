import { respondAsCaptainInstructor } from "@/lib/captainDelta/infinity/respond";
import type { CaptainIntent } from "@/lib/captainDelta/infinity/types";
import { currentStep } from "@/lib/wordMission/lesson/simpleFlow";
import type { WordMissionLessonContext, WordMissionStepId } from "@/lib/wordMission/lesson/types";

const INTERRUPT_PATTERNS: { pattern: RegExp; intent: CaptainIntent }[] = [
  { pattern: /what does this mean|meaning|o que significa/i, intent: "meaning_question" },
  { pattern: /explain again|again|repeat|de novo/i, intent: "explain_again" },
  { pattern: /why|por que|porquê/i, intent: "aviation_context" },
  { pattern: /pronounc|how do i say|stress|syllable|ritmo|rhythm/i, intent: "pronunciation_question" },
  { pattern: /when do pilot|when would|when do/i, intent: "atc" },
  { pattern: /have you heard|real life|real operations/i, intent: "aviation_context" },
];

export function classifyWordMissionInterrupt(question: string): CaptainIntent {
  const q = question.trim();
  for (const { pattern, intent } of INTERRUPT_PATTERNS) {
    if (pattern.test(q)) return intent;
  }
  return "vocabulary_question";
}

export type WordMissionInterruptResult = {
  message: string;
  speechText: string;
  intent: CaptainIntent;
  resumeStepId: WordMissionStepId;
};

/** Student interrupts — Captain answers, then returns to lesson context. */
export function handleWordMissionInterrupt(
  question: string,
  ctx: WordMissionLessonContext,
): WordMissionInterruptResult {
  const phase = currentStep(ctx);
  const intent = classifyWordMissionInterrupt(question);
  const response = respondAsCaptainInstructor({
    question,
    intent,
    currentWord: ctx.lesson.term,
    referenceText: phase.detail ?? phase.captainLine,
    practiceLevel: 2,
  });

  const resume = `Back to our lesson — ${phase.label}. ${phase.captainLine}`;
  return {
    message: `${response.message} ${resume}`,
    speechText: `${response.speechText} Back to the lesson.`,
    intent,
    resumeStepId: ctx.currentStepId,
  };
}

export function isWordMissionStudentQuestion(text: string): boolean {
  const q = text.trim();
  if (!q) return false;
  if (q.endsWith("?")) return true;
  return INTERRUPT_PATTERNS.some(({ pattern }) => pattern.test(q));
}
