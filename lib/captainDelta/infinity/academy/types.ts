import type { OperationContext } from "@/lib/captainDelta/infinity/mentorProfile";

export type AcademyMissionKind =
  | "scenic"
  | "ems"
  | "offshore"
  | "training_sortie"
  | "mountain"
  | "tourism"
  | "firefighting"
  | "police"
  | "sar"
  | "vip";

export type CaptainInstructorRole = "instructor" | "atc" | "copilot" | "passenger" | "examiner";

export type AtcPosition = "tower" | "ground" | "approach" | "departure" | "center";

export type TrainingDayBlock = {
  label: string;
  href?: string;
  complete?: boolean;
};

export type AcademyStudyPlan = {
  date: string;
  todayPriorities: string[];
  tomorrowPriorities: string[];
  weakTopics: string[];
  reviewSchedule: string[];
  activeMission: AcademyMissionKind;
  careerFocus: string | null;
};

export type LiveAdaptationState = "ease" | "steady" | "push";

export type MicroDebriefResult = {
  improved: string[];
  needsWork: string[];
  tomorrow: string;
  speechText: string;
  message: string;
};

export type MissionContext = {
  kind: AcademyMissionKind;
  title: string;
  situation: string;
  operationContext: OperationContext;
};
