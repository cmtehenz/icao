import type { VocabularyKnowledgeEntry } from "@/knowledge/schema/vocabulary";

/** Structured output from any knowledge importer. */
export type ImportedKnowledgeBundle = {
  vocabulary?: VocabularyKnowledgeEntry[];
  /** Future: phraseology, scenarios, pronunciation */
};

/** Importer contract — interfaces only; no scraping in application runtime. */
export interface KnowledgeImporter {
  readonly id: string;
  readonly sourceId: string;
  /** Read → summarize → extract → return structured knowledge. */
  import(): Promise<ImportedKnowledgeBundle>;
}

export type ImporterValidationResult = {
  ok: boolean;
  errors: string[];
};

export interface KnowledgeImporterWithValidation extends KnowledgeImporter {
  validate(bundle: ImportedKnowledgeBundle): ImporterValidationResult;
}
