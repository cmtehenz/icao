import type { Category } from "./categories";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type Card = {
  num: string;
  question: string;
  memory: string;
  memoryLabels: string[];
  keywords?: string[];
  opener: string;
  ideas: string[];
  example: string;
  conclusion: string;
  verbs: string[];
  vocab: string[];
  answer: string;
  /** When set, used as the spoken model in ICAO 4 mode instead of auto-building from PEEL. */
  answerLevel4?: string;
  difficulty: Difficulty;
  category: Category;
  tags: string[];
  targetWords: number;
};
