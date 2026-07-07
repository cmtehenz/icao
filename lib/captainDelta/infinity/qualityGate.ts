/** Captain Delta Infinity — reject robotic, technical, or score-reading copy. */

const METRIC_LABELS = /\b(Accuracy|Fluency|Completeness|Prosody|Score)\b/i;

const FORBIDDEN_INSTRUCTOR_TERMS =
  /\b(Accuracy|Fluency|Completeness|Prosody|Score|Azure|Recognizer|SDK|Session|Callback|JSON|NoMatch|drain\s+timeout)\b/i;

const DICTIONARY_OPENERS =
  /^(the definition of|according to the dictionary|in english,? this means)\b/i;

const MAX_INSTRUCTOR_SENTENCES = 10;
const MAX_SPEECH_SENTENCES = 3;

export function passesInstructorQualityGate(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (FORBIDDEN_INSTRUCTOR_TERMS.test(trimmed)) return false;
  if (METRIC_LABELS.test(trimmed) && /\d/.test(trimmed)) return false;
  if (DICTIONARY_OPENERS.test(trimmed)) return false;
  if (sentenceCount(trimmed) > MAX_INSTRUCTOR_SENTENCES) return false;
  return true;
}

export function passesSpeechQualityGate(text: string): boolean {
  if (!passesInstructorQualityGate(text)) return false;
  return sentenceCount(text.trim()) <= MAX_SPEECH_SENTENCES;
}

export function sanitizeInstructorCopy(text: string): string {
  let out = text.trim();
  if (!passesInstructorQualityGate(out)) {
    out = clampSentences(out, MAX_INSTRUCTOR_SENTENCES);
  }
  return out;
}

export function clampSentences(text: string, max: number): string {
  const parts = text.match(/[^.!?]+[.!?]+/g);
  if (!parts?.length) return text.trim();
  return parts.slice(0, max).join(" ").trim();
}

function sentenceCount(text: string): number {
  const normalized = text
    .replace(/"[^"]*"/g, (quoted) => quoted.replace(/\./g, "·"))
    .replace(/\.{3,}/g, "…");
  const parts = normalized.split(/(?<=[.!?])\s+/).filter((p) => p.trim().length > 0);
  return parts.length || 1;
}

/** @deprecated use passesInstructorQualityGate — kept for pronunciationCoach re-export */
export function spokenFeedbackExcludesRawScores(text: string): boolean {
  return passesInstructorQualityGate(text) && !METRIC_LABELS.test(text);
}
