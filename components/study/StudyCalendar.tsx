"use client";

import { useEffect, useMemo, useState } from "react";
import { loadStudyPlanMode, STUDY_PLAN_CHANGE_EVENT } from "@/lib/studyAgenda";
import {
  buildStudyCalendar,
  STUDY_ACTIVITY_LABELS,
  STUDY_ACTIVITY_POINTS,
  STUDY_ACTIVITY_ORDER,
  STUDY_DAILY_GOAL_POINTS,
  STUDY_TIME_CHANGE_EVENT,
  studyActivityPoints,
  studyDayGoalPoints,
  studyDaysThisMonth,
  studyStreak,
  type StudyCalendarCell,
} from "@/lib/studyTime";

const WEEKDAY_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];

const DISPLAY_ACTIVITIES = STUDY_ACTIVITY_ORDER.filter((key) => key !== "simulate");

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

function dayAriaLabel(day: StudyCalendarCell, goalPoints: number): string {
  const parts = DISPLAY_ACTIVITIES.filter((key) => day[key] > 0).map(
    (key) => `${STUDY_ACTIVITY_LABELS[key]} ${day[key]}`,
  );
  return `${formatDateLabel(day.date)}: ${parts.length ? parts.join(", ") : "nada"} — ${day.points}/${goalPoints} pts`;
}

export default function StudyCalendar() {
  const [mode, setMode] = useState(loadStudyPlanMode);
  const [cells, setCells] = useState<StudyCalendarCell[]>(() => buildStudyCalendar(26, mode));
  const [active, setActive] = useState<StudyCalendarCell | null>(null);
  const goalPoints = studyDayGoalPoints(mode);

  const refresh = () => {
    const currentMode = loadStudyPlanMode();
    setMode(currentMode);
    setCells(buildStudyCalendar(26, currentMode));
  };

  useEffect(() => {
    refresh();
    window.addEventListener(STUDY_TIME_CHANGE_EVENT, refresh);
    window.addEventListener(STUDY_PLAN_CHANGE_EVENT, refresh);
    return () => {
      window.removeEventListener(STUDY_TIME_CHANGE_EVENT, refresh);
      window.removeEventListener(STUDY_PLAN_CHANGE_EVENT, refresh);
    };
  }, []);

  const weeks = useMemo(() => chunkWeeks(cells), [cells]);
  const streak = studyStreak(undefined, mode);
  const studiedDays = studyDaysThisMonth();

  return (
    <section className="study-calendar" aria-label="Calendário de estudo">
      <header className="study-calendar-head">
        <div>
          <h2>Histórico de estudo</h2>
          <p className="study-calendar-sub">
            Estilo GitHub — verde = mais pontos. Meta padrão: {STUDY_DAILY_GOAL_POINTS} pts/dia (dia bom:
            45 pts).
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
                aria-label={dayAriaLabel(day, goalPoints)}
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
          <span className="study-calendar-detail-total">
            {active.points} / {goalPoints} pts
          </span>
          {DISPLAY_ACTIVITIES.map((key) =>
            active[key] > 0 ? (
              <span key={key}>
                {STUDY_ACTIVITY_LABELS[key]}: {active[key]}×{STUDY_ACTIVITY_POINTS[key]} ={" "}
                {studyActivityPoints(key, active[key])} pts
              </span>
            ) : null,
          )}
          <span className={active.goalMet ? "study-cal-met" : "study-cal-pending"}>
            {active.goalMet ? "Meta do dia completa ✓" : "Meta do dia incompleta"}
          </span>
        </div>
      )}
    </section>
  );
}
