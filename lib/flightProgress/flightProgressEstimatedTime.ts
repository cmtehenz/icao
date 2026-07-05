import type { FlightPhase } from "@/lib/flightProgress/flightProgressTypes";

/** Rough minutes per leg — display estimate only, not scheduling logic. */
const PHASE_ESTIMATE_MINUTES: Record<string, number> = {
  pronunciation: 8,
  vocabulary: 10,
  part1: 12,
  part2: 15,
  recall: 8,
  mock: 25,
  debrief: 5,
  shutdown: 0,
};

export function estimateRemainingMinutes(phases: FlightPhase[]): number | null {
  let total = 0;
  let hasWork = false;

  for (const phase of phases) {
    if (phase.status === "completed" || phase.status === "optional") continue;
    if (phase.id === "shutdown") continue;

    const base = PHASE_ESTIMATE_MINUTES[phase.id] ?? 0;
    if (base <= 0) continue;

    hasWork = true;

    if (phase.status === "current" && phase.progress && phase.progress.total > 0) {
      const remainingRatio = 1 - phase.progress.done / phase.progress.total;
      total += base * Math.max(0, remainingRatio);
    } else if (phase.status === "upcoming") {
      total += base;
    }
  }

  if (!hasWork) return null;
  return Math.max(1, Math.round(total));
}
