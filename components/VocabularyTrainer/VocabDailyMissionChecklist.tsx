"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import WordPhoneticHint from "@/components/WordPhoneticHint";
import { ICAO_VOCABULARY } from "@/data/icaoVocabulary";
import {
  getOrCreateVocabDailyMission,
  vocabDailyMissionProgress,
  vocabMissionLink,
  VOCAB_DAILY_MISSION_EVENT,
  VOCAB_DAILY_WORD_COUNT,
} from "@/lib/vocabDailyMission";

function termLabel(id: string): string {
  return ICAO_VOCABULARY.find((t) => t.id === id)?.term ?? id;
}

type Props = {
  onSelectTerm?: (termId: string) => void;
  /** @deprecated Missão abre expandida quando há palavras pendentes */
  defaultCollapsed?: boolean;
};

export default function VocabDailyMissionChecklist({ onSelectTerm }: Props) {
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    window.addEventListener(VOCAB_DAILY_MISSION_EVENT, refresh);
    return () => window.removeEventListener(VOCAB_DAILY_MISSION_EVENT, refresh);
  }, [refresh]);

  const mission = getOrCreateVocabDailyMission();
  const progress = vocabDailyMissionProgress(mission);
  const remaining = progress.total - progress.done;
  const nextId = progress.currentId;
  const nextLabel = nextId ? termLabel(nextId) : null;

  const [expanded, setExpanded] = useState(remaining > 0);

  useEffect(() => {
    if (remaining > 0) setExpanded(true);
  }, [remaining, tick]);

  const openTerm = (termId: string) => {
    if (onSelectTerm) {
      onSelectTerm(termId);
      return;
    }
    window.location.href = vocabMissionLink(termId);
  };

  return (
    <section
      className={`vocab-daily-mission ${expanded ? "expanded" : "collapsed"} ${progress.complete ? "complete" : "pending"}`}
      aria-label="Missão diária de vocabulário"
    >
      <header className="vocab-daily-mission-head">
        <button
          type="button"
          className="vocab-daily-mission-toggle"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
        >
          <div className="vocab-daily-mission-toggle-text">
            <h2>Missão de hoje — {VOCAB_DAILY_WORD_COUNT} palavras</h2>
            <p className="sub">
              {progress.done}/{progress.total} concluídas
              {remaining > 0 ? ` · ${remaining} faltando` : " · completa"}
            </p>
          </div>
          <span className="vocab-daily-mission-chevron" aria-hidden>
            {expanded ? "▾" : "▸"}
          </span>
        </button>
        <span className={`vocab-daily-mission-pill ${progress.complete ? "done" : ""}`}>
          {progress.complete ? "Completa ✓" : `${remaining} faltando`}
        </span>
      </header>

      <div className="daily-study-bar vocab-daily-mission-bar" aria-hidden>
        <div
          className="daily-study-bar-fill"
          style={{ width: `${progress.total ? Math.round((progress.done / progress.total) * 100) : 0}%` }}
        />
      </div>

      {!expanded && remaining > 0 && nextId && nextLabel && (
        <div className="vocab-daily-mission-next">
          <span className="vocab-daily-mission-next-label">Próxima palavra</span>
          <span className="vocab-daily-mission-next-term">
            {nextLabel}
            <WordPhoneticHint word={nextLabel} className="vault-word-phonetic" />
          </span>
          {onSelectTerm ? (
            <button type="button" className="btn green btn-sm" onClick={() => openTerm(nextId)}>
              Treinar agora
            </button>
          ) : (
            <Link href={vocabMissionLink(nextId)} className="btn green btn-sm">
              Treinar agora
            </Link>
          )}
        </div>
      )}

      {expanded && (
        <ol className="vocab-daily-checklist">
          {mission.termIds.map((id, index) => {
            const done = mission.completedIds.includes(id);
            const label = termLabel(id);
            const isNext = id === nextId;
            return (
              <li
                key={id}
                className={`vocab-daily-checklist-item ${done ? "done" : ""} ${isNext ? "next" : ""}`}
              >
                {done ? (
                  <>
                    <span className="vocab-daily-check" aria-hidden>
                      ✓
                    </span>
                    <span className="vocab-daily-term">
                      {label}
                      <WordPhoneticHint word={label} className="vault-word-phonetic" />
                    </span>
                    <span className="vocab-daily-done-label">feito</span>
                  </>
                ) : (
                  <button
                    type="button"
                    className="vocab-daily-checklist-action"
                    onClick={() => openTerm(id)}
                  >
                    <span className="vocab-daily-check" aria-hidden>
                      {index + 1}
                    </span>
                    <span className="vocab-daily-term">
                      {label}
                      <WordPhoneticHint word={label} className="vault-word-phonetic" />
                    </span>
                    <span className="vocab-daily-train-label">Treinar →</span>
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
