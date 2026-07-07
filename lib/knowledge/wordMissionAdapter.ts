import type { VocabularyKnowledgeEntry } from "@/knowledge/schema/vocabulary";
import type { KnowledgeSource } from "@/lib/wordMission/lesson/knowledgeSource";
import { buildKnowledgeReviewMeta, type KnowledgeReviewMeta } from "@/lib/knowledge/review";

export type KnowledgeLessonDef = {
  meaningEn: string;
  meaningPt: string;
  whenUsed: string;
  example: string;
  sayPhrase: string;
  icaoQuestion: string;
  icaoSpeakText?: string;
  knowledgeSource?: KnowledgeSource;
  review: KnowledgeReviewMeta;
};

function pickAtcExample(entry: VocabularyKnowledgeEntry): string {
  const termMatch = entry.realExamples.find((e) =>
    e.text.toLowerCase().includes(entry.term.toLowerCase()),
  );
  if (termMatch) return termMatch.text;

  const preferred =
    entry.realExamples.find((e) => e.context === "tower" || e.context === "approach") ??
    entry.realExamples[0];
  return preferred?.text ?? entry.pilotResponses[0] ?? entry.term;
}

function skybraryReference(entry: VocabularyKnowledgeEntry): KnowledgeSource | undefined {
  const sky = entry.references.find((r) => r.source === "skybrary");
  if (!sky) return undefined;
  return {
    provider: "skybrary",
    topic: entry.term,
    summary: entry.operationalMeaning,
    operationalLessonIdea: entry.whenUsed,
    icaoQuestionIdea: entry.icaoQuestions[0] ?? "",
    sourceUrl: sky.url ?? "",
    sourceTitle: sky.title,
    attribution: sky.attribution ?? "Source: SKYbrary Aviation Safety",
  };
}

/** Build Word Mission lesson content from structured knowledge — Captain never invents. */
export function lessonDefFromVocabularyEntry(
  entry: VocabularyKnowledgeEntry,
  options?: { callsign?: string },
): KnowledgeLessonDef {
  const example = pickAtcExample(entry);
  const sayPhrase =
    entry.pilotResponses.find((r) => !/^(roger|wilco)/i.test(r)) ??
    entry.pilotResponses[0] ??
    example;

  return {
    meaningEn: entry.simpleMeaning,
    meaningPt: entry.portugueseMeaning,
    whenUsed: entry.operationalMeaning,
    example,
    sayPhrase,
    icaoQuestion: entry.icaoQuestions[0] ?? "",
    icaoSpeakText: entry.pilotResponses[0],
    knowledgeSource: skybraryReference(entry),
    review: buildKnowledgeReviewMeta(entry, { fallbackUsed: false }),
  };
}
