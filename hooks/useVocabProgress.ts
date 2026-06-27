"use client";

import { useEffect, useState } from "react";
import {
  loadVocabProgress,
  VOCAB_CHANGE_EVENT,
  vocabStats,
  type VocabProgressStore,
} from "@/lib/vocabProgress";
import { VOCABULARY_TERMS } from "@/data/part2Vocabulary";

export function useVocabProgress() {
  const [store, setStore] = useState<VocabProgressStore>(() => loadVocabProgress());

  useEffect(() => {
    const refresh = () => setStore(loadVocabProgress());
    window.addEventListener(VOCAB_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(VOCAB_CHANGE_EVENT, refresh);
  }, []);

  return {
    store,
    stats: vocabStats(store, VOCABULARY_TERMS.length),
  };
}
