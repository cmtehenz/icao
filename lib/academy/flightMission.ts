/**
 * @deprecated ADR-007 — Adaptive leg order conflicts with Mission Flow Matrix.
 * Use `getNextMissionAction()` from `lib/dailyMission.ts` for mission progression.
 */
import { getNextMissionAction } from "@/lib/dailyMission";
import { computeAdaptivePriorities } from "@/lib/captainDelta/memory/adaptive";
import { buildImprovementLines } from "@/lib/captainDelta/memory/improvements";
import { getAcademyPhase } from "@/lib/academy/personality";
import type { DailyFlightMission, FlightMissionLeg } from "@/lib/academy/types";
import { loadStudyPlanMode, STUDY_DAILY_GOAL_MINUTES, STUDY_INTENSE_DAY_MINUTES } from "@/lib/studyTime";

function leg(id: string, label: string, href: string, minutes: number): FlightMissionLeg {
  return { id, label, href, minutes };
}

export function buildDailyFlightMission(): DailyFlightMission {
  const mode = loadStudyPlanMode();
  const baseMinutes = mode === "intense" ? STUDY_INTENSE_DAY_MINUTES : STUDY_DAILY_GOAL_MINUTES;
  const adaptive = computeAdaptivePriorities();
  const phase = getAcademyPhase();
  const next = getNextMissionAction();

  const legs: FlightMissionLeg[] = [
    leg("warmup", "Warm-up · Pronunciation", "/pronunciation", 5),
  ];

  const weakArea = adaptive[0]?.area?.toLowerCase() ?? "";

  if (weakArea.includes("pronunciation")) {
    legs.push(leg("pronunciation", "Pronunciation focus", "/pronunciation", 12));
    legs.push(leg("part1", "Part 1 · Speaking", "/part1", 15));
  } else if (weakArea.includes("part 2")) {
    legs.push(leg("part1", "Part 1 · Topics", "/part1", 10));
    legs.push(leg("part2", "Part 2 · Readback extra", "/part2", 18));
  } else if (weakArea.includes("vocabulary")) {
    legs.push(leg("vocab", "Vocabulary mission", "/vocabulario", 12));
    legs.push(leg("part1", "Part 1 · Apply phrases", "/part1", 15));
  } else if (weakArea.includes("confidence")) {
    legs.push(leg("part1", "Part 1 · Conversation", "/part1", 18));
    legs.push(leg("part2", "Part 2 · Interaction", "/part2", 12));
  } else {
    legs.push(leg("part1", "Part 1 · Aviation topics", "/part1", 15));
    legs.push(leg("part2", "Part 2 · Pilot interaction", "/part2", 12));
  }

  legs.push(leg("pronunciation", "Pronunciation", "/pronunciation", 8));

  if (phase === "simulation" || phase === "exam" || phase === "confidence") {
    legs.push(leg("simulation", "Simulation / Mock exam", "/simulado", 20));
  } else {
    legs.push(leg("part2-extra", "Part 2 practice", "/part2", 10));
  }

  legs.push(leg("debrief", "Debrief · Review", "/", 5));

  const totalMinutes = legs.reduce((s, l) => s + l.minutes, 0);
  const difficulty =
    phase === "exam" || phase === "confidence"
      ? "hard"
      : phase === "simulation" || phase === "performance"
        ? "medium"
        : "easy";

  const objective =
    weakArea
      ? `Improve ${adaptive[0]?.area ?? "speaking"}`
      : next?.title ?? "Natural operational speaking";

  return {
    title: "Today's Flight Mission",
    legs,
    totalMinutes: Math.max(totalMinutes, baseMinutes),
    difficulty,
    objective,
  };
}

export function firstFlightLegHref(mission: DailyFlightMission): string {
  const actionable = mission.legs.find((l) => l.id !== "debrief");
  return actionable?.href ?? "/part1";
}
