/** @deprecated ADR-007 — Use `lib/captainDelta/briefing.ts` (`buildTodayBriefing`). */
import { buildDailyFlightMission } from "@/lib/academy/flightMission";
import { getCaptainPersonality } from "@/lib/academy/personality";
import { daysUntilExam } from "@/lib/captainDelta/examDate";
import { greetingForHour } from "@/lib/captainDelta/voiceText";
import { buildImprovementLines } from "@/lib/captainDelta/memory/improvements";

export function buildFlightBriefing(firstName: string): {
  greeting: string;
  weather: string;
  difficulty: string;
  objective: string;
  estimatedMinutes: number;
  readyLine: string;
} {
  const mission = buildDailyFlightMission();
  const personality = getCaptainPersonality();
  const improvements = buildImprovementLines();
  const greeting = `${greetingForHour(new Date().getHours())}, ${firstName}. Welcome back.`;

  const weather =
    improvements.length > 0
      ? "Excellent motivation — yesterday showed real progress."
      : "Clear skies — steady training weather today.";

  const difficulty =
    mission.difficulty === "hard"
      ? "High"
      : mission.difficulty === "medium"
        ? "Medium"
        : "Light";

  return {
    greeting,
    weather,
    difficulty,
    objective: mission.objective,
    estimatedMinutes: mission.totalMinutes,
    readyLine: `Ready for departure? Exam in ${daysUntilExam()} days · ${personality.focus}.`,
  };
}

export function buildPostFlightDebrief(
  durationMinutes: number,
  strengths: string[],
  focus: string,
  tomorrowMission: string,
): {
  headline: string;
  durationMinutes: number;
  strengths: string[];
  focus: string;
  tomorrowMission: string;
  tomorrowMinutes: number;
  signOff: string;
} {
  return {
    headline: "Flight completed. Excellent work.",
    durationMinutes,
    strengths: strengths.length ? strengths : ["Consistency", "Focus"],
    focus,
    tomorrowMission,
    tomorrowMinutes: 35,
    signOff: "See you tomorrow. Captain Delta.",
  };
}
