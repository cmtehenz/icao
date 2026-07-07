export type DevKnowledgeReference = {
  label: string;
  href?: string;
};

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
  /** Premium Mission Brief — Captain opens the lesson. */
  missionBrief?: string;
  /** Captain Delta Teaching narrative. */
  captainTeaching?: string;
  /** Real Operational Context story. */
  operationalContext?: string;
  /** Pronunciation / readback coaching line. */
  sayItCoach?: string;
  /** ICAO Level 4 model answer. */
  icaoModelAnswer?: string;
  memoryTrick?: string;
  /** Full operational meaning section. */
  operationalMeaning?: string;
  /** Bullet list from Why ATC Uses It. */
  whyAtcUsesIt?: string[];
  /** Real ATC phraseology examples. */
  atcPhraseology?: string[];
  /** Professional pilot readbacks. */
  pilotReadbacks?: string[];
  /** Common Brazilian mistakes section. */
  brazilianMistakes?: string;
  /** Full pronunciation coaching block. */
  pronunciationCoaching?: string;
  /** Related concept labels. */
  relatedConcepts?: string[];
  /** Reference sources with optional links. */
  references?: DevKnowledgeReference[];
};
