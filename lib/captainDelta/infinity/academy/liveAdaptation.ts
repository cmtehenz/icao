import type { CaptainLessonMemory } from "@/lib/captainDelta/infinity/types";
import type { CaptainStudentModel } from "@/lib/captainDelta/infinity/types";
import type { LiveAdaptationState } from "@/lib/captainDelta/infinity/academy/types";
import { clampSentences } from "@/lib/captainDelta/infinity/qualityGate";

export function detectLiveAdaptationState(
  model: CaptainStudentModel,
  memory: CaptainLessonMemory,
): LiveAdaptationState {
  if (
    model.emotionalState === "frustrated" ||
    memory.consecutiveSameMistake >= 2 ||
    memory.frustrationSignals >= 2
  ) {
    return "ease";
  }
  if (model.lastAttemptSucceeded && (model.wordMastered || memory.successesToday >= 2)) {
    return "push";
  }
  return "steady";
}

export type LiveAdaptationResult = {
  state: LiveAdaptationState;
  captainPrefix: string | null;
  captainSuffix: string | null;
  postponeHardContent: boolean;
  increaseDifficulty: boolean;
};

/** V6 — Captain adapts the lesson in real time. */
export function planLiveAdaptation(
  model: CaptainStudentModel,
  memory: CaptainLessonMemory,
): LiveAdaptationResult {
  const state = detectLiveAdaptationState(model, memory);

  if (state === "ease") {
    return {
      state,
      captainPrefix: "Let's pause the harder stuff — one word at a time.",
      captainSuffix: null,
      postponeHardContent: true,
      increaseDifficulty: false,
    };
  }

  if (state === "push") {
    return {
      state,
      captainPrefix: null,
      captainSuffix: "You nailed that — let's add realism.",
      postponeHardContent: false,
      increaseDifficulty: true,
    };
  }

  return {
    state,
    captainPrefix: null,
    captainSuffix: null,
    postponeHardContent: false,
    increaseDifficulty: false,
  };
}

export function applyLiveAdaptationToMessage(
  message: string,
  speechText: string,
  adaptation: LiveAdaptationResult,
): { message: string; speechText: string } {
  let out = message;
  let speech = speechText;
  if (adaptation.captainPrefix) {
    out = `${adaptation.captainPrefix} ${out}`;
    speech = `${adaptation.captainPrefix} ${speech}`;
  }
  if (adaptation.captainSuffix) {
    out = clampSentences(`${out} ${adaptation.captainSuffix}`, 8);
  }
  return { message: out.trim(), speechText: clampSentences(speech, 3) };
}
