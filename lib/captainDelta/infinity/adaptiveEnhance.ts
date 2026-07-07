import type { AdaptivePlan, CaptainLessonMemory, InstructorLesson } from "@/lib/captainDelta/infinity/types";
import { aviationHookForWord, aviationStoryForWord } from "@/lib/captainDelta/infinity/aviationCoach";
import { learningLoopText } from "@/lib/captainDelta/infinity/adaptivePlan";

const OPENER_ROTATION = [
  "Good question.",
  "Right — let's work this.",
  "Okay, one step at a time.",
  "Let's try another way.",
];

function rotateOpener(memory: CaptainLessonMemory, defaultOpener: string): string {
  if (memory.helpLevel >= 1 || memory.explainedTopics.length >= 1) {
    const idx = memory.turnCount % OPENER_ROTATION.length;
    return OPENER_ROTATION[idx] ?? "Let's try another way.";
  }
  return defaultOpener;
}

function granularityExercise(
  word: string,
  referenceText: string,
  granularity: AdaptivePlan["smallestLesson"],
): string {
  const q = `"${word.trim()}"`;
  switch (granularity) {
    case "syllable":
      return `Isolate one syllable in ${q} — slow, then normal.`;
    case "word":
      return `Say ${q} once by itself, clearly.`;
    case "phrase": {
      const words = referenceText.trim().split(/\s+/).slice(0, 3).join(" ");
      return words ? `Practice the phrase: "${words}…"` : `Build up from ${q} into a short phrase.`;
    }
    case "challenge":
      return `Use ${q} in a new sentence — pretend you're talking to Tower.`;
    default:
      return referenceText
        ? "Now say the full sentence again."
        : "Now try the full line again.";
  }
}

/** Apply V3 adaptive plan on top of a base instructor lesson. */
export function enhanceLessonWithAdaptivePlan(
  lesson: InstructorLesson,
  memory: CaptainLessonMemory,
  plan: AdaptivePlan,
  word: string,
): InstructorLesson {
  let next: InstructorLesson = {
    ...lesson,
    positive: rotateOpener(memory, lesson.positive),
  };

  if (plan.activeIntervention) {
    next = {
      ...next,
      positive: plan.activeIntervention,
      focus: next.focus,
    };
  }

  if (plan.useAviationHook) {
    const hook = aviationHookForWord(word);
    if (hook) {
      if (next.teach.startsWith("Model:")) {
        next = { ...next, focus: `${next.focus} Example: ${hook}`.trim() };
      } else {
        next = { ...next, teach: hook };
      }
    }
  }

  if (plan.useStory) {
    const story = aviationStoryForWord(word);
    if (story) {
      next = { ...next, teach: story };
    }
  }

  if (plan.microChallenge) {
    next = { ...next, exercise: plan.microChallenge };
  } else if (plan.smallestLesson !== "sentence" && !next.exercise) {
    next = {
      ...next,
      exercise: granularityExercise(word, memory.referenceText, plan.smallestLesson),
    };
  }

  next = {
    ...next,
    repeat: learningLoopText(plan.learningLoop),
  };

  return next;
}

/** Avoid repeating identical coaching copy today. */
export function variesFromRecentMessages(message: string, memory: CaptainLessonMemory): boolean {
  const normalized = message.trim().toLowerCase();
  return !memory.recentMessages.some((m) => m.trim().toLowerCase() === normalized);
}
