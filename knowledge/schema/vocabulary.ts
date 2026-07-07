/** ICAO Delta vocabulary knowledge schema — single source of truth for entry shape. */

export const VOCABULARY_SCHEMA_VERSION = "1.0.0";

export const APPROVED_SOURCE_IDS = [
  "icao-delta",
  "icao",
  "faa",
  "faa-aim",
  "faa-phak",
  "skybrary",
  "easa",
  "rotorcraft",
  "icao-phraseology",
  "youglish",
] as const;

export type ApprovedSourceId = (typeof APPROVED_SOURCE_IDS)[number];

export type OperationalContext =
  | "tower"
  | "ground"
  | "approach"
  | "departure"
  | "center"
  | "pilot"
  | "passenger-briefing"
  | "crm"
  | "checklist"
  | "emergency"
  | "weather"
  | "navigation";

export type KnowledgeReference = {
  title: string;
  source: ApprovedSourceId;
  url?: string;
  attribution?: string;
};

export type RealExample = {
  text: string;
  context: OperationalContext;
  speaker?: string;
};

export type CompareTerm = {
  term: string;
  note: string;
};

export type VocabularyKnowledgeEntry = {
  id: string;
  term: string;
  category: string;
  level: 1 | 2 | 3 | 4 | 5;
  meaning: string;
  simpleMeaning: string;
  portugueseMeaning: string;
  operationalMeaning: string;
  whoUsesIt: string;
  whenUsed: string;
  whyUsed: string;
  realExamples: RealExample[];
  pilotResponses: string[];
  icaoQuestions: string[];
  commonMistakes: string[];
  pronunciationTips: string[];
  relatedTerms: string[];
  compareTerms: CompareTerm[];
  didYouKnow: string[];
  captainStory?: string;
  references: KnowledgeReference[];
  lastReviewed: string;
  version: string;
};

export const VOCABULARY_REQUIRED_FIELDS: (keyof VocabularyKnowledgeEntry)[] = [
  "id",
  "term",
  "category",
  "level",
  "meaning",
  "simpleMeaning",
  "portugueseMeaning",
  "operationalMeaning",
  "whoUsesIt",
  "whenUsed",
  "whyUsed",
  "realExamples",
  "pilotResponses",
  "icaoQuestions",
  "commonMistakes",
  "pronunciationTips",
  "relatedTerms",
  "compareTerms",
  "didYouKnow",
  "references",
  "lastReviewed",
  "version",
];
