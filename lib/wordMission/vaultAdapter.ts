import type { IcaoVocabularyItem } from "@/data/icaoVocabulary";
import { getLevelText } from "@/data/icaoVocabulary";
import type { VaultWord } from "@/lib/pronunciationVault";

/** Ephemeral vault word for the pronunciation recording controller from a vocab term. */
export function vaultWordFromVocabTerm(item: IcaoVocabularyItem): VaultWord {
  return {
    word: item.term,
    lowestAccuracy: 0,
    lastAccuracy: 0,
    errorType: "None",
    errorLabel: "",
    context: item.example,
    timesSeen: 0,
    practiceCount: 0,
    passCount: 0,
    returnCount: 0,
    lastSeenAt: new Date().toISOString(),
    practiceLevel: 1,
    contextPack: {
      expression: getLevelText(item, 2),
      sentence: getLevelText(item, 3),
      icaoPrompt: getLevelText(item, 4),
      fragment: getLevelText(item, 4),
    },
  };
}
