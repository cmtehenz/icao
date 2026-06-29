"use client";

import { useDailyStudyTime } from "@/hooks/useDailyStudyTime";
import {
  STUDY_ACTIVITY_LABELS,
  STUDY_ACTIVITY_ORDER,
  STUDY_ACTIVITY_POINTS,
  STUDY_DAILY_GOAL_POINTS,
  studyActivityPoints,
  studyDayGoalMet,
  studyDayPoints,
  studyProgressPercent,
  studyStreak,
  type StudyActivity,
} from "@/lib/studyTime";

type Props = {
  highlight?: StudyActivity | "all";
  compact?: boolean;
};

function GoalRow({
  label,
  count,
  points,
  weight,
  highlight,
}: {
  label: string;
  count: number;
  points: number;
  weight: number;
  highlight: boolean;
}) {
  const pct = studyProgressPercent(points, STUDY_DAILY_GOAL_POINTS);
  const countLabel = count === 1 ? "1 feito" : `${count} feitos`;
  return (
    <div className={`daily-study-row ${highlight ? "highlight" : ""} ${points > 0 ? "has-points" : ""}`}>
      <div className="daily-study-row-head">
        <span className="daily-study-label">
          {label}
          <small className="daily-study-weight">×{weight} pt{weight > 1 ? "s" : ""}</small>
        </span>
        <span className="daily-study-clock">
          {countLabel} · <strong>{points} pts</strong>
        </span>
      </div>
      <div className="daily-study-bar" aria-hidden>
        <div className="daily-study-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function DailyStudyGoal({ highlight = "all", compact = false }: Props) {
  const today = useDailyStudyTime();
  const totalPoints = studyDayPoints(today);
  const allDone = studyDayGoalMet(today);
  const streak = studyStreak();

  return (
    <section
      className={`daily-study-goal ${compact ? "compact sheet" : ""}`}
      aria-label="Meta diária de estudo"
    >
      {!compact && (
        <header className="daily-study-head">
          <div>
            <strong>Meta de hoje</strong>
            <span>Pontos por atividade — meta ~30 min/dia</span>
          </div>
          <div className="daily-study-head-side">
            {streak > 0 && (
              <span className="daily-study-streak">{streak} dia{streak > 1 ? "s" : ""} seguidos ✓</span>
            )}
            <span className={`daily-study-total ${allDone ? "done" : ""}`}>
              {totalPoints} / {STUDY_DAILY_GOAL_POINTS} pts
            </span>
          </div>
        </header>
      )}

      {compact && (
        <p className="daily-study-sheet-total">
          Total: <strong className={allDone ? "done" : ""}>{totalPoints}</strong>
          <span> / {STUDY_DAILY_GOAL_POINTS} pts</span>
        </p>
      )}

      {STUDY_ACTIVITY_ORDER.map((activity) => (
        <GoalRow
          key={activity}
          label={STUDY_ACTIVITY_LABELS[activity]}
          count={today[activity]}
          points={studyActivityPoints(activity, today[activity])}
          weight={STUDY_ACTIVITY_POINTS[activity]}
          highlight={highlight === "all" || highlight === activity}
        />
      ))}

      {!compact && (
        <p className="daily-study-hint">
          <strong>Dia leve (12 pts):</strong> 1 pergunta Part 1 + 4 blocos shadow + 1 pronúncia + 2
          vocabulário. <strong>Part 2 completo</strong> também fecha a meta (12 pts).
        </p>
      )}
    </section>
  );
}
