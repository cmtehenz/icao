import type { CaptainIntent } from "@/lib/captainDelta/infinity/types";
import type { CaptainLessonMemory } from "@/lib/captainDelta/infinity/types";
import type { CaptainStudentModel } from "@/lib/captainDelta/infinity/types";
import type { CaptainMentorProfile } from "@/lib/captainDelta/infinity/mentorProfile";
import { planLiveAdaptation, applyLiveAdaptationToMessage } from "@/lib/captainDelta/infinity/academy/liveAdaptation";
import {
  applyInstructorRole,
  pickInstructorRole,
  shouldUsePassengerMode,
} from "@/lib/captainDelta/infinity/academy/instructorRoles";
import { appendChallenge, pickChallenge } from "@/lib/captainDelta/infinity/academy/challengeEngine";
import { applyConfidenceEngine, detectConfidenceSignal } from "@/lib/captainDelta/infinity/academy/confidenceEngine";
import { careerStandardNote, buildCareerFocus } from "@/lib/captainDelta/infinity/academy/careerMode";
import { clampSentences } from "@/lib/captainDelta/infinity/qualityGate";

export type AcademyModeOptions = {
  callsign?: string;
  profile?: import("@/lib/profile").PilotProfile;
};

const ACADEMY_ROLE_INTENTS: CaptainIntent[] = [
  "atc",
  "phraseology",
  "crm",
  "icao_answer",
  "exam_strategy",
  "confidence",
  "student_frustration",
  "connected_speech",
  "aviation_context",
  "helicopter_operation",
];

/** V6 — Living Flight Academy layer: adapt, role-play, challenge, student speaks more. */
export function applyAcademyMode(
  message: string,
  speechText: string,
  memory: CaptainLessonMemory,
  intent: CaptainIntent,
  model: CaptainStudentModel,
  mentorProfile: CaptainMentorProfile,
  options?: AcademyModeOptions,
): { message: string; speechText: string } {
  const adaptation = planLiveAdaptation(model, memory);

  if (adaptation.postponeHardContent && intent !== "student_frustration") {
    const confidence = applyConfidenceEngine(message, speechText, model, memory, mentorProfile);
    if (confidence.studentSpeaksMore) {
      return { message: confidence.message, speechText: confidence.speechText };
    }
  }

  if (!ACADEMY_ROLE_INTENTS.includes(intent) && adaptation.state === "steady") {
    const adapted = applyLiveAdaptationToMessage(message, speechText, adaptation);
    return { message: adapted.message, speechText: adapted.speechText };
  }

  const callsign = options?.callsign ?? "ABC123";
  let role = pickInstructorRole(intent, mentorProfile);
  if (shouldUsePassengerMode(intent, memory.turnCount)) role = "passenger";

  const roleApplied = applyInstructorRole(
    message,
    speechText,
    role,
    memory.currentWord,
    callsign,
    intent,
  );

  let out = roleApplied.message;
  let speech = roleApplied.speechText;

  if (roleApplied.role === "instructor") {
    out = message;
    speech = speechText;
    const adapted = applyLiveAdaptationToMessage(out, speech, adaptation);
    out = adapted.message;
    speech = adapted.speechText;
  }

  const challenge = pickChallenge(model, roleApplied.role, adaptation.state, memory.currentWord);
  if (challenge && adaptation.increaseDifficulty) {
    out = appendChallenge(out, challenge);
    speech = clampSentences(challenge, 2);
  }

  const career = buildCareerFocus(options?.profile, mentorProfile);
  const careerNote = careerStandardNote(career);
  if (careerNote && adaptation.increaseDifficulty) {
    out = clampSentences(`${out} ${careerNote}`, 8);
  }

  const signal = detectConfidenceSignal(model, memory);
  if (signal === "frustration" && intent === "student_frustration") {
    const line = applyConfidenceEngine(out, speech, model, memory, mentorProfile);
    return { message: line.message, speechText: line.speechText };
  }

  return { message: out.trim(), speechText: clampSentences(speech, 3) };
}
