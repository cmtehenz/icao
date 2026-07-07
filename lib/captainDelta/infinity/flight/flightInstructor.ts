import type { CaptainIntent } from "@/lib/captainDelta/infinity/types";
import type { CaptainMentorProfile } from "@/lib/captainDelta/infinity/mentorProfile";
import type { CaptainLessonMemory } from "@/lib/captainDelta/infinity/types";
import { examPhaseCoachingNote, getExamTrainingPhase } from "@/lib/captainDelta/infinity/flight/examPhase";
import { buildSituationalExercise, buildStudentDecisionPrompt } from "@/lib/captainDelta/infinity/flight/situationalTeaching";
import { clampSentences } from "@/lib/captainDelta/infinity/qualityGate";
import type { InstructorTone } from "@/lib/captainDelta/infinity/flight/types";

const SITUATIONAL_INTENTS: CaptainIntent[] = [
  "atc",
  "phraseology",
  "aviation_context",
  "helicopter_operation",
  "connected_speech",
];

const PRONUNCIATION_COACHING_INTENTS: CaptainIntent[] = [
  "rhythm_help",
  "stress_help",
  "vowel_help",
  "consonant_help",
  "explain_again",
  "repeat_request",
  "pronunciation_question",
];

function tonePrefix(tone: InstructorTone): string {
  switch (tone) {
    case "urgent":
      return "Urgent — ";
    case "correction":
      return "Stop. Let's fix one word. ";
    case "debrief":
      return "";
    default:
      return "";
  }
}

function pickTone(memory: CaptainLessonMemory, intent: CaptainIntent): InstructorTone {
  if (memory.consecutiveSameMistake >= 2) return "correction";
  if (intent === "student_frustration") return "briefing";
  return "briefing";
}

function defaultCallsign(profile: CaptainMentorProfile, hints?: { callsign?: string }): string {
  return hints?.callsign ?? "ABC123";
}

/** V5 — apply flight instructor mode to Ask Captain responses. */
export function applyFlightInstructorMode(
  message: string,
  speechText: string,
  memory: CaptainLessonMemory,
  intent: CaptainIntent,
  mentorProfile: CaptainMentorProfile,
  options?: { callsign?: string; forceSituational?: boolean },
): { message: string; speechText: string } {
  const phase = getExamTrainingPhase(mentorProfile.daysUntilExam);
  const callsign = defaultCallsign(mentorProfile, options);
  const tone = pickTone(memory, intent);
  let out = message;
  let speech = speechText;

  const useSituational =
    !PRONUNCIATION_COACHING_INTENTS.includes(intent) &&
    (options?.forceSituational ||
      SITUATIONAL_INTENTS.includes(intent) ||
      (phase !== "teaching" && intent !== "confidence"));

  if (useSituational && memory.currentWord) {
    const exercise = buildSituationalExercise(
      memory.currentWord,
      callsign,
      mentorProfile.operationContext,
      phase,
    );
    out = clampSentences(`${exercise}`, 10);
    speech = clampSentences(exercise, 3);
  } else if (intent === "student_frustration" || intent === "confidence") {
    const prompt = buildStudentDecisionPrompt(memory.currentWord);
    out = clampSentences(`${message} ${prompt}`, 8);
  }

  const phaseNote = examPhaseCoachingNote(phase);
  if (phaseNote && phase !== "teaching") {
    out = clampSentences(`${out} ${phaseNote}`, 10);
  }

  const prefix = tonePrefix(tone);
  if (prefix && tone === "correction") {
    out = `${prefix}${out}`;
    speech = `${prefix}${speech}`;
  }

  return { message: out.trim(), speechText: clampSentences(speech, 3) };
}

/** Golden question guard — reject generic exercise language. */
export function soundsLikeExerciseNotSortie(text: string): boolean {
  return /\b(complete the exercise|lesson complete|good job|well done)\b/i.test(text);
}
