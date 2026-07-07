import type { OperationContext } from "@/lib/captainDelta/infinity/mentorProfile";

export type FlightPhase =
  | "preflight"
  | "mission_brief"
  | "training"
  | "correction"
  | "challenge"
  | "debrief"
  | "next_mission";

export type ExamTrainingPhase = "teaching" | "simulation" | "exam" | "confidence";

export type InstructorRole = "instructor" | "atc" | "copilot" | "passenger" | "examiner";

export type InstructorTone = "briefing" | "correction" | "urgent" | "debrief";

export type MicroSimulationKind =
  | "atc"
  | "passenger_briefing"
  | "weather"
  | "emergency"
  | "crm"
  | "offshore"
  | "ems";

export type FlightScenario = {
  kind: MicroSimulationKind;
  situation: string;
  towerOrRadioLine: string;
  studentPrompt: string;
};

export type FlightLogEntry = {
  flightNumber: number;
  date: string;
  missionWord: string;
  completed: boolean;
  difficulty: "easy" | "medium" | "hard";
  improvement: string;
  nextFocus: string;
};

export type FlightSortieContext = {
  word: string;
  referenceText: string;
  operationContext: OperationContext;
  examPhase: ExamTrainingPhase;
  callsign: string;
  aircraft: string;
  succeeded: boolean;
  focus?: string | null;
};
