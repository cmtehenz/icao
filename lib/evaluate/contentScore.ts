import { buildSpokenAnswer } from "@/lib/spokenAnswer";
import { keywordMatchesFlexible } from "./keywordAliases";
import { peelStructureScore } from "./peel";

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "to", "of", "in", "on", "at", "for", "is", "are", "was", "were",
  "i", "we", "you", "it", "that", "this", "with", "as", "be", "have", "has", "had", "my", "our",
  "your", "but", "so", "if", "when", "can", "will", "would", "could", "should", "they", "them",
  "their", "he", "she", "his", "her", "all", "not", "by", "from", "about", "into", "than",
]);

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s'-]/g, " ").replace(/\s+/g, " ").trim();
}

function tokens(text: string): string[] {
  return normalize(text).split(" ").filter(Boolean);
}

function uniqueContentWords(words: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const w of words) {
    if (w.length < 4 || STOP_WORDS.has(w) || seen.has(w)) continue;
    seen.add(w);
    out.push(w);
  }
  return out;
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function keywordMatches(transcript: string, keyword: string): boolean {
  return keywordMatchesFlexible(transcript, keyword);
}

export function keywordCoverage(transcript: string, keywords: string[]) {
  if (!keywords.length) {
    return { percent: 0, matched: [] as string[], missing: [] as string[] };
  }
  const matched = keywords.filter((kw) => keywordMatches(transcript, kw));
  const missing = keywords.filter((kw) => !keywordMatches(transcript, kw));
  return {
    percent: Math.round((matched.length / keywords.length) * 100),
    matched,
    missing,
  };
}

function contentWordOverlap(transcript: string, modelAnswer: string): number {
  const modelWords = uniqueContentWords(tokens(buildSpokenAnswer(modelAnswer)));
  if (!modelWords.length) return 0;
  const transcriptSet = new Set(tokens(transcript));
  let hit = 0;
  for (const w of modelWords) {
    if (transcriptSet.has(w)) hit++;
  }
  return Math.round((hit / modelWords.length) * 100);
}

export type Part1ContentScore = {
  score: number;
  keywordCoverage: number;
  contentOverlap: number;
  structureScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
};

/** Part 1: ideas + keywords matter — not verbatim model text. */
export function scorePart1Content(
  transcript: string,
  modelAnswer: string,
  keywords: string[],
): Part1ContentScore {
  const kw = keywordCoverage(transcript, keywords);
  const contentOverlap = contentWordOverlap(transcript, modelAnswer);
  const structureScore = peelStructureScore(transcript);

  let score: number;
  if (keywords.length >= 2) {
    score = kw.percent * 0.5 + contentOverlap * 0.25 + structureScore * 0.25;
  } else if (keywords.length === 1) {
    score = kw.percent * 0.35 + contentOverlap * 0.35 + structureScore * 0.3;
  } else {
    score = contentOverlap * 0.45 + structureScore * 0.55;
  }

  return {
    score: clamp(score),
    keywordCoverage: kw.percent,
    contentOverlap,
    structureScore,
    matchedKeywords: kw.matched,
    missingKeywords: kw.missing,
  };
}
