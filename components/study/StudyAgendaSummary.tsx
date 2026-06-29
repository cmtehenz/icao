"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useStudyAgenda } from "@/hooks/useStudyAgenda";
import { isAgendaTaskDone } from "@/lib/studyAgenda";
import { resolveAgendaLink } from "@/lib/studyAgendaLinks";
import { studyDayGoalPoints, studyDayPoints, studyDayRemainingPoints } from "@/lib/studyTime";

export default function StudyAgendaSummary() {
  const { agenda, today, progress, mode } = useStudyAgenda();
  const goalPoints = studyDayGoalPoints(mode);
  const totalPoints = studyDayPoints(today);
  const remaining = studyDayRemainingPoints(today, mode);

  const nextTask = useMemo(
    () => agenda.tasks.find((task) => !isAgendaTaskDone(task, today)),
    [agenda.tasks, today],
  );

  const nextHref = nextTask ? resolveAgendaLink(nextTask.linkTarget) : "/conta";

  if (progress.globalGoalMet && progress.agendaComplete) {
    return (
      <section className="study-agenda-summary-banner done" aria-label="Meta de hoje">
        <div>
          <strong>Meta de hoje completa ✓</strong>
          <span>{totalPoints} / {goalPoints} pts</span>
        </div>
        <Link href="/conta" className="study-agenda-summary-link">
          Ver agenda
        </Link>
      </section>
    );
  }

  return (
    <section className="study-agenda-summary-banner" aria-label="Próxima tarefa de hoje">
      <div>
        <strong>
          {remaining > 0 ? `Faltam ${remaining} pts` : "Quase lá"}
        </strong>
        <span>
          {totalPoints}/{goalPoints} pts
          {nextTask ? ` · ${nextTask.title}` : " · agenda completa"}
        </span>
      </div>
      {nextTask && (
        <Link href={nextHref} className="study-agenda-summary-link">
          Ir fazer →
        </Link>
      )}
    </section>
  );
}
