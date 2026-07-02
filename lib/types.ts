import type { Category } from "./categories";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type Level4Step = {
  label: string;
  sentence: string;
};

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
  /** When set, used as the spoken model in ICAO 5 mode (deeper narrative). */
  answerLevel5?: string;
  /** Optional phrase the student can add for a more natural ICAO 4 answer. */
  answerExtra?: string;
  /** Example sentence highlighted in ICAO 4 study mode. */
  level4Example?: string;
  /** Study tips shown at the end of ICAO 4 mode (memorization hints). */
  studyTips?: string;
  /** Four short sentences mapped to keywords — shown in ICAO 4 study mode. */
  level4Steps?: Level4Step[];
  /** Emoji icons aligned with memoryLabels (e.g. 👦 → 🚁 → 🎓 → 👨‍✈️). */
  memoryIcons?: string[];
  difficulty: Difficulty;
  category: Category;
  tags: string[];
  targetWords: number;
};
