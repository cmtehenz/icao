"use client";

import Link from "next/link";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import VaultWeakWordsPanel from "@/components/account/VaultWeakWordsPanel";
import DailyMissionPanel from "@/components/study/DailyMissionPanel";
import StudyWeeklyReport from "@/components/study/StudyWeeklyReport";
import {
  getDailyMissionSummary,
  getNextMissionAction,
  isDailyMissionComplete,
} from "@/lib/dailyMission";
import { PART1_DAILY_MISSION_EVENT } from "@/lib/part1DailyMission";
import { PART2_DAILY_MISSION_EVENT } from "@/lib/part2DailyMission";
import { VOCAB_DAILY_MISSION_EVENT } from "@/lib/vocabDailyMission";
import { DAILY_MISSION_LOG_EVENT } from "@/lib/dailyMissionLog";
import { STUDY_ACTIVITY_RECORDED_EVENT } from "@/lib/studyActivityRecord";
import CaptainDeltaPersonalBriefing from "@/components/CaptainDelta/Memory/CaptainDeltaPersonalBriefing";
import CaptainDeltaReadinessPanel from "@/components/CaptainDelta/Memory/CaptainDeltaReadinessPanel";
import CaptainDeltaWeeklyDebriefPanel from "@/components/CaptainDelta/Memory/CaptainDeltaWeeklyDebriefPanel";
import CaptainDeltaQuestionHistoryPanel from "@/components/CaptainDelta/Memory/CaptainDeltaQuestionHistoryPanel";
import CaptainDeltaExamHistoryPanel from "@/components/CaptainDelta/Examiner/CaptainDeltaExamHistoryPanel";
import { useStudyAgenda } from "@/hooks/useStudyAgenda";
import {
  studyDayGoalPoints,
  studyDayPoints,
  studyDayRemainingPoints,
} from "@/lib/studyTime";

const QUICK_LINKS = [
  { href: "/part1", label: "Part 1", desc: "Aviation topics", icon: "✈" },
  { href: "/part2", label: "Part 2", desc: "Readback & interaction", icon: "📡" },
  { href: "/pronunciation", label: "Pronúncia", desc: "Banco de palavras", icon: "🎤" },
  { href: "/vocabulario", label: "Vocabulário", desc: "SRS + shadowing", icon: "📚" },
] as const;

export default function HomePage() {
  const { user, loading } = useAuth();
  const { today, mode } = useStudyAgenda();
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    const events = [
      PART1_DAILY_MISSION_EVENT,
      PART2_DAILY_MISSION_EVENT,
      VOCAB_DAILY_MISSION_EVENT,
      DAILY_MISSION_LOG_EVENT,
      STUDY_ACTIVITY_RECORDED_EVENT,
    ];
    for (const ev of events) window.addEventListener(ev, refresh);
    return () => {
      for (const ev of events) window.removeEventListener(ev, refresh);
    };
  }, [refresh]);

  const goalPoints = studyDayGoalPoints(mode);
  const totalPoints = studyDayPoints(today);
  const remaining = studyDayRemainingPoints(today, mode);
  const mission = useMemo(() => getDailyMissionSummary(), [tick]);
  const missionComplete = isDailyMissionComplete();
  const nextAction = useMemo(() => getNextMissionAction(), [tick]);

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
          <p className="sub hero-sub-compact">
            {missionComplete
              ? "Plano de hoje completo — pode revisar ou treinar extra."
              : "Siga o plano abaixo: 4 perguntas Part 1, Part 2 e 20 palavras."}
          </p>
        </div>
        <div className="home-hero-stats">
          <span className={`home-points-pill ${missionComplete ? "done" : ""}`}>
            {mission.completedSections}/{mission.totalSections} blocos
          </span>
          <span className={`home-tasks-pill ${totalPoints >= goalPoints ? "done" : ""}`}>
            {totalPoints}/{goalPoints} pts
          </span>
        </div>
      </header>

      <CaptainDeltaPersonalBriefing />
      <CaptainDeltaReadinessPanel />
      <CaptainDeltaWeeklyDebriefPanel />

      <section className="home-continue-card">
        {missionComplete ? (
          <>
            <strong>Plano de hoje completo ✓</strong>
            <p>
              {totalPoints >= goalPoints
                ? "Missão e meta de pontos feitas — ótimo trabalho!"
                : `Missão feita! Faltam ${remaining} pts se quiser o dia bom.`}
            </p>
            <Link href="/part1" className="btn purple">
              Treino extra →
            </Link>
          </>
        ) : (
          <>
            <strong>{nextAction?.title ?? "Plano de hoje"}</strong>
            <p>{nextAction?.hint ?? "Complete os 3 blocos do plano diário."}</p>
            <Link
              href={nextAction?.href ?? "/part1"}
              className="btn purple btn-large"
            >
              Continuar →
            </Link>
          </>
        )}
      </section>

      <DailyMissionPanel />

      <CaptainDeltaQuestionHistoryPanel />

      <CaptainDeltaExamHistoryPanel />

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
