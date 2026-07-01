function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s'-]/g, " ").replace(/\s+/g, " ").trim();
}

/** Semantic aliases — keywords are ideas, not exact words to memorize. */
const ALIASES: Record<string, string[]> = {
  unsafe: ["unsafe", "not safe", "not safe to land", "cannot land", "can't land", "safe landing cannot"],
  weather: ["weather", "bad weather", "poor visibility", "visibility"],
  runway: ["runway", "runway obstruction", "traffic on the runway"],
  "try again": [
    "try again",
    "another approach",
    "go around",
    "divert",
    "tries another approach",
    "try another approach",
  ],
  young: ["young", "very young", "when i was"],
  helicopters: ["helicopter", "helicopters"],
  training: ["training", "flight training", "learn to fly", "learning to fly"],
  career: ["career", "helicopter pilot", "work as a pilot", "my job", "my life"],
  standard: ["standard", "around the world", "worldwide"],
  clear: ["clear", "easy to understand"],
  safety: ["safety", "flight safety", "safe decision"],
};

export function keywordMatchesFlexible(transcript: string, keyword: string): boolean {
  const t = normalize(transcript);
  const key = normalize(keyword);
  const phrases = ALIASES[key] ?? [key];
  return phrases.some((phrase) => {
    const parts = phrase.split(" ").filter(Boolean);
    return parts.length > 0 && parts.every((p) => t.includes(p));
  });
}
