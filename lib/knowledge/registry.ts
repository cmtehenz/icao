import continueEntry from "@/knowledge/vocabulary/continue.json";
import flyDirectEntry from "@/knowledge/vocabulary/fly_direct.json";
import headingEntry from "@/knowledge/vocabulary/heading.json";
import holdShortEntry from "@/knowledge/vocabulary/hold_short.json";
import hoverEntry from "@/knowledge/vocabulary/hover.json";
import lineUpAndWaitEntry from "@/knowledge/vocabulary/line_up_and_wait.json";
import maintainEntry from "@/knowledge/vocabulary/maintain.json";
import reportEntry from "@/knowledge/vocabulary/report.json";
import rogerEntry from "@/knowledge/vocabulary/roger.json";
import wilcoEntry from "@/knowledge/vocabulary/wilco.json";
import type { VocabularyKnowledgeEntry } from "@/knowledge/schema/vocabulary";
import { assertValidVocabularyEntry } from "@/lib/knowledge/validate";

const RAW_ENTRIES = [
  reportEntry,
  headingEntry,
  flyDirectEntry,
  maintainEntry,
  continueEntry,
  holdShortEntry,
  lineUpAndWaitEntry,
  hoverEntry,
  wilcoEntry,
  rogerEntry,
] as const;

/** Validated vocabulary registry — grows via importers + generated index. */
export const VOCABULARY_KNOWLEDGE_REGISTRY: VocabularyKnowledgeEntry[] = RAW_ENTRIES.map((raw) =>
  assertValidVocabularyEntry(raw),
);

export function termToKnowledgeId(term: string): string {
  return term.trim().toLowerCase().replace(/\s+/g, "_");
}

export function knowledgeIdToTerm(id: string): string {
  return id.replace(/_/g, " ");
}

const BY_ID = new Map(VOCABULARY_KNOWLEDGE_REGISTRY.map((e) => [e.id, e]));
const BY_TERM = new Map(
  VOCABULARY_KNOWLEDGE_REGISTRY.map((e) => [e.term.trim().toLowerCase(), e]),
);
const BY_FILE_ID = new Map(
  VOCABULARY_KNOWLEDGE_REGISTRY.map((e) => [termToKnowledgeId(e.term), e]),
);

export function getVocabularyKnowledgeByTerm(term: string): VocabularyKnowledgeEntry | null {
  const key = term.trim().toLowerCase();
  return BY_TERM.get(key) ?? BY_FILE_ID.get(termToKnowledgeId(term)) ?? null;
}

export function getVocabularyKnowledgeById(id: string): VocabularyKnowledgeEntry | null {
  return BY_ID.get(id) ?? null;
}

export function listVocabularyKnowledgeIds(): string[] {
  return VOCABULARY_KNOWLEDGE_REGISTRY.map((e) => e.id);
}
