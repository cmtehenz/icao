import type { KnowledgeImporter } from "@/knowledge/importer/types";

export interface IcaoImporter extends KnowledgeImporter {
  readonly id: "icao";
  readonly sourceId: "icao" | "icao-phraseology";
}
