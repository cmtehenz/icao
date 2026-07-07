import type { NaturalnessLevel } from "@/lib/flightInstructor/types";

export type ConfidenceLevel = "very_confident" | "confident" | "unsure";

export type LearningPreference =
  | "speaking"
  | "listening"
  | "shadowing"
  | "pictures"
  | "keywords";

export type QuestionMemoryEntry = {
  questionId: string;
  label: string;
  timesPracticed: number;
  timesMastered: number;
  averageScore: number;
  averageSeconds: number | null;
  naturalness: NaturalnessLevel | null;
  confidenceAvg: number | null;
  lastConfidence: ConfidenceLevel | null;
  lastAt: string | null;
  nextReviewAt: string | null;
  weakAreas: string[];
};

export type DetectedPattern = {
  id: string;
  label: string;
  detail: string;
  count: number;
  missionHint: string;
};

export type AviationStory = {
  id: string;
  text: string;
  aircraft?: string;
  at: string;
};

/** Cross-session word journey — mentor memory (internal only). */
export type WordJourneyEntry = {
  lastStruggledDate?: string;
  lastSuccessDate?: string;
  struggleCount: number;
  lastFocus?: string;
};

export type CaptainDeltaMemoryStore = {
  version: 1;
  questionHistory: Record<string, QuestionMemoryEntry>;
  confidenceLog: { questionId: string; level: ConfidenceLevel; at: string }[];
  learningStyle: Record<LearningPreference, number>;
  preferredMode: LearningPreference | null;
  aviationStories: AviationStory[];
  connectorUsage: Record<string, number>;
  vocabularyRepeats: Record<string, number>;
  grammarMistakes: Record<string, number>;
  wordJourney?: Record<string, WordJourneyEntry>;
  sessionJournal?: {
    date: string;
    wins: string[];
    struggles: string[];
    reviewTopics: string[];
  };
  flightLog?: import("@/lib/captainDelta/infinity/flight/types").FlightLogEntry[];
  academyStudyPlan?: import("@/lib/captainDelta/infinity/academy/types").AcademyStudyPlan;
  sessionDates: string[];
  lastSessionCloseAt: string | null;
  lastWeeklyDebriefAt: string | null;
  bestAnswers: { questionId: string; label: string; score: number; at: string }[];
  estimatedIcaoHistory: { date: string; level: number }[];
};

export type PersonalMission = {
  title: string;
  expressions: string[];
  challenge: string;
  estimatedMinutes: number;
};

export type PersonalBriefing = {
  greeting: string;
  examDays: number;
  yesterdayLine: string | null;
  improvementNote: string | null;
  focusItems: string[];
  estimatedMinutes: number;
  mission: PersonalMission;
  reminder: string | null;
  aviationPersonal: string | null;
};

export type ExamReadiness = {
  coverage: number;
  confidence: number;
  pronunciation: number;
  vocabulary: number;
  fluency: number;
  interaction: number;
  structure: number;
  weakestTopic: string;
  strongestTopic: string;
  estimatedIcao: number;
  daysRemaining: number;
  trendDelta: number | null;
};

export type WeeklyFlightDebrief = {
  weekLabel: string;
  questionsAnswered: number;
  speakingMinutes: number;
  mostImproved: string;
  needsAttention: string;
  bestAnswer: { label: string; score: number } | null;
  confidenceDelta: number | null;
  estimatedIcaoFrom: number;
  estimatedIcaoTo: number;
  missionNextWeek: string[];
};

export type SessionClosing = {
  praise: string;
  tomorrowItems: string[];
  signOff: string;
};

export type LearnerSnapshot = {
  firstName: string;
  profile: import("@/lib/profile").PilotProfile;
  readiness: ExamReadiness;
  patterns: DetectedPattern[];
  improvements: string[];
  reminders: string[];
  adaptivePriority: { area: string; reason: string; href: string }[];
  masteredCount: number;
  weakQuestionCount: number;
};
