import { buildDifficultyInsights } from "@/lib/difficultyInsights";
import { loadCaptainDeltaMemory } from "@/lib/captainDelta/memory/store";
import { detectSpeechPatterns } from "@/lib/captainDelta/memory/patterns";
import { buildSmartReminders } from "@/lib/captainDelta/memory/reminders";
import { computeAdaptivePriorities } from "@/lib/captainDelta/memory/adaptive";
import { buildImprovementLines } from "@/lib/captainDelta/memory/improvements";
import { buildExamReadiness } from "@/lib/captainDelta/memory/readiness";
import type { LearnerSnapshot } from "@/lib/captainDelta/memory/types";
import { loadProfile } from "@/lib/profile";

export function buildLearnerSnapshot(firstName: string): LearnerSnapshot {
  const store = loadCaptainDeltaMemory();
  const questions = Object.values(store.questionHistory);
  const masteredCount = questions.filter((q) => q.timesMastered >= 1).length;
  const weakQuestionCount = questions.filter((q) => q.averageScore < 60).length;

  return {
    firstName,
    profile: loadProfile(),
    readiness: buildExamReadiness(),
    patterns: detectSpeechPatterns(),
    improvements: buildImprovementLines(),
    reminders: buildSmartReminders(),
    adaptivePriority: computeAdaptivePriorities(),
    masteredCount,
    weakQuestionCount,
  };
}

export function getQuestionMemoryList(limit = 8) {
  return Object.values(loadCaptainDeltaMemory().questionHistory)
    .sort((a, b) => (b.lastAt ?? "").localeCompare(a.lastAt ?? ""))
    .slice(0, limit);
}

export function getWeakestQuestions(limit = 5) {
  return Object.values(loadCaptainDeltaMemory().questionHistory)
    .filter((q) => q.averageScore < 70)
    .sort((a, b) => a.averageScore - b.averageScore)
    .slice(0, limit);
}

export function getStrongestArea(): string {
  const insights = buildDifficultyInsights(3);
  const sorted = [...insights].filter((i) => i.score != null).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  return sorted[0]?.label ?? "Part 1";
}

export function getWeakestArea(): string {
  const insights = buildDifficultyInsights(3);
  const sorted = [...insights].filter((i) => i.score != null).sort((a, b) => (a.score ?? 0) - (b.score ?? 0));
  return sorted[0]?.label ?? "Part 2";
}
