import type { EvaluateType } from "@/lib/evaluate/types";

export type NaturalnessLevel =
  | "professional_pilot"
  | "natural"
  | "understandable"
  | "scripted"
  | "needs_improvement";

export type SkillBand = "operational" | "developing" | "needs_practice";

export type SkillBandNote = {
  band: SkillBand;
  detail: string;
};

export type NaturalnessSuggestion = {
  studentPhrase: string;
  pilotPhrase: string;
  why: string;
};

export type AnswerChange = {
  change: string;
  why: string;
};

export type PilotLanguageTip = {
  term: string;
  usage: string;
};

export type FlightInstructorReport = {
  positiveOpening: string[];
  naturalnessReview: {
    summary: string;
    suggestions: NaturalnessSuggestion[];
    level: NaturalnessLevel;
    levelWhy: string;
  };
  pilotLanguageReview: PilotLanguageTip[];
  priorityImprovement: {
    focus: string;
    detail: string;
  };
  mission: {
    title: string;
    expressions: string[];
    estimatedMinutes: number;
  };
  improvedAnswer: {
    studentVersion: string;
    coachVersion: string;
    whatChanged: AnswerChange[];
  };
  pilotVocabulary: {
    alreadyUsed: string[];
    nextToLearn: string[];
  };
  icaoBands: {
    pronunciation: SkillBandNote;
    fluency: SkillBandNote;
    vocabulary: SkillBandNote;
    structure: SkillBandNote;
    interaction: SkillBandNote;
    estimatedLevel: number;
    disclaimer: string;
  };
  memoryNote: string | null;
  followUpQuestion: string | null;
  closingLine: string;
  source: "openai" | "local";
};

export type FlightInstructorRequest = {
  transcript: string;
  question: string;
  modelAnswer: string;
  type: EvaluateType;
  keywords?: string[];
  answerMode?: "level4" | "level5" | "peel";
  cardNum?: string;
  situationId?: string;
  scores?: {
    overall: number;
    structure: number;
    content: number;
    phraseology: number;
    pronunciation: number;
  };
  icaoLevel?: number;
  azureWeakWords?: string[];
  followUpContext?: {
    originalQuestion: string;
    followUpQuestion: string;
    previousTranscript: string;
  };
};

export type InstructorSessionRecord = {
  id: string;
  date: string;
  at: string;
  type: EvaluateType;
  cardNum?: string;
  situationId?: string;
  question: string;
  transcript: string;
  overallScore: number;
  icaoLevel: number;
  naturalnessLevel: NaturalnessLevel;
  weakAreas: string[];
};

export type InstructorMemoryStore = {
  sessions: InstructorSessionRecord[];
  pronunciationMistakes: Record<string, number>;
  grammarPatterns: Record<string, number>;
  forgottenWords: Record<string, number>;
  difficultQuestionIds: Record<string, number>;
};

export type DailyDebrief = {
  date: string;
  strengths: string[];
  focusNextFlight: string[];
  mission: {
    practiceAreas: string[];
    estimatedMinutes: number;
  };
  source: "openai" | "local";
};

export const NATURALNESS_LABELS: Record<NaturalnessLevel, string> = {
  professional_pilot: "🟢 Professional Pilot",
  natural: "🟢 Natural",
  understandable: "🟡 Understandable",
  scripted: "🟠 Scripted",
  needs_improvement: "🔴 Needs Improvement",
};

export const SKILL_BAND_LABELS: Record<SkillBand, string> = {
  operational: "Operational",
  developing: "Developing",
  needs_practice: "Needs Practice",
};
