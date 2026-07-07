import type { IcaoVocabularyItem } from "@/data/icaoVocabulary";
import {
  buildWordMissionLesson,
  lessonSpeakTextForLevel,
} from "@/lib/wordMission/lesson/lessonEngine";
import type { VaultWord } from "@/lib/pronunciationVault";

/** Ephemeral vault word for the pronunciation recording controller from a vocab term. */
export function vaultWordFromVocabTerm(item: IcaoVocabularyItem): VaultWord {
  const lesson = buildWordMissionLesson(item);
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
      expression: lessonSpeakTextForLevel(lesson, 2),
      sentence: lessonSpeakTextForLevel(lesson, 3),
      icaoPrompt: lesson.steps[3]!.captainLine,
      fragment: lessonSpeakTextForLevel(lesson, 4),
    },
  };
}
