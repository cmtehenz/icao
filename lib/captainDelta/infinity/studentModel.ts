import type {
  CaptainIntent,
  CaptainLessonMemory,
  CaptainStudentModel,
  CaptainStudentNeed,
  StudentModelHints,
} from "@/lib/captainDelta/infinity/types";

function focusToWeakness(
  focus: string | null | undefined,
): CaptainStudentModel["pronunciationWeakness"] {
  if (!focus) return null;
  if (focus === "prosody" || focus === "stress") return "stress";
  if (focus === "fluency") return "rhythm";
  if (focus === "accuracy") return "vowel";
  if (focus === "completeness") return "completeness";
  return null;
}

function inferConfidence(
  memory: CaptainLessonMemory,
  hints?: StudentModelHints,
): CaptainStudentModel["confidence"] {
  if (memory.frustrationSignals >= 2 || hints?.lastAttemptScore != null && hints.lastAttemptScore < 70) {
    return "low";
  }
  if (memory.successesToday >= 2 || hints?.lastAttemptSucceeded) return "high";
  return "medium";
}

function inferEmotionalState(
  memory: CaptainLessonMemory,
  intent?: CaptainIntent,
): CaptainStudentModel["emotionalState"] {
  if (intent === "student_frustration" || memory.frustrationSignals >= 2) return "frustrated";
  if (intent === "confidence" || memory.successesToday >= 2) return "confident";
  if (memory.turnCount >= 6 && memory.successesToday === 0) return "bored";
  return "neutral";
}

function inferPrimaryNeed(
  model: Pick<
    CaptainStudentModel,
    "confidence" | "emotionalState" | "wordMastered" | "pronunciationWeakness" | "lastAttemptSucceeded"
  >,
): CaptainStudentNeed {
  if (model.emotionalState === "frustrated" || model.confidence === "low") return "confidence";
  if (model.wordMastered && model.lastAttemptSucceeded) return "challenge";
  if (model.pronunciationWeakness === "rhythm") return "rhythm";
  if (model.pronunciationWeakness === "stress") return "stress";
  if (model.pronunciationWeakness === "vowel") return "clarity";
  if (model.emotionalState === "bored") return "challenge";
  return "recovery";
}

/** Internal student model — never exposed in UI copy. */
export function buildCaptainStudentModel(
  memory: CaptainLessonMemory,
  hints: StudentModelHints = {},
  intent?: CaptainIntent,
): CaptainStudentModel {
  const weakness = focusToWeakness(memory.lastMistake);
  const confidence = inferConfidence(memory, hints);
  const emotionalState = inferEmotionalState(memory, intent);
  const wordMastered = hints.wordMastered ?? memory.successesToday >= 2;
  const lastAttemptSucceeded =
    hints.lastAttemptSucceeded ?? memory.successesToday > 0;

  const partial = {
    confidence,
    emotionalState,
    wordMastered,
    pronunciationWeakness: weakness,
    lastAttemptSucceeded,
  };

  return {
    estimatedIcaoLevel: hints.estimatedIcaoLevel ?? 4,
    confidence,
    emotionalState,
    pronunciationWeakness: weakness,
    wordMastered,
    wordRepeatCount: hints.wordRepeatCount ?? memory.turnCount,
    consecutiveSameMistake:
      hints.consecutiveSameFocus ?? memory.consecutiveSameMistake,
    hesitation:
      weakness === "rhythm" || weakness === "completeness" ? "high" : "medium",
    learningStyle: "speaking",
    lastAttemptSucceeded,
    primaryNeed: inferPrimaryNeed(partial),
  };
}
