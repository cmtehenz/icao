"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CARDS } from "@/lib/cards";
import { ICAO_VOCABULARY } from "@/data/icaoVocabulary";
import { STUDY_ACTIVITY_RECORDED_EVENT } from "@/lib/studyActivityRecord";
import { DAILY_MISSION_LOG_EVENT } from "@/lib/dailyMissionLog";
import { getDailyMissionSummary, getSimuladoIcaoHref } from "@/lib/dailyMission";
import { buildDifficultyInsights } from "@/lib/difficultyInsights";
import {
  getOrCreatePart1DailyMission,
  part1CardPeelProgress,
  part1MissionLink,
  PART1_DAILY_MISSION_EVENT,
} from "@/lib/part1DailyMission";
import {
  getOrCreatePart2DailyMission,
  part2MissionLink,
  PART2_DAILY_MISSION_EVENT,
} from "@/lib/part2DailyMission";
import { VOCAB_DAILY_MISSION_EVENT, vocabDailyMissionProgress, getOrCreateVocabDailyMission, vocabMissionLink } from "@/lib/vocabDailyMission";
import { PEEL_BLOCK_HISTORY_EVENT } from "@/lib/peelBlockHistory";
import { PART1_COACH_HISTORY_EVENT } from "@/lib/part1CoachHistory";
import { PART2_PROGRESS_EVENT } from "@/lib/part2/progress";
import { useStudyAgenda } from "@/hooks/useStudyAgenda";
import {
  STUDY_PLAN_CHANGE_EVENT,
  STUDY_TIME_CHANGE_EVENT,
  studyDayGoalPoints,
  studyDayPoints,
  studyStreak,
} from "@/lib/studyTime";

function cardLabel(num: string): string {
  const card = CARDS.find((c) => c.num === num);
  if (!card) return `Pergunta ${num}`;
  return `Q${num} · ${card.question.slice(0, 42)}${card.question.length > 42 ? "…" : ""}`;
}

export default function DailyMissionPanel() {
  const [tick, setTick] = useState(0);
  const { mode, setMode, today } = useStudyAgenda();
  const goalPoints = studyDayGoalPoints(mode);
  const totalPoints = studyDayPoints(today);
  const streak = studyStreak(undefined, mode);

  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    const events = [
      PART1_DAILY_MISSION_EVENT,
      PART2_DAILY_MISSION_EVENT,
      VOCAB_DAILY_MISSION_EVENT,
      STUDY_ACTIVITY_RECORDED_EVENT,
      DAILY_MISSION_LOG_EVENT,
      PEEL_BLOCK_HISTORY_EVENT,
      PART1_COACH_HISTORY_EVENT,
      PART2_PROGRESS_EVENT,
      STUDY_TIME_CHANGE_EVENT,
      STUDY_PLAN_CHANGE_EVENT,
    ];
    for (const ev of events) window.addEventListener(ev, refresh);
    return () => {
      for (const ev of events) window.removeEventListener(ev, refresh);
    };
  }, [refresh]);

  const summary = useMemo(() => getDailyMissionSummary(), [tick]);
  const part1 = useMemo(() => getOrCreatePart1DailyMission(), [tick]);
  const part2 = useMemo(() => getOrCreatePart2DailyMission(), [tick]);
  const insights = useMemo(() => buildDifficultyInsights(3), [tick]);
  const vocabProgress = useMemo(() => vocabDailyMissionProgress(getOrCreateVocabDailyMission()), [tick]);
  const vocabNextLink = vocabProgress.currentId
    ? vocabMissionLink(vocabProgress.currentId)
    : "/vocabulario";

  return (
    <section className="daily-mission-panel" aria-label="Plano de estudo de hoje">
      <header className="daily-mission-head">
        <div>
          <h2>Plano de hoje</h2>
          <p className="sub">
            <strong>{summary.examLabel}</strong>
            {mode === "intense"
              ? " — vocabulário · Part 1 (3) · Part 2 sim · Simulado ICAO"
              : " — vocabulário · Part 1 (3 perguntas) · Part 2 simulação completa"}
          </p>
        </div>
        <div className="daily-mission-head-side">
          <span className={`daily-mission-pill ${summary.complete ? "done" : ""}`}>
            {summary.completedSections}/{summary.totalSections} blocos
          </span>
          <span className={`daily-mission-points ${totalPoints >= goalPoints ? "done" : ""}`}>
            {totalPoints}/{goalPoints} pts
          </span>
          {streak > 0 && (
            <span className="daily-mission-streak" title="Dias seguidos com missão ou meta de pontos">
              {streak}d ✓
            </span>
          )}
        </div>
      </header>

      <div className="study-agenda-mode daily-mission-mode" role="group" aria-label="Intensidade extra">
        <button
          type="button"
          className={`study-agenda-mode-btn ${mode === "standard" ? "active" : ""}`}
          onClick={() => setMode("standard")}
        >
          Padrão · 20 pts
        </button>
        <button
          type="button"
          className={`study-agenda-mode-btn ${mode === "intense" ? "active" : ""}`}
          onClick={() => setMode("intense")}
        >
          Dia bom · 45 pts
        </button>
      </div>
      <p className="daily-mission-mode-hint">
        {mode === "intense"
          ? "Dia bom: missão da prova do dia + Simulado ICAO completo (Part 1 + Part 2)."
          : "Um dia = uma prova (23C → 24C → 25C → 26C). Vocabulário primeiro, depois Part 1 e Part 2 inteiros."}
      </p>

      <div className="daily-mission-grid">
        <article className={`daily-mission-card ${summary.vocabulary.complete ? "done" : ""}`}>
          <h3>
            Vocabulário — {summary.vocabulary.done}/{summary.vocabulary.total}
          </h3>
          <p className="daily-mission-meta">
            20 palavras da {summary.examLabel} — as que você mais precisa revisar
          </p>
          <p className="daily-mission-vocab-progress">
            {summary.vocabulary.done}/{summary.vocabulary.total} concluídas
            {!summary.vocabulary.complete && vocabProgress.currentId
              ? ` · falta: ${ICAO_VOCABULARY.find((t) => t.id === vocabProgress.currentId)?.term ?? "1"}`
              : ""}
          </p>
          <Link href={vocabNextLink} className="btn secondary btn-sm">
            {summary.vocabulary.complete ? "Abrir vocabulário →" : "Treinar palavra que falta →"}
          </Link>
        </article>

        <article className={`daily-mission-card ${summary.part1.complete ? "done" : ""}`}>
          <h3>Part 1 — {summary.part1.bothDone}/{summary.part1.total} completas</h3>
          <p className="daily-mission-meta">
            Shadow: todos os blocos PEEL · Coach: gravação Azure
          </p>
          <ul className="daily-mission-list">
            {part1.cards.map((c) => {
              const peel = part1CardPeelProgress(c.cardNum);
              return (
              <li key={c.cardNum} className={c.shadowDone && c.coachDone ? "done" : ""}>
                <span className="daily-mission-item-label">{cardLabel(c.cardNum)}</span>
                <span className="daily-mission-badges">
                  <span className={c.shadowDone ? "ok" : ""} title="Shadow — todos os blocos PEEL">
                    S{c.shadowDone ? "✓" : peel.total > 0 ? ` ${peel.done}/${peel.total}` : ""}
                  </span>
                  <span className={c.coachDone ? "ok" : ""} title="Coach">
                    C{c.coachDone ? "✓" : ""}
                  </span>
                </span>
                {!(c.shadowDone && c.coachDone) && (
                  <span className="daily-mission-links">
                    {!c.shadowDone && (
                      <Link href={part1MissionLink(c.cardNum, "shadow")} className="btn secondary btn-sm">
                        Shadow
                      </Link>
                    )}
                    {!c.coachDone && (
                      <Link href={part1MissionLink(c.cardNum, "coach")} className="btn secondary btn-sm">
                        Coach
                      </Link>
                    )}
                  </span>
                )}
              </li>
            );
            })}
          </ul>
        </article>

        <article className={`daily-mission-card ${summary.part2.complete ? "done" : ""}`}>
          <h3>
            Part 2 — {summary.part2.done}/{summary.part2.total}
          </h3>
          <p className="daily-mission-meta">
            Simulação completa · {part2.examVersion} · 5 situações com coach Azure
          </p>
          {!summary.part2.complete ? (
            <Link href={part2MissionLink(part2)} className="btn secondary btn-sm">
              Iniciar simulação →
            </Link>
          ) : (
            <p className="daily-mission-vocab-progress">✓ Simulação concluída hoje</p>
          )}
        </article>

        {summary.simulateRequired && (
          <article className={`daily-mission-card ${summary.simulate.complete ? "done" : ""}`}>
            <h3>
              Simulado ICAO — {summary.simulate.done}/{summary.simulate.total}
            </h3>
            <p className="daily-mission-meta">
              Dia bom: Simulado completo da {summary.examLabel} (Part 1 + Part 2)
            </p>
            {summary.simulate.complete ? (
              <p className="daily-mission-vocab-progress">✓ Simulado ICAO concluído hoje</p>
            ) : (
              <Link href={getSimuladoIcaoHref()} className="btn secondary btn-sm">
                Simulado ICAO →
              </Link>
            )}
          </article>
        )}
      </div>

      <section className="difficulty-insights">
        <h3>Onde você mais precisa treinar</h3>
        <p className="difficulty-insights-sub">
          Baseado nas suas gravações reais — itens não praticados não aparecem com 0% artificial.
        </p>
        <div className="difficulty-insights-grid">
          {insights.map((area) => (
            <div key={area.area} className="difficulty-insight-card">
              <div className="difficulty-insight-head">
                <strong>{area.label}</strong>
                <span
                  className={`difficulty-score ${
                    area.aggregateIcaoLevel != null
                      ? `icao-l${area.aggregateIcaoLevel}`
                      : area.score == null
                        ? "muted"
                        : area.score < 60
                          ? "bad"
                          : area.score < 75
                            ? "warn"
                            : "good"
                  }`}
                >
                  {area.displayScore ?? (area.score == null ? "—" : `${area.score}%`)}
                </span>
              </div>
              {area.hint && <p className="difficulty-insight-hint">{area.hint}</p>}
              <ul>
                {area.items.length === 0 ? (
                  <li className="difficulty-insight-empty">Nenhum dado de prática ainda</li>
                ) : (
                  area.items.map((item) => (
                    <li key={item.id}>
                      <span>{item.label}</span>
                      <span
                        className={`difficulty-item-score ${
                          item.icaoLevel != null ? `icao-l${item.icaoLevel}` : ""
                        }`}
                      >
                        {item.icaoLevel != null ? `ICAO ${item.icaoLevel}` : `${item.score}%`}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
