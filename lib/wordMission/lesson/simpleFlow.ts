import {
  WORD_MISSION_STEP_ORDER,
  type WordMissionLesson,
  type WordMissionLessonContext,
  type WordMissionStep,
  type WordMissionStepId,
} from "@/lib/wordMission/lesson/types";

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
