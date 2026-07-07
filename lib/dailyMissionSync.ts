/**
 * Sync daily mission (pronunciation / Part 1 / Part 2 / Vocab) across devices via the user account.
 */

import {
  loadPart1DailyMission,
  part1DailyMissionProgress,
  savePart1DailyMission,
  type Part1DailyMissionState,
} from "@/lib/part1DailyMission";
import {
  loadPart2DailyMission,
  part2DailyMissionProgress,
  savePart2DailyMission,
  type Part2DailyMissionState,
} from "@/lib/part2DailyMission";
import {
  loadPronunciationDailyMission,
  savePronunciationDailyMission,
  type PronunciationDailyMissionState,
} from "@/lib/pronunciationDailyMission";
import {
  loadWordDailyMission,
  saveWordDailyMission,
  wordDailyMissionProgress,
} from "@/lib/wordMission/wordDailyMission";
import type { VocabDailyMissionState } from "@/lib/vocabDailyMission";
import {
  loadDailyMissionLog,
  markDailyMissionComplete,
  saveDailyMissionLogFromSync,
} from "@/lib/dailyMissionLog";
import { getDevKnowledgeTermIds } from "@/lib/knowledge/devKnowledge";
import {
  loadFlightDebriefState,
  saveFlightDebriefState,
} from "@/lib/flightDebrief/flightDebriefProgress";
import type { FlightDebriefState } from "@/lib/flightDebrief/flightDebriefTypes";
import {
  loadMissionRecallState,
  saveMissionRecallState,
} from "@/lib/missionRecall/missionRecallProgress";
import type { MissionRecallState } from "@/lib/missionRecall/missionRecallTypes";
import { todayKey } from "@/lib/studyTime";

export const DAILY_MISSION_SYNC_EVENT = "icao-daily-mission-sync-request";

export type DailyMissionBundle = {
  date: string;
  pronunciation: PronunciationDailyMissionState | null;
  part1: Part1DailyMissionState | null;
  part2: Part2DailyMissionState | null;
  vocab: VocabDailyMissionState | null;
  recall: MissionRecallState | null;
  debrief: FlightDebriefState | null;
  complete: boolean;
  /** Historical completion flags by date (YYYY-MM-DD). */
  log?: Record<string, boolean>;
};

let applyingRemote = false;

export function isApplyingRemoteDailyMission(): boolean {
  return applyingRemote;
}

function missionsComplete(
  part1: Part1DailyMissionState | null,
  part2: Part2DailyMissionState | null,
  vocab: VocabDailyMissionState | null,
): boolean {
  if (!part1 || !part2 || !vocab) return false;
  return (
    part1DailyMissionProgress(part1).complete &&
    part2DailyMissionProgress(part2).complete &&
    wordDailyMissionProgress(vocab).complete
  );
}

export function mergePronunciationMission(
  a: PronunciationDailyMissionState | null,
  b: PronunciationDailyMissionState | null,
): PronunciationDailyMissionState | null {
  if (!a) return b;
  if (!b) return a;
  if (a.date !== b.date) return a.date >= b.date ? a : b;

  const completed = new Set(
    [...a.completedWords, ...b.completedWords].map((w) => w.toLowerCase()),
  );
  const words = [...a.words];
  for (const w of b.words) {
    if (!words.some((x) => x.toLowerCase() === w.toLowerCase())) words.push(w);
  }

  return {
    date: a.date,
    words,
    completedWords: words.filter((w) => completed.has(w.toLowerCase())),
  };
}

export function loadLocalDailyMissionBundle(): DailyMissionBundle {
  const date = todayKey();
  const pronunciation = loadPronunciationDailyMission();
  const part1 = loadPart1DailyMission();
  const part2 = loadPart2DailyMission();
  const vocab = loadWordDailyMission();
  const recall = loadMissionRecallState();
  const debrief = loadFlightDebriefState();
  const log = loadDailyMissionLog();
  const complete =
    !!log[date] || missionsComplete(part1, part2, vocab);
  return { date, pronunciation, part1, part2, vocab, recall, debrief, complete, log };
}

export function mergePart1Mission(
  a: Part1DailyMissionState | null,
  b: Part1DailyMissionState | null,
): Part1DailyMissionState | null {
  if (!a) return b;
  if (!b) return a;
  if (a.date !== b.date) return a.date >= b.date ? a : b;

  const byNum = new Map<string, Part1DailyMissionState["cards"][number]>();
  for (const c of a.cards) byNum.set(c.cardNum, { ...c });
  for (const c of b.cards) {
    const prev = byNum.get(c.cardNum);
    if (!prev) {
      byNum.set(c.cardNum, { ...c });
    } else {
      byNum.set(c.cardNum, {
        cardNum: c.cardNum,
        shadowDone: prev.shadowDone || c.shadowDone,
        coachDone: prev.coachDone || c.coachDone,
      });
    }
  }

  const order: string[] = [];
  for (const c of a.cards) {
    if (!order.includes(c.cardNum)) order.push(c.cardNum);
  }
  for (const c of b.cards) {
    if (!order.includes(c.cardNum)) order.push(c.cardNum);
  }

  return {
    date: a.date,
    examVersion: a.examVersion ?? b.examVersion,
    cards: order.map((num) => byNum.get(num)!),
  };
}

export function mergePart2Mission(
  a: Part2DailyMissionState | null,
  b: Part2DailyMissionState | null,
): Part2DailyMissionState | null {
  if (!a) return b;
  if (!b) return a;
  if (a.date !== b.date) return a.date >= b.date ? a : b;

  return {
    date: a.date,
    examVersion: a.examVersion ?? b.examVersion,
    simulationDone: a.simulationDone || b.simulationDone,
  };
}

export function mergeVocabMission(
  a: VocabDailyMissionState | null,
  b: VocabDailyMissionState | null,
): VocabDailyMissionState | null {
  if (!a) return b;
  if (!b) return a;
  if (a.date !== b.date) return a.date >= b.date ? a : b;

  const termIds = getDevKnowledgeTermIds();
  const completed = new Set(
    [...a.completedIds, ...b.completedIds].filter((id) => termIds.includes(id)),
  );
  const completedIds = termIds.filter((id) => completed.has(id));

  return {
    date: a.date,
    examVersion: a.examVersion ?? b.examVersion,
    termIds,
    completedIds,
  };
}

export function mergeMissionRecallState(
  a: MissionRecallState | null,
  b: MissionRecallState | null,
): MissionRecallState | null {
  if (!a) return b;
  if (!b) return a;
  if (a.date !== b.date) return a.date >= b.date ? a : b;

  const answeredIds = [...new Set([...a.answeredIds, ...b.answeredIds])];
  const itemIds = a.itemIds.length >= b.itemIds.length ? a.itemIds : b.itemIds;
  const answers = { ...(b.answers ?? {}), ...(a.answers ?? {}) };
  for (const id of answeredIds) {
    const local = a.answers?.[id];
    const remote = b.answers?.[id];
    if (local && remote) {
      answers[id] = (local.transcript?.length ?? 0) >= (remote.transcript?.length ?? 0)
        ? local
        : remote;
    } else if (local || remote) {
      answers[id] = local ?? remote!;
    }
  }

  const total = itemIds.length;
  const done = answeredIds.length;
  const complete = total > 0 && done >= total;
  const confidenceStars = Math.max(a.confidenceStars, b.confidenceStars);

  return {
    date: a.date,
    itemIds,
    answeredIds,
    answers: Object.keys(answers).length > 0 ? answers : undefined,
    complete: a.complete || b.complete || complete,
    confidenceStars: complete ? Math.max(confidenceStars, 1) : confidenceStars,
    completedAt: a.completedAt ?? b.completedAt,
  };
}

export function mergeFlightDebriefState(
  a: FlightDebriefState | null,
  b: FlightDebriefState | null,
): FlightDebriefState | null {
  if (!a) return b;
  if (!b) return a;
  if (a.date !== b.date) return a.date >= b.date ? a : b;

  return {
    date: a.date,
    viewed: a.viewed || b.viewed,
    complete: a.complete || b.complete,
    completedAt: a.completedAt ?? b.completedAt,
  };
}

export function mergeDailyMissionBundles(
  local: DailyMissionBundle,
  remote: DailyMissionBundle,
): DailyMissionBundle {
  const date =
    local.date >= remote.date ? local.date : remote.date;

  const localToday =
    local.date === date
      ? local
      : {
          ...local,
          pronunciation: null,
          part1: null,
          part2: null,
          vocab: null,
          recall: null,
          debrief: null,
        };
  const remoteToday =
    remote.date === date
      ? remote
      : {
          ...remote,
          pronunciation: null,
          part1: null,
          part2: null,
          vocab: null,
          recall: null,
          debrief: null,
        };

  const pronunciation = mergePronunciationMission(
    localToday.pronunciation,
    remoteToday.pronunciation,
  );
  const part1 = mergePart1Mission(localToday.part1, remoteToday.part1);
  const part2 = mergePart2Mission(localToday.part2, remoteToday.part2);
  const vocab = mergeVocabMission(localToday.vocab, remoteToday.vocab);
  const recall = mergeMissionRecallState(localToday.recall, remoteToday.recall);
  const debrief = mergeFlightDebriefState(localToday.debrief, remoteToday.debrief);
  const complete =
    localToday.complete ||
    remoteToday.complete ||
    missionsComplete(part1, part2, vocab);

  const log = { ...(remote.log ?? {}), ...(local.log ?? {}) };
  if (complete) log[date] = true;

  return { date, pronunciation, part1, part2, vocab, recall, debrief, complete, log };
}

/** Write merged mission into localStorage and notify UI (does not push to server). */
export function applyDailyMissionBundle(bundle: DailyMissionBundle): void {
  if (typeof window === "undefined") return;
  if (bundle.date !== todayKey()) {
    if (bundle.log) saveDailyMissionLogFromSync(bundle.log);
    return;
  }

  applyingRemote = true;
  try {
    if (bundle.pronunciation) savePronunciationDailyMission(bundle.pronunciation);
    if (bundle.part1) savePart1DailyMission(bundle.part1);
    if (bundle.part2) savePart2DailyMission(bundle.part2);
    if (bundle.vocab) saveWordDailyMission(bundle.vocab);
    if (bundle.recall) saveMissionRecallState(bundle.recall);
    if (bundle.debrief) saveFlightDebriefState(bundle.debrief);
    if (bundle.complete) markDailyMissionComplete(bundle.date);
    if (bundle.log) saveDailyMissionLogFromSync(bundle.log);
  } finally {
    applyingRemote = false;
  }
}

export function requestDailyMissionSync(): void {
  if (typeof window === "undefined" || applyingRemote) return;
  window.dispatchEvent(new Event(DAILY_MISSION_SYNC_EVENT));
}
