/** Captain Delta Infinity — shared coaching types (provider-agnostic). */

export type CaptainIntent =
  | "pronunciation_question"
  | "meaning_question"
  | "grammar_question"
  | "vocabulary_question"
  | "icao_answer"
  | "phraseology"
  | "atc"
  | "helicopter_operation"
  | "crm"
  | "weather"
  | "navigation"
  | "exam_strategy"
  | "confidence"
  | "student_frustration"
  | "repeat_request"
  | "explain_again"
  | "stress_help"
  | "rhythm_help"
  | "vowel_help"
  | "connected_speech"
  | "consonant_help"
  | "aviation_context"
  | "random_aviation"
  | "conversation"
  | "motivation"
  | "technical_recording_error"
  | "unknown";

export type TeachingStrategy =
  | "direct"
  | "socratic"
  | "demonstration"
  | "encourage"
  | "clarify"
  | "progressive"
  | "story"
  | "challenge";

/** Granularity for difficulty adaptation — smallest step that creates improvement */
export type DifficultyGranularity = "syllable" | "word" | "phrase" | "sentence" | "challenge";

export type LearningLoopAction =
  | "try_again"
  | "repeat_after_me"
  | "own_sentence"
  | "explain_back"
  | "atc_usage";

export type CaptainStudentNeed =
  | "confidence"
  | "rhythm"
  | "stress"
  | "clarity"
  | "meaning"
  | "challenge"
  | "recovery";

/** Internal only — never shown to the student */
export type CaptainStudentModel = {
  estimatedIcaoLevel: number;
  confidence: "low" | "medium" | "high";
  emotionalState: "frustrated" | "bored" | "neutral" | "confident";
  pronunciationWeakness: "stress" | "rhythm" | "vowel" | "completeness" | null;
  wordMastered: boolean;
  wordRepeatCount: number;
  consecutiveSameMistake: number;
  hesitation: "low" | "medium" | "high";
  learningStyle: "speaking" | "listening" | "shadowing";
  lastAttemptSucceeded: boolean;
  primaryNeed: CaptainStudentNeed;
};

export type AdaptivePlan = {
  studentGoal: string;
  blocker: string | null;
  smallestLesson: DifficultyGranularity;
  teachingVariant: TeachingStrategy;
  microChallenge: string | null;
  activeIntervention: string | null;
  learningLoop: LearningLoopAction;
  useAviationHook: boolean;
  useStory: boolean;
};

export type StudentModelHints = {
  estimatedIcaoLevel?: number;
  wordRepeatCount?: number;
  wordMastered?: boolean;
  lastAttemptScore?: number;
  lastAttemptSucceeded?: boolean;
  consecutiveSameFocus?: number;
  examDaysRemaining?: number;
  mentorStore?: import("@/lib/captainDelta/memory/types").CaptainDeltaMemoryStore;
  pilotProfile?: import("@/lib/profile").PilotProfile;
  vaultWords?: import("@/lib/pronunciationVault").VaultWord[];
  callsign?: string;
};

/** Matches pronunciation coach focus dimensions — kept here to avoid circular imports */
export type CoachingFocusLike =
  | "accuracy"
  | "fluency"
  | "prosody"
  | "completeness"
  | "strong";

/** 0 = hint, 1 = stronger hint, 2 = demonstration, 3 = full explanation */
export type HelpLevel = 0 | 1 | 2 | 3;

export type CaptainLessonMemory = {
  currentWord: string;
  referenceText: string;
  practiceLevel: number;
  currentMission: string | null;
  lastMistake: string | null;
  lastCoaching: string | null;
  lastSuccessfulAttempt: string | null;
  lastIntent: CaptainIntent | null;
  explainedTopics: string[];
  helpLevel: HelpLevel;
  turnCount: number;
  frustrationSignals: number;
  recentMessages: string[];
  consecutiveSameMistake: number;
  successesToday: number;
};

export type CaptainLessonContextInput = {
  currentWord?: string | null;
  referenceText?: string | null;
  practiceLevel?: number;
  currentMission?: string | null;
  lastMistake?: string | null;
  lastCoaching?: string | null;
  lastSuccessfulAttempt?: string | null;
  lastIntent?: CaptainIntent | null;
  studentHints?: StudentModelHints;
  callsign?: string;
};

export type InstructorLesson = {
  positive: string;
  focus: string;
  teach: string;
  exercise: string;
  repeat: string;
};

export type CaptainInstructorResponse = {
  message: string;
  speechText: string;
  intent: CaptainIntent;
  strategy: TeachingStrategy;
  helpLevel: HelpLevel;
  needsClarification?: boolean;
};
