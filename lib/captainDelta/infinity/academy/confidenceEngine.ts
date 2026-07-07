import type { CaptainLessonMemory } from "@/lib/captainDelta/infinity/types";
import type { CaptainStudentModel } from "@/lib/captainDelta/infinity/types";
import type { CaptainMentorProfile } from "@/lib/captainDelta/infinity/mentorProfile";
import { clampSentences } from "@/lib/captainDelta/infinity/qualityGate";

export type ConfidenceSignal = "hesitation" | "retries" | "frustration" | "steady";

export function detectConfidenceSignal(
  model: CaptainStudentModel,
  memory: CaptainLessonMemory,
): ConfidenceSignal {
  if (model.emotionalState === "frustrated" || memory.frustrationSignals >= 2) {
    return "frustration";
  }
  if (memory.consecutiveSameMistake >= 2 || memory.helpLevel >= 2) {
    return "retries";
  }
  if (model.hesitation === "high") return "hesitation";
  return "steady";
}

/** V6 — no generic praise; specific progress when confidence drops. */
export function buildConfidenceResponse(
  signal: ConfidenceSignal,
  mentor: CaptainMentorProfile,
  word: string,
): string | null {
  if (signal === "frustration" || signal === "retries") {
    if (mentor.progressTrend === "up") {
      return "Take your time. You've already improved a lot this week — one sound, then the full line.";
    }
    return `Take your time on "${word}". Fix one piece, then rebuild the transmission.`;
  }
  if (signal === "hesitation") {
    return "Pause is fine — breathe, then answer like you're on frequency.";
  }
  return null;
}

export function applyConfidenceEngine(
  message: string,
  speechText: string,
  model: CaptainStudentModel,
  memory: CaptainLessonMemory,
  mentor: CaptainMentorProfile,
): { message: string; speechText: string; studentSpeaksMore: boolean } {
  const signal = detectConfidenceSignal(model, memory);
  const confidenceLine = buildConfidenceResponse(signal, mentor, memory.currentWord);

  if (!confidenceLine) {
    return { message, speechText, studentSpeaksMore: false };
  }

  const out = clampSentences(`${confidenceLine}`, 3);
  return {
    message: out,
    speechText: out,
    studentSpeaksMore: true,
  };
}

/** Reject generic praise — V6 golden rule for feedback copy. */
export function rejectGenericPraise(text: string): boolean {
  return /\b(good job|nice job|well done|great job)\b/i.test(text);
}

export function specificProgressPraise(word: string, aspect: string): string {
  return `You handled "${word}" much more naturally than yesterday — ${aspect} is moving forward.`;
}
