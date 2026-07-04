import { buildDifficultyInsights } from "@/lib/difficultyInsights";
import { sessionsForDate } from "@/lib/flightInstructor/memory";
import type { DailyDebrief } from "@/lib/flightInstructor/types";
import { getNextMissionAction } from "@/lib/dailyMission";
import { todayKey } from "@/lib/studyTime";

export function buildLocalDailyDebrief(date = todayKey()): DailyDebrief {
  const sessions = sessionsForDate(date);
  const insights = buildDifficultyInsights(4);
  const next = getNextMissionAction();

  const strengths: string[] = [];
  if (sessions.some((s) => s.overallScore >= 70)) {
    strengths.push("Good confidence in at least one coach session today");
  }
  if (sessions.length >= 2) {
    strengths.push("You showed up for multiple practice blocks");
  }
  const avg =
    sessions.length > 0
      ? Math.round(sessions.reduce((s, x) => s + x.overallScore, 0) / sessions.length)
      : null;
  if (avg != null && avg >= 65) strengths.push("Solid overall structure in today's answers");

  if (!strengths.length) {
    strengths.push("You started today's training — consistency matters most");
  }

  const needs: string[] = [];
  for (const area of insights) {
    for (const item of area.items.slice(0, 2)) {
      needs.push(`${area.label}: ${item.label}`);
    }
  }

  const achievement =
    sessions.length >= 2 && avg != null
      ? avg >= 70
        ? "You sounded more structured than your first session today."
        : "You completed multiple recordings — that builds real speaking habit."
      : sessions.length === 1
        ? "First coach session of the day logged — come back for one more block."
        : "Complete at least one Coach recording to unlock a personalized debrief.";

  const missionItems = next
    ? [next.title, ...needs.slice(0, 2)]
    : ["Review today's weakest vocabulary", "One Part 2 simulation", "Pronunciation bank"];

  return {
    date,
    strengths: strengths.slice(0, 4),
    needsImprovement: needs.slice(0, 5),
    achievement,
    tomorrowMission: {
      items: missionItems.slice(0, 5),
      estimatedMinutes: 18,
    },
    source: "local",
  };
}
