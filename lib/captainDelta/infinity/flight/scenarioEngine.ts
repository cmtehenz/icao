import type { OperationContext } from "@/lib/captainDelta/infinity/mentorProfile";
import type { FlightScenario, MicroSimulationKind } from "@/lib/captainDelta/infinity/flight/types";

type WordScenarioDef = {
  why: string;
  kind: MicroSimulationKind;
  situation: string;
  towerTemplate: string;
  studentPrompt: string;
};

const WORD_SCENARIOS: Record<string, WordScenarioDef> = {
  heading: {
    why: "Pilots often receive heading changes immediately after departure.",
    kind: "atc",
    situation: "Departure — Tower assigns a heading right after takeoff.",
    towerTemplate: "Helicopter {callsign}, fly heading zero nine zero.",
    studentPrompt: "What would you read back to Tower?",
  },
  climb: {
    why: "Climb clearances are among the first calls every pilot must read back clearly.",
    kind: "atc",
    situation: "Departure — ATC clears you to climb.",
    towerTemplate: "{callsign}, climb and maintain three thousand.",
    studentPrompt: "Read back the clearance — callsign, climb, altitude.",
  },
  maintain: {
    why: "Maintaining altitude or heading is constant radio language in cruise.",
    kind: "atc",
    situation: "Cruise — ATC confirms your level.",
    towerTemplate: "{callsign}, maintain three thousand.",
    studentPrompt: "What would ATC expect in your readback?",
  },
  engine: {
    why: "Engine checks and abnormal calls must sound calm and clear in the cockpit.",
    kind: "emergency",
    situation: "Preflight — crew confirms engine status before departure.",
    towerTemplate: "Before departure: check the engine — any abnormal indications?",
    studentPrompt: "How would you report an engine caution to your copilot?",
  },
  weather: {
    why: "Weather updates change decisions — brief and clear English keeps the crew aligned.",
    kind: "weather",
    situation: "Approach — visibility dropping near the helipad.",
    towerTemplate: "{callsign}, be advised visibility two thousand meters, wind three three zero at one five.",
    studentPrompt: "What would you tell Tower you intend to do?",
  },
  fuel: {
    why: "Low fuel calls must be short, precise, and without hesitation.",
    kind: "emergency",
    situation: "En route — fuel state requires a diversion decision.",
    towerTemplate: "{callsign}, say fuel remaining and souls on board.",
    studentPrompt: "What would you say to ATC?",
  },
  diversion: {
    why: "Diversions test operational English under pressure — one request, one intention.",
    kind: "atc",
    situation: "ATC congestion — you need an alternate landing site.",
    towerTemplate: "{callsign}, request diversion to the nearest suitable helipad.",
    studentPrompt: "What would you say?",
  },
  approach: {
    why: "Approach clearances demand clean rhythm — no pauses in the readback.",
    kind: "atc",
    situation: "Arrival — Tower clears you for the approach.",
    towerTemplate: "{callsign}, cleared visual approach runway two four.",
    studentPrompt: "Read back the essentials.",
  },
  departure: {
    why: "Departure calls set the tone for the whole sortie — calm and confident.",
    kind: "atc",
    situation: "Ground — ready for departure.",
    towerTemplate: "Ground, {callsign}, ready for departure.",
    studentPrompt: "What would you say to request taxi and departure?",
  },
};

function operationScenarioKind(context: OperationContext): MicroSimulationKind {
  if (context === "ems") return "ems";
  if (context === "offshore") return "offshore";
  return "atc";
}

function operationSituation(context: OperationContext, base: string): string {
  if (context === "ems") return `EMS mission — ${base}`;
  if (context === "offshore") return `Offshore rig ops — ${base}`;
  if (context === "helicopter") return `Helicopter training sortie — ${base}`;
  return base;
}

export function missionBriefWhy(word: string): string | null {
  const def = WORD_SCENARIOS[word.trim().toLowerCase()];
  if (!def) return null;
  return `${def.why} That's why today's word is ${word.trim().toLowerCase()}.`;
}

export function buildFlightScenario(
  word: string,
  callsign: string,
  operationContext: OperationContext = "helicopter",
): FlightScenario | null {
  const key = word.trim().toLowerCase();
  const def = WORD_SCENARIOS[key];
  if (!def) {
    const kind = operationScenarioKind(operationContext);
    return {
      kind,
      situation: operationSituation(operationContext, `Operational use of "${word}" on frequency.`),
      towerOrRadioLine: `${callsign}, say again your request regarding ${word}.`,
      studentPrompt: "What would you say to Tower?",
    };
  }

  const towerOrRadioLine = def.towerTemplate.replace(/\{callsign\}/g, callsign);
  return {
    kind: def.kind,
    situation: operationSituation(operationContext, def.situation),
    towerOrRadioLine,
    studentPrompt: def.studentPrompt,
  };
}

export function realisticScenarioForWord(word: string): boolean {
  return word.trim().toLowerCase() in WORD_SCENARIOS;
}
