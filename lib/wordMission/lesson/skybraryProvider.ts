import type { IcaoVocabularyItem } from "@/data/icaoVocabulary";
import type { SyncKnowledgeProvider } from "@/lib/wordMission/lesson/enrichment";
import { findSkybraryKnowledge } from "@/lib/wordMission/lesson/curatedSkybraryContent";
import type { KnowledgeSource } from "@/lib/wordMission/lesson/knowledgeSource";

export type SkybraryLessonPatch = {
  knowledgeSource: KnowledgeSource;
  whenUsed?: string;
  icaoQuestion?: string;
  icaoSpeakText?: string;
};

export function skybraryPatchForTerm(
  term: string,
  item?: IcaoVocabularyItem,
): SkybraryLessonPatch | null {
  const entry = findSkybraryKnowledge(term, item?.categoryId);
  if (!entry) return null;

  return {
    knowledgeSource: entry,
    whenUsed: entry.operationalLessonIdea,
    icaoQuestion: entry.icaoQuestionIdea,
    icaoSpeakText: entry.summary,
  };
}

/** Sync provider hook for the lesson enrichment pipeline. */
export const skybraryKnowledgeProvider: SyncKnowledgeProvider = {
  id: "skybrary",
  enrich(term, item) {
    const patch = skybraryPatchForTerm(term, item);
    if (!patch) return null;
    return {
      operationalContext: patch.whenUsed,
      conversationPrompts: [patch.icaoQuestion ?? ""],
      source: "skybrary",
      verified: true,
    };
  },
};
