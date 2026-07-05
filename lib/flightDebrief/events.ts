import { emitCaptainDeltaDebrief } from "@/lib/captainDelta/events";
import { buildFlightDebrief } from "@/lib/flightDebrief/buildFlightDebrief";

export const FLIGHT_DEBRIEF_AVAILABLE_EVENT = "icao-flight-debrief-available";
export const FLIGHT_DEBRIEF_COMPLETE_EVENT = "icao-flight-debrief-complete";

export function emitFlightDebriefAvailable(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(FLIGHT_DEBRIEF_AVAILABLE_EVENT));
  const debrief = buildFlightDebrief();
  emitCaptainDeltaDebrief({
    strengths: [debrief.positiveOpening],
    focus: [debrief.priorityImprovement],
    estimatedMinutes: 3,
  });
}

export function emitFlightDebriefComplete(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(FLIGHT_DEBRIEF_COMPLETE_EVENT));
  const debrief = buildFlightDebrief();
  emitCaptainDeltaDebrief({
    strengths: [debrief.positiveOpening, debrief.tomorrowFocus],
    focus: [debrief.priorityImprovement],
    estimatedMinutes: 0,
  });
}
