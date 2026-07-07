import type { PilotProfile } from "@/lib/profile";
import type { CaptainMentorProfile } from "@/lib/captainDelta/infinity/mentorProfile";
import type { AcademyMissionKind, MissionContext } from "@/lib/captainDelta/infinity/academy/types";
import { todayKey } from "@/lib/studyTime";

const MISSION_DEFS: Record<
  AcademyMissionKind,
  { title: string; situation: string; operationContext: MissionContext["operationContext"] }
> = {
  scenic: {
    title: "VFR sightseeing mission",
    situation: "Scenic coastal route — passengers on board, Tower handling departures.",
    operationContext: "helicopter",
  },
  ems: {
    title: "HEMS response",
    situation: "EMS launch — crew coordination and rapid ATC requests.",
    operationContext: "ems",
  },
  offshore: {
    title: "Offshore rig transfer",
    situation: "Rig approach — deck landing calls and fuel state updates.",
    operationContext: "offshore",
  },
  training_sortie: {
    title: "Training sortie",
    situation: "Dual instruction — instructor observes every radio call.",
    operationContext: "helicopter",
  },
  mountain: {
    title: "Mountain operation",
    situation: "High terrain — weather updates and alternate planning.",
    operationContext: "helicopter",
  },
  tourism: {
    title: "Tourism flight",
    situation: "City tour — passenger briefing and scenic routing.",
    operationContext: "helicopter",
  },
  firefighting: {
    title: "Firefighting support",
    situation: "Fire zone ops — tight frequency, fast clearances.",
    operationContext: "helicopter",
  },
  police: {
    title: "Police air support",
    situation: "Urban patrol — coordination with Tower and ground units.",
    operationContext: "helicopter",
  },
  sar: {
    title: "Search and rescue",
    situation: "SAR tasking — multiple agencies on frequency.",
    operationContext: "helicopter",
  },
  vip: {
    title: "VIP transfer",
    situation: "VIP movement — calm, precise radio discipline.",
    operationContext: "helicopter",
  },
};

function inferCareerMission(profile?: PilotProfile, mentor?: CaptainMentorProfile): AcademyMissionKind {
  const op = `${profile?.operationType ?? ""} ${profile?.role ?? ""}`.toLowerCase();
  if (/ems|hems|medevac|ambulance/.test(op)) return "ems";
  if (/offshore|rig|oil/.test(op)) return "offshore";
  if (/tour|scenic|sightseeing/.test(op)) return "scenic";
  if (/sar|search|rescue/.test(op)) return "sar";
  if (/fire/.test(op)) return "firefighting";
  if (/police|law/.test(op)) return "police";
  if (/vip|executive/.test(op)) return "vip";
  if (/mountain|alpine/.test(op)) return "mountain";
  if (mentor?.operationContext === "ems") return "ems";
  if (mentor?.operationContext === "offshore") return "offshore";
  return "training_sortie";
}

/** Stable daily mission — same sortie all day, rotates by date. */
export function pickDailyMission(
  profile?: PilotProfile,
  mentor?: CaptainMentorProfile,
  dateKey: string = todayKey(),
): AcademyMissionKind {
  const career = inferCareerMission(profile, mentor);
  const kinds = Object.keys(MISSION_DEFS) as AcademyMissionKind[];
  const idx = dateKey.split("-").reduce((n, p) => n + Number(p), 0) % kinds.length;
  if (career !== "training_sortie") return career;
  return kinds[idx]!;
}

export function buildMissionContext(
  profile?: PilotProfile,
  mentor?: CaptainMentorProfile,
  dateKey?: string,
): MissionContext {
  const kind = pickDailyMission(profile, mentor, dateKey);
  const def = MISSION_DEFS[kind];
  return { kind, title: def.title, situation: def.situation, operationContext: def.operationContext };
}

export function missionIntroLine(ctx: MissionContext): string {
  return `Today we're flying a ${ctx.title.toLowerCase()}. ${ctx.situation}`;
}
