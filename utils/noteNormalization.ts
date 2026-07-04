/** Student shorthand → accepted variants when matching required codes */
const CODE_MATCH_ALIASES: Record<string, string[]> = {
  "RWY HDG": ["RWY HD", "RWYHD", "RWYHDG", "MNT RWY HDG", "MNT RWY HD"],
  "RWY HD": ["RWY HDG"],
  GEAR: ["GEAR STK", "GEARSTK"],
  "GEAR STK": ["GEAR", "GEARSTK"],
  HDG: ["HD"],
  HD: ["HDG"],
  SQK: ["SQUAWK"],
  IDENT: ["SQK IDENT", "SQUAWK IDENT"],
};

/** Collapse whitespace and punctuation for per-token comparison. */
export function normalizeNoteToken(token: string): string {
  return token
    .toUpperCase()
    .replace(/,/g, "")
    .replace(/\s+/g, "")
    .trim();
}

export function codesEquivalent(a: string, b: string): boolean {
  const normA = normalizeNoteToken(a);
  const normB = normalizeNoteToken(b);
  if (normA === normB) return true;
  if (normA.length >= normB.length && normA.includes(normB)) return true;
  if (normB.length >= normA.length && normB.includes(normA)) return true;
  return false;
}

export function variantsForCode(code: string): string[] {
  const variants = new Set<string>([code]);
  const norm = normalizeNoteToken(code);

  for (const [canonical, aliases] of Object.entries(CODE_MATCH_ALIASES)) {
    const canonNorm = normalizeNoteToken(canonical);
    const aliasNorms = aliases.map(normalizeNoteToken);
    if (norm === canonNorm || aliasNorms.includes(norm)) {
      variants.add(canonical);
      for (const alias of aliases) variants.add(alias);
    }
  }

  return [...variants];
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
  const candidates = [
    ...extractNoteTokens(studentNotes),
    ...studentNotes.split(/\n/).map((line) => line.trim()).filter(Boolean),
  ];

  for (const variant of variantsForCode(code)) {
    const normCode = normalizeNoteToken(variant);
    if (!normCode) continue;

    for (const candidate of candidates) {
      const normCandidate = normalizeNoteToken(candidate);
      if (normCandidate === normCode) return true;
      if (normCandidate.length >= normCode.length && normCandidate.includes(normCode)) return true;
      if (normCode.length >= normCandidate.length && normCode.includes(normCandidate) && normCandidate.length >= 3) {
        return true;
      }
    }
  }

  return false;
}
