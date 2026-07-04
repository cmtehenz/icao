import type { EvaluateType } from "@/lib/evaluate/types";

export type NaturalnessLevel = "scripted" | "acceptable" | "natural" | "professional_pilot";

export type PilotVocabRating = "excellent" | "good" | "needs_improvement";

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
  positiveFeedback: string[];
  naturalnessReview: {
    summary: string;
    suggestions: NaturalnessSuggestion[];
    level: NaturalnessLevel;
  };
  icaoEvaluation: {
    pronunciation: string;
    fluency: string;
    vocabulary: string;
    structure: string;
    interaction: string;
    estimatedLevel: number;
    disclaimer: string;
  };
  improvedAnswer: {
    studentVersion: string;
    coachVersion: string;
    whatChanged: AnswerChange[];
  };
  pilotLanguage: PilotLanguageTip[];
  memoryCoaching: {
    keyIdeas: string[];
    note: string;
  };
  personalCoaching: string | null;
  nextMission: {
    items: string[];
    estimatedMinutes: number;
  };
  confidenceMessage: string;
  pilotVocabulary: {
    rating: PilotVocabRating;
    missingExpressions: string[];
  };
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
  /** Scores from /api/evaluate — helps the instructor stay consistent. */
  scores?: {
    overall: number;
    structure: number;
    content: number;
    phraseology: number;
    pronunciation: number;
  };
  icaoLevel?: number;
  azureWeakWords?: string[];
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
  needsImprovement: string[];
  achievement: string;
  tomorrowMission: {
    items: string[];
    estimatedMinutes: number;
  };
  source: "openai" | "local";
};

export const NATURALNESS_LABELS: Record<NaturalnessLevel, string> = {
  scripted: "Scripted",
  acceptable: "Acceptable",
  natural: "Natural",
  professional_pilot: "Professional Pilot",
};

export const PILOT_VOCAB_LABELS: Record<PilotVocabRating, string> = {
  excellent: "Excellent",
  good: "Good",
  needs_improvement: "Needs Improvement",
};
