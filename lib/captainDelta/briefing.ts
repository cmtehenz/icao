import type { CaptainDeltaContext } from "@/lib/captainDelta/types";
import { toSpeechText } from "@/lib/captainDelta/voiceText";
import { buildTrainingDayBriefing } from "@/lib/captainDelta/infinity/academy/trainingDay";
import { buildWordMissionBrief } from "@/lib/wordMission/lesson/lessonEngine";
import { loadProfile } from "@/lib/profile";
import { buildLocalDailyDebrief } from "@/lib/flightInstructor/dailyDebrief";
import { buildMemoryContextForPrompt } from "@/lib/flightInstructor/memory";
import type { FlightInstructorReport } from "@/lib/flightInstructor/types";
import { loadVault, pickWarmupWords } from "@/lib/pronunciationVault";

const BRIEFING_DATE_KEY = "icao_captain_delta_briefing_v1";

export function wasBriefingShownToday(dateKey: string): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(BRIEFING_DATE_KEY) === dateKey;
}

export function markBriefingShown(dateKey: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(BRIEFING_DATE_KEY, dateKey);
}

/** Screen-specific instructor line — never generic advice. */
export function buildContextTip(context: CaptainDeltaContext): { text: string; speechText: string } | null {
  const tips: Partial<Record<CaptainDeltaContext, string>> = {
    dashboard: "Good to see you. Let's work through today's exam block — one step at a time.",
    part1:
      "On Part 1, do not memorize the paragraph. Hold four ideas, then explain them like a briefing.",
    part2:
      "Part 2 is quick notes only — callsign, problem, intention, request. Then speak clearly.",
    pronunciation:
      "Every term is a mini flight lesson — I'll coach meaning, operations, radio phrase, and ICAO practice.",
    vocabulary:
      "Learn the operational meaning first, then say it out loud like a pilot — not like a dictionary.",
    simulation:
      "This is a full exam run. Breathe, one situation at a time, like a real check ride.",
    recall:
      "Mission Recall — answer from memory. Fast pace, no model answers first.",
    debrief:
      "Flight Debrief — one priority improvement, then we close today's flight.",
    listen:
      "Listen mode: notice how controllers keep it short. Copy that rhythm in your answers.",
    memory:
      "Memory mode is for ideas, not scripts. Four labels — then speak from each one.",
  };
  const line = tips[context];
  if (!line) return null;
  return { text: line, speechText: line };
}

/** Phase 1 daily briefing — V6 training day opens every login. */
export function buildTodayBriefing(
  firstName: string,
  _dateKey: string,
  options?: { surface?: "home" | "full" },
): {
  text: string;
  speechText: string;
} {
  const profile = loadProfile();
  const training = buildTrainingDayBriefing(firstName, { profile, surface: options?.surface });
  return { text: training.text, speechText: training.speechText };
}

/** Coaching line for the active mission term — must match UI and Azure target. */
export function buildActiveMissionTermLine(
  word: string,
  context: CaptainDeltaContext,
): { text: string; speechText: string } {
  const trimmed = word.trim();
  if (context === "vocabulary") {
    const text = `Today's term: "${trimmed}". Learn the meaning, then say it like a pilot.`;
    return { text, speechText: toSpeechText(text) };
  }
  const mission = buildWordMissionBrief(trimmed);
  return { text: mission.message, speechText: toSpeechText(mission.message) };
}

export function buildMemoryLine(): string | null {
  const vault = loadVault();
  if (!vault.length) return null;

  const target = pickWarmupWords(vault, 1)[0]!;
  const memory = buildMemoryContextForPrompt();
  const pass80 = target.pass80Count ?? target.passCount ?? 0;
  const level = target.practiceLevel ?? 1;
  const inMemory = memory.topPronunciationMistakes.some(
    (w) => w.toLowerCase() === target.word.toLowerCase(),
  );

  if (level >= 4 && pass80 >= 2) {
    return `Almost there — one more solid pass on "${target.word}" in ICAO context and we graduate it.`;
  }

  if (level > 1 || pass80 >= 2) {
    return `You're building "${target.word}" — step ${level} of 4. Use the higher practice levels, not just the isolated word.`;
  }

  if (inMemory) {
    return `Good progress yesterday. Today let's fix "${target.word}" again.`;
  }

  return `Let's work on "${target.word}" — slow and clear.`;
}

export function buildSimulationDebrief(): { text: string; speechText: string } {
  const debrief = buildLocalDailyDebrief();
  const strength = debrief.strengths[0] ?? "You showed up and completed the simulation.";
  const focus = debrief.focusNextFlight[0] ?? "More natural pilot language.";
  const text = [`Good work today. ${strength}`, `Tomorrow we focus on: ${focus}.`].join("\n");
  return { text, speechText: toSpeechText(text.replace(/\n/g, " ")) };
}

/** Phase 1 after-answer: positive + ONE suggestion. Action is the mic button. */
export function buildAfterAnswerCoaching(
  report: FlightInstructorReport,
): { text: string; speechText: string } {
  const positive = report.positiveOpening[0] ?? "Good answer.";
  const studentPhrase = report.naturalnessReview.suggestions[0]?.studentPhrase;
  const pilotPhrase = report.naturalnessReview.suggestions[0]?.pilotPhrase;

  const lines = [positive];

  if (studentPhrase && pilotPhrase) {
    lines.push("One suggestion only.");
    lines.push(`Instead of "${studentPhrase}", say "${pilotPhrase}".`);
  } else {
    lines.push(report.priorityImprovement.detail);
  }

  const text = lines.join("\n");
  return { text, speechText: toSpeechText(lines.join(" ")) };
}
