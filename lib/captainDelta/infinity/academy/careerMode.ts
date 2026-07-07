import type { PilotProfile } from "@/lib/profile";
import type { CaptainMentorProfile } from "@/lib/captainDelta/infinity/mentorProfile";
import type { AcademyMissionKind } from "@/lib/captainDelta/infinity/academy/types";
import { pickDailyMission } from "@/lib/captainDelta/infinity/academy/missionGenerator";

export type CareerFocus = {
  label: string;
  missionKind: AcademyMissionKind;
  standardLevel: number;
  vocabularyBias: string[];
};

function parseCareerGoal(profile: PilotProfile, icaoTarget: number): CareerFocus {
  const op = `${profile.operationType} ${profile.role}`.toLowerCase();
  if (/tour|scenic|sightseeing/.test(op)) {
    return {
      label: "Tourism and scenic operations",
      missionKind: "scenic",
      standardLevel: Math.max(icaoTarget, 4),
      vocabularyBias: ["departure", "heading", "maintain", "approach", "weather"],
    };
  }
  if (/ems|hems|medevac/.test(op)) {
    return {
      label: "HEMS and emergency response",
      missionKind: "ems",
      standardLevel: Math.max(icaoTarget, 5),
      vocabularyBias: ["engine", "fuel", "diversion", "weather", "maintain"],
    };
  }
  if (/offshore/.test(op)) {
    return {
      label: "Offshore operations",
      missionKind: "offshore",
      standardLevel: Math.max(icaoTarget, 4),
      vocabularyBias: ["approach", "fuel", "weather", "maintain", "departure"],
    };
  }
  if (icaoTarget >= 5) {
    return {
      label: "ICAO Level 5 professional standard",
      missionKind: pickDailyMission(profile),
      standardLevel: 5,
      vocabularyBias: ["departure", "approach", "diversion", "maintain", "heading"],
    };
  }
  return {
    label: "Professional helicopter operations",
    missionKind: pickDailyMission(profile),
    standardLevel: icaoTarget,
    vocabularyBias: ["heading", "climb", "maintain", "departure", "approach"],
  };
}

/** V6 — long-term career goals shift training focus. */
export function buildCareerFocus(
  profile: PilotProfile | undefined,
  mentor: CaptainMentorProfile,
): CareerFocus {
  const p = profile ?? {
    role: "helicopter pilot",
    aircraft: "H130",
    hours: 4000,
    aircraftType: "helicopter",
    operationType: "helicopter operations",
  };
  return parseCareerGoal(p, mentor.icaoTarget);
}

export function careerStandardNote(focus: CareerFocus): string | null {
  if (focus.standardLevel >= 5) {
    return "Career mode — I'm holding you to Level 5 examiner standards on every call.";
  }
  if (focus.label.includes("Tourism")) {
    return "Career mode — passenger confidence matters as much as phraseology today.";
  }
  if (focus.label.includes("HEMS")) {
    return "Career mode — emergency English must be short under pressure.";
  }
  return null;
}
