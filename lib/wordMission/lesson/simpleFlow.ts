import {
  WORD_MISSION_STEP_ORDER,
  type WordMissionLesson,
  type WordMissionLessonContext,
  type WordMissionStep,
  type WordMissionStepId,
} from "@/lib/wordMission/lesson/types";
import { instructorDisplayText, instructorSpeechFromParts } from "@/lib/wordMission/lesson/instructorText";

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
      return "Tap Continue when Captain Delta has explained the meaning.";
    case "operational_use":
      return "Picture the scenario, then tap Continue. You will record the full pilot readback on Say It.";
    case "say_it":
      return `Record this complete pilot readback out loud — callsign and full phrase: ${speakText}`;
    case "icao_practice":
      return `Record your ICAO answer out loud: ${speakText}`;
    default:
      return "";
  }
}

/** Captain speaks instructor script only — step hints stay on the mission card. */
export function buildStepCaptainCoaching(
  step: WordMissionStep,
): { text: string; speechText: string } {
  const instructorText = instructorDisplayText(step.captainLine, step.detail);
  return {
    text: instructorText,
    speechText: instructorSpeechFromParts(step.captainLine, step.detail),
  };
}
