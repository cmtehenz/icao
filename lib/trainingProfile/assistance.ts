import type { StudentTrainingProfile, TrainingPhase } from "@/lib/trainingProfile/types";

/**
 * Progressive assistance ladder (Flight Manual §04 / RFC-004 Phase 4).
 * Full model → sentence blocks → keywords → student solo.
 */
export type AssistanceLevel = "full" | "blocks" | "keywords" | "solo";

export type Part1AssistanceDefaults = {
  showKeywords: boolean;
  keywordsOnly: boolean;
  showAnswer: boolean;
  preferredTab: "shadow" | "coach";
  coachShowKeywords: boolean;
  coachBasicOpen: boolean;
  hideModelAnswers: boolean;
};

export type WordMissionAssistanceDefaults = {
  /** Show the exact phrase to speak on record steps */
  showSpeakText: boolean;
  /** Expand rich knowledge panels on listen steps */
  expandRichPanels: boolean;
};

const LEVEL_ORDER: AssistanceLevel[] = ["solo", "keywords", "blocks", "full"];

function moreHelp(level: AssistanceLevel): AssistanceLevel {
  const i = LEVEL_ORDER.indexOf(level);
  return LEVEL_ORDER[Math.min(i + 1, LEVEL_ORDER.length - 1)]!;
}

export function baseAssistanceForPhase(phase: TrainingPhase): AssistanceLevel {
  switch (phase) {
    case "foundation":
      return "full";
    case "operational":
      return "keywords";
    case "exam":
      return "solo";
  }
}

/** Profile → assistance. Weak structure/confidence keeps one more scaffold step. */
export function assistanceFromProfile(profile: StudentTrainingProfile): AssistanceLevel {
  let level = baseAssistanceForPhase(profile.phase);
  if (
    profile.weakAreas.includes("structure") ||
    profile.weakAreas.includes("confidence")
  ) {
    level = moreHelp(level);
  }
  return level;
}

export function part1AssistanceDefaults(level: AssistanceLevel): Part1AssistanceDefaults {
  switch (level) {
    case "full":
      return {
        showKeywords: true,
        keywordsOnly: false,
        showAnswer: false,
        preferredTab: "shadow",
        coachShowKeywords: true,
        coachBasicOpen: false,
        hideModelAnswers: false,
      };
    case "blocks":
      return {
        showKeywords: true,
        keywordsOnly: false,
        showAnswer: false,
        preferredTab: "shadow",
        coachShowKeywords: true,
        coachBasicOpen: false,
        hideModelAnswers: false,
      };
    case "keywords":
      return {
        showKeywords: true,
        keywordsOnly: true,
        showAnswer: false,
        preferredTab: "coach",
        coachShowKeywords: true,
        coachBasicOpen: false,
        hideModelAnswers: false,
      };
    case "solo":
      return {
        showKeywords: false,
        keywordsOnly: false,
        showAnswer: false,
        preferredTab: "coach",
        coachShowKeywords: false,
        coachBasicOpen: false,
        hideModelAnswers: true,
      };
  }
}

export function wordMissionAssistanceDefaults(
  level: AssistanceLevel,
): WordMissionAssistanceDefaults {
  return {
    showSpeakText: level === "full" || level === "blocks",
    expandRichPanels: level === "full" || level === "blocks",
  };
}

export function assistanceLabel(level: AssistanceLevel): string {
  switch (level) {
    case "full":
      return "Full model";
    case "blocks":
      return "Sentence blocks";
    case "keywords":
      return "Keywords";
    case "solo":
      return "Solo";
  }
}
