export type MissionRecallStage =
  | "pronunciation"
  | "vocabulary"
  | "part1"
  | "part2"
  | "surprise";

export type MissionRecallAnswer = {
  itemId: string;
  transcript?: string;
  answeredAt: string;
  method: "speech" | "manual";
  answered: true;
};

export type MissionRecallItem = {
  id: string;
  stage: MissionRecallStage;
  prompt: string;
  /** Source reference — must be from today's mission only. */
  sourceRef: string;
};

export type MissionRecallState = {
  date: string;
  itemIds: string[];
  answeredIds: string[];
  answers?: Record<string, MissionRecallAnswer>;
  complete: boolean;
  confidenceStars: number;
  completedAt?: string;
};

export type MissionRecallProgress = {
  done: number;
  total: number;
  complete: boolean;
  confidenceStars: number;
};
