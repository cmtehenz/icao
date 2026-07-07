import type { VocabularyKnowledgeEntry } from "@/knowledge/schema/vocabulary";
import {
  getVocabularyKnowledgeByTerm,
  listVocabularyKnowledgeIds,
  VOCABULARY_KNOWLEDGE_REGISTRY,
} from "@/lib/knowledge/registry";
import { validateVocabularyEntry } from "@/lib/knowledge/validate";

export type KnowledgeLookupResult = {
  entry: VocabularyKnowledgeEntry;
  curated: true;
  fallbackUsed: false;
};

export type KnowledgeEngineStats = {
  vocabularyCount: number;
  ids: string[];
};

/** Layer 1 — Knowledge Engine. Captain consumes; never invents. */
export class KnowledgeEngine {
  /** Load vocabulary entry by term — null when not in database. */
  static lookupVocabulary(term: string): KnowledgeLookupResult | null {
    const entry = getVocabularyKnowledgeByTerm(term);
    if (!entry) return null;
    return { entry, curated: true, fallbackUsed: false };
  }

  static listVocabulary(): VocabularyKnowledgeEntry[] {
    return [...VOCABULARY_KNOWLEDGE_REGISTRY];
  }

  static stats(): KnowledgeEngineStats {
    return {
      vocabularyCount: VOCABULARY_KNOWLEDGE_REGISTRY.length,
      ids: listVocabularyKnowledgeIds(),
    };
  }

  static validateAll(): { ok: boolean; errors: string[] } {
    const errors: string[] = [];
    for (const entry of VOCABULARY_KNOWLEDGE_REGISTRY) {
      const result = validateVocabularyEntry(entry);
      if (!result.ok) {
        errors.push(
          `${entry.id}: ${result.issues.map((i) => `${i.path} — ${i.message}`).join(", ")}`,
        );
      }
    }
    return { ok: errors.length === 0, errors };
  }
}

export { getVocabularyKnowledgeByTerm };
