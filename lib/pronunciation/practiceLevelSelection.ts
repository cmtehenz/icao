import {
  isPracticeLevelUnlocked,
  recommendedPracticeLevel,
  unlockedPracticeLevel,
} from "@/lib/pronunciationGraduation";
import type { PracticeLevel, VaultWord } from "@/lib/pronunciationVault";

/** Level to select when opening a word (once per word change). */
export function initialPracticeLevelForWord(word: VaultWord): PracticeLevel {
  return recommendedPracticeLevel(word);
}

/** After vault refresh — bump up if progress advanced; respect manual override. */
export function practiceLevelAfterVaultRefresh(
  word: VaultWord,
  currentLevel: PracticeLevel,
  userOverride: boolean,
): PracticeLevel {
  if (userOverride) return currentLevel;
  const recommended = recommendedPracticeLevel(word);
  return currentLevel < recommended ? recommended : currentLevel;
}

export { isPracticeLevelUnlocked, recommendedPracticeLevel, unlockedPracticeLevel };
