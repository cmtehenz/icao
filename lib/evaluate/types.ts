import type { IcaoLevelRating } from "./icaoLevel";

export type EvaluateType =
  | "part1"
  | "part2-readback"
  | "part2-interaction"
  | "part2-reported"
  | "part3-report"
  | "part3-followup"
  | "part4-description"
  | "part4-question"
  | "vocabulary";

export type EvaluateScores = {
  overall: number;
  structure: number;
  content: number;
  phraseology: number;
  pronunciation: number;
};

export type EvaluateFeedback = {
  scores: EvaluateScores;
  transcript: string;
  /** Original STT text when aviation normalization changed it. */
  rawTranscript?: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
  /** Clearance element checklist for Part 2 readback feedback. */
  readbackElements?: Array<{ id: string; label: string; found: boolean }>;
  suggestedAnswer?: string;
  source: "local" | "openai";
  icaoLevel?: IcaoLevelRating;
  azurePronunciation?: {
    accuracyScore: number;
    fluencyScore: number;
    completenessScore: number;
    prosodyScore: number;
    weakWords: string[];
    mispronouncedWords: Array<{
      word: string;
      accuracyScore: number;
      errorType: string;
      errorLabel: string;
    }>;
  };
};

export type EvaluateRequest = {
  transcript: string;
  question: string;
  modelAnswer: string;
  type: EvaluateType;
  keywords?: string[];
  /** Part 1: level4/level5 use simpler structure scoring; peel expects full connectors. */
  answerMode?: "level4" | "level5" | "peel";
};
