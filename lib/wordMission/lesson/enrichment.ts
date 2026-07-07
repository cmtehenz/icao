import type { IcaoVocabularyItem } from "@/data/icaoVocabulary";

/** Curated operational content — internal fallback, never invented operational facts. */
export type CuratedWordContent = {
  missionBrief: string;
  meaningEn: string;
  meaningPt: string;
  operationalContext: string;
  whoSaysIt: string;
  whenUsed: string;
  whyUsed: string;
  towerLine: string;
  towerExplanation: string;
  pronunciationChunks: string[];
  commonMistakes: string[];
  didYouKnow: string;
  comparePairs: { a: string; b: string; note: string }[];
  captainStory?: string;
  icaoConnection: string;
  conversationPrompts: string[];
  microChallenges: string[];
};

/** Future enrichment from FAA, ICAO Doc 4444, AIM, YouGlish, etc. */
export type AviationKnowledgeEnrichment = Partial<CuratedWordContent> & {
  source?: string;
  verified?: boolean;
};

export type AviationKnowledgeProvider = {
  id: string;
  /** Returns null when source unavailable — engine falls back to curated content. */
  enrich(term: string, item?: IcaoVocabularyItem): Promise<AviationKnowledgeEnrichment | null>;
};

export type SyncKnowledgeProvider = {
  id: string;
  enrich(term: string, item?: IcaoVocabularyItem): AviationKnowledgeEnrichment | null;
};

/** Compose enrichment from providers — first verified result wins per field. */
export async function enrichFromProviders(
  term: string,
  providers: AviationKnowledgeProvider[],
  item?: IcaoVocabularyItem,
): Promise<AviationKnowledgeEnrichment> {
  const merged: AviationKnowledgeEnrichment = {};
  for (const provider of providers) {
    try {
      const patch = await provider.enrich(term, item);
      if (!patch) continue;
      Object.assign(merged, patch);
      if (patch.verified) merged.verified = true;
      merged.source = merged.source ? `${merged.source}, ${provider.id}` : provider.id;
    } catch {
      // Graceful fallback — external knowledge unavailable
    }
  }
  return merged;
}

export function enrichFromSyncProviders(
  term: string,
  providers: SyncKnowledgeProvider[],
  item?: IcaoVocabularyItem,
): AviationKnowledgeEnrichment {
  const merged: AviationKnowledgeEnrichment = {};
  for (const provider of providers) {
    const patch = provider.enrich(term, item);
    if (!patch) continue;
    Object.assign(merged, patch);
    if (patch.verified) merged.verified = true;
    merged.source = merged.source ? `${merged.source}, ${provider.id}` : provider.id;
  }
  return merged;
}

/** Placeholder for future OpenAI / FAA / YouGlish integration. */
export const noopKnowledgeProvider: SyncKnowledgeProvider = {
  id: "noop",
  enrich: () => null,
};
