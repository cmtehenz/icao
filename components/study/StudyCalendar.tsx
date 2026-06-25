"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildStudyCalendar,
  formatStudyClock,
  STUDY_GOAL_SECONDS,
  STUDY_TIME_CHANGE_EVENT,
  studyDaysThisMonth,
  studyStreak,
  type StudyCalendarCell,
} from "@/lib/studyTime";

const WEEKDAY_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];

function formatDateLabel(date: string): string {
  const parsed = new Date(`${date}T12:00:00`);
  return parsed.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function chunkWeeks(cells: StudyCalendarCell[]): StudyCalendarCell[][] {
  const weeks: StudyCalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export default function StudyCalendar() {
  const [cells, setCells] = useState<StudyCalendarCell[]>(() => buildStudyCalendar(26));
  const [active, setActive] = useState<StudyCalendarCell | null>(null);

  useEffect(() => {
    const refresh = () => setCells(buildStudyCalendar(26));
    window.addEventListener(STUDY_TIME_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(STUDY_TIME_CHANGE_EVENT, refresh);
  }, []);

  const weeks = useMemo(() => chunkWeeks(cells), [cells]);
  const streak = studyStreak();
  const studiedDays = studyDaysThisMonth();

  return (
    <section className="study-calendar" aria-label="Calendário de estudo">
      <header className="study-calendar-head">
        <div>
          <h2>Histórico de estudo</h2>
          <p className="study-calendar-sub">
            Estilo GitHub — verde = mais tempo. Meta: 1h Part 1 + 1h Part 2 por dia.
          </p>
        </div>
        <div className="study-calendar-stats">
          <span className="study-calendar-stat">
            <strong>{streak}</strong>
            <small>sequência</small>
          </span>
          <span className="study-calendar-stat">
            <strong>{studiedDays}</strong>
            <small>dias no mês</small>
          </span>
        </div>
      </header>

      <div className="study-calendar-scroll">
        <div className="study-calendar-weekdays" aria-hidden>
          {WEEKDAY_LABELS.map((label, i) => (
            <span key={`${label}-${i}`}>{label}</span>
          ))}
        </div>
        <div
          className="study-calendar-grid"
          style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(10px, 1fr))` }}
        >
          {weeks.map((week) =>
            week.map((day) => (
              <button
                key={day.date}
                type="button"
                className={`study-cal-cell level-${day.level}${day.goalMet ? " goal-met" : ""}`}
                aria-label={`${formatDateLabel(day.date)}: Part 1 ${formatStudyClock(day.part1)}, Part 2 ${formatStudyClock(day.part2)}`}
                onClick={() => setActive(day)}
              />
            )),
          )}
        </div>
      </div>

      <div className="study-calendar-legend" aria-hidden>
        <span>Menos</span>
        <span className="study-cal-cell level-0" />
        <span className="study-cal-cell level-1" />
        <span className="study-cal-cell level-2" />
        <span className="study-cal-cell level-3" />
        <span className="study-cal-cell level-4" />
        <span>Mais</span>
      </div>

      {active && (
        <div className="study-calendar-detail">
          <strong>{formatDateLabel(active.date)}</strong>
          <span>
            Part 1: {formatStudyClock(active.part1)} / {formatStudyClock(STUDY_GOAL_SECONDS)}
          </span>
          <span>
            Part 2: {formatStudyClock(active.part2)} / {formatStudyClock(STUDY_GOAL_SECONDS)}
          </span>
          <span className={active.goalMet ? "study-cal-met" : "study-cal-pending"}>
            {active.goalMet ? "Meta do dia completa ✓" : "Meta do dia incompleta"}
          </span>
        </div>
      )}
    </section>
  );
}
