"use client";

import PronunciationRecorder from "@/components/VocabularyTrainer/PronunciationRecorder";
import WordPhoneticHint from "@/components/WordPhoneticHint";
import type { IcaoVocabularyItem } from "@/data/icaoVocabulary";
import { getLevelText } from "@/data/icaoVocabulary";
import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import type { VocabItemProgress } from "@/utils/spacedRepetition";
import { countLevelsPassed, masteryNextStep } from "@/utils/spacedRepetition";
import { vbLevelCode, vbLevelLabel } from "@/lib/vocabGraduation";

type Props = {
  item: IcaoVocabularyItem;
  progress: VocabItemProgress;
  level: 1 | 2 | 3 | 4;
  onLevelChange: (level: 1 | 2 | 3 | 4) => void;
  onClose: () => void;
  onNext: () => void;
  onMarkDifficult: () => void;
  onMarkMastered: () => void;
  onResult: (
    score: number,
    assessment: AzurePronunciationResult | null,
    audioBlob: Blob | null,
  ) => Promise<{ audioSaved: boolean; audioError?: string } | void>;
};

export default function VocabTrainingPanel({
  item,
  progress,
  level,
  onLevelChange,
  onClose,
  onNext,
  onMarkDifficult,
  onMarkMastered,
  onResult,
}: Props) {
  const referenceText = getLevelText(item, level);
  const levelsDone = countLevelsPassed(progress);
  const nextStep = masteryNextStep(progress);
  const masteryPct = Math.round((progress.masteryLevel / 5) * 100);

  return (
    <div className="vocab-studio-training">
      <header className="vocab-studio-training-head">
        <button type="button" className="vocab-studio-back btn secondary btn-sm" onClick={onClose}>
          ← Back
        </button>
        <span className="vocab-studio-training-cat">{item.category}</span>
      </header>

      <div className="vocab-studio-hero">
        <div className="vocab-studio-hero-top">
          <h2 className="vocab-studio-hero-term">
            {item.term}
            <WordPhoneticHint word={item.term} className="vault-word-phonetic" />
          </h2>
          <div className="vocab-studio-hero-score">
            <strong>{progress.masteryLevel}</strong>
            <span>/5 mastery</span>
          </div>
        </div>
        <p className="vocab-studio-hero-meaning">{item.meaning}</p>
        <p className="vocab-studio-hero-example">{item.example}</p>

        <div className="vocab-studio-hero-stats">
          <span>Best {progress.bestScore}</span>
          <span>{progress.attempts} attempts</span>
          <span>Levels {levelsDone}/4</span>
          <span>{masteryPct}% mastery</span>
        </div>
        {nextStep && <p className="vocab-studio-hero-hint">{nextStep}</p>}
      </div>

      <div className="vocab-studio-levels" role="tablist" aria-label="VB training level">
        {([1, 2, 3, 4] as const).map((l) => (
          <button
            key={l}
            type="button"
            role="tab"
            aria-selected={level === l}
            className={`vocab-studio-level-tab ${level === l ? "active" : ""}`}
            onClick={() => onLevelChange(l)}
            title={vbLevelLabel(l)}
          >
            {vbLevelCode(l)}
          </button>
        ))}
      </div>

      <div className="vocab-studio-practice-box">
        <span className="vocab-studio-practice-label">Practice text</span>
        <p className="vocab-studio-practice-text">{referenceText}</p>
      </div>

      <PronunciationRecorder
        referenceText={referenceText}
        termLabel={item.term}
        progress={progress}
        onResult={onResult}
        onMarkDifficult={onMarkDifficult}
        onMarkMastered={onMarkMastered}
        onNext={onNext}
      />
    </div>
  );
}
