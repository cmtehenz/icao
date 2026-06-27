"use client";

import type { IcaoVocabularyItem } from "@/data/icaoVocabulary";
import { difficultyLabel } from "@/data/icaoVocabulary";
import type { VocabItemProgress } from "@/utils/spacedRepetition";
import { scoreTierLabel } from "@/utils/spacedRepetition";

type Props = {
  item: IcaoVocabularyItem;
  progress: VocabItemProgress;
  trainingLevel?: 1 | 2 | 3 | 4;
  compact?: boolean;
};

export default function VocabularyCard({ item, progress, trainingLevel, compact = false }: Props) {
  const masteryPct = Math.round((progress.masteryLevel / 5) * 100);

  if (compact) {
    return (
      <article className="vocab-card vocab-card-compact">
        <div className="vocab-card-head">
          <h3 className="vocab-card-term">{item.term}</h3>
          <span className="vocab-card-mastery" title="Mastery level">
            {progress.masteryLevel}/5
          </span>
        </div>
        <p className="vocab-card-meaning">{item.meaning}</p>
        <div className="vocab-card-meta">
          <span className="vocab-card-tag">{item.category}</span>
          <span className="vocab-card-tag">{difficultyLabel(item.difficulty)}</span>
        </div>
      </article>
    );
  }

  return (
    <article className="vocab-card vocab-card-full">
      <header className="vocab-card-head">
        <div>
          <span className="vocab-card-category">{item.category}</span>
          <h2 className="vocab-card-term">{item.term}</h2>
        </div>
        <div className="vocab-card-mastery-block">
          <strong className="vocab-card-mastery-score">{progress.masteryLevel}/5</strong>
          <span className="vocab-card-mastery-label">mastery</span>
        </div>
      </header>

      <p className="vocab-card-meaning">{item.meaning}</p>
      <p className="vocab-card-example">
        <strong>Example:</strong> {item.example}
      </p>

      <div className="vocab-card-meta">
        <span className="vocab-card-tag">Difficulty {item.difficulty}</span>
        {trainingLevel && <span className="vocab-card-tag">Training L{trainingLevel}</span>}
        <span className={`vocab-card-tag status-${progress.status}`}>{progress.status}</span>
      </div>

      <div className="vocab-card-progress">
        <div className="vocab-card-progress-head">
          <span>Mastery</span>
          <span>{masteryPct}%</span>
        </div>
        <div className="daily-study-bar" aria-hidden>
          <div className="daily-study-bar-fill" style={{ width: `${masteryPct}%` }} />
        </div>
      </div>

      {progress.attempts > 0 && (
        <div className="vocab-card-scores">
          <div className="vocab-score-pill">
            <strong>{progress.bestScore}</strong>
            <span>best</span>
          </div>
          <div className="vocab-score-pill">
            <strong>{progress.attempts}</strong>
            <span>attempts</span>
          </div>
          <div className="vocab-score-pill">
            <strong>{progress.lastScore}</strong>
            <span>last ({scoreTierLabel(progress.lastScore)})</span>
          </div>
        </div>
      )}
    </article>
  );
}
