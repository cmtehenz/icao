export type EvaluateType =
  | "part1"
  | "part2-readback"
  | "part2-interaction"
  | "part2-reported";

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
  summary: string;
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
  suggestedAnswer?: string;
  source: "local" | "openai";
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
};
