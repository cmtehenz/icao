"use client";

import { useState } from "react";
import { VOCABULARY_TERMS } from "@/data/part2Vocabulary";
import {
  getPart2ItemProgress,
  markVocabularyKnown,
  markVocabularyReview,
  type Part2ProgressStore,
} from "@/lib/part2/progress";
import ProgressBadge from "@/components/study/ProgressBadge";
import type { CardProgressStatus } from "@/lib/progress";

type Props = {
  progress: Part2ProgressStore;
  onProgressChange: (store: Part2ProgressStore) => void;
};

export default function VocabularyDrill({ progress, onProgressChange }: Props) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const term = VOCABULARY_TERMS[index];
  const itemProgress = getPart2ItemProgress(progress, term.id);
  const known = progress.vocabularyKnown.includes(term.id);

  const go = (delta: number) => {
    setIndex((i) => (i + delta + VOCABULARY_TERMS.length) % VOCABULARY_TERMS.length);
    setFlipped(false);
  };

  return (
    <div className="part2-mode">
      <header className="part2-mode-head">
        <span className="badge">Vocabulary Drill</span>
        <ProgressBadge status={itemProgress.status as CardProgressStatus} />
        <span className="part2-counter">
          {index + 1} / {VOCABULARY_TERMS.length} · {progress.vocabularyKnown.length} known
        </span>
      </header>

      <article className={`card card-essential part2-card vocab-card ${flipped ? "flipped" : ""}`}>
        <button type="button" className="vocab-flip-area" onClick={() => setFlipped((f) => !f)}>
          {!flipped ? (
            <div className="vocab-front">
              <h2 className="vocab-term">{term.term}</h2>
              <p className="part2-hint">Tap to reveal definition</p>
            </div>
          ) : (
            <div className="vocab-back">
              <h3>Definition</h3>
              <p>{term.definition}</p>
              <h3>Example</h3>
              <p className="vocab-example">{term.example}</p>
            </div>
          )}
        </button>

        <div className="card-body">
          <div className="study-toolbar">
            <button
              type="button"
              className="btn green"
              onClick={() => onProgressChange(markVocabularyKnown(progress, term.id))}
            >
              ✓ I know
            </button>
            <button
              type="button"
              className="btn orange"
              onClick={() => onProgressChange(markVocabularyReview(progress, term.id))}
            >
              Review again
            </button>
            <button type="button" className="btn secondary" onClick={() => go(1)}>
              Next →
            </button>
          </div>
          {known && <p className="vocab-known-badge">Marked as known</p>}
        </div>
      </article>
    </div>
  );
}
