export type Part2Mode =
  | "readback"
  | "interaction"
  | "reported"
  | "vocabulary"
  | "simulation"
  | "words";

export type ReadbackChunkType =
  | "callsign"
  | "altitude"
  | "heading"
  | "frequency"
  | "runway"
  | "route"
  | "clearance"
  | "other";

export type ReadbackChunk = {
  type: ReadbackChunkType;
  text: string;
};

export type ReadbackScenario = {
  id: string;
  title: string;
  instruction: string;
  chunks: ReadbackChunk[];
  modelReadback: string;
};

export type InteractionScenario = {
  id: string;
  title: string;
  flightPhase: string;
  situation: string;
  atcName: string;
  callsign: string;
  urgency: "MAYDAY" | "PAN-PAN" | "routine";
  problem: string;
  intention: string;
  request: string;
  modelReport: string;
};

export type ReportedSpeechType = "instructed" | "cleared" | "asked" | "informed";

export type ReportedSpeechScenario = {
  id: string;
  title: string;
  atcMessage: string;
  speechType: ReportedSpeechType;
  template: string;
  modelAnswer: string;
};

export type VocabularyTerm = {
  id: string;
  term: string;
  definition: string;
  example: string;
};

export type Part2ProgressStatus = "new" | "learning" | "difficult" | "mastered";

export type Part2ItemProgress = {
  status: Part2ProgressStatus;
  reviews: number;
  lastReviewed?: string;
};

export type Part2ProgressStore = {
  items: Record<string, Part2ItemProgress>;
  vocabularyKnown: string[];
  dailyCount: Record<string, number>;
};

export const REPORTED_TEMPLATES: Record<ReportedSpeechType, string> = {
  instructed: "The controller instructed me to...",
  cleared: "The controller cleared me to...",
  asked: "The controller asked me to confirm if...",
  informed: "The controller informed me that...",
};

export const INTERACTION_HELPERS = {
  problem: "We are experiencing...",
  intention: "We would like to...",
  request: "Request vectors / priority / emergency services...",
} as const;
