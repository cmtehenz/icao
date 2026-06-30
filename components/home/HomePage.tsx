"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAuth } from "@/components/AuthProvider";
import VaultWeakWordsPanel from "@/components/account/VaultWeakWordsPanel";
import StudyAgenda from "@/components/study/StudyAgenda";
import StudyWeeklyReport from "@/components/study/StudyWeeklyReport";
import { useStudyAgenda } from "@/hooks/useStudyAgenda";
import { isAgendaTaskDone } from "@/lib/studyAgenda";
import { resolveAgendaLink } from "@/lib/studyAgendaLinks";
import { studyDayGoalPoints, studyDayPoints, studyDayRemainingPoints } from "@/lib/studyTime";

const QUICK_LINKS = [
  { href: "/part1", label: "Part 1", desc: "Aviation topics", icon: "✈" },
  { href: "/part2", label: "Part 2", desc: "Readback & interaction", icon: "📡" },
  { href: "/pronunciation", label: "Pronúncia", desc: "Banco de palavras", icon: "🎤" },
  { href: "/vocabulario", label: "Vocabulário", desc: "SRS + shadowing", icon: "📚" },
] as const;

export default function HomePage() {
  const { user, loading } = useAuth();
  const { agenda, today, progress, mode } = useStudyAgenda();

  const goalPoints = studyDayGoalPoints(mode);
  const totalPoints = studyDayPoints(today);
  const remaining = studyDayRemainingPoints(today, mode);

  const nextTask = useMemo(
    () => agenda.tasks.find((task) => !isAgendaTaskDone(task, today)),
    [agenda.tasks, today],
  );

  const nextHref = nextTask ? resolveAgendaLink(nextTask.linkTarget) : "/part1";
  const firstName = user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "piloto";

  if (loading) {
    return (
      <div className="wrap home-page">
        <p>Carregando…</p>
      </div>
    );
  }

  return (
    <div className="wrap home-page">
      <header className="home-hero">
        <div>
          <h1>Olá, {firstName}</h1>
          <p className="sub hero-sub-compact">{agenda.subtitle}</p>
        </div>
        <div className="home-hero-stats">
          <span className={`home-points-pill ${progress.globalGoalMet ? "done" : ""}`}>
            {totalPoints} / {goalPoints} pts
          </span>
          <span className="home-tasks-pill">
            {progress.tasksDone}/{progress.tasksTotal} tarefas
          </span>
        </div>
      </header>

      <section className="home-continue-card">
        {progress.globalGoalMet && progress.agendaComplete ? (
          <>
            <strong>Meta de hoje completa ✓</strong>
            <p>Ótimo trabalho — revise ou avance no Part 1/2.</p>
            <Link href="/part1" className="btn purple">
              Abrir Part 1 →
            </Link>
          </>
        ) : (
          <>
            <strong>{nextTask ? nextTask.title : "Agenda de hoje"}</strong>
            <p>
              {remaining > 0
                ? `Faltam ${remaining} pts para a meta${nextTask ? ` · ${nextTask.hint}` : ""}`
                : "Quase na meta — mais uma sessão curta."}
            </p>
            <Link href={nextHref} className="btn purple btn-large">
              {nextTask ? "Continuar treino →" : "Ir para Part 1 →"}
            </Link>
          </>
        )}
      </section>

      <StudyAgenda compact showWeek={false} />

      <VaultWeakWordsPanel limit={3} />

      <details className="home-weekly-details">
        <summary>Relatório desta semana</summary>
        <StudyWeeklyReport />
      </details>

      <section className="home-quick-links" aria-label="Atalhos de treino">
        <h2>Treinar</h2>
        <div className="home-quick-grid">
          {QUICK_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="home-quick-card">
              <span className="home-quick-icon" aria-hidden>
                {item.icon}
              </span>
              <strong>{item.label}</strong>
              <span>{item.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      <p className="home-account-link">
        <Link href="/conta">Calendário, histórico de notas e conta →</Link>
      </p>
    </div>
  );
}
