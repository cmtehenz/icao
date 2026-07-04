export type CaptainDeltaRole = "instructor" | "examiner";

export type ExamRecordingMeta = {
  stepId: string;
  part: number;
  label: string;
  question: string;
  transcript: string;
  durationSec: number;
  pauseCount: number;
  score: number;
  modelAnswer?: string;
  recordedAt: string;
};

export type ExaminerExamRecord = {
  reportId: string;
  date: string;
  mode: string;
  examVersion: string;
  estimatedLevel: number;
  strongestPart: number | null;
  weakestPart: number | null;
  avgResponseSec: number | null;
  completionPct: number;
  recordings: ExamRecordingMeta[];
};

export type ExaminerDebrief = {
  disclaimer: string;
  estimatedLevel: number;
  criteria: { key: string; label: string; level: number; score: number }[];
  partScores: { part: number; score: number }[];
  strengths: string[];
  weaknesses: string[];
  bestAnswer: { label: string; score: number; transcript: string } | null;
  worstAnswer: { label: string; score: number; transcript: string } | null;
  hardestMoment: string | null;
  wordsToPractice: string[];
  tomorrowMission: string[];
  spokenSummary: string;
};
