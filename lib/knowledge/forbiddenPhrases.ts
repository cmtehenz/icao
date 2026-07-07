/** Phrases forbidden in Captain speech and knowledge entries. */

export const FORBIDDEN_CAPTAIN_PHRASES = [
  /in part 2/i,
  /i would explain/i,
  /this lesson/i,
  /in this exercise/i,
  /we are learning/i,
  /this vocabulary/i,
  /about the exam/i,
  /about the app/i,
] as const;

export type ForbiddenPhraseMatch = {
  phrase: string;
  field: string;
  text: string;
};

export function findForbiddenPhrases(
  texts: Record<string, string | string[] | undefined>,
): ForbiddenPhraseMatch[] {
  const hits: ForbiddenPhraseMatch[] = [];

  for (const [field, value] of Object.entries(texts)) {
    const lines = Array.isArray(value) ? value : value ? [value] : [];
    for (const text of lines) {
      for (const pattern of FORBIDDEN_CAPTAIN_PHRASES) {
        if (pattern.test(text)) {
          hits.push({ phrase: pattern.source, field, text });
        }
      }
    }
  }

  return hits;
}

export function hasForbiddenPhrases(texts: Record<string, string | string[] | undefined>): boolean {
  return findForbiddenPhrases(texts).length > 0;
}
