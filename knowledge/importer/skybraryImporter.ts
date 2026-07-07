import type { KnowledgeImporter } from "@/knowledge/importer/types";

/** SKYbrary: read → summarize → extract → store. Never bulk-copy articles. */
export interface SkybraryImporter extends KnowledgeImporter {
  readonly id: "skybrary";
  readonly sourceId: "skybrary";
}
