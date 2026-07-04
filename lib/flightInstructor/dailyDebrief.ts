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
    strengths.push("Good confidence in at least one debrief today");
  }
  if (sessions.length >= 2) {
    strengths.push("Multiple practice blocks logged — solid habit");
  }
  const avg =
    sessions.length > 0
      ? Math.round(sessions.reduce((s, x) => s + x.overallScore, 0) / sessions.length)
      : null;
  if (avg != null && avg >= 65) {
    strengths.push("Clear organization in today's answers");
  }
  if (sessions.some((s) => s.naturalnessLevel === "natural" || s.naturalnessLevel === "professional_pilot")) {
    strengths.push("Aviation vocabulary sounding more natural");
  }

  if (!strengths.length) {
    strengths.push("You started today's training — consistency builds Level 4");
  }

  const focusNextFlight: string[] = [];
  for (const area of insights) {
    for (const item of area.items.slice(0, 1)) {
      focusNextFlight.push(`${area.label}: ${item.label}`);
    }
  }
  if (!focusNextFlight.length) {
    focusNextFlight.push("More natural pilot language", "Better connectors", "Less translated English");
  }

  const practiceAreas = next
    ? [next.title, "Weather briefing", "CRM", ...focusNextFlight.slice(0, 1)]
    : ["Weather", "Briefing", "CRM"];

  return {
    date,
    strengths: strengths.slice(0, 4),
    focusNextFlight: focusNextFlight.slice(0, 4),
    mission: {
      practiceAreas: practiceAreas.slice(0, 4),
      estimatedMinutes: 8,
    },
    source: "local",
  };
}
