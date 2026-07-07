import type { CaptainMentorProfile } from "@/lib/captainDelta/infinity/mentorProfile";
import { missionBriefWhy } from "@/lib/captainDelta/infinity/flight/scenarioEngine";
import { examPhaseCoachingNote } from "@/lib/captainDelta/infinity/flight/examPhase";
import { getExamTrainingPhase } from "@/lib/captainDelta/infinity/flight/examPhase";

export type PreflightBriefInput = {
  word: string;
  focusAreas?: string[];
  mentorProfile?: CaptainMentorProfile;
  aircraft?: string;
};

function focusLabel(word: string, areas: string[]): string {
  if (areas.length) return areas.join(", ");
  return `operational use of "${word}"`;
}

/** Opens every mission — flight instructor preflight brief. */
export function buildPreflightBrief(input: PreflightBriefInput): {
  message: string;
  speechText: string;
} {
  const word = input.word.trim();
  const areas = input.focusAreas ?? ["stress", "rhythm", "confidence"];
  const days = input.mentorProfile?.daysUntilExam ?? 45;
  const phase = getExamTrainingPhase(days);
  const phaseNote = examPhaseCoachingNote(phase);
  const aircraft = input.aircraft ?? "your helicopter";

  const objective =
    phase === "exam" || phase === "confidence"
      ? `exam-style radio communication with "${word}"`
      : `radio communication during ${word} calls in ${aircraft} operations`;

  let message = `Today's objective is to improve ${objective}. We'll focus on ${focusLabel(word, areas)}. Ready?`;
  if (phaseNote) message = `${message} ${phaseNote}`;

  return {
    message,
    speechText: message,
  };
}

/** Mission brief — explain WHY, not just WHAT. */
export function buildMissionBrief(
  word: string,
  mentorProfile?: CaptainMentorProfile,
): { message: string; speechText: string } {
  const why = missionBriefWhy(word);
  const w = word.trim().toLowerCase();

  if (why) {
    return { message: why, speechText: why };
  }

  const ctx = mentorProfile?.operationContext ?? "helicopter";
  const contextLine =
    ctx === "ems"
      ? "On EMS missions, every radio call must be short — patients and crew depend on clear English."
      : ctx === "offshore"
        ? "Offshore, you hear this language on rig approaches and deck landings."
        : "In helicopter training, this word shows up on real frequency — not in a textbook.";

  const message = `${contextLine} That's why today's word is ${w}.`;
  return { message, speechText: message };
}
