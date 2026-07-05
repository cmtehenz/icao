import type { VocabItemProgress } from "@/utils/spacedRepetition";
import { countLevelsPassed } from "@/utils/spacedRepetition";

export type VocabPracticeLevel = 1 | 2 | 3 | 4;

export const VB_PASS_SCORE = 75;

const VB_LEVEL_NAMES: Record<VocabPracticeLevel, string> = {
  1: "Meaning",
  2: "Operational Expression",
  3: "Aviation Sentence",
  4: "ICAO Use",
};

export function vbLevelCode(level: VocabPracticeLevel): string {
  return `VB-${level}`;
}

export function vbLevelLabel(level: VocabPracticeLevel): string {
  return `${vbLevelCode(level)} — ${VB_LEVEL_NAMES[level]}`;
}

export function vbLevelName(level: VocabPracticeLevel): string {
  return VB_LEVEL_NAMES[level];
}

export function isVbLevelPassed(progress: VocabItemProgress, level: VocabPracticeLevel): boolean {
  return !!progress.levelsPassed?.[level];
}

export function countVbLevelsPassed(progress: VocabItemProgress): number {
  return countLevelsPassed(progress);
}

/** Daily mission term complete — all four VB levels passed (≥75% each). */
export function isVocabMissionTermComplete(progress: VocabItemProgress): boolean {
  return countVbLevelsPassed(progress) >= 4;
}

/** Next VB level to practice for today's mission term. */
export function nextVocabMissionLevel(progress: VocabItemProgress): VocabPracticeLevel {
  for (const level of [1, 2, 3, 4] as const) {
    if (!isVbLevelPassed(progress, level)) return level;
  }
  return 4;
}

export function vocabTermMissionProgress(progress: VocabItemProgress): {
  levelsDone: number;
  total: number;
  complete: boolean;
  currentLevel: VocabPracticeLevel;
} {
  const levelsDone = countVbLevelsPassed(progress);
  return {
    levelsDone,
    total: 4,
    complete: levelsDone >= 4,
    currentLevel: nextVocabMissionLevel(progress),
  };
}
