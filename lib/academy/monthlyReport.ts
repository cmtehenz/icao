import { buildAllTrends } from "@/lib/scoreHistory";
import { buildDifficultyInsights } from "@/lib/difficultyInsights";
import { loadStudyDays, studyDayMinutes } from "@/lib/studyTime";
import { loadCaptainDeltaMemory } from "@/lib/captainDelta/memory/store";
import type { MonthlyAcademyReport } from "@/lib/academy/types";

export function buildMonthlyAcademyReport(): MonthlyAcademyReport {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthLabel = monthStart.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const days = loadStudyDays();
  let speakingMinutes = 0;
  let vocabSessions = 0;
  const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  for (const [date, day] of Object.entries(days)) {
    if (!date.startsWith(prefix) || !day) continue;
    speakingMinutes += studyDayMinutes(day);
    vocabSessions += day.vocabulary ?? 0;
  }

  const trends = buildAllTrends(30);
  const improved = trends
    .filter((t) => t.direction === "up")
    .sort((a, b) => (b.delta ?? 0) - (a.delta ?? 0))[0];
  const insights = buildDifficultyInsights(4);
  const weakest = insights.filter((i) => i.score != null).sort((a, b) => (a.score ?? 0) - (b.score ?? 0))[0];

  const icaoHist = loadCaptainDeltaMemory().estimatedIcaoHistory.filter((h) =>
    h.date.startsWith(prefix),
  );
  const from = icaoHist[0]?.level ?? 3.5;
  const to = icaoHist[icaoHist.length - 1]?.level ?? from;

  return {
    monthLabel,
    speakingHours: Math.round((speakingMinutes / 60) * 10) / 10,
    vocabularySessions: vocabSessions,
    mostImproved: improved?.label ?? "Consistency",
    weakestArea: weakest?.label ?? "Part 2",
    icaoFrom: from,
    icaoTo: to,
    recommendations: [
      `Focus on ${weakest?.label ?? "Part 2"} next month`,
      improved ? `Keep momentum in ${improved.label}` : "Maintain daily flight missions",
      "One mock exam per week in the final month",
    ],
  };
}
