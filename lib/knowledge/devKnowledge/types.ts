export type DevKnowledgeEntry = {
  id: string;
  catalogId: string;
  /** Title-case label for UI (e.g. "Fly Direct"). */
  displayTerm: string;
  term: string;
  slug: string;
  category: string;
  meaningEn: string;
  meaningPt: string;
  whenUsed: string;
  example: string;
  sayPhrase: string;
  icaoQuestion: string;
  icaoSpeakText: string;
};
