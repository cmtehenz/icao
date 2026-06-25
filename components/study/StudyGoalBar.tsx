"use client";

import { useEffect, useState } from "react";
import DailyStudyGoal from "@/components/study/DailyStudyGoal";
import { useDailyStudyTime } from "@/hooks/useDailyStudyTime";
import {
  formatStudyClock,
  STUDY_GOAL_SECONDS,
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
        <DailyStudyGoal highlight="both" compact />
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
  const { part1, part2 } = useDailyStudyTime();
  const total = part1 + part2;
  const part1Pct = studyProgressPercent(part1);
  const part2Pct = studyProgressPercent(part2);
  const part1Done = part1 >= STUDY_GOAL_SECONDS;
  const part2Done = part2 >= STUDY_GOAL_SECONDS;

  return (
    <>
      <button
        type="button"
        className="study-goal-bar"
        onClick={() => setOpen(true)}
        aria-label={`Meta de estudo hoje: ${formatStudyClock(total)} de 2 horas`}
      >
        <span className="study-goal-bar-label">Hoje</span>
        <div className="study-goal-bar-split" aria-hidden>
          <div className={`study-goal-half ${part1Done ? "done" : ""}`}>
            <div className="study-goal-half-fill" style={{ width: `${part1Pct}%` }} />
          </div>
          <div className={`study-goal-half ${part2Done ? "done" : ""}`}>
            <div className="study-goal-half-fill" style={{ width: `${part2Pct}%` }} />
          </div>
        </div>
        <span className="study-goal-bar-meta">
          <span className="study-goal-bar-time">{formatStudyClock(total)}</span>
          <span className="study-goal-bar-chevron" aria-hidden>›</span>
        </span>
      </button>
      {open && <StudyGoalSheet onClose={() => setOpen(false)} />}
    </>
  );
}
