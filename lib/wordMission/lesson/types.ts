/** Word Mission 2.0 — micro-flight lesson phases. */

export type WordMissionPhaseId =
  | "mission_brief"
  | "meaning"
  | "operational_context"
  | "real_example"
  | "pronunciation"
  | "common_mistakes"
  | "did_you_know"
  | "compare"
  | "captain_story"
  | "icao_connection"
  | "micro_conversation"
  | "micro_challenge"
  | "mission_complete";

export const WORD_MISSION_PHASE_ORDER: WordMissionPhaseId[] = [
  "mission_brief",
  "meaning",
  "operational_context",
  "real_example",
  "pronunciation",
  "common_mistakes",
  "did_you_know",
  "compare",
  "captain_story",
  "icao_connection",
  "micro_conversation",
  "micro_challenge",
  "mission_complete",
];

export const WORD_MISSION_PHASE_LABELS: Record<WordMissionPhaseId, string> = {
  mission_brief: "Mission Brief",
  meaning: "Meaning",
  operational_context: "Operational Context",
  real_example: "Real Example",
  pronunciation: "Pronunciation",
  common_mistakes: "Common Mistakes",
  did_you_know: "Did You Know?",
  compare: "Compare",
  captain_story: "Captain Story",
  icao_connection: "ICAO Connection",
  micro_conversation: "Micro Conversation",
  micro_challenge: "Micro Challenge",
  mission_complete: "Mission Complete",
};

export type WordMissionPhaseContent = {
  id: WordMissionPhaseId;
  label: string;
  message: string;
  speechText: string;
  /** Student should speak on this phase */
  studentTurn?: boolean;
  /** Azure recording recommended */
  recordHere?: boolean;
};

export type WordMissionLesson = {
  term: string;
  termId: string | null;
  category: string;
  phases: WordMissionPhaseContent[];
  callsign: string;
};

export type WordMissionLessonContext = {
  lesson: WordMissionLesson;
  currentPhaseId: WordMissionPhaseId;
  phaseIndex: number;
};
