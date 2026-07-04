import { loadCaptainDeltaMemory, saveCaptainDeltaMemory } from "@/lib/captainDelta/memory/store";
import type { LearningPreference } from "@/lib/captainDelta/memory/types";
import { loadScoreHistory } from "@/lib/scoreHistory";
import { todayKey } from "@/lib/studyTime";

export function bumpLearningStyle(mode: LearningPreference, delta = 1): void {
  const store = loadCaptainDeltaMemory();
  const learningStyle = {
    ...store.learningStyle,
    [mode]: (store.learningStyle[mode] ?? 0) + delta,
  };
  const top = (Object.entries(learningStyle) as [LearningPreference, number][])
    .sort((a, b) => b[1] - a[1])[0];
  saveCaptainDeltaMemory({
    ...store,
    learningStyle,
    preferredMode: top && top[1] > 0 ? top[0] : store.preferredMode,
  });
}

/** Infer style gains from score history deltas per activity type. */
export function inferLearningStyleFromHistory(): LearningPreference | null {
  const store = loadCaptainDeltaMemory();
  if (store.preferredMode) return store.preferredMode;

  const days = loadScoreHistory().days;
  const today = todayKey();
  const keys = Object.keys(days).filter((k) => k <= today).sort().slice(-14);
  if (keys.length < 3) return null;

  const scores: Partial<Record<LearningPreference, number>> = {};
  const map: Record<string, LearningPreference> = {
    part1: "speaking",
    part2: "speaking",
    pronunciation: "speaking",
    vocabulary: "keywords",
  };

  for (const key of keys) {
    const day = days[key];
    if (!day) continue;
    for (const [area, bucket] of Object.entries(day)) {
      const pref = map[area];
      if (!pref || !bucket?.count) continue;
      const avg = bucket.sum / bucket.count;
      scores[pref] = (scores[pref] ?? 0) + avg * bucket.count;
    }
  }

  const shadowStore = loadCaptainDeltaMemory().learningStyle.shadowing;
  if (shadowStore > 0) scores.shadowing = (scores.shadowing ?? 0) + shadowStore * 10;

  const ranked = Object.entries(scores).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));
  return (ranked[0]?.[0] as LearningPreference) ?? null;
}

export function learningStyleLabel(mode: LearningPreference): string {
  const labels: Record<LearningPreference, string> = {
    speaking: "free speaking in the Coach",
    listening: "listen-and-repeat mode",
    shadowing: "shadowing PEEL blocks",
    pictures: "picture description practice",
    keywords: "keyword-first answers",
  };
  return labels[mode];
}
