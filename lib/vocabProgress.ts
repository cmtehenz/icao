import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import { errorTypeLabel } from "@/lib/azure/pronunciation";
import { addWordsToVault } from "@/lib/pronunciationVault";
import type { VocabularyTerm } from "@/lib/part2/types";

export const VOCAB_RECORDINGS_GOAL = 20;
export const VOCAB_PASS_SCORE = 85;
export const VOCAB_CHANGE_EVENT = "icao-vocab-progress-change";

const STORAGE_KEY = "icao_vocab_progress_v2";

export type VocabTermProgress = {
  recordings: number;
  passes: number;
  lowestAccuracy: number;
  lastAccuracy: number;
  hasPronunciationError: boolean;
  lastPracticedAt?: string;
};

export type VocabProgressStore = {
  terms: Record<string, VocabTermProgress>;
};

export type VocabFilter = "all" | "practice" | "errors" | "done";

function defaultTerm(): VocabTermProgress {
  return {
    recordings: 0,
    passes: 0,
    lowestAccuracy: 100,
    lastAccuracy: 0,
    hasPronunciationError: false,
  };
}

export function loadVocabProgress(): VocabProgressStore {
  if (typeof window === "undefined") return { terms: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { terms: {} };
    const parsed = JSON.parse(raw) as VocabProgressStore;
    if (!parsed?.terms || typeof parsed.terms !== "object") return { terms: {} };
    return parsed;
  } catch {
    return { terms: {} };
  }
}

export function saveVocabProgress(store: VocabProgressStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(new Event(VOCAB_CHANGE_EVENT));
}

export function getVocabTermProgress(store: VocabProgressStore, termId: string): VocabTermProgress {
  return store.terms[termId] ?? defaultTerm();
}

export function isVocabMastered(progress: VocabTermProgress): boolean {
  return (
    progress.recordings >= VOCAB_RECORDINGS_GOAL &&
    progress.lastAccuracy >= VOCAB_PASS_SCORE
  );
}

export function vocabNeedsPronunciationWork(progress: VocabTermProgress): boolean {
  return progress.hasPronunciationError || progress.lastAccuracy < VOCAB_PASS_SCORE;
}

function mispronouncedFromAssessment(
  assessment: AzurePronunciationResult,
): Array<{ word: string; accuracyScore: number; errorType: string; errorLabel: string }> {
  const bad = assessment.words.filter(
    (w) => (w.errorType && w.errorType !== "None") || w.accuracyScore < 80,
  );
  if (bad.length) {
    return bad.map((w) => ({
      word: w.word,
      accuracyScore: w.accuracyScore,
      errorType: w.errorType ?? "Mispronunciation",
      errorLabel: errorTypeLabel(w.errorType ?? "Mispronunciation"),
    }));
  }
  return [
    {
      word: assessment.recognizedText.trim() || "term",
      accuracyScore: assessment.accuracyScore,
      errorType: "Mispronunciation",
      errorLabel: "Pronúncia fraca",
    },
  ];
}

export function recordVocabPractice(
  term: VocabularyTerm,
  score: number,
  assessment: AzurePronunciationResult | null,
): VocabTermProgress {
  const store = loadVocabProgress();
  const existing = getVocabTermProgress(store, term.id);
  const passed = score >= VOCAB_PASS_SCORE;

  const next: VocabTermProgress = {
    recordings: existing.recordings + 1,
    passes: existing.passes + (passed ? 1 : 0),
    lowestAccuracy:
      existing.recordings === 0 ? score : Math.min(existing.lowestAccuracy, score),
    lastAccuracy: score,
    hasPronunciationError: passed ? false : true,
    lastPracticedAt: new Date().toISOString(),
  };

  store.terms[term.id] = next;
  saveVocabProgress(store);

  if (!passed && assessment) {
    const words = mispronouncedFromAssessment(assessment);
    addWordsToVault(words, `Part 2 Vocabulário: ${term.term}`);
  } else if (!passed) {
    addWordsToVault(
      [
        {
          word: term.term,
          accuracyScore: score,
          errorType: "Mispronunciation",
          errorLabel: "Pronúncia fraca",
        },
      ],
      `Part 2 Vocabulário: ${term.term}`,
    );
  }

  return next;
}

export function vocabStats(store: VocabProgressStore, total: number) {
  const values = Object.values(store.terms);
  const mastered = values.filter(isVocabMastered).length;
  const errors = values.filter(vocabNeedsPronunciationWork).length;
  const inProgress = values.filter(
    (p) => p.recordings > 0 && p.recordings < VOCAB_RECORDINGS_GOAL,
  ).length;
  const totalRecordings = values.reduce((sum, p) => sum + p.recordings, 0);
  return { total, mastered, errors, inProgress, totalRecordings };
}

export function filterVocabTerms(
  terms: VocabularyTerm[],
  store: VocabProgressStore,
  filter: VocabFilter,
): VocabularyTerm[] {
  return terms.filter((term) => {
    const p = getVocabTermProgress(store, term.id);
    switch (filter) {
      case "practice":
        return p.recordings < VOCAB_RECORDINGS_GOAL || !isVocabMastered(p);
      case "errors":
        return p.recordings > 0 && vocabNeedsPronunciationWork(p);
      case "done":
        return isVocabMastered(p);
      default:
        return true;
    }
  });
}
