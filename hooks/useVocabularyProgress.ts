"use client";

import { useCallback, useEffect, useState } from "react";
import { ICAO_VOCABULARY } from "@/data/icaoVocabulary";
import { addWordsToVault } from "@/lib/pronunciationVault";
import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import { errorTypeLabel } from "@/lib/azure/pronunciation";
import {
  dailyMissionStats,
  getItemProgress,
  isDueForReview,
  isMastered,
  loadVocabProgressStore,
  markVocabDifficult,
  markVocabMastered,
  pronunciationScore,
  recordVocabAttempt,
  type DailyMissionStats,
  type VocabItemProgress,
  type VocabProgressStore,
  VOCAB_PROGRESS_EVENT,
} from "@/utils/spacedRepetition";

function mispronouncedFromAssessment(assessment: AzurePronunciationResult) {
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

export function useVocabularyProgress() {
  const [store, setStore] = useState<VocabProgressStore>(() => loadVocabProgressStore());

  const refresh = useCallback(() => {
    setStore(loadVocabProgressStore());
  }, []);

  useEffect(() => {
    const onChange = () => refresh();
    window.addEventListener(VOCAB_PROGRESS_EVENT, onChange);
    return () => window.removeEventListener(VOCAB_PROGRESS_EVENT, onChange);
  }, [refresh]);

  const total = ICAO_VOCABULARY.length;
  const mission: DailyMissionStats = dailyMissionStats(store, total);
  const masteredCount = ICAO_VOCABULARY.filter((item) =>
    isMastered(getItemProgress(store, item.id)),
  ).length;
  const dueItems = ICAO_VOCABULARY.filter((item) =>
    isDueForReview(getItemProgress(store, item.id)),
  );

  const recordAttempt = useCallback(
    (
      id: string,
      assessment: AzurePronunciationResult | null,
      level: 1 | 2 | 3 | 4,
      termLabel: string,
    ): VocabItemProgress => {
      const current = loadVocabProgressStore();
      const score = assessment
        ? pronunciationScore(
            assessment.accuracyScore,
            assessment.fluencyScore,
            assessment.completenessScore,
          )
        : 0;
      const next = recordVocabAttempt(current, id, score, level);
      setStore(loadVocabProgressStore());

      if (score < 75 && assessment) {
        addWordsToVault(mispronouncedFromAssessment(assessment), `Vocabulary: ${termLabel}`);
      } else if (score < 75) {
        addWordsToVault(
          [
            {
              word: termLabel,
              accuracyScore: score,
              errorType: "Mispronunciation",
              errorLabel: "Pronúncia fraca",
            },
          ],
          `Vocabulary: ${termLabel}`,
        );
      }

      return next;
    },
    [],
  );

  const markDifficult = useCallback((id: string) => {
    const current = loadVocabProgressStore();
    markVocabDifficult(current, id);
    setStore(loadVocabProgressStore());
  }, []);

  const markMastered = useCallback((id: string) => {
    const current = loadVocabProgressStore();
    markVocabMastered(current, id);
    setStore(loadVocabProgressStore());
  }, []);

  const getProgress = useCallback(
    (id: string) => getItemProgress(store, id),
    [store],
  );

  return {
    store,
    total,
    mission,
    masteredCount,
    dueItems,
    getProgress,
    recordAttempt,
    markDifficult,
    markMastered,
    refresh,
  };
}
