import type { VocabularyKnowledgeEntry } from "@/knowledge/schema/vocabulary";

export type KnowledgeReviewMeta = {
  entryId: string | null;
  version: string | null;
  primarySource: string | null;
  fallbackUsed: boolean;
  curated: boolean;
  generated: boolean;
  referenceCount: number;
};

export function buildKnowledgeReviewMeta(
  entry: VocabularyKnowledgeEntry | null,
  options: { fallbackUsed: boolean },
): KnowledgeReviewMeta {
  if (!entry) {
    return {
      entryId: null,
      version: null,
      primarySource: null,
      fallbackUsed: options.fallbackUsed,
      curated: false,
      generated: false,
      referenceCount: 0,
    };
  }

  const primary = entry.references[0];

  return {
    entryId: entry.id,
    version: entry.version,
    primarySource: primary ? `${primary.source}: ${primary.title}` : null,
    fallbackUsed: false,
    curated: true,
    generated: false,
    referenceCount: entry.references.length,
  };
}