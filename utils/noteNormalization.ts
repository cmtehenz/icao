/** Collapse whitespace and punctuation for per-token comparison. */
export function normalizeNoteToken(token: string): string {
  return token
    .toUpperCase()
    .replace(/,/g, "")
    .replace(/\s+/g, "")
    .trim();
}

/** Normalize full notes text while keeping word boundaries for display. */
export function normalizeNotesText(text: string): string {
  return text
    .toUpperCase()
    .replace(/,/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Split student notes into candidate tokens (lines, commas, spaces). */
export function extractNoteTokens(text: string): string[] {
  if (!text.trim()) return [];

  const tokens: string[] = [];
  for (const line of text.split(/\n/)) {
    for (const segment of line.split(/,/)) {
      const trimmed = segment.trim();
      if (!trimmed) continue;
      tokens.push(trimmed);
      const words = trimmed.split(/\s+/).filter(Boolean);
      if (words.length > 1) {
        tokens.push(words.join(" "));
        tokens.push(words.join(""));
      }
    }
  }
  return [...new Set(tokens)];
}

/** Check whether student notes contain a required/optional code (spacing-tolerant). */
export function studentNotesContainCode(studentNotes: string, code: string): boolean {
  const normCode = normalizeNoteToken(code);
  if (!normCode) return false;

  const candidates = [
    ...extractNoteTokens(studentNotes),
    ...studentNotes.split(/\n/).map((line) => line.trim()).filter(Boolean),
  ];

  for (const candidate of candidates) {
    const normCandidate = normalizeNoteToken(candidate);
    if (normCandidate === normCode) return true;
    if (normCandidate.length >= normCode.length && normCandidate.includes(normCode)) return true;
  }

  return false;
}
