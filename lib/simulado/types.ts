import type { EvaluateFeedback, EvaluateType } from "@/lib/evaluate/types";
import type { IcaoCriterion, IcaoLevel } from "@/lib/evaluate/icaoLevel";
import type { ExamVersion } from "@/lib/exams/types";

export type SimulationMode = "full" | "part1" | "part2" | "part3" | "part4" | "custom";

export type SimuladoPart = 1 | 2 | 3 | 4;

export type ICAOCriterionScore = {
  pronunciation: number;
  structure: number;
  vocabulary: number;
  fluency: number;
  comprehension: number;
  interactions: number;
};

export type SimulationTranscriptItem = {
  stepId: string;
  part: SimuladoPart;
  label: string;
  question: string;
  transcript: string;
  modelAnswer?: string;
};

export type SimulationReport = {
  id: string;
  date: string;
  examVersion: ExamVersion;
  mode: SimulationMode;
  partsIncluded: SimuladoPart[];
  estimatedLevel: 3 | 4 | 5 | 6;
  scores: ICAOCriterionScore;
  partScores: {
    part1?: number;
    part2?: number;
    part3?: number;
    part4?: number;
  };
  strengths: string[];
  weaknesses: string[];
  studyRecommendations: string[];
  difficultItems: string[];
  transcript: SimulationTranscriptItem[];
  criterionLevels: Record<IcaoCriterion, IcaoLevel>;
};

export type SimuladoStepResult = {
  stepId: string;
  part: SimuladoPart;
  label: string;
  question: string;
  modelAnswer: string;
  evaluateType: EvaluateType;
  feedback: EvaluateFeedback;
  evaluationId?: string;
};

export type SimuladoListenStep = {
  kind: "listen";
  id: string;
  part: SimuladoPart;
  label: string;
  audioSrc: string;
};

export type SimuladoExaminerStep = {
  kind: "examiner";
  id: string;
  part: SimuladoPart;
  label: string;
  text: string;
};

export type SimuladoRecordStep = {
  kind: "record";
  id: string;
  part: SimuladoPart;
  label: string;
  question: string;
  modelAnswer: string;
  evaluateType: EvaluateType;
  keywords?: string[];
  prepSeconds?: number;
  answerSeconds?: number;
};

export type SimuladoNotesStep = {
  kind: "notes";
  id: string;
  part: SimuladoPart;
  label: string;
  prompt: string;
};

export type SimuladoPictureStep = {
  kind: "picture";
  id: string;
  part: 4;
  label: string;
  imageSrc: string;
  imageAlt: string;
  examinerPrompt: string;
};

export type SimuladoInstructionStep = {
  kind: "instruction";
  id: string;
  part: SimuladoPart;
  label: string;
  text: string;
};

export type SimuladoStep =
  | SimuladoListenStep
  | SimuladoExaminerStep
  | SimuladoRecordStep
  | SimuladoNotesStep
  | SimuladoPictureStep
  | SimuladoInstructionStep;

export type SimuladoSessionConfig = {
  examVersion: ExamVersion;
  mode: SimulationMode;
  customParts?: SimuladoPart[];
};

export type SimuladoDashboardStats = {
  totalSimulations: number;
  averageScore: number;
  bestScore: number;
  weakestPart: SimuladoPart | null;
  strongestPart: SimuladoPart | null;
  suggestedNext: string;
  history: Array<{
    id: string;
    date: string;
    mode: SimulationMode;
    examVersion: ExamVersion;
    estimatedLevel: number;
    overallScore: number;
  }>;
};
