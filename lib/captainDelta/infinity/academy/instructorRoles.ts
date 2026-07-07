import type { CaptainIntent } from "@/lib/captainDelta/infinity/types";
import type { CaptainInstructorRole, AtcPosition } from "@/lib/captainDelta/infinity/academy/types";
import type { CaptainMentorProfile } from "@/lib/captainDelta/infinity/mentorProfile";
import { getExamTrainingPhase } from "@/lib/captainDelta/infinity/flight/examPhase";
import { clampSentences } from "@/lib/captainDelta/infinity/qualityGate";

export function pickInstructorRole(
  intent: CaptainIntent,
  mentorProfile: CaptainMentorProfile,
): CaptainInstructorRole {
  const phase = getExamTrainingPhase(mentorProfile.daysUntilExam);
  if (phase === "exam" || phase === "confidence") {
    if (intent === "atc" || intent === "phraseology" || intent === "icao_answer" || intent === "exam_strategy") {
      return "examiner";
    }
  }
  if (intent === "atc" || intent === "phraseology" || intent === "connected_speech") return "atc";
  if (intent === "crm" || intent === "helicopter_operation") return "copilot";
  if (intent === "confidence" || intent === "student_frustration") return "instructor";
  if (intent === "icao_answer" || intent === "exam_strategy") return "instructor";
  return "instructor";
}

function atcPosition(intent: CaptainIntent): AtcPosition {
  if (intent === "navigation") return "approach";
  if (intent === "weather") return "center";
  return "tower";
}

function atcLine(word: string, callsign: string, position: AtcPosition): string {
  const pos = position.charAt(0).toUpperCase() + position.slice(1);
  return `${pos}: "${callsign}, say again your request regarding ${word}." Your turn — answer naturally.`;
}

function copilotLine(word: string): string {
  return `Copilot: "Before we depart — how would you brief ${word} on this checklist?" What would you say?`;
}

function passengerLine(word: string): string {
  return `Passenger: "I'm nervous about this flight — can you explain ${word} in plain language?" Your turn.`;
}

function examinerLine(word: string): string {
  return `Examiner: "Describe a situation where a pilot uses ${word} on radio." No hints — answer in thirty seconds.`;
}

/** V6 — Captain becomes ATC, copilot, passenger, or examiner. */
export function applyInstructorRole(
  message: string,
  speechText: string,
  role: CaptainInstructorRole,
  word: string,
  callsign: string,
  intent: CaptainIntent,
): { message: string; speechText: string; role: CaptainInstructorRole } {
  if (!word.trim()) return { message, speechText, role };

  let roleLine: string | null = null;
  switch (role) {
    case "atc":
      roleLine = atcLine(word, callsign, atcPosition(intent));
      break;
    case "copilot":
      roleLine = copilotLine(word);
      break;
    case "passenger":
      roleLine = passengerLine(word);
      break;
    case "examiner":
      roleLine = examinerLine(word);
      break;
    default:
      break;
  }

  if (!roleLine) return { message, speechText, role };

  const out = clampSentences(`${roleLine}`, 6);
  return { message: out, speechText: clampSentences(roleLine, 2), role };
}

export function shouldUsePassengerMode(intent: CaptainIntent, turnCount: number): boolean {
  return intent === "confidence" && turnCount >= 2;
}
