/** Referenced aviation knowledge — never bulk-copied article text. */

export type KnowledgeSourceProvider = "internal" | "skybrary";

export type KnowledgeSource = {
  provider: KnowledgeSourceProvider;
  topic: string;
  /** Short summary in our own words — never a pasted article. */
  summary: string;
  operationalLessonIdea: string;
  icaoQuestionIdea: string;
  sourceUrl: string;
  sourceTitle: string;
  attribution: string;
};

export const SKYBRARY_ATTRIBUTION = "Source: SKYbrary Aviation Safety";

export const SKYBRARY_UI_LABEL = "Based on SKYbrary Aviation Safety.";

/** Guard — curated entries must stay short; no full articles. */
export const KNOWLEDGE_SUMMARY_MAX_CHARS = 320;

export function isValidKnowledgeSummary(text: string): boolean {
  return text.length > 0 && text.length <= KNOWLEDGE_SUMMARY_MAX_CHARS;
}
