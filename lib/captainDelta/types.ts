import type { FlightInstructorReport } from "@/lib/flightInstructor/types";
import type { PronunciationRecorderUiState } from "@/lib/captainDelta/pronunciationRecorderState";

export type CaptainDeltaContext =
  | "dashboard"
  | "part1"
  | "part2"
  | "pronunciation"
  | "vocabulary"
  | "simulation"
  | "recall"
  | "debrief"
  | "listen"
  | "memory"
  | "account"
  | "other";

export type CaptainDeltaLessonMode =
  | "briefing"
  | "coach"
  | "memory"
  | "pronunciation"
  | "readback"
  | "interaction"
  | "reported"
  | "picture"
  | "simulation"
  | "listen"
  | "debrief"
  | "idle";

export type CaptainDeltaAvatarState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "celebrating"
  | "correcting";

export type CaptainDeltaMessageKind =
  | "briefing"
  | "context"
  | "coaching"
  | "debrief"
  | "mission"
  | "suggestion"
  | "followup";

export type CaptainDeltaActionId =
  | "ready"
  | "answer_question"
  | "explain_your_way"
  | "try_again"
  | "repeat_after_me"
  | "describe_picture"
  | "read_back"
  | "report_atc"
  | "start_exam"
  | "explain_it"
  | "give_example"
  | "slow_audio"
  | "watch_real_examples"
  | "show_keywords"
  | "show_hint"
  | "listen_again"
  | "show_model"
  | "open_notes"
  | "explain_why"
  | "compare_attempts";

export type CaptainDeltaAction = {
  id: CaptainDeltaActionId;
  label: string;
  primary?: boolean;
};

export type CaptainDeltaLessonContext = {
  mode: CaptainDeltaLessonMode;
  question?: string;
  questionLabel?: string;
  modelAnswer?: string;
  keywords?: string[];
  pronunciationWord?: string;
  simulationStep?: string;
  part2Kind?: "readback" | "interaction" | "reported" | "picture";
  hasFeedback?: boolean;
  hasModelAnswer?: boolean;
  hasNotes?: boolean;
  canCompareAttempts?: boolean;
  recording?: boolean;
  pronunciationRecorder?: PronunciationRecorderUiState;
};

export type CaptainDeltaLessonContextPatch = Partial<CaptainDeltaLessonContext> & {
  eventId?: string;
};

export type CaptainDeltaMessage = {
  id: string;
  kind: CaptainDeltaMessageKind;
  text: string;
  speechText?: string;
  at: string;
  primaryAction: CaptainDeltaAction;
  secondaryActions: CaptainDeltaAction[];
};

export type CaptainDeltaSuggestionPayload = {
  text: string;
  speechText?: string;
  kind?: CaptainDeltaMessageKind;
  primaryAction?: CaptainDeltaAction;
  secondaryActions?: CaptainDeltaAction[];
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

export const DEFAULT_LESSON_CONTEXT: CaptainDeltaLessonContext = {
  mode: "idle",
};
