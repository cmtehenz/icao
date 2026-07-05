import type { DailyMissionSummary } from "@/lib/dailyMission";

export type FlightPhaseId =
  | "pronunciation"
  | "vocabulary"
  | "part1"
  | "part2"
  | "recall"
  | "mock"
  | "debrief"
  | "shutdown";

export type FlightPhaseStatus = "completed" | "current" | "upcoming" | "optional";

export type FlightPhaseProgress = {
  done: number;
  total: number;
};

export type FlightPhaseDefinition = {
  id: FlightPhaseId;
  aviationLabel: string;
  missionLabel: string;
  captainCopy: string;
};

export type FlightPhase = FlightPhaseDefinition & {
  status: FlightPhaseStatus;
  progress?: FlightPhaseProgress;
};

export type FlightProgress = {
  phases: FlightPhase[];
  currentPhaseId: FlightPhaseId;
  currentPhase: FlightPhase;
  estimatedRemainingMinutes: number | null;
  mode: "standard" | "intense";
  missionComplete: boolean;
  youAreHereLabel: string;
};

export const FLIGHT_PHASE_DEFINITIONS: FlightPhaseDefinition[] = [
  {
    id: "pronunciation",
    aviationLabel: "ENGINE START",
    missionLabel: "Pronunciation",
    captainCopy: "Engine start — five words, slow and operational. Quality before speed.",
  },
  {
    id: "vocabulary",
    aviationLabel: "TAXI",
    missionLabel: "Vocabulary",
    captainCopy: "Taxi clearance — learn the operational meaning, then say it like a pilot.",
  },
  {
    id: "part1",
    aviationLabel: "TAKEOFF",
    missionLabel: "Part 1",
    captainCopy: "Takeoff briefing — hold four ideas, then explain them like a real briefing.",
  },
  {
    id: "part2",
    aviationLabel: "CRUISE",
    missionLabel: "Part 2",
    captainCopy: "Cruise — quick notes only: callsign, problem, intention, request.",
  },
  {
    id: "recall",
    aviationLabel: "SYSTEMS CHECK",
    missionLabel: "Mission Recall",
    captainCopy: "Systems check — answer from memory. Keep it fast.",
  },
  {
    id: "mock",
    aviationLabel: "CHECK RIDE",
    missionLabel: "Mock Exam",
    captainCopy: "Check ride — one situation at a time. Breathe and speak like the exam.",
  },
  {
    id: "debrief",
    aviationLabel: "LANDING",
    missionLabel: "Flight Debrief",
    captainCopy: "Landing — one priority improvement, then we close today's flight.",
  },
  {
    id: "shutdown",
    aviationLabel: "SHUTDOWN",
    missionLabel: "Mission Complete",
    captainCopy: "Shutdown complete. Well flown today — see you on the next leg.",
  },
];

export type FlightProgressInput = DailyMissionSummary;
