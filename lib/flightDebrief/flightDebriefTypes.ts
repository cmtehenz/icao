export type FlightDebriefLegStatus = {
  id: string;
  label: string;
  complete: boolean;
};

export type Part1ConversationDebrief = {
  conversationQuality: number;
  followUpHandling: number;
  naturalness: number;
  operationalReasoning: number;
  confidence: number;
  priorityImprovement: string;
  tomorrowFocus: string;
};

export type FlightDebriefSummary = {
  date: string;
  examLabel: string;
  positiveOpening: string;
  legs: FlightDebriefLegStatus[];
  recallResult: string;
  recallConfidenceStars: number;
  strongestArea: string;
  weakestArea: string;
  priorityImprovement: string;
  nextAction: string;
  tomorrowFocus: string;
  readinessPercent: number;
  part1Conversation?: Part1ConversationDebrief | null;
};

export type FlightDebriefState = {
  date: string;
  viewed: boolean;
  complete: boolean;
  completedAt?: string;
};

export type FlightDebriefProgress = {
  done: number;
  total: number;
  complete: boolean;
};
