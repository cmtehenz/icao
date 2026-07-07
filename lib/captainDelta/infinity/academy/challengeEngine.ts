import type { CaptainStudentModel } from "@/lib/captainDelta/infinity/types";
import type { CaptainInstructorRole } from "@/lib/captainDelta/infinity/academy/types";
import type { LiveAdaptationState } from "@/lib/captainDelta/infinity/academy/types";

export type ChallengeKind =
  | "faster"
  | "confidence"
  | "passenger_explain"
  | "atc_answer"
  | "timed_thirty";

const CHALLENGES: Record<ChallengeKind, (word: string) => string> = {
  faster: (w) => `Challenge — say "${w}" slightly faster. Keep the radio rhythm steady.`,
  confidence: (w) => `Challenge — say "${w}" like you own the frequency. Calm and decisive.`,
  passenger_explain: (w) => `Challenge — explain "${w}" to a nervous passenger in one sentence.`,
  atc_answer: (w) => `Challenge — answer Tower as if they just asked about "${w}". Short readback.`,
  timed_thirty: (w) => `Challenge — thirty seconds. Use "${w}" in a full operational line.`,
};

export function pickChallenge(
  model: CaptainStudentModel,
  role: CaptainInstructorRole,
  adaptation: LiveAdaptationState,
  word: string,
): string | null {
  if (!word.trim()) return null;
  if (adaptation === "ease") return null;
  if (model.emotionalState === "frustrated") return null;

  if (adaptation === "push" || model.primaryNeed === "challenge") {
    if (role === "atc") return CHALLENGES.atc_answer(word);
    if (role === "examiner") return CHALLENGES.timed_thirty(word);
    if (model.lastAttemptSucceeded) return CHALLENGES.faster(word);
    return CHALLENGES.confidence(word);
  }

  if (model.lastAttemptSucceeded && model.wordMastered) {
    return CHALLENGES.passenger_explain(word);
  }

  return null;
}

export function appendChallenge(message: string, challenge: string | null): string {
  if (!challenge) return message;
  return `${message} ${challenge}`.trim();
}
