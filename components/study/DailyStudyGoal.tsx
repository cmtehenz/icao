"use client";

import { useDailyStudyTime } from "@/hooks/useDailyStudyTime";
import { loadStudyPlanMode } from "@/lib/studyAgenda";
import {
  STUDY_ACTIVITY_LABELS,
  STUDY_ACTIVITY_POINTS,
  studyActivityPoints,
  studyDayGoalMet,
  studyDayGoalPoints,
  studyDayPoints,
  studyProgressPercent,
  studyStreak,
  type StudyActivity,
} from "@/lib/studyTime";

const DISPLAY_ACTIVITIES: StudyActivity[] = [
  "shadow",
  "shadowPart2",
  "pronunciation",
  "vocabulary",
];

type Props = {
  highlight?: StudyActivity | "all";
  compact?: boolean;
};

function GoalRow({
  label,
  count,
  points,
  weight,
  goalPoints,
  highlight,
}: {
  label: string;
  count: number;
  points: number;
  weight: number;
  goalPoints: number;
  highlight: boolean;
}) {
  const pct = studyProgressPercent(points, goalPoints);
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
  const mode = loadStudyPlanMode();
  const goalPoints = studyDayGoalPoints(mode);
  const totalPoints = studyDayPoints(today);
  const allDone = studyDayGoalMet(today, mode);
  const streak = studyStreak(undefined, mode);

  return (
    <section
      className={`daily-study-goal ${compact ? "compact sheet" : ""}`}
      aria-label="Meta diária de estudo"
    >
      {!compact && (
        <header className="daily-study-head">
          <div>
            <strong>Meta de hoje</strong>
            <span>
              {mode === "intense"
                ? "Dia bom — 45 pts (shadow + pronúncia + vocabulário)"
                : "Padrão — 20 pts por dia"}
            </span>
          </div>
          <div className="daily-study-head-side">
            {streak > 0 && (
              <span className="daily-study-streak">{streak} dia{streak > 1 ? "s" : ""} seguidos ✓</span>
            )}
            <span className={`daily-study-total ${allDone ? "done" : ""}`}>
              {totalPoints} / {goalPoints} pts
            </span>
          </div>
        </header>
      )}

      {compact && (
        <p className="daily-study-sheet-total">
          Total: <strong className={allDone ? "done" : ""}>{totalPoints}</strong>
          <span> / {goalPoints} pts</span>
        </p>
      )}

      {DISPLAY_ACTIVITIES.map((activity) => (
        <GoalRow
          key={activity}
          label={STUDY_ACTIVITY_LABELS[activity]}
          count={today[activity]}
          points={studyActivityPoints(activity, today[activity])}
          weight={STUDY_ACTIVITY_POINTS[activity]}
          goalPoints={goalPoints}
          highlight={highlight === "all" || highlight === activity}
        />
      ))}

      {!compact && (
        <p className="daily-study-hint">
          Fase atual: <strong>shadow</strong> (Part 1 e Part 2), <strong>pronúncia</strong> e{" "}
          <strong>vocabulário</strong> — sem simulado. Marque &quot;Dia bom&quot; quando quiser meta de 45 pts.
        </p>
      )}
    </section>
  );
}
