import type { IcaoVocabularyItem } from "@/data/icaoVocabulary";
import { examCorpus, termExamBoost } from "@/lib/examVocabPool";
import type { ExamVersion } from "@/lib/exams/types";
import { lookupDevKnowledgeById } from "@/lib/knowledge/devKnowledge";
import { pickDailySlice } from "@/lib/dailyRotation";
import { getAdaptiveDailyPlan } from "@/lib/trainingProfile/adaptivePlan";
import { getWordMissionVocabulary } from "@/lib/wordMission/wordMissionCatalog";
import {
  getItemProgress,
  isDueForReview,
  isMastered,
  loadVocabProgressStore,
  type VocabProgressStore,
} from "@/utils/spacedRepetition";

/** Default ~15 min daily leg (exam phase). Adaptive plan may lower this. */
export const WORD_DAILY_MISSION_TERM_COUNT = 4;

/** At least this many terms must match today's exam corpus (exam/operational). */
export const WORD_DAILY_MIN_EXAM_TERMS = 2;

/** Cap review/difficult slots so the rest rotate to future days. */
export const WORD_DAILY_MAX_REVIEW_TERMS = 2;

type RankedTerm = {
  id: string;
  difficultyRank: number;
  examBoost: number;
  reviewPriority: number;
};

function vocabDifficultyRank(store: VocabProgressStore, id: string): number {
  const p = getItemProgress(store, id);
  if (p.markedDifficult || p.status === "review") return 0;
  if (isDueForReview(p)) return 1;
  if (p.lastScore > 0 && p.lastScore < 75) return 1;
  if (p.status === "learning") return 2;
  if (p.status === "new") return 3;
  return 4;
}

function reviewPriority(store: VocabProgressStore, id: string): number {
  const p = getItemProgress(store, id);
  if (p.markedDifficult) return 0;
  if (p.lastScore > 0 && p.lastScore < 75) return 1;
  if (isDueForReview(p)) return 2;
  return 3;
}

function premiumTermExamBoost(corpus: string, item: IcaoVocabularyItem): number {
  const premium = lookupDevKnowledgeById(item.id);
  const labels = [
    item.term,
    premium?.displayTerm,
    premium?.sayPhrase,
    premium?.example,
    ...(premium?.atcPhraseology ?? []),
    ...(premium?.pilotReadbacks ?? []),
  ].filter((s): s is string => Boolean(s?.trim()));

  let boost = 0;
  for (const label of labels) {
    boost = Math.max(boost, termExamBoost(corpus, label));
  }
  return boost;
}

function rankPremiumTerms(
  examVersion: ExamVersion,
  store: VocabProgressStore,
  preferFoundation: boolean,
): RankedTerm[] {
  const corpus = examCorpus(examVersion);
  return getWordMissionVocabulary()
    .map((item) => ({
      id: item.id,
      difficultyRank: vocabDifficultyRank(store, item.id),
      examBoost: premiumTermExamBoost(corpus, item),
      reviewPriority: reviewPriority(store, item.id),
    }))
    .sort((a, b) => {
      if (preferFoundation) {
        return (
          b.difficultyRank - a.difficultyRank ||
          a.examBoost - b.examBoost ||
          a.id.localeCompare(b.id)
        );
      }
      return (
        a.difficultyRank - b.difficultyRank ||
        b.examBoost - a.examBoost ||
        a.id.localeCompare(b.id)
      );
    });
}

function isEligibleForDailyPick(store: VocabProgressStore, id: string): boolean {
  const p = getItemProgress(store, id);
  if (!isMastered(p)) return true;
  return isDueForReview(p) || p.markedDifficult;
}

function countExamTerms(result: string[], examIds: Set<string>): number {
  return result.filter((id) => examIds.has(id)).length;
}

export type PickWordDailyOptions = {
  count?: number;
  minExamTerms?: number;
  maxReviewTerms?: number;
  preferFoundationTerms?: boolean;
  store?: VocabProgressStore;
};

/**
 * Daily Word Mission queue — exam-aligned, difficulty-aware, phase-adaptive (RFC-004).
 * Omit count to use `getAdaptiveDailyPlan().wordMissionTermCount`.
 */
export function pickWordDailyTermIds(
  date: string,
  examVersion: ExamVersion,
  countOrOptions?: number | PickWordDailyOptions,
  storeArg?: VocabProgressStore,
): string[] {
  const plan = getAdaptiveDailyPlan();
  const options: PickWordDailyOptions =
    countOrOptions === undefined
      ? { store: storeArg }
      : typeof countOrOptions === "number"
        ? { count: countOrOptions, store: storeArg }
        : countOrOptions;

  const count = options.count ?? plan.wordMissionTermCount;
  const minExam = options.minExamTerms ?? plan.wordMissionMinExamTerms;
  const maxReview = options.maxReviewTerms ?? plan.wordMissionMaxReviewTerms;
  const preferFoundation = options.preferFoundationTerms ?? plan.preferFoundationTerms;
  const store = options.store ?? storeArg ?? loadVocabProgressStore();

  const ranked = rankPremiumTerms(examVersion, store, preferFoundation);
  const eligible = ranked.filter((r) => isEligibleForDailyPick(store, r.id));
  const examIds = new Set(eligible.filter((r) => r.examBoost > 0).map((r) => r.id));
  const picked = new Set<string>();
  const result: string[] = [];

  const push = (id: string): void => {
    if (picked.has(id) || result.length >= count) return;
    picked.add(id);
    result.push(id);
  };

  if (!preferFoundation) {
    const reviewCandidates = eligible
      .filter((r) => reviewPriority(store, r.id) < 3)
      .sort((a, b) => a.reviewPriority - b.reviewPriority || a.difficultyRank - b.difficultyRank);

    for (const entry of reviewCandidates) {
      if (result.length >= maxReview) break;
      push(entry.id);
    }
  }

  const examCandidates = eligible
    .filter((r) => r.examBoost > 0)
    .sort((a, b) =>
      preferFoundation
        ? a.difficultyRank - b.difficultyRank || b.examBoost - a.examBoost
        : b.examBoost - a.examBoost || a.difficultyRank - b.difficultyRank,
    );

  for (const entry of examCandidates) {
    if (result.length >= count) break;
    push(entry.id);
  }

  while (countExamTerms(result, examIds) < minExam) {
    const nextExam = examCandidates.find((e) => !picked.has(e.id));
    if (!nextExam) break;
    push(nextExam.id);
  }

  for (const entry of eligible) {
    if (result.length >= count) break;
    push(entry.id);
  }

  const rotated = pickDailySlice(
    eligible.map((r) => r.id),
    Math.min(count * 2, eligible.length),
    date,
    11,
  );

  for (const id of rotated) {
    if (result.length >= count) break;
    push(id);
  }

  return result.slice(0, count);
}
