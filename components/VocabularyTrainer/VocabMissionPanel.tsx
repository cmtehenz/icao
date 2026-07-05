"use client";

import { useEffect, useMemo, useState } from "react";
import PronunciationRecorder from "@/components/VocabularyTrainer/PronunciationRecorder";
import WordPhoneticHint from "@/components/WordPhoneticHint";
import type { IcaoVocabularyItem } from "@/data/icaoVocabulary";
import { getLevelText } from "@/data/icaoVocabulary";
import { CAPTAIN_VOCAB_MISSION_INTRO } from "@/lib/vocabCoach";
import {
  isVocabMissionTermComplete,
  nextVocabMissionLevel,
  vbLevelCode,
  vbLevelLabel,
  vocabTermMissionProgress,
} from "@/lib/vocabGraduation";
import type { VocabPracticeLevel } from "@/lib/vocabGraduation";
import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import type { VocabItemProgress } from "@/utils/spacedRepetition";

type Props = {
  item: IcaoVocabularyItem;
  progress: VocabItemProgress;
  missionLegActive?: boolean;
  onClose: () => void;
  onNext: () => void;
  onMarkDifficult: () => void;
  onMarkMastered: () => void;
  onResult: (
    level: VocabPracticeLevel,
    score: number,
    assessment: AzurePronunciationResult | null,
    audioBlob: Blob | null,
  ) => Promise<{ audioSaved: boolean; audioError?: string } | void>;
  onProgressRefresh: () => void;
};

export default function VocabMissionPanel({
  item,
  progress,
  missionLegActive = false,
  onClose,
  onNext,
  onMarkDifficult,
  onMarkMastered,
  onResult,
  onProgressRefresh,
}: Props) {
  const missionProgress = useMemo(() => vocabTermMissionProgress(progress), [progress]);
  const [level, setLevel] = useState(missionProgress.currentLevel);
  const [introShown, setIntroShown] = useState(false);

  useEffect(() => {
    setLevel(nextVocabMissionLevel(progress));
  }, [item.id, progress]);

  const referenceText = getLevelText(item, level);
  const termComplete = isVocabMissionTermComplete(progress);

  const handleResult = async (
    score: number,
    assessment: AzurePronunciationResult | null,
    audioBlob: Blob | null,
  ) => {
    const result = await onResult(level, score, assessment, audioBlob);
    onProgressRefresh();
    return result;
  };

  return (
    <div className="vocab-studio-training vocab-mission-panel">
      {!missionLegActive && (
        <header className="vocab-studio-training-head">
          <button type="button" className="vocab-studio-back btn secondary btn-sm" onClick={onClose}>
            ← Back
          </button>
          <span className="vocab-mission-badge">Today&apos;s mission</span>
        </header>
      )}

      {missionLegActive && (
        <p className="vocab-mission-badge vocab-mission-badge-inline">Today&apos;s mission</p>
      )}

      {!introShown && !termComplete && (
        <p className="vocab-mission-captain-intro">
          <strong>Captain Delta:</strong> {CAPTAIN_VOCAB_MISSION_INTRO}
          <button
            type="button"
            className="vocab-mission-intro-dismiss"
            onClick={() => setIntroShown(true)}
          >
            Got it
          </button>
        </p>
      )}

      <div className="vocab-studio-hero">
        <div className="vocab-studio-hero-top">
          <h2 className="vocab-studio-hero-term">
            {item.term}
            <WordPhoneticHint word={item.term} className="vault-word-phonetic" />
          </h2>
          <div className="vocab-studio-hero-score">
            <strong>{missionProgress.levelsDone}</strong>
            <span>/4 VB</span>
          </div>
        </div>
        <p className="vocab-studio-hero-meaning">{item.meaning}</p>

        <div className="vocab-mission-vb-track" aria-label="VB level progress">
          {([1, 2, 3, 4] as const).map((l) => (
            <span
              key={l}
              className={`vocab-mission-vb-step ${
                progress.levelsPassed?.[l] ? "done" : l === level ? "current" : ""
              }`}
            >
              {vbLevelCode(l)}
            </span>
          ))}
        </div>
      </div>

      {termComplete ? (
        <section className="vocab-mission-complete">
          <h3>Term complete</h3>
          <p className="sub">All four VB levels passed for today&apos;s mission.</p>
          {!missionLegActive && (
            <div className="vocab-mission-complete-actions">
              <button type="button" className="btn purple" onClick={onNext}>
                Next term →
              </button>
            </div>
          )}
        </section>
      ) : (
        <>
          <div className="vocab-mission-current-level">
            <span className="vocab-mission-level-label">{vbLevelLabel(level)}</span>
          </div>

          <div className="vocab-studio-practice-box">
            <span className="vocab-studio-practice-label">Speak this</span>
            <p className="vocab-studio-practice-text">{referenceText}</p>
          </div>

          <PronunciationRecorder
            referenceText={referenceText}
            termLabel={item.term}
            progress={progress}
            onResult={handleResult}
            onMarkDifficult={onMarkDifficult}
            onMarkMastered={onMarkMastered}
            onNext={missionLegActive ? undefined : onNext}
            missionLegActive={missionLegActive}
          />
        </>
      )}
    </div>
  );
}
