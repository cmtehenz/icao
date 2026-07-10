"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CARDS } from "@/lib/cards";
import { STUDY_ACTIVITY_RECORDED_EVENT } from "@/lib/studyActivityRecord";
import { DAILY_MISSION_LOG_EVENT } from "@/lib/dailyMissionLog";
import { getDailyMissionSummary, getSimuladoIcaoHref } from "@/lib/dailyMission";
import { flightDebriefLink } from "@/lib/flightDebrief/flightDebriefProgress";
import { missionRecallLink } from "@/lib/missionRecall/missionRecallProgress";
import { FLIGHT_DEBRIEF_EVENT } from "@/lib/flightDebrief/flightDebriefProgress";
import { MISSION_RECALL_EVENT } from "@/lib/missionRecall/missionRecallProgress";
import {
  getOrCreatePart1DailyMission,
  part1CardPeelProgress,
  part1MissionDeepLink,
  PART1_DAILY_MISSION_EVENT,
} from "@/lib/part1DailyMission";
import {
  getOrCreatePart2DailyMission,
  part2MissionLink,
  PART2_DAILY_MISSION_EVENT,
} from "@/lib/part2DailyMission";
import {
  VOCAB_DAILY_MISSION_EVENT,
} from "@/lib/vocabDailyMission";
import {
  getOrCreateWordDailyMission,
  wordMissionLink,
} from "@/lib/wordMission/wordDailyMission";
import {
  findWordMissionVocabItem,
  getWordMissionTermLabel,
} from "@/lib/wordMission/wordMissionCatalog";
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
  if (!card) return `Question ${num}`;
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
      MISSION_RECALL_EVENT,
      FLIGHT_DEBRIEF_EVENT,
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
  const wordMission = useMemo(() => getOrCreateWordDailyMission(), [tick]);
  const currentWordMissionItem = summary.wordMission.currentId
    ? findWordMissionVocabItem(summary.wordMission.currentId)
    : null;
  const wordNextLink = wordMission.termIds.find((id) => !wordMission.completedIds.includes(id))
    ? wordMissionLink(
        wordMission.termIds.find((id) => !wordMission.completedIds.includes(id))!,
      )
    : "/word-mission";

  return (
    <section className="daily-mission-panel" aria-label="Plano de estudo de hoje">
      <header className="daily-mission-head">
        <div>
          <h2>Plano de hoje</h2>
          <p className="sub">
            <strong>{summary.examLabel}</strong>
            {mode === "intense"
              ? " — Word Mission · Part 1 · Part 2 · Recall · Simulado · Debrief"
              : " — Word Mission · Part 1 · Part 2 · Recall · Debrief"}
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
          ? "Dia bom: missão completa + Mission Recall + Simulado ICAO + Flight Debrief."
          : "Um dia = uma prova. Word Mission, Part 1, Part 2, Mission Recall e Flight Debrief."}
      </p>

      <div className="daily-mission-grid">
        <article className={`daily-mission-card ${summary.wordMission.complete ? "done" : ""}`}>
          <h3>
            Word Mission — {summary.wordMission.done}/{summary.wordMission.total}
          </h3>
          <p className="daily-mission-meta">
            {summary.wordMission.total} conceitos premium — meaning, pilot phrase, sentence, ICAO use
          </p>
          <p className="daily-mission-vocab-progress">
            {summary.wordMission.done}/{summary.wordMission.total} concluídos
            {!summary.wordMission.complete && summary.wordMission.currentId
              ? ` · falta: ${
                  currentWordMissionItem
                    ? getWordMissionTermLabel(currentWordMissionItem)
                    : summary.wordMission.currentId
                }`
              : ""}
          </p>
          <Link href={wordNextLink} className="btn secondary btn-sm">
            {summary.wordMission.complete ? "Abrir Word Mission →" : "Treinar termo que falta →"}
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
                      <Link href={part1MissionDeepLink(c.cardNum, "shadow")} className="btn secondary btn-sm">
                        Shadow
                      </Link>
                    )}
                    {!c.coachDone && (
                      <Link href={part1MissionDeepLink(c.cardNum, "coach")} className="btn secondary btn-sm">
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
            Prova completa · {part2.examVersion} · 5 situações · papel e caneta
          </p>
          {!summary.part2.complete ? (
            <Link href={part2MissionLink(part2)} className="btn secondary btn-sm">
              Iniciar prova de hoje →
            </Link>
          ) : (
            <p className="daily-mission-vocab-progress">✓ Part 2 concluído hoje</p>
          )}
        </article>

        <article className={`daily-mission-card ${summary.recall.complete ? "done" : ""}`}>
          <h3>
            Mission Recall — {summary.recall.done}/{summary.recall.total}
          </h3>
          <p className="daily-mission-meta">
            Active recall from today&apos;s mission — no new content
          </p>
          {summary.recall.complete ? (
            <p className="daily-mission-vocab-progress">
              ✓ Recall complete · {summary.recall.confidenceStars}/5 confidence
            </p>
          ) : (
            <Link href={missionRecallLink()} className="btn secondary btn-sm">
              {summary.part2.complete ? "Start Mission Recall →" : "Complete Part 2 first →"}
            </Link>
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

        <article className={`daily-mission-card ${summary.debrief.complete ? "done" : ""}`}>
          <h3>
            Flight Debrief — {summary.debrief.done}/{summary.debrief.total}
          </h3>
          <p className="daily-mission-meta">
            Close today&apos;s flight — one priority improvement
          </p>
          {summary.debrief.complete ? (
            <p className="daily-mission-vocab-progress">✓ Today&apos;s flight debrief complete</p>
          ) : (
            <Link href={flightDebriefLink()} className="btn secondary btn-sm">
              Open Flight Debrief →
            </Link>
          )}
        </article>
      </div>
    </section>
  );
}
