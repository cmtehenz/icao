import type { DailyMissionSummary } from "@/lib/dailyMission";
import { loadStudyPlanMode } from "@/lib/studyTime";
import { estimateRemainingMinutes } from "@/lib/flightProgress/flightProgressEstimatedTime";
import {
  buildFlightPhases,
  detectCurrentPhaseId,
  youAreHereLabel,
} from "@/lib/flightProgress/flightProgressStatus";
import type { FlightProgress } from "@/lib/flightProgress/flightProgressTypes";

/** Build flight progress view model from Mission Engine summary — no orchestration logic. */
export function buildFlightProgress(summary: DailyMissionSummary): FlightProgress {
  const phases = buildFlightPhases(summary);
  const currentPhaseId = detectCurrentPhaseId(summary);
  const currentPhase = phases.find((p) => p.id === currentPhaseId) ?? phases[0]!;

  return {
    phases,
    currentPhaseId,
    currentPhase,
    estimatedRemainingMinutes: estimateRemainingMinutes(phases),
    mode: loadStudyPlanMode(),
    missionComplete: summary.complete,
    youAreHereLabel: youAreHereLabel(currentPhase),
  };
}
