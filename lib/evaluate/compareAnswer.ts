import { buildSpokenAnswer } from "@/lib/spokenAnswer";

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "to", "of", "in", "on", "at", "for", "is", "are", "was", "were",
  "i", "we", "you", "it", "that", "this", "with", "as", "be", "have", "has", "had", "my", "our",
  "your", "but", "so", "if", "when", "can", "will", "would", "could", "should", "they", "them",
  "their", "he", "she", "his", "her", "all", "not", "by", "from", "or", "about", "into", "than",
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

export type AnswerCompareResult = {
  spokenModel: string;
  overlapPercent: number;
  matchedContentWords: string[];
  missingContentWords: string[];
  extraContentWords: string[];
  unreliableTranscript: boolean;
};

export function compareTranscriptToModel(
  transcript: string,
  modelAnswer: string,
): AnswerCompareResult {
  const spokenModel = buildSpokenAnswer(modelAnswer);
  const modelTokens = tokens(spokenModel);
  const transcriptTokens = tokens(transcript);
  const modelSet = new Set(modelTokens);
  const transcriptSet = new Set(transcriptTokens);

  let matched = 0;
  for (const w of modelTokens) {
    if (transcriptSet.has(w)) matched++;
  }

  const overlapPercent = modelTokens.length
    ? Math.round((matched / modelTokens.length) * 100)
    : 0;

  const matchedContentWords = uniqueContentWords(
    modelTokens.filter((w) => transcriptSet.has(w)),
  ).slice(0, 12);

  const missingContentWords = uniqueContentWords(
    modelTokens.filter((w) => !transcriptSet.has(w)),
  ).slice(0, 14);

  const extraContentWords = uniqueContentWords(
    transcriptTokens.filter((w) => !modelSet.has(w)),
  ).slice(0, 12);

  const unreliableTranscript =
    transcript.trim().length > 0 &&
    transcriptTokens.length >= 25 &&
    overlapPercent < 45;

  return {
    spokenModel,
    overlapPercent,
    matchedContentWords,
    missingContentWords,
    extraContentWords,
    unreliableTranscript,
  };
}
