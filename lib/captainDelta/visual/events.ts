import type { VisualCoachPlan } from "@/lib/captainDelta/visual/types";

export const CAPTAIN_DELTA_VISUAL_PLAN = "icao-captain-delta-visual-plan";
export const CAPTAIN_DELTA_VISUAL_CLEAR = "icao-captain-delta-visual-clear";

export function emitVisualPlan(plan: VisualCoachPlan): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CAPTAIN_DELTA_VISUAL_PLAN, { detail: plan }));
}

export function emitVisualClear(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CAPTAIN_DELTA_VISUAL_CLEAR));
}
