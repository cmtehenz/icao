import { ICAO_VOCABULARY } from "@/data/icaoVocabulary";
import type { IcaoVocabularyItem } from "@/data/icaoVocabulary";
import { isDevKnowledgeEnabled } from "@/lib/knowledge/devKnowledgeFlag";
import { getDevWordMissionVocabulary } from "@/lib/knowledge/devKnowledge";

/** Word Mission term catalog — dev batch-01 only when NEXT_PUBLIC_DEV_KNOWLEDGE=true. */
export function getWordMissionVocabulary(): IcaoVocabularyItem[] {
  if (isDevKnowledgeEnabled()) {
    return getDevWordMissionVocabulary();
  }
  return ICAO_VOCABULARY;
}

export function findWordMissionVocabItem(idOrTerm: string): IcaoVocabularyItem | undefined {
  const key = idOrTerm.trim();
  const catalog = getWordMissionVocabulary();
  return (
    catalog.find((t) => t.id === key) ??
    catalog.find((t) => t.term.toLowerCase() === key.toLowerCase())
  );
}
