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

  return (
    <section className="vocab-daily-mission" aria-label="Missão diária de vocabulário">
      <header className="vocab-daily-mission-head">
        <div>
          <h2>Missão de hoje — {VOCAB_DAILY_WORD_COUNT} palavras</h2>
          <p className="sub">
            {progress.done}/{progress.total} concluídas · lista nova amanhã
          </p>
        </div>
        <span className={`vocab-daily-mission-pill ${progress.complete ? "done" : ""}`}>
          {progress.complete ? "Completa ✓" : `${progress.total - progress.done} faltando`}
        </span>
      </header>

      <div className="daily-study-bar vocab-daily-mission-bar" aria-hidden>
        <div
          className="daily-study-bar-fill"
          style={{ width: `${progress.total ? Math.round((progress.done / progress.total) * 100) : 0}%` }}
        />
      </div>

      <ol className="vocab-daily-checklist">
        {mission.termIds.map((id, index) => {
          const done = mission.completedIds.includes(id);
          const label = termLabel(id);
          return (
            <li key={id} className={`vocab-daily-checklist-item ${done ? "done" : ""}`}>
              <span className="vocab-daily-check" aria-hidden>
                {done ? "✓" : index + 1}
              </span>
              <span className="vocab-daily-term">
                {label}
                <WordPhoneticHint word={label} className="vault-word-phonetic" />
              </span>
              {done ? (
                <span className="vocab-daily-done-label">feito</span>
              ) : onSelectTerm ? (
                <button type="button" className="btn green btn-sm" onClick={() => onSelectTerm(id)}>
                  Treinar
                </button>
              ) : (
                <Link href={vocabMissionLink(id)} className="btn green btn-sm">
                  Treinar
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
