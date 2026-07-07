import type { KnowledgeImporter } from "@/knowledge/importer/types";

export interface FaaImporter extends KnowledgeImporter {
  readonly id: "faa";
  readonly sourceId: "faa" | "faa-aim" | "faa-phak";
}
