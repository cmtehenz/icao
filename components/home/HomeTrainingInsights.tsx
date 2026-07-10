"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DailyDebriefPanel from "@/components/FlightInstructor/DailyDebriefPanel";
import ProgressTrendPanel from "@/components/study/ProgressTrendPanel";
import TeacherReportPanel from "@/components/study/TeacherReportPanel";
import { buildDifficultyInsights } from "@/lib/difficultyInsights";
import { DAILY_MISSION_LOG_EVENT } from "@/lib/dailyMissionLog";
import { MISSION_REFRESH_EVENTS } from "@/lib/home/missionRefreshEvents";
import { STUDY_ACTIVITY_RECORDED_EVENT } from "@/lib/studyActivityRecord";

function formatInsightItemScore(item: { score: number; icaoLevel?: number }): string {
  if (item.icaoLevel != null) return `${item.score}% · ICAO ${item.icaoLevel}`;
  return `${item.score}%`;
}

function insightScoreClass(score: number | null | undefined): string {
  if (score == null) return "muted";
  if (score < 60) return "bad";
  if (score < 75) return "warn";
  return "good";
}

/** Secondary training analytics — progressive disclosure on home (ADR-010). */
export default function HomeTrainingInsights() {
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    const events = [...MISSION_REFRESH_EVENTS, STUDY_ACTIVITY_RECORDED_EVENT, DAILY_MISSION_LOG_EVENT];
    for (const ev of events) window.addEventListener(ev, refresh);
    return () => {
      for (const ev of events) window.removeEventListener(ev, refresh);
    };
  }, [refresh]);

  const insights = useMemo(() => buildDifficultyInsights(3, "recent"), [tick]);

  return (
    <div className="home-training-insights" aria-label="Training insights">
      <section className="difficulty-insights">
        <h3>Where to focus next</h3>
        <p className="difficulty-insights-sub">
          Based on your real recordings (last 7 days) — unpracticed items are not shown with artificial 0%.
        </p>
        <div className="difficulty-insights-grid">
          {insights.map((area) => (
            <div key={area.area} className="difficulty-insight-card">
              <div className="difficulty-insight-head">
                <strong>{area.label}</strong>
                <span className={`difficulty-score ${insightScoreClass(area.score)}`}>
                  {area.displayScore ?? (area.score == null ? "—" : `${area.score}%`)}
                </span>
              </div>
              {area.hint && <p className="difficulty-insight-hint">{area.hint}</p>}
              <ul>
                {area.items.length === 0 ? (
                  <li className="difficulty-insight-empty">No practice data yet</li>
                ) : (
                  area.items.map((item) => (
                    <li key={item.id}>
                      <span>{item.label}</span>
                      <span
                        className={`difficulty-item-score ${
                          item.icaoLevel != null ? `icao-l${item.icaoLevel}` : insightScoreClass(item.score)
                        }`}
                      >
                        {formatInsightItemScore(item)}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <TeacherReportPanel />
      <ProgressTrendPanel />
      <DailyDebriefPanel />
    </div>
  );
}
