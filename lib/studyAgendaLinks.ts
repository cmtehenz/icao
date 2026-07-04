import { CARDS } from "@/lib/cards";
import { getCardProgress, loadProgress, type ProgressStore } from "@/lib/progress";
import { loadVault, type VaultWord } from "@/lib/pronunciationVault";
import { ICAO_VOCABULARY } from "@/data/icaoVocabulary";
import {
  getItemProgress,
  isDueForReview,
  loadVocabProgressStore,
} from "@/utils/spacedRepetition";
import type { StudyAgendaLinkTarget } from "@/lib/studyAgenda";

export function pickPart1CardNum(progress: ProgressStore = loadProgress()): string {
  const difficult = CARDS.find((c) => getCardProgress(progress, c.num).status === "difficult");
  if (difficult) return difficult.num;

  const learning = CARDS.find((c) => {
    const st = getCardProgress(progress, c.num).status;
    return st === "learning" || st === "new";
  });
  if (learning) return learning.num;

  const notMastered = CARDS.find((c) => getCardProgress(progress, c.num).status !== "mastered");
  return notMastered?.num ?? CARDS[0]?.num ?? "01";
}

export function pickVaultWord(words: VaultWord[] = loadVault()): VaultWord | null {
  if (!words.length) return null;
  return [...words].sort((a, b) => a.lastAccuracy - b.lastAccuracy)[0];
}

export function pickDueVocabId(): string | null {
  const store = loadVocabProgressStore();
  const due = ICAO_VOCABULARY.filter((item) => isDueForReview(getItemProgress(store, item.id)));
  if (due.length) return due[0].id;
  return ICAO_VOCABULARY[0]?.id ?? null;
}

export function resolveAgendaLink(target: StudyAgendaLinkTarget): string {
  switch (target) {
    case "part1-shadow": {
      const num = pickPart1CardNum();
      return `/part1?card=${num}&shadow=1`;
    }
    case "part2-readback-shadow":
      return "/part2?mode=readback&shadow=1";
    case "part2-readback":
      return "/part2?mode=readback";
    case "part2-interaction":
      return "/part2?mode=interaction&shadow=1";
    case "part2-any":
      return "/part2?mode=readback";
    case "part2-simulation":
      return "/part2?mode=simulation";
    case "pronunciation": {
      const word = pickVaultWord();
      return word ? `/pronunciation?word=${encodeURIComponent(word.word)}` : "/pronunciation";
    }
    case "vocabulary": {
      const id = pickDueVocabId();
      return id ? `/vocabulario?term=${encodeURIComponent(id)}` : "/vocabulario";
    }
    default:
      return "/part1";
  }
}
