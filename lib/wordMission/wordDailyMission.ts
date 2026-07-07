import { ICAO_VOCABULARY } from "@/data/icaoVocabulary";
import {
  getOrCreateVocabDailyMission,
  isVocabTermInTodayMission,
  markVocabDailyComplete,
  vocabDailyMissionProgress,
  VOCAB_DAILY_MISSION_EVENT,
  VOCAB_DAILY_WORD_COUNT,
} from "@/lib/vocabDailyMission";

export { VOCAB_DAILY_WORD_COUNT };
export const WORD_DAILY_MISSION_EVENT = VOCAB_DAILY_MISSION_EVENT;

export function getOrCreateWordDailyMission() {
  return getOrCreateVocabDailyMission();
}

export function wordDailyMissionProgress(mission = getOrCreateWordDailyMission()) {
  return vocabDailyMissionProgress(mission);
}

export function isWordMissionTermInTodayMission(termId: string): boolean {
  return isVocabTermInTodayMission(termId);
}

export function markWordMissionTermComplete(termId: string) {
  return markVocabDailyComplete(termId);
}

export function wordMissionLink(termId: string): string {
  return `/word-mission?term=${encodeURIComponent(termId)}`;
}

export function wordMissionBrowseLink(): string {
  return "/word-mission";
}

/** Map legacy pronunciation vault word to a vocab term id when possible. */
export function resolveVocabTermIdForWord(word: string): string | null {
  const normalized = word.trim().toLowerCase();
  const exact = ICAO_VOCABULARY.find((t) => t.term.toLowerCase() === normalized);
  if (exact) return exact.id;
  const partial = ICAO_VOCABULARY.find((t) => t.term.toLowerCase().includes(normalized));
  return partial?.id ?? null;
}
