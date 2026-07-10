/** Short AFFIRM / NEGATIVE + callsign — scripted phraseology, not free speech. */
export function isShortPhraseologyAnswer(modelAnswer: string): boolean {
  const trimmed = modelAnswer.trim();
  if (!trimmed) return false;
  return /^(AFFIRM|NEGATIVE)\b/i.test(trimmed);
}

function norm(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Fix common Azure STT errors on AFFIRM / NEGATIVE + ANAC 123. */
export function normalizeConfirmTranscript(transcript: string): string {
  let t = transcript;

  t = t.replace(/\ba\s*firm\b/gi, "AFFIRM");
  t = t.replace(/\baffirmative\b/gi, "AFFIRM");
  t = t.replace(/\bnegativ(e|)\b/gi, "NEGATIVE");

  t = t.replace(
    /\banac\s*(?:wun|one|1)\s*(?:too|two|to|2)\s*(?:tree|three|dream|3)\b/gi,
    "ANAC 123",
  );
  t = t.replace(/\b1\s*[- ]?\s*2\s*[- ]?\s*(?:3|three|tree|dream)\b/gi, "123");
  t = t.replace(/\b(?:one|wun)\s+(?:two|too)\s+(?:three|tree|dream)\b/gi, "123");

  const n = norm(t);
  if (/\baffirm\b/.test(n) && /\b123\b/.test(n) && !/\banac\b/.test(n)) {
    t = t.replace(/\b123\b/i, "ANAC 123");
  }

  return t.replace(/\s+/g, " ").trim();
}

export function scoreConfirmResponse(transcript: string, modelAnswer: string): number {
  const t = norm(normalizeConfirmTranscript(transcript));
  const model = norm(modelAnswer);
  const wantsAffirm = /\baffirm\b/.test(model);
  const wantsNegative = /\bnegative\b/.test(model);

  let score = 0;
  if (wantsAffirm && /\baffirm\b/.test(t)) score += 55;
  if (wantsNegative && /\bnegative\b/.test(t)) score += 55;

  const hasCallsign =
    /\banac\s*123\b/.test(t) ||
    (/\banac\b/.test(t) && /\b123\b/.test(t)) ||
    /\banac\s*(?:wun|one)\s*(?:too|two)\s*(?:tree|three)\b/.test(t);
  if (hasCallsign) score += 45;

  return Math.min(100, score);
}
