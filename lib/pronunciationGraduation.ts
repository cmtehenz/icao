import type {
  PracticeLevel,
  VaultWord,
  VaultWordStatus,
} from "@/lib/pronunciationVault";
import { VAULT_PASS_SCORE } from "@/lib/pronunciationVault";

export type PracticeOutcome = {
  status: VaultWordStatus;
  practiceLevel: PracticeLevel;
  graduated: boolean;
  removed: boolean;
  advancedLevel: boolean;
  passCount: number;
};

const MAX_RECENT = 10;

function clampLevel(n: number): PracticeLevel {
  return Math.min(4, Math.max(1, n)) as PracticeLevel;
}

function hasImproved(scores: number[]): boolean {
  if (scores.length < 2) return false;
  const first = scores[0]!;
  const last = scores[scores.length - 1]!;
  return last > first + 4;
}

/** Current unlocked / recommended practice level from vault progress. */
export function recommendedPracticeLevel(word: VaultWord): PracticeLevel {
  const stored = clampLevel(word.practiceLevel ?? 1);
  if (word.status === "use_icao") return clampLevel(Math.max(stored, 4));
  if (word.status === "use_sentence") return clampLevel(Math.max(stored, 3));
  return stored;
}

export function unlockedPracticeLevel(word: VaultWord): PracticeLevel {
  return recommendedPracticeLevel(word);
}

export function isPracticeLevelUnlocked(
  word: VaultWord,
  level: PracticeLevel,
): boolean {
  return level <= unlockedPracticeLevel(word);
}

export function deriveVaultWordStatus(word: VaultWord): VaultWordStatus {
  if (word.status) return word.status;
  if (word.practiceCount === 0) return "new";
  if ((word.fail70Count ?? 0) >= 3 || word.lowestAccuracy < 60) return "critical";
  if (word.needsReview) return "needs_review";
  if (word.practiceLevel === 4 && (word.pass80Count ?? 0) >= 1) return "use_icao";
  if ((word.practiceLevel ?? 1) >= 3) return "use_sentence";
  return "practicing";
}

export function applyPracticeAttempt(
  item: VaultWord,
  accuracy: number,
  level: PracticeLevel,
): { word: VaultWord; outcome: PracticeOutcome } {
  const recentScores = [...(item.recentScores ?? []), accuracy].slice(-MAX_RECENT);
  let pass90 = item.pass90Count ?? 0;
  let pass85 = item.pass85Count ?? 0;
  let pass80 = item.pass80Count ?? 0;
  let fail70 = item.fail70Count ?? 0;
  let practiceLevel = item.practiceLevel ?? 1;
  let needsReview = item.needsReview ?? false;
  let status = deriveVaultWordStatus(item);

  if (accuracy >= 90) pass90 += 1;
  if (accuracy >= 85) pass85 += 1;
  if (accuracy >= VAULT_PASS_SCORE) pass80 += 1;
  if (accuracy < 70) fail70 += 1;
  else fail70 = 0;

  if (fail70 >= 3) {
    status = "critical";
  }

  let advancedLevel = false;
  let graduated = false;
  let removed = false;

  const levelComplete =
    pass90 >= 2 || pass85 >= 3 || pass80 >= 5;

  if (levelComplete && practiceLevel === level) {
    if (pass90 >= 2 && practiceLevel === 1) {
      practiceLevel = 3;
      status = "use_sentence";
    } else if (practiceLevel < 4) {
      practiceLevel = clampLevel(practiceLevel + 1);
      status = practiceLevel >= 3 ? "use_sentence" : "practicing";
      if (practiceLevel === 4) status = "use_icao";
    } else {
      graduated = true;
      removed = true;
      status = "graduated";
    }
    pass90 = 0;
    pass85 = 0;
    pass80 = 0;
    advancedLevel = true;
  }

  if (
    !advancedLevel &&
    recentScores.length >= 5 &&
    !hasImproved(recentScores.slice(-5)) &&
    accuracy < VAULT_PASS_SCORE
  ) {
    needsReview = true;
    status = "needs_review";
    if (practiceLevel < 4) {
      practiceLevel = clampLevel(practiceLevel + 1);
      advancedLevel = true;
      pass90 = 0;
      pass85 = 0;
      pass80 = 0;
    }
  }

  if (accuracy >= VAULT_PASS_SCORE && status === "new") {
    status = "practicing";
  }

  const updated: VaultWord = {
    ...item,
    recentScores,
    pass90Count: pass90,
    pass85Count: pass85,
    pass80Count: pass80,
    fail70Count: fail70,
    practiceLevel,
    needsReview,
    status,
    passCount: pass80,
    ...(graduated ? { graduatedAt: new Date().toISOString() } : {}),
  };

  return {
    word: updated,
    outcome: {
      status,
      practiceLevel,
      graduated,
      removed,
      advancedLevel,
      passCount: pass80,
    },
  };
}
