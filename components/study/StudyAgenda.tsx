"use client";

import Link from "next/link";
import { useStudyAgenda } from "@/hooks/useStudyAgenda";
import {
  activityPointLabel,
  agendaTaskProgress,
  type StudyAgendaTask,
} from "@/lib/studyAgenda";
import { studyActivityPoints } from "@/lib/studyTime";
import type { StudyDayRecord } from "@/lib/studyTime";

type Props = {
  compact?: boolean;
  showWeek?: boolean;
};

function TaskRow({
  task,
  day,
  compact,
}: {
  task: StudyAgendaTask;
  day: StudyDayRecord;
  compact?: boolean;
}) {
  const { done, target, complete } = agendaTaskProgress(task, day);
  const points = studyActivityPoints(task.activity, target);

  return (
    <li className={`study-agenda-task ${complete ? "done" : ""}`}>
      <div className="study-agenda-task-check" aria-hidden>
        {complete ? "✓" : ""}
      </div>
      <div className="study-agenda-task-body">
        <div className="study-agenda-task-head">
          <strong>{task.title}</strong>
          <span className="study-agenda-task-meta">
            {complete ? (
              <span className="study-agenda-task-pts">{points} pts</span>
            ) : (
              <span>
                {done}/{target} · {points} pts
              </span>
            )}
            {!compact && <span className="study-agenda-task-time">~{task.minutes} min</span>}
          </span>
        </div>
        {!compact && <p className="study-agenda-task-hint">{task.hint}</p>}
        {!complete && (
          <Link href={task.href} className="study-agenda-task-link">
            Ir fazer →
          </Link>
        )}
      </div>
    </li>
  );
}

export default function StudyAgenda({ compact = false, showWeek = true }: Props) {
  const { mode, setMode, agenda, week, today, progress } = useStudyAgenda();

  return (
    <section className={`study-agenda ${compact ? "compact" : ""}`} aria-label="Agenda de estudo">
      <header className="study-agenda-head">
        <div>
          <h2>{compact ? "Agenda de hoje" : agenda.title}</h2>
          <p className="study-agenda-sub">{agenda.subtitle}</p>
        </div>
        <div className="study-agenda-head-side">
          <span className={`study-agenda-progress-pill ${progress.agendaComplete ? "done" : ""}`}>
            {progress.tasksDone}/{progress.tasksTotal} tarefas
          </span>
          <span className="study-agenda-time-pill">~{agenda.estimatedMinutes} min</span>
        </div>
      </header>

      <div className="study-agenda-mode" role="group" aria-label="Intensidade do plano">
        <button
          type="button"
          className={`study-agenda-mode-btn ${mode === "light" ? "active" : ""}`}
          onClick={() => setMode("light")}
        >
          Leve · 8 pts
        </button>
        <button
          type="button"
          className={`study-agenda-mode-btn ${mode === "standard" ? "active" : ""}`}
          onClick={() => setMode("standard")}
        >
          Semanal · 12 pts
        </button>
      </div>

      {showWeek && !compact && (
        <div className="study-agenda-week" aria-label="Plano da semana">
          {week.map((day) => (
            <div
              key={day.date}
              className={`study-agenda-week-day ${day.isToday ? "today" : ""}`}
              title={day.title}
            >
              <span>{day.weekdayLabel}</span>
              <small>{day.goalPoints}p</small>
            </div>
          ))}
        </div>
      )}

      <div className="study-agenda-summary">
        <div className="study-agenda-summary-bar" aria-hidden>
          <div
            className="study-agenda-summary-fill"
            style={{
              width: `${progress.goalPoints > 0 ? Math.round((progress.pointsEarned / progress.goalPoints) * 100) : 0}%`,
            }}
          />
        </div>
        <p className="study-agenda-summary-text">
          {progress.agendaComplete ? (
            <strong className="study-agenda-done">Agenda de hoje completa ✓</strong>
          ) : (
            <>
              <strong>{progress.pointsEarned}</strong> / {progress.goalPoints} pts da agenda
              {progress.remainingMinutes > 0 && (
                <span> · faltam ~{progress.remainingMinutes} min</span>
              )}
            </>
          )}
          {!compact && progress.globalGoalMet && !progress.agendaComplete && (
            <span className="study-agenda-bonus"> Meta global também atingida.</span>
          )}
        </p>
      </div>

      <ol className="study-agenda-tasks">
        {agenda.tasks.map((task) => (
          <TaskRow key={task.id} task={task} day={today} compact={compact} />
        ))}
      </ol>

      {!compact && (
        <p className="study-agenda-foot">
          Cada tarefa marca automaticamente quando você conclui a prática. Pesos: shadow{" "}
          {activityPointLabel("shadow")}, simulado {activityPointLabel("simulate")}, pronúncia{" "}
          {activityPointLabel("pronunciation")}, vocabulário {activityPointLabel("vocabulary")}.
        </p>
      )}
    </section>
  );
}
