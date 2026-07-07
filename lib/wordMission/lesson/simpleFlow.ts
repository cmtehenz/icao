import {
  WORD_MISSION_STEP_ORDER,
  type WordMissionLesson,
  type WordMissionLessonContext,
  type WordMissionStep,
  type WordMissionStepId,
} from "@/lib/wordMission/lesson/types";
import { instructorSpeechFromParts } from "@/lib/wordMission/lesson/instructorText";

export function stepIndex(id: WordMissionStepId): number {
  return WORD_MISSION_STEP_ORDER.indexOf(id);
}

export function stepIdForLevel(level: 1 | 2 | 3 | 4): WordMissionStepId {
  return WORD_MISSION_STEP_ORDER[level - 1]!;
}

export function levelForStepId(id: WordMissionStepId): 1 | 2 | 3 | 4 {
  return (stepIndex(id) + 1) as 1 | 2 | 3 | 4;
}

export function createLessonContext(
  lesson: WordMissionLesson,
  startStep: WordMissionStepId = "meaning",
): WordMissionLessonContext {
  return {
    lesson,
    currentStepId: startStep,
    stepIndex: stepIndex(startStep),
  };
}

export function currentStep(ctx: WordMissionLessonContext): WordMissionStep {
  return ctx.lesson.steps[ctx.stepIndex]!;
}

export function shouldEnableRecording(stepId: WordMissionStepId): boolean {
  return stepId === "say_it" || stepId === "icao_practice";
}

export function isLessonComplete(ctx: WordMissionLessonContext): boolean {
  return ctx.currentStepId === "icao_practice" && ctx.stepIndex === WORD_MISSION_STEP_ORDER.length - 1;
}

/** What the student should do on this step — shown on card and spoken by Captain Delta. */
export function wordMissionStepActionHint(
  stepId: WordMissionStepId,
  speakText: string,
): string {
  switch (stepId) {
    case "meaning":
      return "Listen only — no recording. Tap Continue when the meaning is clear.";
    case "operational_use":
      return "Picture the scenario — no recording on this step. Tap Continue. On Say It you will speak the full pilot readback with callsign.";
    case "say_it":
      return `Record this complete pilot readback out loud — callsign and full phrase: ${speakText}`;
    case "icao_practice":
      return `Record your ICAO answer out loud: ${speakText}`;
    default:
      return "";
  }
}

export function buildStepCaptainCoaching(
  step: WordMissionStep,
  speakText: string,
): { text: string; speechText: string } {
  const actionHint = wordMissionStepActionHint(step.id, speakText);
  const text = [step.captainLine, step.detail, actionHint].filter(Boolean).join("\n\n");
  return {
    text,
    speechText: instructorSpeechFromParts(step.captainLine, step.detail, actionHint),
  };
}
