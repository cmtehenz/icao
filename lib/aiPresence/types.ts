/** Explicit conversation / mission AI phases (Sprint 6.1). */
export type ConversationSessionPhase =
  | "idle"
  | "examiner_speaking"
  | "student_speaking"
  | "examiner_thinking"
  | "listening"
  | "conversation_closing"
  | "captain_standby"
  | "captain_debrief";

export type AIPresenceActor = "captain" | "examiner";

export type AIPresenceSnapshot = {
  actor: AIPresenceActor;
  phase: ConversationSessionPhase;
  statusLine: string;
  subLine?: string;
  /** Part 1 HEX only */
  hexActive?: boolean;
};

export type ConversationProgressView = {
  discussionLabel: string;
  current: number;
  total: number;
  stageIndex: number;
  stages: string[];
};

export type CaptainStandbyCopy = {
  title: string;
  body: string;
  hint?: string;
};
