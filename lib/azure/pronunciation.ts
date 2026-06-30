import { buildSpokenAnswer } from "@/lib/spokenAnswer";
import { shouldSkipPronunciationVaultWord } from "@/lib/aviationSpeechTerms";

export type AzureWordScore = {
  word: string;
  accuracyScore: number;
  errorType?: string;
};

export type AzurePronunciationResult = {
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  prosodyScore: number;
  recognizedText: string;
  words: AzureWordScore[];
};

export function isScriptedAssessment(type: string): boolean {
  return (
    type === "part1" ||
    type === "part2-readback" ||
    type === "part2-reported" ||
    type === "part2-interaction"
  );
}

/** Reference text for Azure pronunciation assessment. */
export function azureReferenceText(modelAnswer: string, type: string): string {
  const trimmed = (modelAnswer ?? "").trim();
  if (!trimmed) return "";

  if (type === "part1") {
    return buildSpokenAnswer(trimmed).slice(0, 500);
  }
  if (isScriptedAssessment(type)) {
    return trimmed.slice(0, 500);
  }
  if (type === "vocabulary") {
    return trimmed.slice(0, 500);
  }
  return "";
}

const ERROR_LABELS: Record<string, string> = {
  None: "ok",
  Mispronunciation: "pronúncia errada",
  Omission: "omitida",
  Insertion: "palavra extra",
  UnexpectedBreak: "pausa inesperada",
  MissingBreak: "falta pausa",
  Monotone: "monótono",
};

export function errorTypeLabel(errorType?: string): string {
  if (!errorType || errorType === "None") return "ok";
  return ERROR_LABELS[errorType] ?? errorType;
}

/** Words Azure flagged or scored below 80 — sorted worst first. */
export function getMispronouncedWords(words: AzureWordScore[]): AzureWordScore[] {
  return words
    .filter((w) => {
      if (!w.word?.trim()) return false;
      if (shouldSkipPronunciationVaultWord(w.word)) return false;
      const err = w.errorType ?? "None";
      if (err !== "None") return true;
      return w.accuracyScore < 80;
    })
    .sort((a, b) => a.accuracyScore - b.accuracyScore);
}

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "to", "of", "in", "on", "at", "for", "is", "are", "was",
  "were", "i", "we", "you", "it", "that", "this", "with", "as", "be", "have", "has", "had",
  "my", "our", "your", "but", "so", "if", "when", "can", "will", "would", "could", "should",
]);

export function extractPracticeWordsFromTranscript(text: string, max = 6): string[] {
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z'\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w) && !shouldSkipPronunciationVaultWord(w));
  return [...new Set(tokens)].slice(0, max);
}

export type VaultWordCandidate = {
  word: string;
  accuracyScore: number;
  errorType: string;
  errorLabel: string;
};

/**
 * Words to save in the pronunciation vault.
 * Part 1 uses unscripted Azure mode — when word-level scores are missing,
 * fall back to transcript tokens when overall accuracy is weak.
 */
export function collectVaultWordCandidates(
  azureResult: AzurePronunciationResult,
): VaultWordCandidate[] {
  const flagged = getMispronouncedWords(azureResult.words);
  if (flagged.length) {
    return flagged.map((w) => ({
      word: w.word,
      accuracyScore: w.accuracyScore,
      errorType: w.errorType ?? "Mispronunciation",
      errorLabel: errorTypeLabel(w.errorType),
    }));
  }

  if (azureResult.accuracyScore >= 80) return [];

  const practiceWords = extractPracticeWordsFromTranscript(azureResult.recognizedText);
  if (!practiceWords.length) {
    const snippet = azureResult.recognizedText.trim().slice(0, 48);
    if (!snippet) return [];
    return [
      {
        word: snippet,
        accuracyScore: azureResult.accuracyScore,
        errorType: "Mispronunciation",
        errorLabel: "Pronúncia fraca",
      },
    ];
  }

  return practiceWords.map((word) => ({
    word,
    accuracyScore: azureResult.accuracyScore,
    errorType: "Mispronunciation",
    errorLabel: "Pronúncia fraca",
  }));
}
