"use client";

import { useEffect, useState } from "react";
import DailyStudyGoal from "@/components/study/DailyStudyGoal";
import StudyAgenda from "@/components/study/StudyAgenda";
import { useDailyStudyTime } from "@/hooks/useDailyStudyTime";
import { loadStudyPlanMode, STUDY_PLAN_CHANGE_EVENT } from "@/lib/studyAgenda";
import {
  STUDY_ACTIVITY_ORDER,
  studyActivityPoints,
  studyDayGoalMet,
  studyDayGoalPoints,
  studyDayPoints,
  studyDayRemainingPoints,
  studyProgressPercent,
  studyStreak,
  STUDY_TIME_CHANGE_EVENT,
} from "@/lib/studyTime";

const BAR_ACTIVITIES = STUDY_ACTIVITY_ORDER.filter((a) => a !== "simulate");

export default function StudyGoalSheet({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState(loadStudyPlanMode);
  const streak = studyStreak(undefined, mode);

  useEffect(() => {
    const refresh = () => setMode(loadStudyPlanMode());
    window.addEventListener(STUDY_PLAN_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(STUDY_PLAN_CHANGE_EVENT, refresh);
  }, []);

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
        <StudyAgenda compact showWeek={false} />
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
  const [mode, setMode] = useState(loadStudyPlanMode);
  const today = useDailyStudyTime();
  const goalPoints = studyDayGoalPoints(mode);
  const totalPoints = studyDayPoints(today);
  const remaining = studyDayRemainingPoints(today, mode);
  const allDone = studyDayGoalMet(today, mode);

  useEffect(() => {
    const refresh = () => setMode(loadStudyPlanMode());
    window.addEventListener(STUDY_TIME_CHANGE_EVENT, refresh);
    window.addEventListener(STUDY_PLAN_CHANGE_EVENT, refresh);
    return () => {
      window.removeEventListener(STUDY_TIME_CHANGE_EVENT, refresh);
      window.removeEventListener(STUDY_PLAN_CHANGE_EVENT, refresh);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        className="study-goal-bar"
        onClick={() => setOpen(true)}
        aria-label={
          allDone
            ? `Meta de hoje completa: ${totalPoints} pontos`
            : `Estudo hoje: ${totalPoints} de ${goalPoints} pontos, faltam ${remaining}`
        }
      >
        <span className="study-goal-bar-label">Hoje</span>
        <div className="study-goal-bar-split study-goal-bar-split-4" aria-hidden>
          {BAR_ACTIVITIES.map((activity) => {
            const points = studyActivityPoints(activity, today[activity]);
            const pct = studyProgressPercent(points, goalPoints);
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
            {allDone ? `${totalPoints}✓` : `${totalPoints}/${goalPoints}`}
          </span>
          <span className="study-goal-bar-chevron" aria-hidden>›</span>
        </span>
      </button>
      {open && <StudyGoalSheet onClose={() => setOpen(false)} />}
    </>
  );
}
