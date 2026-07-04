import type { FlightInstructorReport } from "@/lib/flightInstructor/types";

export type CaptainDeltaContext =
  | "dashboard"
  | "part1"
  | "part2"
  | "pronunciation"
  | "vocabulary"
  | "simulation"
  | "listen"
  | "memory"
  | "account"
  | "other";

export type CaptainDeltaMessageKind =
  | "briefing"
  | "context"
  | "coaching"
  | "debrief"
  | "mission"
  | "suggestion"
  | "answer"
  | "followup";

export type CaptainDeltaMessage = {
  id: string;
  kind: CaptainDeltaMessageKind;
  text: string;
  /** Shown in panel; voice uses speechText when set */
  speechText?: string;
  at: string;
};

export type CaptainDeltaSuggestionPayload = {
  text: string;
  speechText?: string;
  kind?: CaptainDeltaMessageKind;
};

export type CaptainDeltaAfterAnswerPayload = {
  report: FlightInstructorReport;
  transcript: string;
};

export type CaptainDeltaDebriefPayload = {
  strengths?: string[];
  focus?: string[];
  estimatedMinutes?: number;
};
