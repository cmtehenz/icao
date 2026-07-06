import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import type { PracticeLevel, VaultWord, VaultWordStatus } from "@/lib/pronunciationVault";
import { VAULT_PASS_SCORE } from "@/lib/pronunciationVault";

export type CaptainPronunciationFeedback = {
  message: string;
  speechText: string;
  tone: "good" | "weak" | "strong" | "critical" | "review";
};

export type ScoreDimension = "accuracy" | "fluency" | "prosody" | "completeness";

export type CoachingFocus = ScoreDimension | "strong";

export type CaptainAssessmentDebrief = {
  message: string;
  speechText: string;
  focus: CoachingFocus;
  focusLabel: string | null;
  technicalDetails: string;
  youGlishQuery: string | null;
  showYouGlish: boolean;
};

const FOCUS_LABELS: Record<ScoreDimension, string> = {
  accuracy: "word clarity",
  fluency: "fluency",
  prosody: "stress",
  completeness: "full sentence",
};

function dimensionSeverity(dimension: ScoreDimension, score: number): number {
  switch (dimension) {
    case "accuracy":
      if (score >= 95) return 0;
      if (score >= 85) return 1;
      if (score >= 70) return 2;
      return 3;
    case "fluency":
      if (score >= 95) return 0;
      if (score >= 85) return 1;
      if (score >= 70) return 2;
      return 3;
    case "prosody":
      if (score >= 85) return 0;
      if (score >= 70) return 1;
      return 2;
    case "completeness":
      if (score >= 90) return 0;
      return 2;
    default:
      return 0;
  }
}

export function pickWeakestDimension(assessment: AzurePronunciationResult): ScoreDimension {
  const scores: Record<ScoreDimension, number> = {
    accuracy: assessment.accuracyScore ?? 0,
    fluency: assessment.fluencyScore ?? 0,
    prosody: assessment.prosodyScore ?? 0,
    completeness: assessment.completenessScore ?? 100,
  };

  let weakest: ScoreDimension = "accuracy";
  let worstSeverity = -1;
  let worstScore = 101;

  for (const dim of Object.keys(scores) as ScoreDimension[]) {
    const score = scores[dim];
    const severity = dimensionSeverity(dim, score);
    if (severity > worstSeverity || (severity === worstSeverity && score < worstScore)) {
      weakest = dim;
      worstSeverity = severity;
      worstScore = score;
    }
  }

  return weakest;
}

export function allDimensionsStrong(assessment: AzurePronunciationResult): boolean {
  return (
    (assessment.accuracyScore ?? 0) >= 95 &&
    (assessment.fluencyScore ?? 0) >= 95 &&
    (assessment.prosodyScore ?? 0) >= 85 &&
    (assessment.completenessScore ?? 0) >= 90
  );
}

export function phraseAroundTarget(referenceText: string, targetWord: string): string {
  const clean = referenceText.replace(/[.,!?;:]+/g, " ").trim();
  const tokens = clean.split(/\s+/).filter(Boolean);
  const targetLower = targetWord.toLowerCase();
  const idx = tokens.findIndex(
    (token) =>
      token.toLowerCase() === targetLower ||
      token.toLowerCase().includes(targetLower),
  );
  if (idx < 0) return targetWord;
  const start = Math.max(0, idx - 1);
  const end = Math.min(tokens.length, idx + 2);
  return tokens.slice(start, end).join(" ");
}

export function youGlishQueryForLevel(
  targetWord: string,
  level: PracticeLevel,
  referenceText: string,
): string {
  if (level === 1 || level === 2) return targetWord;
  const phrase = phraseAroundTarget(referenceText, targetWord);
  return phrase.length <= 48 ? phrase : targetWord;
}

export function formatTechnicalDetails(assessment: AzurePronunciationResult): string {
  const parts = [
    `Accuracy ${assessment.accuracyScore ?? 0}`,
    `Fluency ${assessment.fluencyScore ?? 0}`,
    `Prosody ${assessment.prosodyScore ?? 0}`,
    `Completeness ${assessment.completenessScore ?? 0}`,
  ];
  if (assessment.recognizedText?.trim()) {
    parts.push(`Recognized: "${assessment.recognizedText.trim()}"`);
  }
  return parts.join(" · ");
}

function buildStrongFeedback(
  targetWord: string,
  practiceLevel: PracticeLevel,
  missionPass?: boolean,
): { message: string; speechText: string } {
  if (missionPass) {
    return {
      message: `Nice work. "${targetWord}" was clear and the sentence flowed naturally. Continue to the next word.`,
      speechText: `Nice work. The word was clear. Continue to the next word.`,
    };
  }
  if (practiceLevel >= 3) {
    return {
      message: `Nice work. "${targetWord}" was clear. Now connect it naturally in the full sentence.`,
      speechText: `Nice work. The word was clear. Now connect it naturally in the full sentence.`,
    };
  }
  return {
    message: `Strong work on "${targetWord}". Keep that clarity and move to the next challenge.`,
    speechText: `Strong work. Keep that clarity and move on.`,
  };
}

function buildAccuracyFeedback(
  score: number,
  targetWord: string,
  practicePhrase: string,
  fluencyScore: number,
): { message: string; speechText: string } {
  const fluencySmooth = fluencyScore >= 85;
  const fluencyLead = fluencySmooth
    ? "Your fluency was smooth, but "
    : "The sentence was understandable, but ";

  if (score < 70) {
    return {
      message: `${fluencyLead}"${targetWord}" needs a clearer, shorter sound. Say "${targetWord}" by itself, then repeat the full sentence.`,
      speechText: `"${targetWord}" needs a clearer sound. Say it alone, then repeat the full sentence.`,
    };
  }
  if (score < 85) {
    return {
      message: `Good. ${fluencyLead}the target word "${targetWord}" sounded weak. Repeat only "${practicePhrase}" first, then say the full sentence again.`,
      speechText: `Good. Repeat "${practicePhrase}" first, then the full sentence.`,
    };
  }
  return {
    message: `Good. "${targetWord}" is understandable — polish the stress on the target syllable and try once more.`,
    speechText: `Good. Polish the stress on "${targetWord}" and try once more.`,
  };
}

function buildFluencyFeedback(
  score: number,
  targetWord: string,
): { message: string; speechText: string } {
  if (score < 70) {
    return {
      message: `Good attempt. "${targetWord}" was there, but the rhythm was choppy. Link the words smoothly with fewer pauses.`,
      speechText: `The rhythm was choppy. Link the words smoothly with fewer pauses.`,
    };
  }
  if (score < 85) {
    return {
      message: `Good. "${targetWord}" came through, but you paused too much. Keep a steady flow through the whole sentence.`,
      speechText: `You paused too much. Keep a steady flow through the sentence.`,
    };
  }
  return {
    message: `Mostly smooth on "${targetWord}". Trim one small pause and run the sentence in one breath.`,
    speechText: `Mostly smooth. Trim one pause and run the sentence in one breath.`,
  };
}

function buildProsodyFeedback(
  score: number,
  targetWord: string,
): { message: string; speechText: string } {
  if (score < 70) {
    return {
      message: `Good attempt. The sentence was understandable, but the stress was flat. Put more pressure on "${targetWord}" and slow the ending.`,
      speechText: `The stress was flat. Put more pressure on the target word and slow the ending.`,
    };
  }
  if (score < 85) {
    return {
      message: `Good. "${targetWord}" was clear enough, but the stress could be stronger. Lift the target word and let the rest of the sentence settle.`,
      speechText: `The stress could be stronger. Lift the target word in the sentence.`,
    };
  }
  return {
    message: `Almost there on "${targetWord}". Add a little more natural rhythm on the stressed syllable.`,
    speechText: `Almost there. Add a little more rhythm on the stressed syllable.`,
  };
}

function buildCompletenessFeedback(
  score: number,
  targetWord: string,
  referenceText: string,
): { message: string; speechText: string } {
  const tail = referenceText.split(/\s+/).slice(-3).join(" ").replace(/[.,!?;:]+$/, "");
  if (score < 90) {
    return {
      message: `Good start. Say the full sentence without cutting the ending — include every word through "${tail || targetWord}".`,
      speechText: `Say the full sentence without cutting the ending.`,
    };
  }
  return {
    message: `Nearly complete on "${targetWord}". Finish the last words clearly.`,
    speechText: `Nearly complete. Finish the last words clearly.`,
  };
}

export function buildHumanCaptainFeedback(
  assessment: AzurePronunciationResult,
  context: {
    targetWord: string;
    practiceLevel: PracticeLevel;
    referenceText: string;
    missionPass?: boolean;
  },
): CaptainAssessmentDebrief {
  const { targetWord, practiceLevel, referenceText, missionPass } = context;
  const practicePhrase = phraseAroundTarget(referenceText, targetWord);
  const technicalDetails = formatTechnicalDetails(assessment);

  let focus: CoachingFocus;
  let copy: { message: string; speechText: string };

  if (allDimensionsStrong(assessment)) {
    focus = "strong";
    copy = buildStrongFeedback(targetWord, practiceLevel, missionPass);
  } else {
    focus = pickWeakestDimension(assessment);
    const scores = {
      accuracy: assessment.accuracyScore ?? 0,
      fluency: assessment.fluencyScore ?? 0,
      prosody: assessment.prosodyScore ?? 0,
      completeness: assessment.completenessScore ?? 100,
    };

    switch (focus) {
      case "accuracy":
        copy = buildAccuracyFeedback(
          scores.accuracy,
          targetWord,
          practicePhrase,
          scores.fluency,
        );
        break;
      case "fluency":
        copy = buildFluencyFeedback(scores.fluency, targetWord);
        break;
      case "prosody":
        copy = buildProsodyFeedback(scores.prosody, targetWord);
        break;
      case "completeness":
        copy = buildCompletenessFeedback(scores.completeness, targetWord, referenceText);
        break;
      default:
        copy = buildStrongFeedback(targetWord, practiceLevel, missionPass);
        focus = "strong";
    }
  }

  const youGlishQuery = youGlishQueryForLevel(targetWord, practiceLevel, referenceText);
  const showYouGlish =
    focus !== "strong" &&
    ((assessment.accuracyScore ?? 0) < 85 ||
      (assessment.prosodyScore ?? 0) < 85 ||
      focus === "accuracy" ||
      focus === "prosody");

  return {
    message: copy.message,
    speechText: copy.speechText,
    focus,
    focusLabel: focus === "strong" ? null : FOCUS_LABELS[focus],
    technicalDetails,
    youGlishQuery,
    showYouGlish,
  };
}

/** Short Captain debrief after a valid pronunciation assessment — human coaching only. */
export function buildCaptainAssessmentDebrief(
  assessment: AzurePronunciationResult,
  context: {
    targetWord: string;
    practiceLevel: PracticeLevel;
    referenceText: string;
    missionPass?: boolean;
  },
): CaptainAssessmentDebrief {
  return buildHumanCaptainFeedback(assessment, context);
}

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

/** Guard: spoken Captain text must never read raw score metrics aloud. */
export function spokenFeedbackExcludesRawScores(text: string): boolean {
  return !/\b(Accuracy|Fluency|Completeness|Prosody)\s+\d+/i.test(text);
}
