import type {
  CaptainIntent,
  CaptainLessonContextInput,
  CaptainLessonMemory,
  HelpLevel,
} from "@/lib/captainDelta/infinity/types";

const DEFAULT_WORD = "the word";

let activeMemory: CaptainLessonMemory | null = null;

export function createLessonMemory(
  input: CaptainLessonContextInput = {},
): CaptainLessonMemory {
  return {
    currentWord: input.currentWord?.trim() || DEFAULT_WORD,
    referenceText: input.referenceText?.trim() || "",
    practiceLevel: input.practiceLevel ?? 1,
    currentMission: input.currentMission?.trim() || null,
    lastMistake: input.lastMistake?.trim() || null,
    lastCoaching: input.lastCoaching?.trim() || null,
    lastSuccessfulAttempt: input.lastSuccessfulAttempt?.trim() || null,
    lastIntent: input.lastIntent ?? null,
    explainedTopics: [],
    helpLevel: 0,
    turnCount: 0,
    frustrationSignals: 0,
    recentMessages: [],
    consecutiveSameMistake: 0,
    successesToday: 0,
  };
}

export function mergeLessonMemory(
  base: CaptainLessonMemory,
  patch: CaptainLessonContextInput,
): CaptainLessonMemory {
  return {
    ...base,
    currentWord: patch.currentWord?.trim() || base.currentWord,
    referenceText: patch.referenceText?.trim() || base.referenceText,
    practiceLevel: patch.practiceLevel ?? base.practiceLevel,
    currentMission: patch.currentMission?.trim() || base.currentMission,
    lastMistake: patch.lastMistake?.trim() || base.lastMistake,
    lastCoaching: patch.lastCoaching?.trim() || base.lastCoaching,
    lastSuccessfulAttempt:
      patch.lastSuccessfulAttempt?.trim() || base.lastSuccessfulAttempt,
    lastIntent: patch.lastIntent ?? base.lastIntent,
  };
}

export function rememberCaptainLesson(input: CaptainLessonContextInput): CaptainLessonMemory {
  activeMemory = activeMemory
    ? mergeLessonMemory(activeMemory, input)
    : createLessonMemory(input);
  return activeMemory;
}

export function saveCaptainLessonMemory(memory: CaptainLessonMemory): void {
  activeMemory = memory;
}

export function patchCaptainLessonMemory(
  patch: Partial<
    Pick<
      CaptainLessonMemory,
      | "consecutiveSameMistake"
      | "successesToday"
      | "lastMistake"
      | "lastSuccessfulAttempt"
    >
  >,
): CaptainLessonMemory | null {
  if (!activeMemory) return null;
  activeMemory = { ...activeMemory, ...patch };
  return activeMemory;
}

export function getCaptainLessonMemory(): CaptainLessonMemory | null {
  return activeMemory;
}

export function resetCaptainLessonMemoryForTests(): void {
  activeMemory = null;
}

export function recordCoachingTurn(
  memory: CaptainLessonMemory,
  intent: CaptainIntent,
  coachingMessage: string,
  topicKey: string,
): CaptainLessonMemory {
  const alreadyExplained = memory.explainedTopics.includes(topicKey);
  const sameIntentAgain = memory.lastIntent === intent;
  const frustrationBump =
    intent === "student_frustration" || intent === "explain_again" ? 1 : 0;

  let helpLevel: HelpLevel = memory.helpLevel;
  if (sameIntentAgain || intent === "explain_again" || intent === "repeat_request") {
    helpLevel = Math.min(3, memory.helpLevel + 1) as HelpLevel;
  } else if (alreadyExplained || memory.turnCount > 0) {
    helpLevel = Math.min(3, memory.helpLevel + 1) as HelpLevel;
  }

  const explainedTopics = memory.explainedTopics.includes(topicKey)
    ? memory.explainedTopics
    : [...memory.explainedTopics, topicKey];

  return {
    ...memory,
    lastCoaching: coachingMessage,
    lastIntent: intent,
    explainedTopics,
    helpLevel,
    turnCount: memory.turnCount + 1,
    frustrationSignals: memory.frustrationSignals + frustrationBump,
    recentMessages: [...memory.recentMessages.slice(-4), coachingMessage],
  };
}

export function topicKeyForIntent(intent: CaptainIntent, word: string): string {
  return `${intent}:${word.toLowerCase()}`;
}

export function resolveWhyReferent(memory: CaptainLessonMemory): string {
  if (memory.lastCoaching) return memory.lastCoaching;
  if (memory.lastMistake) return memory.lastMistake;
  if (memory.referenceText) return memory.referenceText;
  return memory.currentWord;
}
