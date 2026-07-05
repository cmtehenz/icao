export type FlightMissionLeg = {
  id: string;
  label: string;
  href: string;
  minutes: number;
};

export type DailyFlightMission = {
  title: string;
  legs: FlightMissionLeg[];
  totalMinutes: number;
  difficulty: "easy" | "medium" | "hard";
  objective: string;
};

export type LogbookFlight = {
  flightNumber: number;
  date: string;
  durationMinutes: number;
  mission: string;
  result: "excellent" | "good" | "developing";
  captainNotes: string;
  activities: string[];
};

export type AviationAchievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
};

export type CareerGoal = {
  title: string;
  progress?: number;
  description?: string;
};

export type AcademyStore = {
  version: 1;
  flights: LogbookFlight[];
  achievements: Record<string, string>;
  postExamNote: string | null;
  postExamLevel: number | null;
  academyStartDate: string;
  bestStreak: number;
};

export type AcademyStatistics = {
  hoursStudied: number;
  hoursSpeaking: number;
  questionsAnswered: number;
  mockExamsCompleted: number;
  bestStreak: number;
  currentStreak: number;
};

export type AcademyPhase =
  | "learning"
  | "performance"
  | "simulation"
  | "exam"
  | "confidence"
  | "post_exam";

export type CaptainPersonality = {
  phase: AcademyPhase;
  tone: string;
  focus: string;
};

export type MonthlyAcademyReport = {
  monthLabel: string;
  speakingHours: number;
  vocabularySessions: number;
  mostImproved: string;
  weakestArea: string;
  icaoFrom: number;
  icaoTo: number;
  recommendations: string[];
};

/** Future-ready community hooks — not implemented yet. */
export type CommunityFeatureFlags = {
  leaderboards: boolean;
  instructorChallenges: boolean;
  weeklyMissions: boolean;
  liveMockExams: boolean;
  sharedStatistics: boolean;
};
