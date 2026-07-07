import type { CaptainDeltaMemoryStore, LearningPreference } from "@/lib/captainDelta/memory/types";
import type { PilotProfile } from "@/lib/profile";
import type { VaultWord } from "@/lib/pronunciationVault";
import { getWordJourney, wordStruggledYesterday } from "@/lib/captainDelta/infinity/wordJourney";

export type OperationContext = "helicopter" | "offshore" | "ems" | "general";

export type CaptainMentorProfile = {
  icaoTarget: number;
  icaoEstimate: number;
  confidenceTrend: "up" | "down" | "stable";
  motivationLevel: "low" | "medium" | "high";
  masteredWords: string[];
  strugglingWords: string[];
  vocabularyGaps: string[];
  grammarWeaknesses: string[];
  learningStyle: LearningPreference;
  operationContext: OperationContext;
  examMode: boolean;
  examSimulation: boolean;
  progressTrend: "up" | "down" | "stable";
  wordStruggledYesterday: boolean;
  smartReviewWord: string | null;
  daysUntilExam: number;
};

export type MentorProfileInput = {
  memoryStore?: CaptainDeltaMemoryStore;
  pilotProfile?: PilotProfile;
  vaultWords?: VaultWord[];
  examDaysRemaining?: number;
  currentWord?: string;
};

function inferOperationContext(profile: PilotProfile): OperationContext {
  const op = `${profile.operationType} ${profile.role}`.toLowerCase();
  if (/ems|hems|medevac|air ambulance/.test(op)) return "ems";
  if (/offshore|rig|oil/.test(op)) return "offshore";
  if (/helicopter|rotor|heli/.test(op)) return "helicopter";
  return "general";
}

function icaoEstimate(store: CaptainDeltaMemoryStore): number {
  const hist = store.estimatedIcaoHistory;
  if (!hist.length) return 4;
  return hist[hist.length - 1]!.level;
}

function progressTrend(store: CaptainDeltaMemoryStore): "up" | "down" | "stable" {
  const hist = store.estimatedIcaoHistory.slice(-5);
  if (hist.length < 2) return "stable";
  const delta = hist[hist.length - 1]!.level - hist[0]!.level;
  if (delta >= 0.5) return "up";
  if (delta <= -0.5) return "down";
  return "stable";
}

function confidenceTrend(store: CaptainDeltaMemoryStore): "up" | "down" | "stable" {
  const recent = store.confidenceLog.slice(-8);
  if (recent.length < 3) return "stable";
  const unsureRecent = recent.filter((c) => c.level === "unsure").length;
  const older = store.confidenceLog.slice(-16, -8);
  const unsureOlder = older.filter((c) => c.level === "unsure").length;
  if (unsureRecent < unsureOlder) return "up";
  if (unsureRecent > unsureOlder + 1) return "down";
  return "stable";
}

function motivationLevel(
  store: CaptainDeltaMemoryStore,
  trend: "up" | "down" | "stable",
): "low" | "medium" | "high" {
  const recentUnsure = store.confidenceLog.slice(-6).filter((c) => c.level === "unsure").length;
  if (recentUnsure >= 3 || trend === "down") return "low";
  if (trend === "up") return "high";
  return "medium";
}

function smartReviewWord(
  store: CaptainDeltaMemoryStore,
  currentWord?: string,
): string | null {
  const journey = store.wordJourney ?? {};
  const candidates = Object.entries(journey)
    .filter(([w, j]) => w !== currentWord?.toLowerCase() && (j.struggleCount ?? 0) >= 2)
    .sort((a, b) => b[1].struggleCount - a[1].struggleCount);
  return candidates[0]?.[0] ?? null;
}

/** Internal mentor profile — teaches THIS student, not today's lesson. */
export function buildCaptainMentorProfile(input: MentorProfileInput = {}): CaptainMentorProfile {
  const store = input.memoryStore ?? {
    version: 1 as const,
    questionHistory: {},
    confidenceLog: [],
    learningStyle: { speaking: 0, listening: 0, shadowing: 0, pictures: 0, keywords: 0 },
    preferredMode: null,
    aviationStories: [],
    connectorUsage: {},
    vocabularyRepeats: {},
    grammarMistakes: {},
    wordJourney: {},
    sessionDates: [],
    lastSessionCloseAt: null,
    lastWeeklyDebriefAt: null,
    bestAnswers: [],
    estimatedIcaoHistory: [],
  };

  const profile = input.pilotProfile ?? {
    role: "helicopter pilot",
    aircraft: "H130",
    hours: 4000,
    aircraftType: "helicopter",
    operationType: "helicopter operations",
  };

  const vault = input.vaultWords ?? [];
  const days = input.examDaysRemaining ?? 45;
  const trend = progressTrend(store);
  const current = input.currentWord?.trim().toLowerCase();

  const masteredWords = vault
    .filter((w) => w.status === "graduated" || w.status === "use_icao" || w.status === "use_sentence")
    .map((w) => w.word.toLowerCase());

  const strugglingWords = Object.entries(store.wordJourney ?? {})
    .filter(([, j]) => j.struggleCount >= 2)
    .map(([w]) => w);

  const vocabularyGaps = Object.entries(store.vocabularyRepeats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([w]) => w);

  const grammarWeaknesses = Object.entries(store.grammarMistakes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([g]) => g);

  const learningStyle =
    store.preferredMode ??
    (Object.entries(store.learningStyle).sort((a, b) => b[1] - a[1])[0]?.[0] as LearningPreference) ??
    "speaking";

  return {
    icaoTarget: 4,
    icaoEstimate: icaoEstimate(store),
    confidenceTrend: confidenceTrend(store),
    motivationLevel: motivationLevel(store, trend),
    masteredWords,
    strugglingWords,
    vocabularyGaps,
    grammarWeaknesses,
    learningStyle,
    operationContext: inferOperationContext(profile),
    examMode: days <= 21,
    examSimulation: days <= 14,
    progressTrend: trend,
    wordStruggledYesterday: current ? wordStruggledYesterday(current, store) : false,
    smartReviewWord: smartReviewWord(store, current),
    daysUntilExam: days,
  };
}

export function operationExamplePrefix(context: OperationContext): string {
  switch (context) {
    case "ems":
      return "On an EMS mission";
    case "offshore":
      return "Offshore, on the radio";
    case "helicopter":
      return "In helicopter ops";
    default:
      return "On the radio";
  }
}
