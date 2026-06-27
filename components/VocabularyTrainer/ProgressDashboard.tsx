"use client";

import type { DailyMissionStats } from "@/utils/spacedRepetition";

type Props = {
  mission: DailyMissionStats;
  total: number;
  mastered: number;
};

export default function ProgressDashboard({ mission, total, mastered }: Props) {
  return (
    <section className="vocab-mission-dashboard" aria-label="Daily mission">
      <h2 className="vocab-mission-title">Daily Mission</h2>
      <div className="delta-dashboard pronunciation-dashboard vocab-mission-grid">
        <div className="delta-stat">
          <strong>{mission.wordsToday}</strong>
          <span>words today</span>
        </div>
        <div className="delta-stat learning">
          <strong>{mission.phrasesToday}</strong>
          <span>phrases today</span>
        </div>
        <div className="delta-stat">
          <strong>{mission.averageScoreToday || "—"}</strong>
          <span>avg score</span>
        </div>
        <div className="delta-stat mastered">
          <strong>{mission.streak}</strong>
          <span>day streak</span>
        </div>
        <div className="delta-stat difficult">
          <strong>{mission.dueToday}</strong>
          <span>due reviews</span>
        </div>
        <div className="delta-stat mastered">
          <strong>{mastered}/{total}</strong>
          <span>mastered</span>
        </div>
      </div>
    </section>
  );
}
