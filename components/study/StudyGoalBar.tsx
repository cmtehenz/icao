"use client";

import { useEffect, useState } from "react";
import DailyStudyGoal from "@/components/study/DailyStudyGoal";
import { useDailyStudyTime } from "@/hooks/useDailyStudyTime";
import {
  STUDY_ACTIVITY_ORDER,
  STUDY_DAILY_GOAL_POINTS,
  studyActivityPoints,
  studyDayGoalMet,
  studyDayPoints,
  studyDayRemaining,
  studyProgressPercent,
  studyStreak,
} from "@/lib/studyTime";

export default function StudyGoalSheet({ onClose }: { onClose: () => void }) {
  const streak = studyStreak();

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="study-goal-sheet-backdrop" onClick={onClose} role="presentation">
      <div
        className="study-goal-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Meta diária de estudo"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="study-goal-sheet-handle" aria-hidden />
        <header className="study-goal-sheet-head">
          <h2>Meta de hoje</h2>
          <button type="button" className="btn icon-btn secondary" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </header>
        <DailyStudyGoal highlight="all" compact />
        {streak > 0 && (
          <p className="study-goal-sheet-streak">
            Sequência: {streak} dia{streak > 1 ? "s" : ""} com meta completa
          </p>
        )}
      </div>
    </div>
  );
}

export function StudyGoalBar() {
  const [open, setOpen] = useState(false);
  const today = useDailyStudyTime();
  const totalPoints = studyDayPoints(today);
  const remaining = studyDayRemaining(today);
  const allDone = studyDayGoalMet(today);

  return (
    <>
      <button
        type="button"
        className="study-goal-bar"
        onClick={() => setOpen(true)}
        aria-label={
          allDone
            ? `Meta de hoje completa: ${totalPoints} pontos`
            : `Meta de estudo hoje: ${totalPoints} de ${STUDY_DAILY_GOAL_POINTS} pontos, faltam ${remaining}`
        }
      >
        <span className="study-goal-bar-label">Hoje</span>
        <div className="study-goal-bar-split study-goal-bar-split-4" aria-hidden>
          {STUDY_ACTIVITY_ORDER.map((activity) => {
            const points = studyActivityPoints(activity, today[activity]);
            const pct = studyProgressPercent(points, STUDY_DAILY_GOAL_POINTS);
            return (
              <div
                key={activity}
                className={`study-goal-segment study-goal-${activity} ${points > 0 ? "has-points" : ""}`}
              >
                <div className="study-goal-segment-fill" style={{ width: `${pct}%` }} />
              </div>
            );
          })}
        </div>
        <span className="study-goal-bar-meta">
          <span className={`study-goal-bar-time ${allDone ? "done" : ""}`}>
            {allDone ? `${totalPoints}✓` : `${totalPoints}/${STUDY_DAILY_GOAL_POINTS}`}
          </span>
          <span className="study-goal-bar-chevron" aria-hidden>›</span>
        </span>
      </button>
      {open && <StudyGoalSheet onClose={() => setOpen(false)} />}
    </>
  );
}
