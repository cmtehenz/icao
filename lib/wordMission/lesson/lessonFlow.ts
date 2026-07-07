import {
  WORD_MISSION_PHASE_ORDER,
  type WordMissionLesson,
  type WordMissionPhaseContent,
  type WordMissionPhaseId,
  type WordMissionLessonContext,
} from "@/lib/wordMission/lesson/types";

export function phaseIndex(id: WordMissionPhaseId): number {
  return WORD_MISSION_PHASE_ORDER.indexOf(id);
}

export function nextPhaseId(current: WordMissionPhaseId): WordMissionPhaseId | null {
  const idx = phaseIndex(current);
  if (idx < 0 || idx >= WORD_MISSION_PHASE_ORDER.length - 1) return null;
  return WORD_MISSION_PHASE_ORDER[idx + 1]!;
}

export function prevPhaseId(current: WordMissionPhaseId): WordMissionPhaseId | null {
  const idx = phaseIndex(current);
  if (idx <= 0) return null;
  return WORD_MISSION_PHASE_ORDER[idx - 1]!;
}

export function createLessonContext(
  lesson: WordMissionLesson,
  startPhase: WordMissionPhaseId = "mission_brief",
): WordMissionLessonContext {
  return {
    lesson,
    currentPhaseId: startPhase,
    phaseIndex: phaseIndex(startPhase),
  };
}

export function advanceLessonContext(ctx: WordMissionLessonContext): WordMissionLessonContext {
  const next = nextPhaseId(ctx.currentPhaseId);
  if (!next) return ctx;
  return { ...ctx, currentPhaseId: next, phaseIndex: phaseIndex(next) };
}

export function currentPhaseContent(ctx: WordMissionLessonContext): WordMissionPhaseContent {
  return ctx.lesson.phases[ctx.phaseIndex]!;
}

export function isLessonComplete(ctx: WordMissionLessonContext): boolean {
  return ctx.currentPhaseId === "mission_complete";
}

export function shouldEnableRecording(ctx: WordMissionLessonContext): boolean {
  return !!currentPhaseContent(ctx).recordHere;
}

/** Map lesson phase to legacy WM level for Azure reference text progression. */
export function practiceLevelForPhase(phaseId: WordMissionPhaseId): 1 | 2 | 3 | 4 {
  const idx = phaseIndex(phaseId);
  if (idx <= 3) return 1;
  if (idx <= 6) return 2;
  if (idx <= 9) return 3;
  return 4;
}

export function captainSpeechBudget(phaseId: WordMissionPhaseId): "short" | "medium" {
  return phaseId === "mission_brief" || phaseId === "mission_complete" ? "short" : "medium";
}

/** Target 35% Captain / 65% student — student-turn phases. */
export function isStudentTurnPhase(phaseId: WordMissionPhaseId): boolean {
  return phaseId === "micro_conversation" || phaseId === "micro_challenge" || phaseId === "pronunciation";
}

export function groupedPhaseLabel(phaseId: WordMissionPhaseId): string {
  const idx = phaseIndex(phaseId);
  if (idx <= 0) return "Brief";
  if (idx <= 3) return "Learn";
  if (idx <= 6) return "Speak";
  if (idx <= 9) return "Master";
  return "Fly";
}
