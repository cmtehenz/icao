import type { ExamVersion } from "@/lib/exams/types";

export type ExamAudioPart = "part1" | "part2" | "part3" | "part4";

export type ExamAudioItemType =
  | "examiner_question"
  | "model_answer"
  | "original_audio"
  | "instruction"
  | "pause";

export type ExamSpeaker = "female_examiner" | "male_candidate" | "original_atc";

export type ExamAudioItem = {
  id: string;
  part: ExamAudioPart;
  type: ExamAudioItemType;
  speaker?: ExamSpeaker;
  text?: string;
  audioSrc?: string;
  pauseSeconds?: number;
  label?: string;
};

export type ListeningMode = "full" | "question_only" | "shadowing";

export type FullExamId = "exam1" | "exam2" | "exam3" | "exam4";

export type FullExamMeta = {
  id: FullExamId;
  title: string;
  subtitle: string;
  version: ExamVersion;
  durationEstimateMin: number;
  partsIncluded: ExamAudioPart[];
  description: string;
};

export const FULL_EXAM_IDS: FullExamId[] = ["exam1", "exam2", "exam3", "exam4"];

export const EXAM_ID_TO_VERSION: Record<FullExamId, ExamVersion> = {
  exam1: "23C",
  exam2: "24C",
  exam3: "25C",
  exam4: "26C",
};

export const VERSION_TO_EXAM_ID: Record<ExamVersion, FullExamId> = {
  "23C": "exam1",
  "24C": "exam2",
  "25C": "exam3",
  "26C": "exam4",
};
