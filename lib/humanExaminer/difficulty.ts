import type { Card } from "@/lib/types";
import type { ExaminerProfile } from "@/lib/humanExaminer/types";
import { getProfileLimits } from "@/lib/humanExaminer/examinerPersonality";

export function difficultyFromCard(card: Card): 1 | 2 | 3 {
  if (card.difficulty === "Easy") return 1;
  if (card.difficulty === "Medium") return 2;
  return 3;
}

export function maxFollowUpsForDifficulty(
  difficulty: 1 | 2 | 3,
  profile: ExaminerProfile,
): number {
  const base = getProfileLimits(profile).maxFollowUps;
  if (difficulty === 1) return base;
  if (difficulty === 2) return base + 1;
  return base + 2;
}

export function scoreThresholdForDifficulty(difficulty: 1 | 2 | 3): number {
  if (difficulty === 1) return 55;
  if (difficulty === 2) return 60;
  return 65;
}
