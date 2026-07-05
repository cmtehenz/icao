import type { DailyMissionSummary } from "@/lib/dailyMission";
import {
  FLIGHT_PHASE_DEFINITIONS,
  type FlightPhase,
  type FlightPhaseId,
  type FlightPhaseProgress,
  type FlightPhaseStatus,
} from "@/lib/flightProgress/flightProgressTypes";

export function detectCurrentPhaseId(summary: DailyMissionSummary): FlightPhaseId {
  if (summary.complete) return "shutdown";
  if (!summary.pronunciation.complete) return "pronunciation";
  if (!summary.vocabulary.complete) return "vocabulary";
  if (!summary.part1.complete) return "part1";
  if (!summary.part2.complete) return "part2";
  if (!summary.recall.complete) return "recall";
  if (summary.simulateRequired && !summary.simulate.complete) return "mock";
  if (!summary.debrief.complete) return "debrief";
  return "shutdown";
}

function phaseProgress(summary: DailyMissionSummary, id: FlightPhaseId): FlightPhaseProgress | undefined {
  switch (id) {
    case "pronunciation":
      return { done: summary.pronunciation.done, total: summary.pronunciation.total };
    case "vocabulary":
      return { done: summary.vocabulary.done, total: summary.vocabulary.total };
    case "part1":
      return { done: summary.part1.bothDone, total: summary.part1.total };
    case "part2":
      return { done: summary.part2.done, total: summary.part2.total };
    case "recall":
      return { done: summary.recall.done, total: summary.recall.total };
    case "mock":
      return { done: summary.simulate.done, total: summary.simulate.total };
    case "debrief":
      return { done: summary.debrief.done, total: summary.debrief.total };
    default:
      return undefined;
  }
}

function isPhaseComplete(summary: DailyMissionSummary, id: FlightPhaseId): boolean {
  switch (id) {
    case "pronunciation":
      return summary.pronunciation.complete;
    case "vocabulary":
      return summary.vocabulary.complete;
    case "part1":
      return summary.part1.complete;
    case "part2":
      return summary.part2.complete;
    case "recall":
      return summary.recall.complete;
    case "mock":
      return summary.simulate.complete;
    case "debrief":
      return summary.debrief.complete;
    case "shutdown":
      return summary.complete;
    default:
      return false;
  }
}

export function buildFlightPhases(summary: DailyMissionSummary): FlightPhase[] {
  const currentId = detectCurrentPhaseId(summary);

  return FLIGHT_PHASE_DEFINITIONS.map((def) => {
    if (def.id === "mock" && !summary.simulateRequired) {
      return {
        ...def,
        status: "optional" as FlightPhaseStatus,
        progress: phaseProgress(summary, def.id),
      };
    }

    const complete = isPhaseComplete(summary, def.id);
    let status: FlightPhaseStatus;
    if (complete) {
      status = "completed";
    } else if (def.id === currentId) {
      status = "current";
    } else {
      status = "upcoming";
    }

    return {
      ...def,
      status,
      progress: phaseProgress(summary, def.id),
    };
  });
}

export function youAreHereLabel(phase: FlightPhase): string {
  if (phase.status === "completed" && phase.id === "shutdown") {
    return "Flight complete";
  }
  if (phase.status === "current") {
    return `You are here — ${phase.aviationLabel}`;
  }
  return "";
}
