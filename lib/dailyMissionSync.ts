/**
 * Sync daily mission (Part 1 / Part 2 / Vocab) across devices via the user account.
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
  loadVocabDailyMission,
  saveVocabDailyMission,
  vocabDailyMissionProgress,
  type VocabDailyMissionState,
} from "@/lib/vocabDailyMission";
import {
  loadDailyMissionLog,
  markDailyMissionComplete,
  saveDailyMissionLogFromSync,
} from "@/lib/dailyMissionLog";
import { todayKey } from "@/lib/studyTime";

export const DAILY_MISSION_SYNC_EVENT = "icao-daily-mission-sync-request";

export type DailyMissionBundle = {
  date: string;
  part1: Part1DailyMissionState | null;
  part2: Part2DailyMissionState | null;
  vocab: VocabDailyMissionState | null;
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
    vocabDailyMissionProgress(vocab).complete
  );
}

export function loadLocalDailyMissionBundle(): DailyMissionBundle {
  const date = todayKey();
  const part1 = loadPart1DailyMission();
  const part2 = loadPart2DailyMission();
  const vocab = loadVocabDailyMission();
  const log = loadDailyMissionLog();
  const complete = !!log[date] || missionsComplete(part1, part2, vocab);
  return { date, part1, part2, vocab, complete, log };
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

  const preferA = a.completedIds.length >= b.completedIds.length;
  const primary = preferA ? a : b;
  const secondary = preferA ? b : a;

  const termIds = [...primary.termIds];
  for (const id of secondary.termIds) {
    if (!termIds.includes(id) && secondary.completedIds.includes(id)) {
      termIds.push(id);
    }
  }

  const completed = new Set([...a.completedIds, ...b.completedIds]);
  const completedIds = termIds.filter((id) => completed.has(id));

  return {
    date: a.date,
    examVersion: a.examVersion ?? b.examVersion,
    termIds,
    completedIds,
  };
}

export function mergeDailyMissionBundles(
  local: DailyMissionBundle,
  remote: DailyMissionBundle,
): DailyMissionBundle {
  const date =
    local.date >= remote.date ? local.date : remote.date;

  const localToday = local.date === date ? local : { ...local, part1: null, part2: null, vocab: null };
  const remoteToday = remote.date === date ? remote : { ...remote, part1: null, part2: null, vocab: null };

  const part1 = mergePart1Mission(localToday.part1, remoteToday.part1);
  const part2 = mergePart2Mission(localToday.part2, remoteToday.part2);
  const vocab = mergeVocabMission(localToday.vocab, remoteToday.vocab);
  const complete =
    localToday.complete ||
    remoteToday.complete ||
    missionsComplete(part1, part2, vocab);

  const log = { ...(remote.log ?? {}), ...(local.log ?? {}) };
  if (complete) log[date] = true;

  return { date, part1, part2, vocab, complete, log };
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
    if (bundle.part1) savePart1DailyMission(bundle.part1);
    if (bundle.part2) savePart2DailyMission(bundle.part2);
    if (bundle.vocab) saveVocabDailyMission(bundle.vocab);
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
