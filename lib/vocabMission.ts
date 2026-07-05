import { ICAO_VOCABULARY } from "@/data/icaoVocabulary";
import {
  getOrCreateVocabDailyMission,
  vocabDailyMissionProgress,
} from "@/lib/vocabDailyMission";
import { isVocabMissionTermComplete, countVbLevelsPassed } from "@/lib/vocabGraduation";
import { getItemProgress, loadVocabProgressStore } from "@/utils/spacedRepetition";

export type VocabMissionDebrief = {
  completedTerms: number;
  totalTerms: number;
  weakTerms: string[];
  strongTerms: string[];
  averageBestScore: number;
  nextFocus: string | null;
};

export function buildVocabMissionDebrief(): VocabMissionDebrief {
  const mission = getOrCreateVocabDailyMission();
  const progress = vocabDailyMissionProgress(mission);
  const store = loadVocabProgressStore();

  const weakTerms: string[] = [];
  const strongTerms: string[] = [];
  let scoreSum = 0;
  let scored = 0;

  for (const id of mission.termIds) {
    const item = getItemProgress(store, id);
    const label = ICAO_VOCABULARY.find((t) => t.id === id)?.term ?? id;
    if (isVocabMissionTermComplete(item)) {
      strongTerms.push(label);
    } else if (item.attempts > 0) {
      weakTerms.push(label);
    }
    if (item.bestScore > 0) {
      scoreSum += item.bestScore;
      scored += 1;
    }
  }

  const nextId = progress.currentId;
  const nextLabel = nextId
    ? ICAO_VOCABULARY.find((t) => t.id === nextId)?.term ?? null
    : null;

  let nextFocus: string | null = null;
  if (nextId && nextLabel) {
    const item = getItemProgress(store, nextId);
    const done = countVbLevelsPassed(item);
    nextFocus = `${nextLabel} — VB ${done + 1}/4 remaining today.`;
  } else if (weakTerms.length > 0) {
    nextFocus = `Revisit: ${weakTerms.slice(0, 2).join(", ")}.`;
  }

  return {
    completedTerms: progress.done,
    totalTerms: progress.total,
    weakTerms,
    strongTerms,
    averageBestScore: scored > 0 ? Math.round(scoreSum / scored) : 0,
    nextFocus,
  };
}
