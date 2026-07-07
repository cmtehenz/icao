import type { IcaoVocabularyItem } from "@/data/icaoVocabulary";
import {
  getDevKnowledgeDisplayTerms,
  getDevWordMissionVocabulary,
  lookupDevKnowledgeById,
} from "@/lib/knowledge/devKnowledge";

/** Word Mission catalog — completed premium lessons only. */
export function getWordMissionVocabulary(): IcaoVocabularyItem[] {
  return getDevWordMissionVocabulary();
}

export function getWordMissionVocabularyCount(): number {
  return getWordMissionVocabulary().length;
}

export function findWordMissionVocabItem(idOrTerm: string): IcaoVocabularyItem | undefined {
  const key = idOrTerm.trim();
  const catalog = getWordMissionVocabulary();
  return (
    catalog.find((t) => t.id === key) ??
    catalog.find((t) => t.term.toLowerCase() === key.toLowerCase())
  );
}

export function getWordMissionTermLabel(item: IcaoVocabularyItem): string {
  const premium = lookupDevKnowledgeById(item.id);
  return premium?.displayTerm ?? item.term;
}

export function getWordMissionCatalogLabels(): string[] {
  return getDevKnowledgeDisplayTerms();
}
