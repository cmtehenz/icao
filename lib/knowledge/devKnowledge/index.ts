import type { IcaoVocabularyItem } from "@/data/icaoVocabulary";
import type { KnowledgeReviewMeta } from "@/lib/knowledge/review";
import type { KnowledgeLessonDef } from "@/lib/knowledge/wordMissionAdapter";
import { isDevKnowledgeEnabled } from "@/lib/knowledge/devKnowledgeFlag";
import { BATCH01_DEV_ENTRIES } from "@/lib/knowledge/devKnowledge/batch01Entries";
import type { DevKnowledgeEntry } from "@/lib/knowledge/devKnowledge/types";

export { BATCH01_DEV_ENTRIES };

const BY_ID = new Map(BATCH01_DEV_ENTRIES.map((e) => [e.id, e]));
const BY_TERM = new Map(BATCH01_DEV_ENTRIES.map((e) => [e.term.toLowerCase(), e]));

export function getDevKnowledgeTermIds(): string[] {
  return BATCH01_DEV_ENTRIES.map((e) => e.id);
}

export function lookupDevKnowledgeById(id: string): DevKnowledgeEntry | null {
  return BY_ID.get(id) ?? null;
}

export function lookupDevKnowledgeByTerm(term: string): DevKnowledgeEntry | null {
  return BY_TERM.get(term.trim().toLowerCase()) ?? null;
}

function devReviewMeta(entry: DevKnowledgeEntry): KnowledgeReviewMeta {
  return {
    entryId: entry.id,
    version: "batch-01",
    primarySource: `batch-01:${entry.slug}`,
    fallbackUsed: false,
    curated: true,
    generated: false,
    referenceCount: 0,
  };
}

export function lessonDefFromDevEntry(entry: DevKnowledgeEntry): KnowledgeLessonDef {
  return {
    meaningEn: entry.meaningEn,
    meaningPt: entry.meaningPt,
    whenUsed: entry.whenUsed,
    example: entry.example,
    sayPhrase: entry.sayPhrase,
    icaoQuestion: entry.icaoQuestion,
    icaoSpeakText: entry.icaoSpeakText,
    review: devReviewMeta(entry),
  };
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function devEntryToIcaoVocabularyItem(entry: DevKnowledgeEntry): IcaoVocabularyItem {
  return {
    id: entry.id,
    term: entry.term,
    meaning: entry.meaningPt || entry.meaningEn,
    example: entry.example,
    category: entry.category,
    categoryId: "atc",
    difficulty: 2,
    levels: {
      1: entry.term,
      2: cap(entry.sayPhrase),
      3: entry.example,
      4: entry.icaoSpeakText,
    },
  };
}

export function getDevWordMissionVocabulary(): IcaoVocabularyItem[] {
  return BATCH01_DEV_ENTRIES.map(devEntryToIcaoVocabularyItem);
}

export function isDevKnowledgeTermId(id: string): boolean {
  return isDevKnowledgeEnabled() && BY_ID.has(id);
}
