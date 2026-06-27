"use client";

import { useCallback, useEffect, useState } from "react";
import { ICAO_VOCABULARY } from "@/data/icaoVocabulary";
import { saveVocabAttempt } from "@/lib/vocabRecordings";
import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import {
  dailyMissionStats,
  getItemProgress,
  isDueForReview,
  isMastered,
  loadVocabProgressStore,
  markVocabDifficult,
  markVocabMastered,
  type DailyMissionStats,
  type VocabItemProgress,
  type VocabProgressStore,
  VOCAB_PROGRESS_EVENT,
} from "@/utils/spacedRepetition";

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
    async (
      id: string,
      assessment: AzurePronunciationResult | null,
      level: 1 | 2 | 3 | 4,
      termLabel: string,
      referenceText: string,
      audioBlob: Blob | null,
    ) => {
      const result = await saveVocabAttempt({
        id,
        assessment,
        level,
        termLabel,
        referenceText,
        audioBlob,
      });
      setStore(loadVocabProgressStore());
      return result;
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
