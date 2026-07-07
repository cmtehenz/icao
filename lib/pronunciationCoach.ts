import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import { splitSyllables } from "@/lib/captainDelta/visual/syllables";
import type { CaptainIntent } from "@/lib/captainDelta/infinity/types";
import {
  classifyCaptainIntent,
  isCaptainStudentQuestion,
  respondAsCaptainInstructor,
  resetCaptainLessonMemoryForTests,
  rememberCaptainLesson,
} from "@/lib/captainDelta/infinity/respond";
import { applyAdaptiveDebrief } from "@/lib/captainDelta/infinity/adaptiveDebrief";
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

/** Spoken/UI coaching must never expose Azure or SDK terminology. */
const FORBIDDEN_COACH_TERMS =
  /\b(Accuracy|Fluency|Completeness|Prosody|SDK|Azure|Recognizer|Callback|Session|NoMatch|JSON|Scores?|drain\s+timeout)\b/i;

function quoteWord(word: string): string {
  return `"${word}"`;
}

function capitalizeWord(word: string): string {
  const w = word.trim();
  if (!w) return w;
  return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
}

function focusWord(targetWord: string, assessment: AzurePronunciationResult): string {
  const key = targetWord.trim().toLowerCase();
  const scored = assessment.words?.filter((w) => w.word?.trim()) ?? [];
  if (!scored.length) return targetWord;
  const hit = scored.find(
    (w) =>
      w.word.toLowerCase() === key ||
      w.word.toLowerCase().includes(key) ||
      key.includes(w.word.toLowerCase()),
  );
  if (hit) return hit.word;
  const weakest = [...scored].sort((a, b) => a.accuracyScore - b.accuracyScore)[0];
  return weakest?.word ?? targetWord;
}

function syllableDrillLine(word: string): string {
  const parts = splitSyllables(word);
  if (parts.length <= 1) {
    return `Say ${quoteWord(capitalizeWord(word))} slowly once, then again at normal speed.`;
  }
  const slow = parts.map((p) => p.toUpperCase()).join("... ");
  return `Listen carefully. ${slow}... Now together — ${word.toUpperCase()}.`;
}

function linkedSpeechHint(referenceText: string): string {
  const words = referenceText
    .replace(/[.,!?;:]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4);
  if (words.length < 2) return referenceText.trim();
  return words.join("_").toLowerCase();
}

type InstructorLesson = {
  positive: string;
  focus: string;
  teach: string;
  exercise: string;
  repeat: string;
};

function buildInstructorLesson(lesson: InstructorLesson): { message: string; speechText: string } {
  const body = [lesson.positive, lesson.focus, lesson.teach, lesson.exercise]
    .filter(Boolean)
    .join(" ");
  const message = lesson.repeat ? `${clampSentences(body, 5)} ${lesson.repeat}` : clampSentences(body, 6);

  const speechText = [lesson.positive, lesson.exercise, lesson.repeat]
    .filter(Boolean)
    .join(" ");

  return {
    message: message.trim(),
    speechText: clampSentences(speechText, 3),
  };
}

/** Keep instructor copy to at most N sentences. */
function clampSentences(text: string, max = 3): string {
  const parts = text.match(/[^.!?]+[.!?]+/g);
  if (!parts?.length) return text.trim();
  return parts.slice(0, max).join(" ").trim();
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
    return buildInstructorLesson({
      positive: "Nice work.",
      focus: `${q} sounded clear and natural in the sentence.`,
      teach: "You kept a steady rhythm — that's what examiners listen for.",
      exercise: "",
      repeat: "Continue to the next word when you're ready.",
    });
  }
  if (practiceLevel >= 3) {
    return buildInstructorLesson({
      positive: "Nice work.",
      focus: `${q} came through clearly in context.`,
      teach: "Keep linking the words smoothly — like one calm radio call.",
      exercise: "",
      repeat: "Try the full sentence once more, or move on when ready.",
    });
  }
  return buildInstructorLesson({
    positive: "Strong work.",
    focus: `${q} is clear enough to build on.`,
    teach: "Next step is using it in a short phrase, not only by itself.",
    exercise: "",
    repeat: "Move to the next challenge when you're ready.",
  });
}

function buildAccuracyFeedback(
  score: number,
  targetWord: string,
  assessment: AzurePronunciationResult,
  fluencyScore: number,
): { message: string; speechText: string } {
  const word = focusWord(targetWord, assessment);
  const q = quoteWord(word);
  const understood =
    fluencyScore >= 85
      ? "I understood what you meant."
      : "I heard you — the idea came through.";

  if (score < 70) {
    return buildInstructorLesson({
      positive: `Good attempt. ${understood}`,
      focus: `Let's clean up the sound in ${q}.`,
      teach: "Open your mouth a little more and keep the vowel short — don't stretch it into an 'ee' sound.",
      exercise: `Say ${q} once slowly, then once at normal speed.`,
      repeat: "Now repeat the full sentence.",
    });
  }
  if (score < 85) {
    return buildInstructorLesson({
      positive: `Good attempt. ${understood}`,
      focus: `One sound in ${q} needs to be sharper.`,
      teach: "Keep the vowel short and the consonants crisp — like a clear radio readback.",
      exercise: `Say ${q} once by itself.`,
      repeat: "Now put it back into the full sentence.",
    });
  }
  return buildInstructorLesson({
    positive: "Good.",
    focus: `${q} is understandable — almost there.`,
    teach: "Polish the stressed syllable so the word pops naturally.",
    exercise: syllableDrillLine(word),
    repeat: "Now repeat the full sentence once more.",
  });
}

function buildFluencyFeedback(
  score: number,
  targetWord: string,
  referenceText: string,
): { message: string; speechText: string } {
  const q = quoteWord(targetWord);
  const linked = linkedSpeechHint(referenceText);
  if (score < 70) {
    return buildInstructorLesson({
      positive: "Good attempt. I understood you.",
      focus: "The sentence sounded a little chopped.",
      teach: "Try not to stop between the words — imagine speaking in one breath, like a calm checklist call.",
      exercise: linked.includes("_")
        ? `Link it smoothly: ${linked.replace(/_/g, " ")} — almost as one flow.`
        : "Keep the words flowing without pauses in the middle.",
      repeat: "Now say the full sentence again.",
    });
  }
  if (score < 85) {
    return buildInstructorLesson({
      positive: "Good. The meaning was clear.",
      focus: `${q} was there, but you paused too much.`,
      teach: "Keep a steady flow through the whole line — less stop, more glide.",
      exercise: "Take a small breath, then run the sentence in one go.",
      repeat: "Try the full sentence again.",
    });
  }
  return buildInstructorLesson({
    positive: "Mostly smooth.",
    focus: "One small pause broke the rhythm.",
    teach: "Trim that pause and keep the line moving.",
    exercise: "Say the first half, then the full sentence without stopping.",
    repeat: "Go again when ready.",
  });
}

function buildProsodyFeedback(
  score: number,
  targetWord: string,
  assessment: AzurePronunciationResult,
): { message: string; speechText: string } {
  const word = focusWord(targetWord, assessment);
  const q = quoteWord(word);
  const drill = syllableDrillLine(word);

  if (score < 70) {
    return buildInstructorLesson({
      positive: "Good attempt. I understood what you meant.",
      focus: `Now let's make ${q} sound more natural.`,
      teach: "Notice where my voice gets stronger — the first syllable carries the energy. Hold it just a little longer and raise your pitch slightly.",
      exercise: drill,
      repeat: "Great. Now put it back into the full sentence.",
    });
  }
  if (score < 85) {
    return buildInstructorLesson({
      positive: "Good. The sentence was understandable.",
      focus: `The stress on ${q} could be stronger.`,
      teach: "Put more weight on the stressed syllable — let the rest of the word settle.",
      exercise: drill,
      repeat: "Now say the full sentence once more.",
    });
  }
  return buildInstructorLesson({
    positive: "Almost there.",
    focus: `${q} is close — one more touch on the rhythm.`,
    teach: "Lift the stressed syllable slightly so it sounds like native helicopter English.",
    exercise: `Repeat only the stressed part of ${q}, then the whole word.`,
    repeat: "Now the full sentence again.",
  });
}

function buildCompletenessFeedback(
  score: number,
  referenceText: string,
): { message: string; speechText: string } {
  const tail = referenceText.split(/\s+/).slice(-3).join(" ").replace(/[.,!?;:]+$/, "");
  const ending = tail ? ` through ${quoteWord(tail)}` : "";

  if (score < 90) {
    return buildInstructorLesson({
      positive: "Good start. I heard most of it.",
      focus: "You stopped before the end.",
      teach: "Say the full line in one breath — every word matters on the radio.",
      exercise: ending
        ? `Make sure you finish${ending}.`
        : "Don't skip the last words.",
      repeat: "Repeat the full sentence without cutting it short.",
    });
  }
  return buildInstructorLesson({
    positive: "Nearly complete.",
    focus: "The ending faded out a little.",
    teach: "Finish the last words clearly — keep the energy through the final syllable.",
    exercise: tail ? `Practice the ending: ${quoteWord(tail)}.` : "Focus on the last words.",
    repeat: "Now say the full sentence once more.",
  });
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
          assessment,
          scores.fluency,
        );
        break;
      case "fluency":
        copy = buildFluencyFeedback(scores.fluency, targetWord, referenceText);
        break;
      case "prosody":
        copy = buildProsodyFeedback(scores.prosody, targetWord, assessment);
        break;
      case "completeness":
        copy = buildCompletenessFeedback(scores.completeness, referenceText);
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

  copy = applyAdaptiveDebrief(copy, {
    targetWord,
    referenceText,
    practiceLevel,
    focus,
    missionPass,
    assessment,
  });

  rememberPronunciationCoachSession({
    targetWord,
    referenceText,
    practiceLevel,
    lastFocus: focus,
    recognizedText: assessment.recognizedText ?? "",
    lastCoachingMessage: copy.message,
  });

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

export type PronunciationAskIntent =
  | "pronunciation_help"
  | "stress_help"
  | "rhythm_help"
  | "vowel_help"
  | "word_meaning"
  | "sentence_explanation"
  | "aviation_context"
  | "icao_answer_help"
  | "repeat_instruction"
  | "technical_recording_error"
  | "general_question";

export type PronunciationAskContext = {
  targetWord?: string | null;
  referenceText?: string | null;
  targetPhrase?: string | null;
  practiceLevel?: PracticeLevel;
  recognizedText?: string | null;
  lastFocus?: CoachingFocus | null;
  lastCoachingMessage?: string | null;
};

type PronunciationCoachSession = Required<
  Pick<
    PronunciationAskContext,
    | "targetWord"
    | "referenceText"
    | "practiceLevel"
    | "lastFocus"
    | "recognizedText"
    | "lastCoachingMessage"
  >
>;

let lastPronunciationCoachSession: PronunciationCoachSession | null = null;

export function rememberPronunciationCoachSession(
  session: PronunciationAskContext & {
    targetWord: string;
    referenceText: string;
    practiceLevel: PracticeLevel;
    lastFocus: CoachingFocus;
    lastCoachingMessage: string;
    recognizedText?: string;
  },
): void {
  lastPronunciationCoachSession = {
    targetWord: session.targetWord,
    referenceText: session.referenceText,
    practiceLevel: session.practiceLevel,
    lastFocus: session.lastFocus,
    recognizedText: session.recognizedText?.trim() ?? "",
    lastCoachingMessage: session.lastCoachingMessage,
  };
  rememberCaptainLesson({
    currentWord: session.targetWord,
    referenceText: session.referenceText,
    practiceLevel: session.practiceLevel,
    lastCoaching: session.lastCoachingMessage,
    lastMistake: session.lastFocus !== "strong" ? session.lastFocus : null,
  });
}

export function getLastPronunciationCoachSession(): PronunciationCoachSession | null {
  return lastPronunciationCoachSession;
}

export function resetPronunciationCoachSessionForTests(): void {
  lastPronunciationCoachSession = null;
  resetCaptainLessonMemoryForTests();
}

function mapCaptainIntentToLegacy(intent: CaptainIntent): PronunciationAskIntent {
  switch (intent) {
    case "stress_help":
      return "stress_help";
    case "rhythm_help":
    case "connected_speech":
      return "rhythm_help";
    case "vowel_help":
    case "consonant_help":
      return "vowel_help";
    case "pronunciation_question":
      return "pronunciation_help";
    case "meaning_question":
      return "sentence_explanation";
    case "vocabulary_question":
      return "word_meaning";
    case "aviation_context":
    case "helicopter_operation":
    case "phraseology":
    case "atc":
    case "crm":
    case "weather":
    case "navigation":
    case "random_aviation":
      return "aviation_context";
    case "icao_answer":
    case "exam_strategy":
      return "icao_answer_help";
    case "repeat_request":
    case "explain_again":
      return "repeat_instruction";
    case "technical_recording_error":
      return "technical_recording_error";
    default:
      return "general_question";
  }
}

function mapLegacyIntentToCaptain(intent: PronunciationAskIntent): CaptainIntent {
  switch (intent) {
    case "stress_help":
      return "stress_help";
    case "rhythm_help":
      return "rhythm_help";
    case "vowel_help":
      return "vowel_help";
    case "pronunciation_help":
      return "pronunciation_question";
    case "word_meaning":
      return "vocabulary_question";
    case "sentence_explanation":
      return "meaning_question";
    case "aviation_context":
      return "aviation_context";
    case "icao_answer_help":
      return "icao_answer";
    case "repeat_instruction":
      return "repeat_request";
    case "technical_recording_error":
      return "technical_recording_error";
    default:
      return "pronunciation_question";
  }
}

function resolveAskContext(ctx: PronunciationAskContext = {}) {
  const session = lastPronunciationCoachSession;
  const word = ctx.targetWord?.trim() || session?.targetWord || "the word";
  const referenceText =
    ctx.referenceText?.trim() ||
    ctx.targetPhrase?.trim() ||
    session?.referenceText ||
    "";
  return {
    word,
    referenceText,
    practiceLevel: ctx.practiceLevel ?? session?.practiceLevel ?? 1,
    lastFocus: ctx.lastFocus ?? session?.lastFocus ?? null,
    recognizedText: ctx.recognizedText?.trim() || session?.recognizedText || "",
    lastCoachingMessage:
      ctx.lastCoachingMessage?.trim() || session?.lastCoachingMessage || "",
  };
}

/** Infinity intent router — maps Captain Delta teaching intents to legacy ask intents. */
export function classifyPronunciationStudentIntent(
  question: string,
  ctx: PronunciationAskContext = {},
): PronunciationAskIntent {
  const resolved = resolveAskContext(ctx);
  rememberCaptainLesson({
    currentWord: resolved.word,
    referenceText: resolved.referenceText,
    practiceLevel: resolved.practiceLevel,
    lastCoaching: resolved.lastCoachingMessage,
    lastMistake: resolved.lastFocus ?? null,
  });
  const { intent } = classifyCaptainIntent(question, {
    lastIntent: null,
    lastCoaching: resolved.lastCoachingMessage,
    currentWord: resolved.word,
    referenceText: resolved.referenceText,
  });
  if (intent === "unknown" && resolved.lastFocus === "prosody") return "stress_help";
  if (intent === "unknown" && resolved.lastFocus === "fluency") return "rhythm_help";
  if (intent === "unknown" && resolved.lastFocus === "accuracy") return "vowel_help";
  return mapCaptainIntentToLegacy(intent);
}

export function isPronunciationStudentQuestion(text: string): boolean {
  return isCaptainStudentQuestion(text);
}

/** @deprecated use isPronunciationStudentQuestion */
export function isPronunciationCoachingQuestion(text: string): boolean {
  return isPronunciationStudentQuestion(text);
}

export function shouldAnswerPronunciationLocally(_intent: PronunciationAskIntent): boolean {
  return true;
}

/** Infinity — local instructor answer; never triggers recording or Azure. */
export function answerPronunciationStudentQuestion(
  question: string,
  intent: PronunciationAskIntent = classifyPronunciationStudentIntent(question),
  ctx: PronunciationAskContext = {},
): { message: string; speechText: string; intent: PronunciationAskIntent } {
  const resolved = resolveAskContext(ctx);
  const captainIntent = mapLegacyIntentToCaptain(intent);
  const response = respondAsCaptainInstructor({
    question,
    intent: captainIntent,
    currentWord: resolved.word,
    referenceText: resolved.referenceText,
    practiceLevel: resolved.practiceLevel,
    lastCoaching: resolved.lastCoachingMessage,
    lastMistake: resolved.lastFocus ?? null,
  });
  return {
    message: response.message,
    speechText: response.speechText,
    intent: mapCaptainIntentToLegacy(response.intent),
  };
}

/** @deprecated use answerPronunciationStudentQuestion */
export function answerPronunciationCoachingQuestion(
  question: string,
  ctx: PronunciationAskContext = {},
): { message: string; speechText: string } {
  const result = answerPronunciationStudentQuestion(question, undefined, ctx);
  return { message: result.message, speechText: result.speechText };
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
  return (
    !METRIC_LABEL_PATTERN.test(text) &&
    !FORBIDDEN_COACH_TERMS.test(text) &&
    !/\b(Accuracy|Fluency|Completeness|Prosody)\s+\d+/i.test(text)
  );
}

/** V1 guard — coaching copy must stay instructor-safe (no Azure/SDK terms). */
export function coachingCopyIsInstructorSafe(text: string): boolean {
  return spokenFeedbackExcludesRawScores(text);
}
