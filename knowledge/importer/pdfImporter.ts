import type { KnowledgeImporter } from "@/knowledge/importer/types";

export interface PdfImporter extends KnowledgeImporter {
  readonly id: "pdf";
  readonly sourceId: "icao-delta" | "icao" | "faa" | "easa" | "rotorcraft";
}
