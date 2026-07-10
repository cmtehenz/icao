import { getTrainingProfile } from "@/lib/trainingProfile/store";
import type { StudentTrainingProfile, TrainingPhase } from "@/lib/trainingProfile/types";

/** Phase-driven daily flight shape — Mission Engine reads this (RFC-004 Phase 2). */
export type AdaptiveDailyPlan = {
  phase: TrainingPhase;
  /** Word Mission terms today */
  wordMissionTermCount: number;
  wordMissionMinExamTerms: number;
  wordMissionMaxReviewTerms: number;
  /** Pronunciation warm-up before Word Mission */
  pronunciationFirst: boolean;
  pronunciationWordCount: number;
  /** Prefer easier / new terms over exam pressure */
  preferFoundationTerms: boolean;
};

/** Starter words when vault is empty (Foundation checkride overlap). */
export const FOUNDATION_BOOTSTRAP_WORDS = [
  "turbulence",
  "approach",
  "altitude",
  "hold short",
  "go around",
] as const;

export function getAdaptiveDailyPlan(
  profile: StudentTrainingProfile = getTrainingProfile(),
): AdaptiveDailyPlan {
  const phase = profile.phase;
  const weakPron =
    profile.weakAreas.includes("pronunciation") || profile.weakAreas.includes("rhythm");

  switch (phase) {
    case "foundation":
      return {
        phase,
        wordMissionTermCount: 2,
        wordMissionMinExamTerms: 1,
        wordMissionMaxReviewTerms: 1,
        pronunciationFirst: true,
        pronunciationWordCount: 5,
        preferFoundationTerms: true,
      };
    case "operational":
      return {
        phase,
        wordMissionTermCount: 3,
        wordMissionMinExamTerms: 2,
        wordMissionMaxReviewTerms: 2,
        pronunciationFirst: weakPron,
        pronunciationWordCount: 4,
        preferFoundationTerms: false,
      };
    case "exam":
      return {
        phase,
        wordMissionTermCount: 4,
        wordMissionMinExamTerms: 2,
        wordMissionMaxReviewTerms: 2,
        pronunciationFirst: weakPron,
        pronunciationWordCount: 5,
        preferFoundationTerms: false,
      };
  }
}

export function adaptivePlanHint(plan: AdaptiveDailyPlan): string {
  if (plan.phase === "foundation") {
    return "Foundation day — pronunciation first, then two Word Mission terms.";
  }
  if (plan.phase === "operational") {
    return plan.pronunciationFirst
      ? "Operational day — warm up weak sounds, then three terms."
      : "Operational day — three Word Mission terms.";
  }
  return plan.pronunciationFirst
    ? "Exam phase — pronunciation focus, then full Word Mission."
    : "Exam phase — full Word Mission load.";
}
