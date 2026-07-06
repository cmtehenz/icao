import type { VaultWord } from "@/lib/pronunciationVault";
import { deriveVaultWordStatus } from "@/lib/pronunciationGraduation";
import { VAULT_PASS_SCORE } from "@/lib/pronunciationVault";
import { todayKey } from "@/lib/studyTime";

export type PronunciationMissionWord = {
  word: VaultWord;
  role: "critical" | "below80" | "sentence";
};

export type PronunciationMission = {
  date: string;
  words: PronunciationMissionWord[];
};

export type MissionDebrief = {
  bestWord: string | null;
  mostImprovedWord: string | null;
  stillCritical: string[];
  graduated: string[];
  nextFocus: string | null;
};

const MISSION_PROGRESS_KEY = "icao_pronunciation_mission_progress_v1";

export function buildDailyPronunciationMission(words: VaultWord[]): PronunciationMission {
  const critical = words.filter(
    (w) => deriveVaultWordStatus(w) === "critical" || w.lowestAccuracy < 60,
  );
  const below80 = words.filter(
    (w) =>
      w.lastAccuracy < VAULT_PASS_SCORE &&
      deriveVaultWordStatus(w) !== "critical" &&
      !critical.some((c) => c.word === w.word),
  );
  const goodForSentence = words.filter(
    (w) =>
      w.lastAccuracy >= VAULT_PASS_SCORE &&
      (w.practiceLevel ?? 1) <= 3 &&
      !critical.some((c) => c.word === w.word) &&
      !below80.some((b) => b.word === w.word),
  );

  const pick = (pool: VaultWord[], n: number, used: Set<string>) => {
    const out: VaultWord[] = [];
    for (const w of pool) {
      if (used.has(w.word.toLowerCase())) continue;
      out.push(w);
      used.add(w.word.toLowerCase());
      if (out.length >= n) break;
    }
    return out;
  };

  const used = new Set<string>();
  const missionWords: PronunciationMissionWord[] = [];

  for (const w of pick(critical, 2, used)) {
    missionWords.push({ word: w, role: "critical" });
  }
  for (const w of pick(below80, 2, used)) {
    missionWords.push({ word: w, role: "below80" });
  }
  for (const w of pick(goodForSentence, 1, used)) {
    missionWords.push({ word: w, role: "sentence" });
  }

  for (const w of words) {
    if (missionWords.length >= 5) break;
    if (used.has(w.word.toLowerCase())) continue;
    missionWords.push({ word: w, role: "below80" });
    used.add(w.word.toLowerCase());
  }

  return { date: todayKey(), words: missionWords.slice(0, 5) };
}

export function saveMissionProgress(completedWords: string[]): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(MISSION_PROGRESS_KEY, JSON.stringify(completedWords));
}

export function loadMissionProgress(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(MISSION_PROGRESS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function buildMissionDebrief(
  mission: PronunciationMission,
  completed: string[],
): MissionDebrief {
  const pool = mission.words.map((m) => m.word);
  const done = pool.filter((w) => completed.includes(w.word.toLowerCase()));

  const bestWord =
    done.length > 0
      ? [...done].sort((a, b) => b.lastAccuracy - a.lastAccuracy)[0]?.word ?? null
      : null;

  const mostImproved =
    done.length > 0
      ? [...done].sort((a, b) => {
          const aGain = (a.recentScores?.at(-1) ?? a.lastAccuracy) - (a.recentScores?.[0] ?? a.lowestAccuracy);
          const bGain = (b.recentScores?.at(-1) ?? b.lastAccuracy) - (b.recentScores?.[0] ?? b.lowestAccuracy);
          return bGain - aGain;
        })[0]?.word ?? null
      : null;

  const stillCritical = done
    .filter((w) => w.lowestAccuracy < 60 || (w.fail70Count ?? 0) >= 3)
    .map((w) => w.word);

  const graduated = done.filter((w) => w.status === "graduated").map((w) => w.word);

  const next = mission.words.find(
    (m) => !completed.includes(m.word.word.toLowerCase()),
  );

  return {
    bestWord,
    mostImprovedWord: mostImproved,
    stillCritical,
    graduated,
    nextFocus: next?.word.word ?? null,
  };
}

/** Reference text for Azure at each practice level. */
export function practiceTextForLevel(
  word: VaultWord,
  level: import("@/lib/pronunciationVault").PracticeLevel,
): string {
  const pack = word.contextPack;
  if (level === 1) return word.word;
  if (level === 2) return pack?.expression ?? word.word;
  if (level === 3) return pack?.sentence ?? word.word;
  return pack?.icaoPrompt ?? pack?.fragment ?? word.word;
}

export function pronunciationMissionKey(m: PronunciationMission): string {
  return `${m.date}|${m.words.map((w) => w.word.word.toLowerCase()).join(",")}`;
}
