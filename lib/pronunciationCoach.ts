import type { PracticeLevel, VaultWord, VaultWordStatus } from "@/lib/pronunciationVault";
import { VAULT_PASS_SCORE } from "@/lib/pronunciationVault";
import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";

export type CaptainPronunciationFeedback = {
  message: string;
  speechText: string;
  tone: "good" | "weak" | "strong" | "critical" | "review";
};

export function captainFeedbackAfterAttempt(
  word: VaultWord,
  score: number,
  level: PracticeLevel,
  status: VaultWordStatus,
): CaptainPronunciationFeedback {
  if (status === "critical" || score < 70) {
    return {
      tone: "critical",
      message: "Slow down. Let's break this word into smaller parts.",
      speechText: "Slow down. Let's break this word into smaller parts.",
    };
  }

  if (status === "needs_review") {
    return {
      tone: "review",
      message: "No clear improvement yet. We'll move on and revisit this word later.",
      speechText: "No clear improvement yet. We'll move on and revisit this word later.",
    };
  }

  if (
    status === "use_sentence" ||
    status === "use_icao" ||
    (word.pass90Count ?? 0) >= 2 ||
    score >= 90
  ) {
    if (level >= 3) {
      return {
        tone: "strong",
        message: "Stop. You already know this word. Let's use it naturally.",
        speechText: "Stop. You already know this word. Let's use it naturally.",
      };
    }
    return {
      tone: "strong",
      message: "Strong pronunciation. Now use this word in a sentence.",
      speechText: "Strong pronunciation. Now use this word in a sentence.",
    };
  }

  if (score >= VAULT_PASS_SCORE) {
    return {
      tone: "good",
      message: "Good. Now use this word in a sentence.",
      speechText: "Good. Now use this word in a sentence.",
    };
  }

  return {
    tone: "weak",
    message: "Slow down. Let's break this word into smaller parts.",
    speechText: "Slow down. Let's break this word into smaller parts.",
  };
}

/** Short Captain debrief after a valid pronunciation assessment. */
export function buildCaptainAssessmentDebrief(
  assessment: AzurePronunciationResult,
  feedback: CaptainPronunciationFeedback,
  options?: { missionPass?: boolean },
): { message: string; speechText: string } {
  const scoreLine = `Accuracy ${assessment.accuracyScore}, Fluency ${assessment.fluencyScore}.`;
  let coaching: string;

  if (assessment.accuracyScore >= 90 && assessment.fluencyScore >= 90) {
    coaching = options?.missionPass
      ? "Nice work. Continue to the next word."
      : "Nice work — keep that clarity and pace.";
  } else if (assessment.accuracyScore >= VAULT_PASS_SCORE) {
    coaching =
      "Good attempt — accuracy is fine, but slow down and repeat the stressed syllable.";
  } else {
    coaching = feedback.message;
  }

  const message = `${scoreLine} ${coaching}`;
  return { message, speechText: message };
}

export const CAPTAIN_MISSION_INTRO =
  "Today we'll practice 5 words. But we won't repeat words forever. Once your score is good, we'll use them in real pilot sentences.";

export const CAPTAIN_MISSION_DEBRIEF =
  "Good work. Your isolated pronunciation is improving. Tomorrow we'll focus on using these words naturally in answers.";

export function levelLabel(level: PracticeLevel): string {
  if (level === 1) return "Word";
  if (level === 2) return "Expression";
  if (level === 3) return "Sentence";
  return "ICAO Use";
}

export function captainFeedbackBelowStoredLevel(
  word: VaultWord,
  attemptLevel: PracticeLevel,
): CaptainPronunciationFeedback | null {
  const stored = word.practiceLevel ?? 1;
  if (attemptLevel >= stored) return null;
  const next = levelLabel(stored);
  return {
    tone: "review",
    message: `"${word.word}" is already at level ${stored} (${next}). Practice at that level to graduate — not the isolated word again.`,
    speechText: `"${word.word}" is already at level ${stored}. Practice at ${next} level to graduate.`,
  };
}

export function statusLabel(status: VaultWordStatus): string {
  const labels: Record<VaultWordStatus, string> = {
    new: "New",
    practicing: "Practicing",
    needs_review: "Needs Review",
    critical: "Critical",
    graduated: "Graduated",
    use_sentence: "Use in Sentence",
    use_icao: "Use in ICAO Answer",
  };
  return labels[status];
}
