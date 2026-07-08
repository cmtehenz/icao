import { CARDS } from "@/lib/cards";
import { ICAO_VOCABULARY } from "@/data/icaoVocabulary";
import { getSituationsByExam } from "@/data/exams/part2Data";
import { PART1_BY_EXAM } from "@/data/exams/part1";
import { pickDailySlice } from "@/lib/dailyRotation";
import type { ExamVersion } from "@/lib/exams/types";
import {
  getItemProgress,
  isDueForReview,
  loadVocabProgressStore,
  type VocabProgressStore,
} from "@/utils/spacedRepetition";

function vocabDifficultyRank(store: VocabProgressStore, id: string): number {
  const p = getItemProgress(store, id);
  if (p.markedDifficult || p.status === "review") return 0;
  if (isDueForReview(p)) return 1;
  if (p.status === "learning") return 2;
  if (p.status === "new") return 3;
  return 4;
}

/** Text corpus for an exam version — Part 1 cards + Part 2 situations. */
export function examCorpus(examVersion: ExamVersion): string {
  const situations = getSituationsByExam(examVersion);
  const chunks = situations.flatMap((s) => [
    s.context,
    s.title,
    s.readback.atcMessage,
    s.readback.modelReadback,
    s.interaction.prompt,
    s.interaction.modelReport,
    s.atcFollowUp.atcMessage,
    s.reportedSpeech.modelAnswer,
  ]);
  const part1Nums = PART1_BY_EXAM[examVersion];
  for (const num of part1Nums) {
    const card = CARDS.find((c) => c.num === num);
    if (card) {
      chunks.push(card.question, card.answer, ...(card.keywords ?? []), ...(card.vocab ?? []));
    }
  }
  return chunks.join(" ").toLowerCase();
}

export function termExamBoost(corpus: string, term: string): number {
  const t = term.toLowerCase().trim();
  if (!t) return 0;
  if (corpus.includes(t)) return 4;
  const words = t.split(/\s+/);
  if (words.some((w) => w.length > 3 && corpus.includes(w))) return 2;
  return 0;
}

/** 20 vocab terms for today's exam — hardest / due first, biased to words in that prova. */
export function pickExamVocabTermIds(
  examVersion: ExamVersion,
  count: number,
  dateKey: string,
  store: VocabProgressStore = loadVocabProgressStore(),
): string[] {
  const corpus = examCorpus(examVersion);

  const ranked = ICAO_VOCABULARY.map((item) => ({
    id: item.id,
    rank: vocabDifficultyRank(store, item.id) * 10 - termExamBoost(corpus, item.term),
  })).sort((a, b) => a.rank - b.rank || a.id.localeCompare(b.id));

  const pool = ranked.map((r) => r.id);
  const rotated = pickDailySlice(pool, Math.min(count * 2, pool.length), dateKey, 7);

  const picked = new Set<string>();
  const result: string[] = [];

  for (const entry of ranked) {
    if (result.length >= count) break;
    if (!picked.has(entry.id)) {
      picked.add(entry.id);
      result.push(entry.id);
    }
  }

  for (const id of rotated) {
    if (result.length >= count) break;
    if (!picked.has(id)) {
      picked.add(id);
      result.push(id);
    }
  }

  return result.slice(0, count);
}
