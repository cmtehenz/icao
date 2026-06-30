import {
  part1DailyMissionProgress,
  getOrCreatePart1DailyMission,
  part1CardPeelProgress,
  part1MissionLink,
} from "@/lib/part1DailyMission";
import {
  part2DailyMissionProgress,
  getOrCreatePart2DailyMission,
  part2MissionLink,
} from "@/lib/part2DailyMission";
import {
  vocabDailyMissionProgress,
  getOrCreateVocabDailyMission,
  vocabMissionLink,
} from "@/lib/vocabDailyMission";
import { syncDailyMissionLog } from "@/lib/dailyMissionLog";

export type DailyMissionNextAction = {
  href: string;
  title: string;
  hint: string;
};

export type DailyMissionSummary = {
  part1: ReturnType<typeof part1DailyMissionProgress>;
  part2: ReturnType<typeof part2DailyMissionProgress>;
  vocabulary: ReturnType<typeof vocabDailyMissionProgress>;
  complete: boolean;
  completedSections: number;
  totalSections: number;
};

export function getDailyMissionSummary(): DailyMissionSummary {
  const part1 = part1DailyMissionProgress(getOrCreatePart1DailyMission());
  const part2 = part2DailyMissionProgress(getOrCreatePart2DailyMission());
  const vocabulary = vocabDailyMissionProgress(getOrCreateVocabDailyMission());

  const sections = [part1.complete, part2.complete, vocabulary.complete];
  const completedSections = sections.filter(Boolean).length;
  const complete = completedSections === sections.length;

  if (complete) syncDailyMissionLog();

  return {
    part1,
    part2,
    vocabulary,
    complete,
    completedSections,
    totalSections: sections.length,
  };
}

export function isDailyMissionComplete(): boolean {
  return getDailyMissionSummary().complete;
}

/** Próximo passo concreto da missão (para CTA na home). */
export function getNextMissionAction(): DailyMissionNextAction | null {
  const summary = getDailyMissionSummary();
  if (summary.complete) return null;

  const part1Mission = getOrCreatePart1DailyMission();
  for (const card of part1Mission.cards) {
    if (!card.shadowDone) {
      const peel = part1CardPeelProgress(card.cardNum);
      return {
        href: part1MissionLink(card.cardNum, "shadow"),
        title: `Part 1 · Q${card.cardNum} Shadow`,
        hint:
          peel.total > 0
            ? `Complete os blocos PEEL (${peel.done}/${peel.total})`
            : "Shadow nos blocos PEEL desta pergunta",
      };
    }
    if (!card.coachDone) {
      return {
        href: part1MissionLink(card.cardNum, "coach"),
        title: `Part 1 · Q${card.cardNum} Coach`,
        hint: "Grave a resposta no coach de voz",
      };
    }
  }

  const part2Mission = getOrCreatePart2DailyMission();
  const nextPart2 = part2Mission.items.find((i) => !part2Mission.completedIds.includes(i.id));
  if (nextPart2) {
    return {
      href: part2MissionLink(nextPart2),
      title: nextPart2.label,
      hint: "Part 2 da missão de hoje",
    };
  }

  const vocabMission = getOrCreateVocabDailyMission();
  const nextVocabId = vocabMission.termIds.find((id) => !vocabMission.completedIds.includes(id));
  if (nextVocabId) {
    const done = vocabMission.completedIds.length;
    return {
      href: vocabMissionLink(nextVocabId),
      title: "Vocabulário da missão",
      hint: `${done}/20 palavras concluídas`,
    };
  }

  return null;
}
