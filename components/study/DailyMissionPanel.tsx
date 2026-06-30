"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CARDS } from "@/lib/cards";
import { STUDY_ACTIVITY_RECORDED_EVENT } from "@/lib/studyActivityRecord";
import { DAILY_MISSION_LOG_EVENT } from "@/lib/dailyMissionLog";
import { getDailyMissionSummary } from "@/lib/dailyMission";
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
import { VOCAB_DAILY_MISSION_EVENT } from "@/lib/vocabDailyMission";

function cardLabel(num: string): string {
  const card = CARDS.find((c) => c.num === num);
  if (!card) return `Pergunta ${num}`;
  return `Q${num} · ${card.question.slice(0, 42)}${card.question.length > 42 ? "…" : ""}`;
}

export default function DailyMissionPanel() {
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    const events = [
      PART1_DAILY_MISSION_EVENT,
      PART2_DAILY_MISSION_EVENT,
      VOCAB_DAILY_MISSION_EVENT,
      STUDY_ACTIVITY_RECORDED_EVENT,
      DAILY_MISSION_LOG_EVENT,
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

  return (
    <section className="daily-mission-panel" aria-label="Missão diária">
      <header className="daily-mission-head">
        <div>
          <h2>Missão de hoje</h2>
          <p className="sub">
            Part 1: 4 perguntas (shadow + coach) · Part 2: mix diário · Vocabulário: 20 palavras
          </p>
        </div>
        <span className={`daily-mission-pill ${summary.complete ? "done" : ""}`}>
          {summary.completedSections}/{summary.totalSections} blocos
        </span>
      </header>

      <div className="daily-mission-grid">
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
            Readback {summary.part2.byKind.readback.done}/{summary.part2.byKind.readback.total} ·
            Interaction {summary.part2.byKind.interaction.done}/{summary.part2.byKind.interaction.total} ·
            Reported {summary.part2.byKind.reported.done}/{summary.part2.byKind.reported.total}
          </p>
          <ul className="daily-mission-list">
            {part2.items.map((item) => {
              const done = part2.completedIds.includes(item.id);
              return (
                <li key={item.id} className={done ? "done" : ""}>
                  <span className="daily-mission-item-label">{item.label}</span>
                  {!done && (
                    <Link href={part2MissionLink(item)} className="btn secondary btn-sm">
                      Treinar
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </article>

        <article className={`daily-mission-card ${summary.vocabulary.complete ? "done" : ""}`}>
          <h3>
            Vocabulário — {summary.vocabulary.done}/{summary.vocabulary.total}
          </h3>
          <p className="daily-mission-meta">20 palavras — checklist completo no Vocabulário</p>
          <p className="daily-mission-vocab-progress">
            {summary.vocabulary.done}/{summary.vocabulary.total} concluídas
          </p>
          <Link href="/vocabulario" className="btn secondary btn-sm">
            Abrir checklist de 20 palavras →
          </Link>
        </article>
      </div>

      <section className="difficulty-insights">
        <h3>Onde você mais precisa treinar</h3>
        <div className="difficulty-insights-grid">
          {insights.map((area) => (
            <div key={area.area} className="difficulty-insight-card">
              <div className="difficulty-insight-head">
                <strong>{area.label}</strong>
                <span className={`difficulty-score ${area.score < 60 ? "bad" : area.score < 75 ? "warn" : "good"}`}>
                  {area.score}%
                </span>
              </div>
              <ul>
                {area.items.map((item) => (
                  <li key={item.id}>
                    <span>{item.label}</span>
                    <span className="difficulty-item-score">{item.score}%</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
