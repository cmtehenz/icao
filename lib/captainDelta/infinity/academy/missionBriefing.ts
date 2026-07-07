import { missionBriefWhy } from "@/lib/captainDelta/infinity/flight/scenarioEngine";
import type { CaptainMentorProfile } from "@/lib/captainDelta/infinity/mentorProfile";
import type { PilotProfile } from "@/lib/profile";
import { buildMissionContext, missionIntroLine } from "@/lib/captainDelta/infinity/academy/missionGenerator";

/** V6 — mission-first briefing: sortie context, then why today's word matters. */
export function buildMissionContextBrief(
  word: string,
  options?: { mentorProfile?: CaptainMentorProfile; profile?: PilotProfile },
): { message: string; speechText: string } {
  const w = word.trim().toLowerCase();
  const ctx = buildMissionContext(options?.profile, options?.mentorProfile);
  const intro = missionIntroLine(ctx);
  const why = missionBriefWhy(w);

  const wordLink = why
    ? why.replace("today's word is", "today's lesson focuses on")
    : ctx.operationContext === "ems"
      ? `On this ${ctx.title.toLowerCase()}, you'll hear "${w}" on a busy frequency — short and clear.`
      : ctx.operationContext === "offshore"
        ? `On rig ops, "${w}" shows up in approach and deck calls — that's today's focus.`
        : `Tower will probably issue ${w} clearances on this sortie — that's why today's lesson focuses on "${w}".`;

  const message = `${intro} ${wordLink} Ready to fly?`;
  return { message, speechText: message };
}
