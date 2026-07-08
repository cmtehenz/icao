import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import { isVocabMissionTermComplete } from "@/lib/vocabGraduation";
import {
  getOrCreateWordDailyMission,
  markWordMissionTermComplete,
} from "@/lib/wordMission/wordDailyMission";
import { WM_PASS_SCORE } from "@/lib/wordMission/types";
import {
  getItemProgress,
  loadVocabProgressStore,
  markVocabDifficult,
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
  if (!passed && level >= 3 && score < 60) {
    markVocabDifficult(store, termId);
  }
  const termComplete = isVocabMissionTermComplete(progress);
  let missionMarkedComplete = false;

  const daily = getOrCreateWordDailyMission();
  if (termComplete && daily.termIds.includes(termId) && !daily.completedIds.includes(termId)) {
    markWordMissionTermComplete(termId);
    missionMarkedComplete = true;
  }

  return { progress, passed, termComplete, missionMarkedComplete };
}

/** Mark read-only steps (Meaning, Operational Use) complete without recording. */
export function markWordMissionStepViewed(
  termId: string,
  level: 1 | 2,
): WordMissionLevelResult {
  const store = loadVocabProgressStore();
  const progress = recordVocabAttempt(store, termId, WM_PASS_SCORE, level);
  const termComplete = isVocabMissionTermComplete(progress);
  let missionMarkedComplete = false;
  const daily = getOrCreateWordDailyMission();
  if (termComplete && daily.termIds.includes(termId) && !daily.completedIds.includes(termId)) {
    markWordMissionTermComplete(termId);
    missionMarkedComplete = true;
  }
  return { progress, passed: true, termComplete, missionMarkedComplete };
}

export function wordMissionTermProgress(termId: string): VocabItemProgress {
  return getItemProgress(loadVocabProgressStore(), termId);
}
