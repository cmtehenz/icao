/** Word Mission 2.1 — four practical lesson steps. */

export type WordMissionStepId =
  | "meaning"
  | "operational_use"
  | "say_it"
  | "icao_practice";

export const WORD_MISSION_STEP_ORDER: WordMissionStepId[] = [
  "meaning",
  "operational_use",
  "say_it",
  "icao_practice",
];

export const WORD_MISSION_STEP_LABELS: Record<WordMissionStepId, string> = {
  meaning: "Meaning",
  operational_use: "Operational Use",
  say_it: "Say It",
  icao_practice: "ICAO Practice",
};

export type WordMissionStep = {
  id: WordMissionStepId;
  label: string;
  /** Short Captain line — never a lecture */
  captainLine: string;
  /** Supporting copy shown in the card */
  detail?: string;
  /** Azure reference text when recording */
  speakText?: string;
  recordHere: boolean;
};

import type { KnowledgeSource } from "@/lib/wordMission/lesson/knowledgeSource";
import type { KnowledgeReviewMeta } from "@/lib/knowledge/review";

export type WordMissionLesson = {
  term: string;
  termId: string | null;
  category: string;
  steps: WordMissionStep[];
  callsign: string;
  /** Present when a curated external reference informed the lesson. */
  knowledgeSource?: KnowledgeSource;
  /** Developer review metadata — knowledge provenance. */
  knowledgeReview?: KnowledgeReviewMeta;
};

export type WordMissionLessonContext = {
  lesson: WordMissionLesson;
  currentStepId: WordMissionStepId;
  stepIndex: number;
};
