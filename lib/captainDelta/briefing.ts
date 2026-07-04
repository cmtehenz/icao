import type { CaptainDeltaContext } from "@/lib/captainDelta/types";
import { daysUntilExam } from "@/lib/captainDelta/examDate";
import { greetingForHour, toSpeechText } from "@/lib/captainDelta/voiceText";
import { getWeeklyFocusLine } from "@/lib/captainDelta/weeklyFocus";
import { buildLocalDailyDebrief } from "@/lib/flightInstructor/dailyDebrief";
import { buildMemoryContextForPrompt } from "@/lib/flightInstructor/memory";
import type { FlightInstructorReport } from "@/lib/flightInstructor/types";
import { getDailyMissionSummary, getNextMissionAction } from "@/lib/dailyMission";
import { loadStudyPlanMode, STUDY_DAILY_GOAL_MINUTES, STUDY_INTENSE_DAY_MINUTES } from "@/lib/studyTime";
import { loadVault } from "@/lib/pronunciationVault";

const BRIEFING_DATE_KEY = "icao_captain_delta_briefing_v1";

export function wasBriefingShownToday(dateKey: string): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(BRIEFING_DATE_KEY) === dateKey;
}

export function markBriefingShown(dateKey: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(BRIEFING_DATE_KEY, dateKey);
}

export function buildContextTip(context: CaptainDeltaContext): { text: string; speechText: string } | null {
  const tips: Partial<Record<CaptainDeltaContext, string>> = {
    part1:
      "I would not memorize this paragraph. Remember only four ideas, then explain them in your own words.",
    part2: "Do not write full sentences. Use quick notes — callsign, problem, intention, request.",
    pronunciation: "Today let's fix one word at a time. Slow and clear beats fast and messy.",
    vocabulary: "Learn the operational meaning first. Then say it out loud like a briefing, not a dictionary.",
    simulation: "Treat this like a real flight. Breathe, then speak. One situation at a time.",
    listen: "Listen for phraseology patterns. Notice how controllers keep it short and precise.",
    memory: "Memory is for ideas, not scripts. Chain four labels and speak from each one.",
    dashboard: "One mission at a time. Finish today's exam block before chasing extra practice.",
  };
  const line = tips[context];
  if (!line) return null;
  return { text: line, speechText: line };
}

export function buildTodayBriefing(firstName: string, dateKey: string): {
  text: string;
  speechText: string;
} {
  const hour = new Date().getHours();
  const greeting = greetingForHour(hour);
  const days = daysUntilExam();
  const mission = getDailyMissionSummary();
  const next = getNextMissionAction();
  const mode = loadStudyPlanMode();
  const minutes = mode === "intense" ? STUDY_INTENSE_DAY_MINUTES : STUDY_DAILY_GOAL_MINUTES;
  const memory = buildMemoryContextForPrompt();
  const weekFocus = getWeeklyFocusLine();

  const lines: string[] = [
    `${greeting}, ${firstName}.`,
    `Your ICAO exam is in ${days} days.`,
  ];

  if (memory.yesterdaySummary) {
    lines.push(memory.yesterdaySummary.replace(/Weak areas:/i, "Yesterday we worked on:"));
  } else {
    lines.push(`Today's exam rotation is ${mission.examLabel}.`);
  }

  lines.push("Today's mission:");
  if (!mission.vocabulary.complete) lines.push("Twenty vocabulary words from today's exam.");
  if (!mission.part1.complete) lines.push("Three Part 1 questions with shadow and coach.");
  if (!mission.part2.complete) lines.push("One full Part 2 simulation.");
  if (mission.simulateRequired && !mission.simulate.complete) {
    lines.push("Optional full ICAO simulado on a good day.");
  }
  if (mission.complete) lines.push("Today's plan is complete. Extra practice is optional.");

  if (next) lines.push(`Start with: ${next.title}.`);
  lines.push(`Estimated training: about ${minutes} minutes.`);
  lines.push(`This week we focus on ${weekFocus}.`);
  lines.push("Ready?");

  const text = lines.join("\n");
  return { text, speechText: toSpeechText(lines.join(" ")) };
}

export function buildMemoryLine(): string | null {
  const memory = buildMemoryContextForPrompt();
  if (memory.topPronunciationMistakes.length) {
    const word = memory.topPronunciationMistakes[0];
    return `Let's practice "${word}" again today.`;
  }
  if (memory.recurringWeakAreas.length) {
    return `I noticed you are working on ${memory.recurringWeakAreas[0]}. Keep going.`;
  }
  const vault = loadVault();
  if (vault.length) {
    return `Today let's fix one word: ${vault[0].word}.`;
  }
  return null;
}

export function buildSimulationDebrief(): { text: string; speechText: string } {
  const debrief = buildLocalDailyDebrief();
  const lines = [
    "Today's debrief.",
    "Excellent work showing up for training.",
    ...debrief.strengths.slice(0, 3).map((s) => `Strength: ${s}`),
    "Focus for tomorrow:",
    ...debrief.focusNextFlight.slice(0, 2).map((f) => f),
    `Estimated training: ${debrief.mission.estimatedMinutes} minutes.`,
  ];
  const text = lines.join("\n");
  return { text, speechText: toSpeechText(lines.join(" ")) };
}

/** Short coaching card after each answer: positive + one fix + mission. */
export function buildAfterAnswerCoaching(
  report: FlightInstructorReport,
): { text: string; speechText: string; missionExpression?: string } {
  const positive = report.positiveOpening[0] ?? "Excellent.";
  const studentPhrase = report.naturalnessReview.suggestions[0]?.studentPhrase;
  const pilotPhrase = report.naturalnessReview.suggestions[0]?.pilotPhrase;
  const missionExpr = report.mission.expressions[0] ?? "situational awareness";

  const lines: string[] = [positive];

  if (studentPhrase && pilotPhrase) {
    lines.push("Let's improve only one sentence.");
    lines.push(`Instead of\n${studentPhrase}\nsay\n${pilotPhrase}.`);
  } else {
    lines.push("Only one suggestion.");
    lines.push(report.priorityImprovement.detail);
  }

  lines.push("Mission:");
  lines.push(`Use ${missionExpr} in your next answer.`);

  const text = lines.join("\n");
  return {
    text,
    speechText: toSpeechText(lines.join(" ")),
    missionExpression: missionExpr,
  };
}

export function buildMicroMission(report: FlightInstructorReport): {
  text: string;
  speechText: string;
} {
  const expr = report.mission.expressions.slice(0, 3);
  const lines = [
    "Mission for your next attempt.",
    ...expr.map((e) => e),
    `Estimated: ${report.mission.estimatedMinutes} minutes.`,
  ];
  const text = lines.join("\n");
  return { text, speechText: toSpeechText(lines.join(" ")) };
}
