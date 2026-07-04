import { loadInstructorMemory } from "@/lib/flightInstructor/memory";
import { loadCaptainDeltaMemory, saveCaptainDeltaMemory } from "@/lib/captainDelta/memory/store";
import type { WeeklyFlightDebrief } from "@/lib/captainDelta/memory/types";
import { buildAllTrends } from "@/lib/scoreHistory";
import { buildDifficultyInsights } from "@/lib/difficultyInsights";
import { loadStudyDays, studyDayMinutes, todayKey } from "@/lib/studyTime";

function weekStartKey(): string {
  const d = new Date(`${todayKey()}T12:00:00`);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  return d.toISOString().slice(0, 10);
}

function datesSince(start: string): string[] {
  const keys: string[] = [];
  const end = new Date(`${todayKey()}T12:00:00`);
  const cur = new Date(`${start}T12:00:00`);
  while (cur <= end) {
    keys.push(cur.toISOString().slice(0, 10));
    cur.setDate(cur.getDate() + 1);
  }
  return keys;
}

export function buildWeeklyFlightDebrief(): WeeklyFlightDebrief {
  const start = weekStartKey();
  const weekDates = datesSince(start);
  const sessions = loadInstructorMemory().sessions.filter((s) => weekDates.includes(s.date));
  const store = loadCaptainDeltaMemory();
  const trends = buildAllTrends(14);
  const insights = buildDifficultyInsights(4);

  let speakingMinutes = 0;
  const studyDays = loadStudyDays();
  for (const date of weekDates) {
    const day = studyDays[date];
    if (day) speakingMinutes += studyDayMinutes(day);
  }
  speakingMinutes += sessions.length * 3;

  const improved = trends
    .filter((t) => t.direction === "up" && t.delta != null)
    .sort((a, b) => (b.delta ?? 0) - (a.delta ?? 0))[0];

  const weakest = insights.filter((i) => i.score != null).sort((a, b) => (a.score ?? 0) - (b.score ?? 0))[0];

  const icaoHist = store.estimatedIcaoHistory.filter((h) => weekDates.includes(h.date));
  const from = icaoHist[0]?.level ?? store.estimatedIcaoHistory[0]?.level ?? 3.5;
  const to = icaoHist[icaoHist.length - 1]?.level ?? from;

  const confRecent = store.confidenceLog.filter((c) => c.at.slice(0, 10) >= start);
  const confScore = (l: string) => (l === "very_confident" ? 100 : l === "confident" ? 70 : 35);
  const confAvg =
    confRecent.length > 0
      ? confRecent.reduce((s, c) => s + confScore(c.level), 0) / confRecent.length
      : null;

  const best = [...store.bestAnswers].sort((a, b) => b.score - a.score)[0] ?? null;

  return {
    weekLabel: `Week of ${start}`,
    questionsAnswered: sessions.length,
    speakingMinutes,
    mostImproved: improved?.label ?? "Consistency",
    needsAttention: weakest?.label ?? "Part 2",
    bestAnswer: best ? { label: best.label, score: best.score } : null,
    confidenceDelta: confAvg != null ? Math.round(confAvg - 55) : null,
    estimatedIcaoFrom: from,
    estimatedIcaoTo: to,
    missionNextWeek: [
      weakest?.items[0]?.label ?? "Weather",
      "Emergency",
      "Examples in every answer",
    ],
  };
}

export function shouldShowWeeklyDebrief(): boolean {
  const store = loadCaptainDeltaMemory();
  const start = weekStartKey();
  if (store.lastWeeklyDebriefAt === start) return false;
  const day = new Date().getDay();
  return day === 1 || day === 0;
}

export function markWeeklyDebriefShown(): void {
  const store = loadCaptainDeltaMemory();
  saveCaptainDeltaMemory({ ...store, lastWeeklyDebriefAt: weekStartKey() });
}
