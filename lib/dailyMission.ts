import { todayExamLabel } from "@/lib/dailyExamRotation";
import { EXAM_LABELS } from "@/lib/exams/types";
import { isPronunciationWarmupBlocking } from "@/lib/dailyMission/pronunciationWarmup";
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
  getOrCreatePronunciationDailyMission,
  pronunciationDailyMissionProgress,
  pronunciationMissionLink,
} from "@/lib/pronunciationDailyMission";
import {
  adaptivePlanHint,
  getAdaptiveDailyPlan,
} from "@/lib/trainingProfile/adaptivePlan";
import {
  getOrCreateWordDailyMission,
  wordDailyMissionProgress,
  wordMissionLink,
} from "@/lib/wordMission/wordDailyMission";
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
  wordMission: ReturnType<typeof wordDailyMissionProgress>;
  part1: ReturnType<typeof part1DailyMissionProgress>;
  part2: ReturnType<typeof part2DailyMissionProgress>;
  recall: ReturnType<typeof missionRecallProgress>;
  simulate: ReturnType<typeof simulateMissionProgress>;
  debrief: ReturnType<typeof flightDebriefProgress>;
  simulateRequired: boolean;
  pronunciationRequired: boolean;
  complete: boolean;
  completedSections: number;
  totalSections: number;
  planHint: string;
};

function pronunciationLegActive(): boolean {
  return isPronunciationWarmupBlocking();
}

export function areBaseMissionLegsComplete(): boolean {
  if (pronunciationLegActive()) {
    const pron = pronunciationDailyMissionProgress(getOrCreatePronunciationDailyMission());
    if (!pron.complete) return false;
  }
  const wordMission = wordDailyMissionProgress(getOrCreateWordDailyMission());
  const part1 = part1DailyMissionProgress(getOrCreatePart1DailyMission());
  const part2 = part2DailyMissionProgress(getOrCreatePart2DailyMission());
  return wordMission.complete && part1.complete && part2.complete;
}

export function getDailyMissionSummary(): DailyMissionSummary {
  const mode = loadStudyPlanMode();
  const plan = getAdaptiveDailyPlan();
  const pronunciation = pronunciationDailyMissionProgress(getOrCreatePronunciationDailyMission());
  const pronunciationRequired = isPronunciationWarmupBlocking();
  const wordMission = wordDailyMissionProgress(getOrCreateWordDailyMission());
  const part1 = part1DailyMissionProgress(getOrCreatePart1DailyMission());
  const part2 = part2DailyMissionProgress(getOrCreatePart2DailyMission());
  const recall = missionRecallProgress();
  const simulate = simulateMissionProgress();
  const debrief = flightDebriefProgress();
  const simulateRequired = isSimulateMissionRequired(mode);

  const sections: boolean[] = [];
  if (pronunciationRequired) sections.push(pronunciation.complete);
  sections.push(wordMission.complete, part1.complete, part2.complete, recall.complete);
  if (simulateRequired) sections.push(simulate.complete);
  sections.push(debrief.complete);

  const completedSections = sections.filter(Boolean).length;
  const complete = completedSections === sections.length;

  return {
    examLabel: todayExamLabel(),
    pronunciation,
    wordMission,
    part1,
    part2,
    recall,
    simulate,
    debrief,
    simulateRequired,
    pronunciationRequired,
    complete,
    completedSections,
    totalSections: sections.length,
    planHint: adaptivePlanHint(plan),
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

  const plan = getAdaptiveDailyPlan();

  if (isPronunciationWarmupBlocking()) {
    const pron = pronunciationDailyMissionProgress(getOrCreatePronunciationDailyMission());
    return {
      href: pronunciationMissionLink(pron.currentWord ?? undefined),
      title: `Pronunciation warm-up · ${summary.examLabel}`,
      hint: `${pron.done}/${pron.total} words — speak clearly before Word Mission`,
    };
  }

  const wordMission = getOrCreateWordDailyMission();
  const nextTermId = wordMission.termIds.find((id) => !wordMission.completedIds.includes(id));
  if (nextTermId) {
    const done = wordMission.completedIds.length;
    return {
      href: wordMissionLink(nextTermId),
      title: `Word Mission · ${summary.examLabel}`,
      hint: `${done}/${wordMission.termIds.length} terms today`,
    };
  }

  const part1Mission = getOrCreatePart1DailyMission();
  for (const card of part1Mission.cards) {
    if (!card.shadowDone) {
      const peel = part1CardPeelProgress(card.cardNum);
      return {
        href: part1MissionLink(card.cardNum),
        title: `Part 1 · Q${card.cardNum}`,
        hint:
          peel.total > 0 && peel.done > 0
            ? `Anchor build (${peel.done}/${peel.total} points)`
            : "Build four anchor points for this question",
      };
    }
    if (!card.coachDone) {
      return {
        href: part1MissionLink(card.cardNum),
        title: `Part 1 · Q${card.cardNum} Coach`,
        hint: "Keywords speak, then record your solo answer",
      };
    }
  }

  const part2Mission = getOrCreatePart2DailyMission();
  if (!part2Mission.simulationDone) {
    return {
      href: part2MissionLink(part2Mission),
      title: `Part 2 · ${EXAM_LABELS[part2Mission.examVersion]}`,
      hint: "Full exam today — 5 situations, paper notes like the real SDEA",
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
