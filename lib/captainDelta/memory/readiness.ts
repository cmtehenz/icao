import { buildAllTrends } from "@/lib/scoreHistory";
import { buildDifficultyInsights } from "@/lib/difficultyInsights";
import { loadCaptainDeltaMemory } from "@/lib/captainDelta/memory/store";
import type { ExamReadiness } from "@/lib/captainDelta/memory/types";
import { daysUntilExam } from "@/lib/captainDelta/examDate";
import { loadPart1CoachHistory } from "@/lib/part1CoachHistory";
import { CARDS } from "@/lib/cards";

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function avgConfidence(): number {
  const store = loadCaptainDeltaMemory();
  const vals = Object.values(store.questionHistory)
    .map((q) => q.confidenceAvg)
    .filter((v): v is number => v != null);
  if (!vals.length) return 55;
  return clamp(vals.reduce((s, v) => s + v, 0) / vals.length);
}

function estimatedIcao(): number {
  const store = loadCaptainDeltaMemory();
  const hist = store.estimatedIcaoHistory;
  if (hist.length) return hist[hist.length - 1]!.level;
  const insights = buildDifficultyInsights(4);
  const part1 = insights.find((i) => i.area === "part1");
  if (part1?.aggregateIcaoLevel) return part1.aggregateIcaoLevel;
  const coach = Object.values(loadPart1CoachHistory());
  if (coach.length) {
    return (
      Math.round(coach.reduce((s, c) => s + c.lastIcaoLevel, 0) / coach.length * 10) / 10
    );
  }
  return 3.5;
}

export function buildExamReadiness(): ExamReadiness {
  const insights = buildDifficultyInsights(5);
  const trends = buildAllTrends(14);
  const part1Trend = trends.find((t) => t.area === "part1");
  const practicedCards = Object.keys(loadPart1CoachHistory()).length;
  const coverage = clamp((practicedCards / Math.max(CARDS.length, 1)) * 100);

  const byArea = Object.fromEntries(
    insights.map((i) => [i.area, i.score ?? 50]),
  ) as Record<string, number>;

  const ranked = insights.filter((i) => i.score != null).sort((a, b) => (a.score ?? 0) - (b.score ?? 0));

  return {
    coverage,
    confidence: avgConfidence(),
    pronunciation: byArea.pronunciation ?? 50,
    vocabulary: byArea.vocabulary ?? 50,
    fluency: clamp(((byArea.part1 ?? 50) + (byArea.part2 ?? 50)) / 2),
    interaction: byArea.part2 ?? 50,
    structure: byArea.part1 ?? 50,
    weakestTopic: ranked[0]?.label ?? "Part 2",
    strongestTopic: ranked[ranked.length - 1]?.label ?? "Part 1",
    estimatedIcao: estimatedIcao(),
    daysRemaining: daysUntilExam(),
    trendDelta: part1Trend?.delta ?? null,
  };
}
