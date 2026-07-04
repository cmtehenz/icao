import { todayExamLabel } from "@/lib/dailyExamRotation";
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
import {
  getSimuladoIcaoHref,
  isSimulateMissionDone,
  isSimulateMissionRequired,
  simulateMissionProgress,
} from "@/lib/simulateDailyMission";
import { loadStudyPlanMode } from "@/lib/studyTime";

export type DailyMissionNextAction = {
  href: string;
  title: string;
  hint: string;
};

export type DailyMissionSummary = {
  examLabel: string;
  part1: ReturnType<typeof part1DailyMissionProgress>;
  part2: ReturnType<typeof part2DailyMissionProgress>;
  vocabulary: ReturnType<typeof vocabDailyMissionProgress>;
  simulate: ReturnType<typeof simulateMissionProgress>;
  simulateRequired: boolean;
  complete: boolean;
  completedSections: number;
  totalSections: number;
};

export function getDailyMissionSummary(): DailyMissionSummary {
  const mode = loadStudyPlanMode();
  const part1 = part1DailyMissionProgress(getOrCreatePart1DailyMission());
  const part2 = part2DailyMissionProgress(getOrCreatePart2DailyMission());
  const vocabulary = vocabDailyMissionProgress(getOrCreateVocabDailyMission());
  const simulate = simulateMissionProgress();
  const simulateRequired = isSimulateMissionRequired(mode);

  const sections = [vocabulary.complete, part1.complete, part2.complete];
  if (simulateRequired) sections.push(simulate.complete);

  const completedSections = sections.filter(Boolean).length;
  const complete = completedSections === sections.length;

  return {
    examLabel: todayExamLabel(),
    part1,
    part2,
    vocabulary,
    simulate,
    simulateRequired,
    complete,
    completedSections,
    totalSections: sections.length,
  };
}

export function isDailyMissionComplete(): boolean {
  const part1 = part1DailyMissionProgress(getOrCreatePart1DailyMission());
  const part2 = part2DailyMissionProgress(getOrCreatePart2DailyMission());
  const vocabulary = vocabDailyMissionProgress(getOrCreateVocabDailyMission());
  const base = part1.complete && part2.complete && vocabulary.complete;
  if (!base) return false;
  if (isSimulateMissionRequired()) return isSimulateMissionDone();
  return true;
}

/** Próximo passo concreto da missão (para CTA na home). */
export function getNextMissionAction(): DailyMissionNextAction | null {
  const summary = getDailyMissionSummary();
  if (summary.complete) return null;

  const vocabMission = getOrCreateVocabDailyMission();
  const nextVocabId = vocabMission.termIds.find((id) => !vocabMission.completedIds.includes(id));
  if (nextVocabId) {
    const done = vocabMission.completedIds.length;
    return {
      href: vocabMissionLink(nextVocabId),
      title: `Vocabulário · ${summary.examLabel}`,
      hint: `${done}/20 palavras da prova de hoje`,
    };
  }

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
  if (!part2Mission.simulationDone) {
    return {
      href: part2MissionLink(part2Mission),
      title: `Part 2 · Simulação ${part2Mission.examVersion}`,
      hint: "5 situações completas da prova de hoje",
    };
  }

  if (isSimulateMissionRequired() && !isSimulateMissionDone()) {
    return {
      href: getSimuladoIcaoHref(),
      title: `Simulado ICAO · ${summary.examLabel}`,
      hint: "Dia bom: simulado completo (Part 1 + Part 2) da prova de hoje",
    };
  }

  return null;
}

export { getSimuladoIcaoHref };
