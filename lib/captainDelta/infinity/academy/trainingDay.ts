import { greetingForHour, toSpeechText } from "@/lib/captainDelta/voiceText";
import { getDailyMissionSummary } from "@/lib/dailyMission";
import { loadStudyPlanMode, STUDY_DAILY_GOAL_MINUTES, STUDY_INTENSE_DAY_MINUTES } from "@/lib/studyTime";
import type { TrainingDayBlock } from "@/lib/captainDelta/infinity/academy/types";
import { buildMissionContext } from "@/lib/captainDelta/infinity/academy/missionGenerator";
import type { PilotProfile } from "@/lib/profile";

function trainingBlocks(summary: ReturnType<typeof getDailyMissionSummary>): TrainingDayBlock[] {
  const blocks: TrainingDayBlock[] = [
    { label: "Word Mission", complete: summary.wordMission.complete },
    { label: "ATC Communication", complete: summary.wordMission.complete },
    { label: "ICAO Speaking", complete: summary.part1.complete && summary.part2.complete },
  ];
  if (!summary.recall.complete) {
    blocks.push({ label: "Mission Recall", complete: false });
  }
  if (summary.simulateRequired && !summary.simulate.complete) {
    blocks.push({ label: "Exam simulation", complete: false });
  }
  blocks.push({ label: "One emergency scenario", complete: summary.debrief.complete });
  return blocks;
}

/** V6 — every login opens with a training day briefing. */
export function buildTrainingDayBriefing(
  firstName: string,
  options?: { profile?: PilotProfile; surface?: "home" | "full" },
): { text: string; speechText: string; blocks: TrainingDayBlock[]; estimatedMinutes: number } {
  const surface = options?.surface ?? "full";
  const greeting = greetingForHour(new Date().getHours());
  const summary = getDailyMissionSummary();
  const mode = loadStudyPlanMode();
  const minutes = mode === "intense" ? STUDY_INTENSE_DAY_MINUTES : STUDY_DAILY_GOAL_MINUTES;
  const mission = buildMissionContext(options?.profile);

  const lines = [`${greeting}, ${firstName}.`];

  if (surface === "full") {
    lines.push("Today's training includes:");
    for (const block of trainingBlocks(summary)) {
      const mark = block.complete ? " ✓" : "";
      lines.push(`• ${block.label}${mark}`);
    }
    lines.push(`Estimated flight time: ${minutes} minutes.`);
    lines.push(`Sortie profile: ${mission.title}.`);
    lines.push("Ready?");
  } else {
    lines.push(`Today's sortie: ${mission.title}. Estimated flight time: ${minutes} minutes. Ready?`);
  }

  const text = lines.join("\n");
  return {
    text,
    speechText: toSpeechText(lines.join(" ")),
    blocks: trainingBlocks(summary),
    estimatedMinutes: minutes,
  };
}
