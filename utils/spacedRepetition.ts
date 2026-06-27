export type VocabStatus = "new" | "learning" | "review" | "mastered";

export type VocabItemProgress = {
  attempts: number;
  bestScore: number;
  averageScore: number;
  lastScore: number;
  masteryLevel: 0 | 1 | 2 | 3 | 4 | 5;
  nextReviewDate: string;
  status: VocabStatus;
  lastAttemptDate?: string;
  /** ISO dates (YYYY-MM-DD) with score >= 90 */
  highScoreDates: string[];
  currentLevel: 1 | 2 | 3 | 4;
  markedDifficult: boolean;
  manuallyMastered: boolean;
};

export const VOCAB_PROGRESS_EVENT = "icao-vocabulary-progress-change";
const STORAGE_KEY = "icao_vocabulary_progress_v1";

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function defaultProgress(): VocabItemProgress {
  return {
    attempts: 0,
    bestScore: 0,
    averageScore: 0,
    lastScore: 0,
    masteryLevel: 0,
    nextReviewDate: todayKey(),
    status: "new",
    highScoreDates: [],
    currentLevel: 1,
    markedDifficult: false,
    manuallyMastered: false,
  };
}

export function pronunciationScore(accuracy: number, fluency: number, completeness: number): number {
  return Math.round(accuracy * 0.55 + fluency * 0.25 + completeness * 0.2);
}

export function scoreTier(score: number): "excellent" | "good" | "retry" {
  if (score >= 90) return "excellent";
  if (score >= 75) return "good";
  return "retry";
}

export function scoreTierLabel(score: number): string {
  const tier = scoreTier(score);
  if (tier === "excellent") return "Excellent";
  if (tier === "good") return "Good";
  return "Try again";
}

export function nextReviewDate(score: number, from = new Date()): string {
  const d = new Date(from);
  if (score < 75) return d.toISOString().slice(0, 10);
  if (score < 90) {
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }
  d.setDate(d.getDate() + 3);
  return d.toISOString().slice(0, 10);
}

export function isMastered(progress: VocabItemProgress): boolean {
  if (progress.manuallyMastered) return true;
  const uniqueDays = new Set(progress.highScoreDates);
  return uniqueDays.size >= 3;
}

export function computeMasteryLevel(progress: VocabItemProgress): 0 | 1 | 2 | 3 | 4 | 5 {
  if (isMastered(progress)) return 5;
  if (progress.bestScore >= 90 && progress.highScoreDates.length >= 2) return 4;
  if (progress.bestScore >= 90) return 3;
  if (progress.bestScore >= 75) return 2;
  if (progress.attempts > 0) return 1;
  return 0;
}

export function computeStatus(progress: VocabItemProgress): VocabStatus {
  if (isMastered(progress)) return "mastered";
  if (progress.attempts === 0) return "new";
  if (progress.markedDifficult || progress.lastScore < 75) return "review";
  if (progress.attempts < 3) return "learning";
  return "review";
}

export function isDueForReview(progress: VocabItemProgress, date = todayKey()): boolean {
  if (isMastered(progress)) return false;
  return progress.nextReviewDate <= date;
}

export type VocabProgressStore = {
  items: Record<string, VocabItemProgress>;
  /** YYYY-MM-DD → attempt count */
  dailyAttempts: Record<string, number>;
  /** YYYY-MM-DD → phrase-level attempts (level 2+) */
  dailyPhrases: Record<string, number>;
  /** YYYY-MM-DD → sum of scores */
  dailyScoreSum: Record<string, number>;
  streak: number;
  lastPracticeDate?: string;
};

export function loadVocabProgressStore(): VocabProgressStore {
  if (typeof window === "undefined") {
    return { items: {}, dailyAttempts: {}, dailyPhrases: {}, dailyScoreSum: {}, streak: 0 };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: {}, dailyAttempts: {}, dailyPhrases: {}, dailyScoreSum: {}, streak: 0 };
    const parsed = JSON.parse(raw) as VocabProgressStore;
    return {
      items: parsed.items ?? {},
      dailyAttempts: parsed.dailyAttempts ?? {},
      dailyPhrases: parsed.dailyPhrases ?? {},
      dailyScoreSum: parsed.dailyScoreSum ?? {},
      streak: parsed.streak ?? 0,
      lastPracticeDate: parsed.lastPracticeDate,
    };
  } catch {
    return { items: {}, dailyAttempts: {}, dailyPhrases: {}, dailyScoreSum: {}, streak: 0 };
  }
}

export function saveVocabProgressStore(store: VocabProgressStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(new Event(VOCAB_PROGRESS_EVENT));
}

export function getItemProgress(store: VocabProgressStore, id: string): VocabItemProgress {
  return store.items[id] ?? defaultProgress();
}

function updateStreak(store: VocabProgressStore, date: string): number {
  if (!store.lastPracticeDate) return 1;
  const last = new Date(`${store.lastPracticeDate}T12:00:00`);
  const today = new Date(`${date}T12:00:00`);
  const diffDays = Math.round((today.getTime() - last.getTime()) / 86400000);
  if (diffDays === 0) return store.streak || 1;
  if (diffDays === 1) return (store.streak || 0) + 1;
  return 1;
}

export function recordVocabAttempt(
  store: VocabProgressStore,
  id: string,
  score: number,
  level: 1 | 2 | 3 | 4,
): VocabItemProgress {
  const existing = getItemProgress(store, id);
  const date = todayKey();
  const attempts = existing.attempts + 1;
  const bestScore = Math.max(existing.bestScore, score);
  const averageScore = Math.round(
    (existing.averageScore * existing.attempts + score) / attempts,
  );
  const highScoreDates = [...existing.highScoreDates];
  if (score >= 90 && !highScoreDates.includes(date)) {
    highScoreDates.push(date);
  }

  const next: VocabItemProgress = {
    ...existing,
    attempts,
    bestScore,
    averageScore,
    lastScore: score,
    lastAttemptDate: date,
    highScoreDates,
    nextReviewDate: nextReviewDate(score),
    currentLevel: level,
    manuallyMastered: existing.manuallyMastered,
  };
  next.masteryLevel = computeMasteryLevel(next);
  next.status = computeStatus(next);

  store.items[id] = next;
  store.dailyAttempts[date] = (store.dailyAttempts[date] ?? 0) + 1;
  if (level >= 2) {
    store.dailyPhrases[date] = (store.dailyPhrases[date] ?? 0) + 1;
  }
  store.dailyScoreSum[date] = (store.dailyScoreSum[date] ?? 0) + score;
  store.streak = updateStreak(store, date);
  store.lastPracticeDate = date;

  saveVocabProgressStore(store);
  return next;
}

export function markVocabDifficult(store: VocabProgressStore, id: string): VocabItemProgress {
  const existing = getItemProgress(store, id);
  const next: VocabItemProgress = {
    ...existing,
    markedDifficult: true,
    status: "review",
    nextReviewDate: todayKey(),
  };
  store.items[id] = next;
  saveVocabProgressStore(store);
  return next;
}

export function markVocabMastered(store: VocabProgressStore, id: string): VocabItemProgress {
  const existing = getItemProgress(store, id);
  const next: VocabItemProgress = {
    ...existing,
    manuallyMastered: true,
    masteryLevel: 5,
    status: "mastered",
  };
  store.items[id] = next;
  saveVocabProgressStore(store);
  return next;
}

export type DailyMissionStats = {
  wordsToday: number;
  phrasesToday: number;
  averageScoreToday: number;
  streak: number;
  dueToday: number;
};

export function dailyMissionStats(
  store: VocabProgressStore,
  totalItems: number,
  date = todayKey(),
): DailyMissionStats {
  const wordsToday = store.dailyAttempts[date] ?? 0;
  const phrasesToday = store.dailyPhrases[date] ?? 0;
  const scoreSum = store.dailyScoreSum[date] ?? 0;
  const averageScoreToday = wordsToday > 0 ? Math.round(scoreSum / wordsToday) : 0;
  const dueToday = Object.keys(store.items).length
    ? Object.values(store.items).filter((p) => isDueForReview(p, date)).length
    : totalItems;

  return {
    wordsToday,
    phrasesToday,
    averageScoreToday,
    streak: store.streak,
    dueToday,
  };
}
