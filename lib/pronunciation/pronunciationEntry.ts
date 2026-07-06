import { buildDailyPronunciationMission } from "@/lib/pronunciationMission";
import {
  getOrCreatePronunciationDailyMission,
  pronunciationDailyMissionProgress,
} from "@/lib/pronunciationDailyMission";
import { getPronunciationHookMountCount } from "@/lib/azure/pronunciationRecordingStore";
import type { VaultWord } from "@/lib/pronunciationVault";

export type PronunciationEntrySource = "home_mission" | "direct" | "browse";

export type PronunciationEntryTrace = {
  source: PronunciationEntrySource;
  route: string;
  missionWord: string | null;
  activeWord: string | null;
  hasLesson: boolean;
  mountedAzureInstances: number;
  callsignMounted: boolean;
};

export function pronunciationEntrySource(
  missionWordParam: string | null,
  missionLegActive: boolean,
): PronunciationEntrySource {
  if (missionWordParam || missionLegActive) return "home_mission";
  return "direct";
}

export function tracePronunciationEntry(entry: PronunciationEntryTrace): void {
  console.info("[PronunciationEntry]", entry);
}

/** Resolve a daily-mission or deep-link word to a vault row (or mission placeholder). */
export function resolvePronunciationEntryWord(
  requested: string,
  vault: VaultWord[],
): VaultWord | null {
  const key = requested.trim().toLowerCase();
  if (!key) return null;

  const vaultHit = vault.find((w) => w.word.toLowerCase() === key);
  if (vaultHit) return vaultHit;

  const daily = getOrCreatePronunciationDailyMission();
  if (!daily.words.some((w) => w.toLowerCase() === key)) return null;

  const built = buildDailyPronunciationMission(vault);
  const missionHit = built.words.find((m) => m.word.word.toLowerCase() === key);
  if (missionHit) return missionHit.word;

  return {
    word: requested.trim(),
    lowestAccuracy: 0,
    lastAccuracy: 0,
    errorType: "Manual",
    errorLabel: "daily mission",
    context: "",
    timesSeen: 1,
    practiceCount: 0,
    passCount: 0,
    returnCount: 0,
    lastSeenAt: new Date().toISOString(),
  };
}

export function nextIncompleteMissionWord(vault: VaultWord[]): VaultWord | null {
  const daily = getOrCreatePronunciationDailyMission();
  const nextKey =
    daily.words.find((w) => !daily.completedWords.includes(w.toLowerCase())) ??
    daily.words[0] ??
    null;
  if (!nextKey) return null;
  return resolvePronunciationEntryWord(nextKey, vault);
}

export function isMissionEntryMode(
  missionLegActive: boolean,
  missionWordParam: string | null,
): boolean {
  return missionLegActive || !!missionWordParam?.trim();
}

export function shouldMountCallsignDrill(
  browseMode: boolean,
  activeWord: VaultWord | null,
  missionLegActive: boolean,
  missionWordParam: string | null,
): boolean {
  if (!browseMode || activeWord) return false;
  return !isMissionEntryMode(missionLegActive, missionWordParam);
}

export function buildPronunciationEntryTrace(input: {
  route: string;
  missionWordParam: string | null;
  activeWord: VaultWord | null;
  missionLegActive: boolean;
  callsignMounted: boolean;
}): PronunciationEntryTrace {
  const { currentWord } = pronunciationDailyMissionProgress();
  return {
    source: pronunciationEntrySource(input.missionWordParam, input.missionLegActive),
    route: input.route,
    missionWord: input.missionWordParam ?? currentWord,
    activeWord: input.activeWord?.word ?? null,
    hasLesson: !!input.activeWord,
    mountedAzureInstances: getPronunciationHookMountCount(),
    callsignMounted: input.callsignMounted,
  };
}
