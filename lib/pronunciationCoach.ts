import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import { recommendedPracticeLevel } from "@/lib/pronunciationGraduation";
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

const METRIC_LABEL_PATTERN = /\b(Accuracy|Fluency|Completeness|Prosody)\b/i;

function quoteWord(word: string): string {
  return `"${word}"`;
}

/** Keep instructor copy to at most three sentences. */
function clampSentences(text: string, max = 3): string {
  const parts = text.match(/[^.!?]+[.!?]+/g);
  if (!parts?.length) return text.trim();
  return parts.slice(0, max).join(" ").trim();
}

function coachCopy(
  message: string,
  speechText: string,
): { message: string; speechText: string } {
  return {
    message: clampSentences(message),
    speechText: clampSentences(speechText, 2),
  };
}

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
  const q = quoteWord(targetWord);
  if (missionPass) {
    return coachCopy(
      `Nice work. ${q} was clear and the sentence flowed naturally. Continue to the next word.`,
      `Nice work. ${q} was clear. Continue to the next word.`,
    );
  }
  if (practiceLevel >= 3) {
    return coachCopy(
      `Nice work. ${q} was clear in the sentence. Connect it naturally and try once more, or move on when ready.`,
      `Nice work. ${q} was clear. Connect it naturally in the full sentence.`,
    );
  }
  return coachCopy(
    `Strong work on ${q}. Keep that clarity and move to the next challenge.`,
    `Strong work on ${q}. Keep that clarity and move on.`,
  );
}

function buildAccuracyFeedback(
  score: number,
  targetWord: string,
  fluencyScore: number,
): { message: string; speechText: string } {
  const q = quoteWord(targetWord);
  const understandable =
    fluencyScore >= 85
      ? "The sentence was understandable, but "
      : "I heard you, but ";

  if (score < 70) {
    return coachCopy(
      `Good attempt. ${understandable}${q} needs a cleaner, shorter sound. Say ${q} once, then repeat the full sentence.`,
      `Good attempt. ${q} needs a cleaner sound. Say it once, then repeat the full sentence.`,
    );
  }
  if (score < 85) {
    return coachCopy(
      `Good attempt. ${understandable}${q} needs a sharper sound. Say ${q} once, then repeat the full sentence.`,
      `Good attempt. ${q} needs a sharper sound. Say it once, then repeat the full sentence.`,
    );
  }
  return coachCopy(
    `Good. ${q} is understandable — polish the stress on the target syllable and try once more.`,
    `Good. ${q} is close. Polish the stress and try once more.`,
  );
}

function buildFluencyFeedback(
  score: number,
  targetWord: string,
): { message: string; speechText: string } {
  const q = quoteWord(targetWord);
  if (score < 70) {
    return coachCopy(
      `Good attempt. ${q} came through, but the rhythm was choppy. Link the words smoothly and say the full sentence again.`,
      `Good attempt. ${q} was choppy. Smooth the rhythm and say the full sentence again.`,
    );
  }
  if (score < 85) {
    return coachCopy(
      `Good. ${q} was there, but you paused too much. Keep a steady flow through the whole sentence and try again.`,
      `Good. ${q} was there, but the flow broke up. Keep a steady rhythm and try again.`,
    );
  }
  return coachCopy(
    `Mostly smooth on ${q}. Trim one small pause and run the sentence in one breath.`,
    `Mostly smooth on ${q}. Trim one pause and try again.`,
  );
}

function buildProsodyFeedback(
  score: number,
  targetWord: string,
): { message: string; speechText: string } {
  const q = quoteWord(targetWord);
  if (score < 70) {
    return coachCopy(
      `Good attempt. The sentence was understandable, but the stress on ${q} sounded flat. Put more weight on ${q} and say the sentence once more.`,
      `Good attempt. ${q} sounded flat. Put more weight on it and say the sentence again.`,
    );
  }
  if (score < 85) {
    return coachCopy(
      `Good. ${q} was clear enough, but the stress could be stronger. Lift ${q} in the sentence and try again.`,
      `Good. ${q} needs stronger stress. Lift it in the sentence and try again.`,
    );
  }
  return coachCopy(
    `Almost there on ${q}. Add a little more natural rhythm on the stressed syllable and repeat.`,
    `Almost there on ${q}. Add a little more rhythm and repeat.`,
  );
}

function buildCompletenessFeedback(
  score: number,
  targetWord: string,
  referenceText: string,
): { message: string; speechText: string } {
  const q = quoteWord(targetWord);
  const tail = referenceText.split(/\s+/).slice(-3).join(" ").replace(/[.,!?;:]+$/, "");
  const ending = tail ? ` through "${tail}"` : "";
  if (score < 90) {
    return coachCopy(
      `Good start. You cut the sentence short${ending}. Say the full sentence without skipping any words.`,
      `Good start. Say the full sentence${ending ? ` through ${quoteWord(tail)}` : ""} — every word.`,
    );
  }
  return coachCopy(
    `Nearly complete on ${q}. Finish the last words clearly and say the full sentence once more.`,
    `Nearly complete. Finish the last words and say the full sentence again.`,
  );
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
  const stored = recommendedPracticeLevel(word);
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
  return !METRIC_LABEL_PATTERN.test(text) && !/\b(Accuracy|Fluency|Completeness|Prosody)\s+\d+/i.test(text);
}
