import type { VocabPracticeLevel } from "@/lib/vocabGraduation";
import {
  isVocabMissionTermComplete,
  vbLevelName,
  VB_PASS_SCORE,
} from "@/lib/vocabGraduation";
import type { VocabItemProgress } from "@/utils/spacedRepetition";

export type CaptainVocabFeedback = {
  message: string;
  speechText: string;
  tone: "good" | "weak" | "strong" | "complete";
};

export const CAPTAIN_VOCAB_MISSION_INTRO =
  "Today's vocabulary mission — four levels per term. Meaning first, then pilot phrase, sentence, and exam use.";

export const CAPTAIN_VOCAB_MISSION_DEBRIEF =
  "Term graduated. Operational meaning and spoken use — that's what the exam tests.";

export const CAPTAIN_VOCAB_FLIGHT_DEBRIEF =
  "Vocabulary leg complete. Line up for Part 1 — oral exam prep starts on the runway.";

export const AZURE_RECOVERY_GUIDANCE = "Listen → slow down → retry.";

export function captainVocabFeedbackAfterAttempt(
  score: number,
  level: VocabPracticeLevel,
  progress: VocabItemProgress,
): CaptainVocabFeedback {
  if (isVocabMissionTermComplete(progress)) {
    return {
      tone: "complete",
      message: CAPTAIN_VOCAB_MISSION_DEBRIEF,
      speechText: CAPTAIN_VOCAB_MISSION_DEBRIEF,
    };
  }

  if (score >= 90) {
    const next = level < 4 ? vbLevelName((level + 1) as VocabPracticeLevel) : "exam use";
    return {
      tone: "strong",
      message: `Strong at ${vbLevelName(level)}. Next: ${next}.`,
      speechText: `Strong. Next level: ${next}.`,
    };
  }

  if (score >= VB_PASS_SCORE) {
    return {
      tone: "good",
      message: `Good — ${vbLevelName(level)} passed. Keep it operational, not dictionary English.`,
      speechText: `Good. ${vbLevelName(level)} passed.`,
    };
  }

  return {
    tone: "weak",
    message: `Slow down on ${vbLevelName(level)}. Learn the operational meaning, then say it like a pilot.`,
    speechText: "Slow down. Operational meaning first, then speak clearly.",
  };
}
