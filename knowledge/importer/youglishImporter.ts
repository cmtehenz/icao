import type { KnowledgeImporter } from "@/knowledge/importer/types";

/** Pronunciation reference only — not operational procedure source. */
export interface YouGlishImporter extends KnowledgeImporter {
  readonly id: "youglish";
  readonly sourceId: "youglish";
}
