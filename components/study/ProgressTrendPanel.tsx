"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildAllTrends,
  loadScoreHistory,
  recordScoreSnapshot,
  SCORE_HISTORY_CHANGE_EVENT,
  trendDirectionLabel,
  type TrendPoint,
  type TrendSummary,
} from "@/lib/scoreHistory";
import { backfillScoreHistoryFromSimulado } from "@/lib/scoreHistoryBackfill";
import { buildDifficultyInsights } from "@/lib/difficultyInsights";
import { todayKey } from "@/lib/studyTime";
import { PART1_COACH_HISTORY_EVENT } from "@/lib/part1CoachHistory";
import { PART2_PROGRESS_EVENT } from "@/lib/part2/progress";
import { VAULT_CHANGE_EVENT } from "@/lib/pronunciationVault";
import { VOCAB_DAILY_MISSION_EVENT } from "@/lib/vocabDailyMission";

function Sparkline({ series }: { series: TrendPoint[] }) {
  const width = 140;
  const height = 40;
  const points = series.filter((p) => p.score != null);

  if (points.length < 2) {
    return <span className="progress-spark-empty">poucos dados</span>;
  }

  const segments: string[] = [];
  let current: string[] = [];

  for (let i = 0; i < series.length; i += 1) {
    const pt = series[i]!;
    if (pt.score == null) {
      if (current.length >= 2) segments.push(current.join(" "));
      current = [];
      continue;
    }
    const x = series.length <= 1 ? 0 : (i / (series.length - 1)) * width;
    const y = height - (pt.score / 100) * (height - 4) - 2;
    current.push(`${x},${y}`);
  }
  if (current.length >= 2) segments.push(current.join(" "));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="progress-sparkline"
      aria-hidden
    >
      {segments.map((seg, idx) => (
        <polyline
          key={idx}
          points={seg}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ))}
      {points.map((pt) => {
        const idx = series.findIndex((s) => s.date === pt.date);
        const x = series.length <= 1 ? 0 : (idx / (series.length - 1)) * width;
        const y = height - (pt.score! / 100) * (height - 4) - 2;
        return <circle key={pt.date} cx={x} cy={y} r="2.5" className="progress-spark-dot" />;
      })}
    </svg>
  );
}

function TrendCard({ trend }: { trend: TrendSummary }) {
  const hasData = trend.series.some((p) => p.score != null);
  const dirClass =
    trend.direction === "up"
      ? "up"
      : trend.direction === "down"
        ? "down"
        : trend.direction === "flat"
          ? "flat"
          : "unknown";

  return (
    <article className={`progress-trend-card ${dirClass}`}>
      <div className="progress-trend-card-head">
        <strong>{trend.label}</strong>
        <span className={`progress-trend-badge ${dirClass}`}>
          {trendDirectionLabel(trend.direction, trend.delta)}
        </span>
      </div>
      {trend.recentAvg != null && (
        <p className="progress-trend-avg">
          Média 7 dias: <strong>{trend.recentAvg}%</strong>
          {trend.priorAvg != null && (
            <span className="progress-trend-prior"> · semana anterior {trend.priorAvg}%</span>
          )}
        </p>
      )}
      {hasData ? (
        <Sparkline series={trend.series} />
      ) : (
        <p className="progress-trend-empty">Grave no Coach / simulação para ver evolução aqui.</p>
      )}
    </article>
  );
}

export default function ProgressTrendPanel() {
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    backfillScoreHistoryFromSimulado();
    const store = loadScoreHistory();
    if (!Object.keys(store.days).length) {
      const insights = buildDifficultyInsights(8);
      const today = todayKey();
      const part1 = insights.find((i) => i.area === "part1")?.score;
      const part2 = insights.find((i) => i.area === "part2")?.score;
      const pron = insights.find((i) => i.area === "pronunciation")?.score;
      const vocab = insights.find((i) => i.area === "vocabulary")?.score;
      if (part1 != null) recordScoreSnapshot("part1", part1, today);
      if (part2 != null) recordScoreSnapshot("part2", part2, today);
      if (pron != null) recordScoreSnapshot("pronunciation", pron, today);
      if (vocab != null) recordScoreSnapshot("vocabulary", vocab, today);
    }
  }, []);

  useEffect(() => {
    const events = [
      SCORE_HISTORY_CHANGE_EVENT,
      PART1_COACH_HISTORY_EVENT,
      PART2_PROGRESS_EVENT,
      VAULT_CHANGE_EVENT,
      VOCAB_DAILY_MISSION_EVENT,
      "icao-simulado-change",
    ];
    for (const ev of events) window.addEventListener(ev, refresh);
    return () => {
      for (const ev of events) window.removeEventListener(ev, refresh);
    };
  }, [refresh]);

  const trends = useMemo(() => buildAllTrends(14), [tick]);
  const improving = trends.filter((t) => t.direction === "up").length;
  const declining = trends.filter((t) => t.direction === "down").length;

  return (
    <section className="progress-trends-panel" aria-label="Evolução de desempenho">
      <header className="progress-trends-head">
        <div>
          <h3>Sua evolução</h3>
          <p className="progress-trends-sub">
            Últimos 14 dias — compara esta semana com a anterior. Cada gravação no Coach, Part 2 e
            pronúncia alimenta o gráfico.
          </p>
        </div>
        {(improving > 0 || declining > 0) && (
          <p className="progress-trends-summary">
            {improving > 0 && `${improving} área${improving > 1 ? "s" : ""} melhorando`}
            {improving > 0 && declining > 0 && " · "}
            {declining > 0 && `${declining} precisando atenção`}
          </p>
        )}
      </header>
      <div className="progress-trends-grid">
        {trends.map((trend) => (
          <TrendCard key={trend.area} trend={trend} />
        ))}
      </div>
    </section>
  );
}
