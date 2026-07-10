export type ExamVersion = "23C" | "24C" | "25C" | "26C";

export const EXAM_VERSIONS: ExamVersion[] = ["23C", "24C", "25C", "26C"];

export const EXAM_LABELS: Record<ExamVersion, string> = {
  "23C": "Prova 23C",
  "24C": "Prova 24C",
  "25C": "Prova 25C",
  "26C": "Prova 26C",
};

export type NotesScope = {
  idealNotes: string[];
  requiredCodes: string[];
  optionalCodes?: string[];
};

export type RecommendedNotes = NotesScope & {
  /** Clearance-only notes for Readback mode comparison */
  readback?: NotesScope;
  /** ATC reply + AFFIRM/NEGATIVE — excludes readback and initial problem report */
  confirm?: NotesScope;
};

export type ExamSituation = {
  id: string;
  examVersion: ExamVersion;
  situationNumber: 1 | 2 | 3 | 4 | 5;
  title: string;
  context: string;
  recommendedNotes?: RecommendedNotes;
  readback: {
    atcFacility: string;
    atcMessage: string;
    modelReadback: string;
    audioTrack: number;
  };
  interaction: {
    prompt: string;
    modelReport: string;
    urgency: "MAYDAY" | "PAN-PAN" | "routine";
  };
  atcFollowUp: {
    atcMessage: string;
    modelCorrection: string;
    audioTrack: number;
    correctionType: "AFFIRM" | "NEGATIVE";
  };
  reportedSpeech: {
    modelAnswer: string;
  };
};
