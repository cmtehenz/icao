import type { FlightPhase, FlightPhaseId } from "@/lib/flightProgress/flightProgressTypes";
import { FLIGHT_PHASE_DEFINITIONS } from "@/lib/flightProgress/flightProgressTypes";

export function getFlightPhaseCaptainCopy(phaseId: FlightPhaseId): string {
  return FLIGHT_PHASE_DEFINITIONS.find((p) => p.id === phaseId)?.captainCopy ?? "";
}

export function buildFlightPhaseBriefingLine(phase: FlightPhase): string {
  if (phase.status === "optional") {
    return `${phase.aviationLabel} — ${phase.missionLabel} (optional on standard days).`;
  }
  if (phase.status === "completed" && phase.id === "shutdown") {
    return "SHUTDOWN — today's mission is complete.";
  }
  return `${phase.aviationLabel} — ${phase.missionLabel}. ${phase.captainCopy}`;
}
