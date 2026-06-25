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
  difficulty: Difficulty;
  category: Category;
  tags: string[];
  targetWords: number;
};
