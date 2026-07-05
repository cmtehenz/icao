import { todayExamLabel } from "@/lib/dailyExamRotation";
import { flightDebriefLink, flightDebriefProgress, isFlightDebriefComplete } from "@/lib/flightDebrief/flightDebriefProgress";
import { isFlightDebriefAvailable } from "@/lib/flightDebrief/buildFlightDebrief";
import {
  isMissionRecallComplete,
  missionRecallLink,
  missionRecallProgress,
} from "@/lib/missionRecall/missionRecallProgress";
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
  pronunciationDailyMissionProgress,
  getOrCreatePronunciationDailyMission,
  pronunciationMissionLink,
} from "@/lib/pronunciationDailyMission";
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
  pronunciation: ReturnType<typeof pronunciationDailyMissionProgress>;
  part1: ReturnType<typeof part1DailyMissionProgress>;
  part2: ReturnType<typeof part2DailyMissionProgress>;
  vocabulary: ReturnType<typeof vocabDailyMissionProgress>;
  recall: ReturnType<typeof missionRecallProgress>;
  simulate: ReturnType<typeof simulateMissionProgress>;
  debrief: ReturnType<typeof flightDebriefProgress>;
  simulateRequired: boolean;
  complete: boolean;
  completedSections: number;
  totalSections: number;
};

export function areBaseMissionLegsComplete(): boolean {
  const pronunciation = pronunciationDailyMissionProgress(getOrCreatePronunciationDailyMission());
  const part1 = part1DailyMissionProgress(getOrCreatePart1DailyMission());
  const part2 = part2DailyMissionProgress(getOrCreatePart2DailyMission());
  const vocabulary = vocabDailyMissionProgress(getOrCreateVocabDailyMission());
  return pronunciation.complete && vocabulary.complete && part1.complete && part2.complete;
}

export function getDailyMissionSummary(): DailyMissionSummary {
  const mode = loadStudyPlanMode();
  const pronunciation = pronunciationDailyMissionProgress(getOrCreatePronunciationDailyMission());
  const part1 = part1DailyMissionProgress(getOrCreatePart1DailyMission());
  const part2 = part2DailyMissionProgress(getOrCreatePart2DailyMission());
  const vocabulary = vocabDailyMissionProgress(getOrCreateVocabDailyMission());
  const recall = missionRecallProgress();
  const simulate = simulateMissionProgress();
  const debrief = flightDebriefProgress();
  const simulateRequired = isSimulateMissionRequired(mode);

  const sections = [
    pronunciation.complete,
    vocabulary.complete,
    part1.complete,
    part2.complete,
    recall.complete,
  ];
  if (simulateRequired) sections.push(simulate.complete);
  sections.push(debrief.complete);

  const completedSections = sections.filter(Boolean).length;
  const complete = completedSections === sections.length;

  return {
    examLabel: todayExamLabel(),
    pronunciation,
    part1,
    part2,
    vocabulary,
    recall,
    simulate,
    debrief,
    simulateRequired,
    complete,
    completedSections,
    totalSections: sections.length,
  };
}

export function isDailyMissionComplete(): boolean {
  if (!areBaseMissionLegsComplete()) return false;
  if (!isMissionRecallComplete()) return false;
  if (isSimulateMissionRequired() && !isSimulateMissionDone()) return false;
  if (!isFlightDebriefComplete()) return false;
  return true;
}

/** Próximo passo concreto da missão (para CTA na home). */
export function getNextMissionAction(): DailyMissionNextAction | null {
  const summary = getDailyMissionSummary();
  if (summary.complete) return null;

  const pronMission = getOrCreatePronunciationDailyMission();
  const nextPronWord = pronMission.words.find(
    (w) => !pronMission.completedWords.includes(w.toLowerCase()),
  );
  if (nextPronWord) {
    return {
      href: pronunciationMissionLink(nextPronWord),
      title: `Pronunciation · ${summary.examLabel}`,
      hint: `${pronMission.completedWords.length}/${pronMission.words.length} words today`,
    };
  }

  const vocabMission = getOrCreateVocabDailyMission();
  const nextVocabId = vocabMission.termIds.find((id) => !vocabMission.completedIds.includes(id));
  if (nextVocabId) {
    const done = vocabMission.completedIds.length;
    return {
      href: vocabMissionLink(nextVocabId),
      title: `Vocabulary · ${summary.examLabel}`,
      hint: `${done}/20 exam terms today`,
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
            ? `Complete PEEL blocks (${peel.done}/${peel.total})`
            : "Shadow the PEEL blocks for this question",
      };
    }
    if (!card.coachDone) {
      return {
        href: part1MissionLink(card.cardNum, "coach"),
        title: `Part 1 · Q${card.cardNum} Coach`,
        hint: "Record your answer in voice coach",
      };
    }
  }

  const part2Mission = getOrCreatePart2DailyMission();
  if (!part2Mission.simulationDone) {
    return {
      href: part2MissionLink(part2Mission),
      title: `Part 2 · ${part2Mission.examVersion} simulation`,
      hint: "5 full situations from today's exam",
    };
  }

  if (!isMissionRecallComplete()) {
    const recall = missionRecallProgress();
    return {
      href: missionRecallLink(),
      title: `Mission Recall · ${summary.examLabel}`,
      hint: `${recall.done}/${recall.total} recall items — answer from memory`,
    };
  }

  if (isSimulateMissionRequired() && !isSimulateMissionDone()) {
    return {
      href: getSimuladoIcaoHref(),
      title: `Mock Exam · ${summary.examLabel}`,
      hint: "Intense day: full exam simulation (Part 1 + Part 2)",
    };
  }

  if (isFlightDebriefAvailable() && !isFlightDebriefComplete()) {
    return {
      href: flightDebriefLink(),
      title: `Flight Debrief · ${summary.examLabel}`,
      hint: "Close today's flight — one priority improvement",
    };
  }

  return null;
}

export { getSimuladoIcaoHref };
