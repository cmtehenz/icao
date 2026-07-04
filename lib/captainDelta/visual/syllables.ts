/** Rough syllable split for visual coaching — not linguistic perfection. */
export function splitSyllables(word: string): string[] {
  const w = word.trim().toLowerCase();
  if (!w) return [];
  const parts = w.match(/[^aeiouy]*[aeiouy]+(?:[^aeiouy]*|$)/gi);
  return parts?.length ? parts : [w];
}

export function syllableTargetId(syllable: string): string {
  return `syllable-${syllable.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export function weakestSyllable(
  word: string,
  syllableScores: { text: string; score: number }[],
): string | undefined {
  if (!syllableScores.length) return splitSyllables(word)[0];
  const worst = [...syllableScores].sort((a, b) => a.score - b.score)[0];
  return worst?.text;
}
