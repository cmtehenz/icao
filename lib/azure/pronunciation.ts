import { shouldSkipPronunciationVaultWord } from "@/lib/aviationSpeechTerms";
import { isShortPhraseologyAnswer } from "@/lib/evaluate/confirmTranscript";
import { VAULT_ADD_SCORE } from "@/lib/pronunciationVault";
import { compareTranscriptToModel } from "@/lib/evaluate/compareAnswer";

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
  return type === "part2-readback" || type === "vocabulary";
}

/** Free speech — Azure scores how you speak, not word-for-word script. */
export function useUnscriptedPronunciation(type: string, modelAnswer = ""): boolean {
  if (type === "part2-interaction" && isShortPhraseologyAnswer(modelAnswer)) {
    return false;
  }
  return (
    type === "part1" ||
    type === "part2-interaction" ||
    type === "part2-reported" ||
    type === "part3-report" ||
    type === "part3-followup" ||
    type === "part4-description" ||
    type === "part4-question"
  );
}

/** Reference text for Azure pronunciation assessment (scripted Part 2 / vocab only). */
export function azureReferenceText(modelAnswer: string, type: string): string {
  const trimmed = (modelAnswer ?? "").trim();
  if (!trimmed) return "";

  if (useUnscriptedPronunciation(type, trimmed)) {
    return "";
  }
  if (isScriptedAssessment(type) || isShortPhraseologyAnswer(trimmed)) {
    return trimmed.slice(0, 500);
  }
  if (type === "vocabulary") {
    return trimmed.slice(0, 500);
  }
  return "";
}

const ERROR_LABELS: Record<string, string> = {
  None: "ok",
  Mispronunciation: "mispronounced",
  Omission: "omitted",
  Insertion: "extra word",
  UnexpectedBreak: "unexpected pause",
  MissingBreak: "missing pause",
  Monotone: "monotone",
};

export function errorTypeLabel(errorType?: string): string {
  if (!errorType || errorType === "None") return "ok";
  return ERROR_LABELS[errorType] ?? errorType;
}

/** Words Azure scored below VAULT_ADD_SCORE — sorted worst first. */
export function getVaultAddWords(words: AzureWordScore[]): AzureWordScore[] {
  return words
    .filter((w) => {
      if (!w.word?.trim()) return false;
      if (shouldSkipPronunciationVaultWord(w.word)) return false;
      return w.accuracyScore < VAULT_ADD_SCORE;
    })
    .sort((a, b) => a.accuracyScore - b.accuracyScore);
}

/** Words Azure flagged or scored below 80 — sorted worst first (UI display). */
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
  const flagged = getVaultAddWords(azureResult.words);
  if (flagged.length) {
    return flagged.map((w) => ({
      word: w.word,
      accuracyScore: w.accuracyScore,
      errorType: w.errorType ?? "Mispronunciation",
      errorLabel: errorTypeLabel(w.errorType),
    }));
  }

  if (azureResult.accuracyScore >= VAULT_ADD_SCORE) return [];

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

/**
 * Part 1 / coach: prefer MODEL words Azure failed to hear (practice→"Brett see", pilots→"pallets").
 * Avoids saving STT garbage; those are the words the student should train.
 */
export function collectCoachVaultCandidates(
  transcript: string,
  modelAnswer: string,
  azureResult?: AzurePronunciationResult | null,
): VaultWordCandidate[] {
  const byWord = new Map<string, VaultWordCandidate>();
  const modelTokens = new Set(
    modelAnswer
      .toLowerCase()
      .replace(/[^a-z'\s-]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2),
  );

  const compare = compareTranscriptToModel(transcript, modelAnswer);
  for (const word of compare.missingContentWords.slice(0, 10)) {
    if (shouldSkipPronunciationVaultWord(word)) continue;
    byWord.set(word.toLowerCase(), {
      word,
      accuracyScore: azureResult ? Math.min(azureResult.accuracyScore, 48) : 45,
      errorType: "Mispronunciation",
      errorLabel: "Azure não entendeu — treine",
    });
  }

  if (azureResult) {
    for (const w of collectVaultWordCandidates(azureResult)) {
      const key = w.word.toLowerCase().replace(/[^a-z'-]/g, "");
      if (!key || shouldSkipPronunciationVaultWord(w.word)) continue;
      // Keep Azure flags only when the word is in the model (skip "pallets", "Brett")
      if (!modelTokens.has(key)) continue;
      if (!byWord.has(key)) byWord.set(key, w);
    }
  }

  return [...byWord.values()]
    .filter((c) => c.accuracyScore < VAULT_ADD_SCORE)
    .slice(0, 10);
}

/**
 * Scripted shadow (PEEL blocks, readbacks): Azure word scores + transcript diff vs script.
 * Saves weak words even when overall accuracy looks acceptable.
 */
export function collectScriptedShadowVaultCandidates(
  azureResult: AzurePronunciationResult,
  referenceText: string,
): VaultWordCandidate[] {
  const fromAzure = collectVaultWordCandidates(azureResult);
  if (fromAzure.length) return fromAzure;

  const reference = referenceText.trim();
  if (!reference || !azureResult.recognizedText.trim()) return [];

  const compare = compareTranscriptToModel(azureResult.recognizedText, reference);
  const candidates: VaultWordCandidate[] = [];

  for (const word of compare.missingContentWords.slice(0, 6)) {
    if (shouldSkipPronunciationVaultWord(word)) continue;
    candidates.push({
      word,
      accuracyScore: Math.min(azureResult.accuracyScore, 68),
      errorType: "Omission",
      errorLabel: "não detectada no script",
    });
  }

  for (const word of compare.extraContentWords.slice(0, 5)) {
    if (shouldSkipPronunciationVaultWord(word)) continue;
    candidates.push({
      word,
      accuracyScore: Math.min(azureResult.accuracyScore, 62),
      errorType: "Mispronunciation",
      errorLabel: "palavra diferente do modelo",
    });
  }

  if (!candidates.length && azureResult.accuracyScore < VAULT_ADD_SCORE) {
    return collectVaultWordCandidates(azureResult);
  }

  return candidates;
}
