import {
  WORD_MISSION_STEP_ORDER,
  type WordMissionLesson,
  type WordMissionLessonContext,
  type WordMissionStep,
  type WordMissionStepId,
} from "@/lib/wordMission/lesson/types";
import { instructorDisplayText, instructorOpening, instructorSpeechFromParts } from "@/lib/wordMission/lesson/instructorText";

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

/** What the student should do on this step — shown on card; Captain leads listen steps. */
export function wordMissionStepActionHint(
  stepId: WordMissionStepId,
  speakText: string,
): string {
  switch (stepId) {
    case "meaning":
      return "Listen only (no recording). Captain Delta will continue when he finishes speaking.";
    case "operational_use":
      return "Listen only (no recording). Read the operational scenario while Captain speaks. Next: Say It (you will record the full readback).";
    case "say_it":
      return "Tap Record below and speak the highlighted readback exactly.";
    case "icao_practice":
      return "Tap Record below and speak the highlighted ICAO answer exactly.";
    default:
      return "";
  }
}

/** Captain speaks instructor script only — step hints stay on the mission card. */
export function buildStepCaptainCoaching(
  step: WordMissionStep,
): { text: string; speechText: string } {
  const instructorText = instructorDisplayText(step.captainLine, step.detail);
  // Full prose on card; cap TTS length so Azure does not fail and rapid step changes do not cancel endlessly.
  const voiceProse = instructorOpening(instructorText, 1200);
  return {
    text: instructorText,
    speechText: voiceProse ? instructorSpeechFromParts(voiceProse) : "",
  };
}
