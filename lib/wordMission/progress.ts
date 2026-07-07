import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import { isVocabMissionTermComplete } from "@/lib/vocabGraduation";
import {
  getOrCreateVocabDailyMission,
  markVocabDailyComplete,
} from "@/lib/vocabDailyMission";
import { WM_PASS_SCORE } from "@/lib/wordMission/types";
import {
  getItemProgress,
  loadVocabProgressStore,
  pronunciationScore,
  recordVocabAttempt,
  type VocabItemProgress,
} from "@/utils/spacedRepetition";

export type WordMissionLevelResult = {
  progress: VocabItemProgress;
  passed: boolean;
  termComplete: boolean;
  missionMarkedComplete: boolean;
};

/** Record a Word Mission level attempt without duplicate Captain messaging. */
export function recordWordMissionLevelAttempt(
  termId: string,
  level: 1 | 2 | 3 | 4,
  assessment: AzurePronunciationResult,
): WordMissionLevelResult {
  const store = loadVocabProgressStore();
  const score = pronunciationScore(
    assessment.accuracyScore,
    assessment.fluencyScore,
    assessment.completenessScore,
  );
  const progress = recordVocabAttempt(store, termId, score, level);
  const passed = score >= WM_PASS_SCORE;
  const termComplete = isVocabMissionTermComplete(progress);
  let missionMarkedComplete = false;

  const daily = getOrCreateVocabDailyMission();
  if (termComplete && daily.termIds.includes(termId) && !daily.completedIds.includes(termId)) {
    markVocabDailyComplete(termId);
    missionMarkedComplete = true;
  }

  return { progress, passed, termComplete, missionMarkedComplete };
}

export function wordMissionTermProgress(termId: string): VocabItemProgress {
  return getItemProgress(loadVocabProgressStore(), termId);
}
