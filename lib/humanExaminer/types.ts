export type FollowUpCategory =
  | "clarification"
  | "expansion"
  | "personal"
  | "operational"
  | "example"
  | "comparison"
  | "opinion"
  | "hypothetical"
  | "recovery";

export type ExaminerProfile =
  | "neutral"
  | "curious"
  | "reserved"
  | "supportive"
  | "time_pressure";

export type ConversationTurn = {
  role: "examiner" | "student";
  text: string;
  category?: FollowUpCategory;
  score?: number;
  at: string;
};

export type QuestionContext = {
  cardNum: string;
  question: string;
  knowledgeDomain: string;
  operationalTopic: string;
  keywords: string[];
  suggestedFollowUps: string[];
  difficulty: 1 | 2 | 3;
  captainNotes: string;
  graphRefs: string[];
};

export type ConversationState = {
  cardNum: string;
  profile: ExaminerProfile;
  turns: ConversationTurn[];
  followUpCount: number;
  usedCategories: FollowUpCategory[];
  recoveryCount: number;
  memoryPhrases: string[];
  complete: boolean;
  closingMessage?: string;
};

export type ConversationStopReason =
  | "objective_met"
  | "max_followups"
  | "sufficient_answer"
  | "student_stuck";

export type ConversationMetrics = {
  conversationQuality: number;
  followUpHandling: number;
  naturalness: number;
  operationalReasoning: number;
  confidence: number;
  priorityImprovement: string;
  tomorrowFocus: string;
};

export const FOLLOW_UP_PRIORITY: FollowUpCategory[] = [
  "clarification",
  "expansion",
  "personal",
  "operational",
  "example",
  "comparison",
  "opinion",
  "hypothetical",
  "recovery",
];
