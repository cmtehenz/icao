"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import WordPhoneticHint from "@/components/WordPhoneticHint";
import { ICAO_VOCABULARY } from "@/data/icaoVocabulary";
import { countVbLevelsPassed } from "@/lib/vocabGraduation";
import {
  getOrCreateVocabDailyMission,
  vocabDailyMissionProgress,
  vocabMissionLink,
  VOCAB_DAILY_MISSION_EVENT,
  VOCAB_DAILY_WORD_COUNT,
} from "@/lib/vocabDailyMission";
import { getItemProgress, loadVocabProgressStore } from "@/utils/spacedRepetition";

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
      aria-label="Daily vocabulary mission"
    >
      <header className="vocab-daily-mission-head">
        <button
          type="button"
          className="vocab-daily-mission-toggle"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
        >
          <div className="vocab-daily-mission-toggle-text">
            <h2>Today&apos;s mission — {VOCAB_DAILY_WORD_COUNT} terms</h2>
            <p className="sub">
              {progress.done}/{progress.total} complete
              {remaining > 0 ? ` · ${remaining} remaining` : " · complete"}
            </p>
          </div>
          <span className="vocab-daily-mission-chevron" aria-hidden>
            {expanded ? "▾" : "▸"}
          </span>
        </button>
        <span className={`vocab-daily-mission-pill ${progress.complete ? "done" : ""}`}>
          {progress.complete ? "Complete ✓" : `${remaining} remaining`}
        </span>
      </header>

      <div
        className="daily-study-bar vocab-daily-mission-bar"
        role="progressbar"
        aria-valuenow={progress.done}
        aria-valuemin={0}
        aria-valuemax={progress.total}
        aria-label={`Mission progress ${progress.done} of ${progress.total}`}
      >
        <div
          className="daily-study-bar-fill"
          style={{ width: `${progress.total ? Math.round((progress.done / progress.total) * 100) : 0}%` }}
        />
      </div>

      {!expanded && remaining > 0 && nextId && nextLabel && (
        <div className="vocab-daily-mission-next">
          <span className="vocab-daily-mission-next-label">Next term</span>
          <span className="vocab-daily-mission-next-term">
            {nextLabel}
            <WordPhoneticHint word={nextLabel} className="vault-word-phonetic" />
          </span>
          {onSelectTerm ? (
            <button type="button" className="btn green btn-sm" onClick={() => openTerm(nextId)}>
              Train now
            </button>
          ) : (
            <Link href={vocabMissionLink(nextId)} className="btn green btn-sm">
              Train now
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
            const vbLevels = done
              ? 4
              : countVbLevelsPassed(getItemProgress(loadVocabProgressStore(), id));
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
                    <span className="vocab-daily-done-label">VB 4/4</span>
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
                    <span className="vocab-daily-vb-progress">VB {vbLevels}/4</span>
                    <span className="vocab-daily-train-label">Train →</span>
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
