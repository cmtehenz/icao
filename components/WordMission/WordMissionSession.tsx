"use client";

import CaptainDeltaTarget from "@/components/CaptainDelta/Visual/CaptainDeltaTarget";
import WordPhoneticHint from "@/components/WordPhoneticHint";
import { usePronunciationRecordingController } from "@/hooks/usePronunciationRecordingController";
import type { IcaoVocabularyItem } from "@/data/icaoVocabulary";
import { getLevelText } from "@/data/icaoVocabulary";
import { errorTypeLabel } from "@/lib/azure/pronunciation";
import { publishActivePronunciationWord } from "@/lib/captainDelta/lessonContext";
import { missionCardStatusLine } from "@/lib/pronunciation/missionCardStatusLine";
import { isPronunciationRecordingActive } from "@/lib/pronunciation/pronunciationRecordingController";
import {
  isVocabMissionTermComplete,
  nextVocabMissionLevel,
} from "@/lib/vocabGraduation";
import { recordWordMissionLevelAttempt } from "@/lib/wordMission/progress";
import {
  WM_LEVEL_NAMES,
  WM_PASS_SCORE,
  wmLevelLabel,
  type WordMissionLevel,
} from "@/lib/wordMission/types";
import { vaultWordFromVocabTerm } from "@/lib/wordMission/vaultAdapter";
import type { PracticeLevel } from "@/lib/pronunciationVault";
import type { VocabItemProgress } from "@/utils/spacedRepetition";
import { useCallback, useEffect, useMemo, useState } from "react";

const LEVELS: WordMissionLevel[] = [1, 2, 3, 4];

type Props = {
  item: IcaoVocabularyItem;
  progress: VocabItemProgress;
  practiceLevel: WordMissionLevel;
  missionLegActive: boolean;
  onPracticeLevelChange: (level: WordMissionLevel) => void;
  onProgressRefresh: () => void;
  onLevelAdvanced: (level: WordMissionLevel) => void;
  onSelectNextMissionTerm: () => void;
};

function isLevelLocked(progress: VocabItemProgress, level: WordMissionLevel): boolean {
  if (progress.levelsPassed?.[level]) return false;
  const current = nextVocabMissionLevel(progress);
  return level > current;
}

function speakTextForLevel(item: IcaoVocabularyItem, level: WordMissionLevel): string {
  return getLevelText(item, level);
}

export default function WordMissionSession({
  item,
  progress,
  practiceLevel,
  missionLegActive,
  onPracticeLevelChange,
  onProgressRefresh,
  onLevelAdvanced,
  onSelectNextMissionTerm,
}: Props) {
  const vaultWord = useMemo(() => vaultWordFromVocabTerm(item), [item]);
  const termComplete = isVocabMissionTermComplete(progress);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const levelsDone = LEVELS.filter((l) => progress.levelsPassed?.[l]).length;
  const showListen = practiceLevel >= 3;

  useEffect(() => {
    publishActivePronunciationWord(item.term);
  }, [item.id, item.term]);

  useEffect(() => {
    onPracticeLevelChange(nextVocabMissionLevel(progress));
  }, [item.id, progress, onPracticeLevelChange]);

  const onWordMissionRecord = useCallback(
    (
      assessment: import("@/lib/azure/pronunciation").AzurePronunciationResult,
      score: number,
      level: PracticeLevel,
    ) => {
      const result = recordWordMissionLevelAttempt(item.id, level, assessment);
      onProgressRefresh();
      if (result.passed && !result.termComplete) {
        onLevelAdvanced(level);
        const next = nextVocabMissionLevel(result.progress);
        onPracticeLevelChange(next);
      }
      setLastScore(score);
      return { levelPassed: result.passed, termComplete: result.termComplete };
    },
    [item.id, onLevelAdvanced, onPracticeLevelChange, onProgressRefresh],
  );

  const recording = usePronunciationRecordingController({
    activeWord: vaultWord,
    practiceLevel,
    missionLegActive,
    mission: null,
    wordMissionTermId: item.id,
    onWordMissionRecord,
    onVaultRefresh: () => {},
    onMissionProgress: () => {},
    onSelectNextMissionWord: () => onSelectNextMissionTerm(),
    onWordAdvanced: () => {},
    onWordCleared: () => {},
  });

  const { micUi, captainNote, captainDebrief, recordNotice, azureEnvMissing, state: recorderState } =
    recording;

  useEffect(() => {
    if (recorderState.phase !== "success" || recorderState.score == null) return;
    setLastScore(recorderState.score);
  }, [recorderState.phase, recorderState.score]);

  if (termComplete) {
    return (
      <section className="vocab-mission-complete word-mission-complete">
        <h3>Term complete</h3>
        <p className="sub">All four levels passed — {item.term} is ready for operational use.</p>
      </section>
    );
  }

  const speakText = speakTextForLevel(item, practiceLevel);
  const azureWords =
    recorderState.assessment?.words?.filter((w) => w.errorType && w.errorType !== "None") ?? [];

  return (
    <div className="vocab-studio-training vocab-mission-panel word-mission-panel">
      <p className="vocab-mission-badge vocab-mission-badge-inline">Engine Start · Word Mission</p>

      <div className="vocab-studio-hero word-mission-hero">
        <div className="vocab-studio-hero-top">
          <h2 className="vocab-studio-hero-term word-mission-term">
            <CaptainDeltaTarget id="word-mission-term" className="cdv-pronunciation-word">
              {item.term}
            </CaptainDeltaTarget>
            <WordPhoneticHint word={item.term} className="vault-word-phonetic word-mission-phonetic" />
          </h2>
          <div className="vocab-studio-hero-score word-mission-level-score" aria-label="Levels passed">
            <strong>{levelsDone}</strong>
            <span>/4 levels</span>
          </div>
        </div>

        <p className="vocab-studio-hero-meaning word-mission-meaning-line">
          <span className="word-mission-meaning-label">Meaning</span>
          {item.meaning}
        </p>

        <div
          className="word-mission-level-tabs pron-level-tabs"
          role="tablist"
          aria-label="Word Mission levels"
        >
          {LEVELS.map((l) => {
            const locked = isLevelLocked(progress, l);
            const passed = !!progress.levelsPassed?.[l];
            const active = l === practiceLevel;
            return (
              <button
                key={l}
                type="button"
                role="tab"
                id={`wm-level-tab-${l}`}
                aria-selected={active}
                aria-controls="wm-level-panel"
                tabIndex={active ? 0 : -1}
                disabled={locked}
                className={`pron-level-tab word-mission-level-tab ${active ? "active" : ""} ${passed ? "passed" : ""} ${locked ? "locked" : ""}`}
                onClick={() => {
                  if (!locked) onPracticeLevelChange(l);
                }}
              >
                L{l}
                <span className="word-mission-level-tab-name">{WM_LEVEL_NAMES[l]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div id="wm-level-panel" role="tabpanel" className="word-mission-body">
        <div className="word-mission-level-head">
          <span className="vocab-mission-level-label">{wmLevelLabel(practiceLevel)}</span>
        </div>

        <div className="word-mission-content-card">
          {practiceLevel === 1 && (
            <>
              <p className="word-mission-content-label">Definition</p>
              <p className="word-mission-definition">{item.meaning}</p>
            </>
          )}
          {practiceLevel === 2 && (
            <>
              <p className="word-mission-content-label">Pilot phrase</p>
              <p className="word-mission-phrase">{getLevelText(item, 2)}</p>
            </>
          )}
          {practiceLevel === 3 && (
            <>
              <p className="word-mission-content-label">Aviation sentence</p>
              <p className="word-mission-phrase">{getLevelText(item, 3)}</p>
            </>
          )}
          {practiceLevel === 4 && (
            <>
              <p className="word-mission-content-label">ICAO use</p>
              <p className="word-mission-phrase word-mission-icao">{getLevelText(item, 4)}</p>
            </>
          )}
        </div>

        <div className="vocab-studio-practice-box word-mission-speak-box">
          <span className="vocab-studio-practice-label">Speak this</span>
          <p className="vocab-studio-practice-text">{speakText}</p>
        </div>

        {(captainDebrief || captainNote) && (
          <div className="word-mission-captain-block">
            {captainDebrief ? (
              <div className="pron-captain-coaching-card word-mission-coaching">
                <h3 className="pron-captain-coaching-title">Captain Delta</h3>
                <p className="pron-captain-coaching-message">{captainDebrief.message}</p>
                {captainDebrief.focusLabel && (
                  <p className="pron-captain-coaching-focus">Focus: {captainDebrief.focusLabel}</p>
                )}
              </div>
            ) : (
              <p className="pron-captain-feedback word-mission-captain-note">{captainNote}</p>
            )}
          </div>
        )}

        <footer className="word-mission-recorder-foot">
          {azureEnvMissing && (
            <p className="voice-coach-warn word-mission-warn">
              Azure Speech is not configured. Use Captain mic when speech keys are set.
            </p>
          )}

          {showListen && (
            <div className="word-mission-listen-row">
              <button
                type="button"
                className="btn secondary btn-sm word-mission-listen-btn"
                onClick={() => void recording.listen()}
                disabled={isPronunciationRecordingActive(recorderState.phase)}
                aria-label="Listen to model pronunciation"
              >
                Listen
              </button>
              <p className="word-mission-listen-hint">Hear the model, then speak with Captain.</p>
            </div>
          )}

          <div
            className={`pron-captain-recorder-panel word-mission-recorder-status pron-captain-recorder-panel--${micUi.visualState}`}
            role="status"
            aria-live="polite"
          >
            <p className="pron-captain-recorder-line">
              <span className="pron-captain-recorder-label">Captain Recorder</span>
              <span aria-hidden> · </span>
              <span
                className={`pron-captain-recorder-status pron-captain-recorder-status--${micUi.visualState}`}
              >
                {missionCardStatusLine(recorderState.phase)}
              </span>
            </p>
          </div>

          {recordNotice && micUi.phase === "idle" && (
            <p className="pron-recording-state pron-recording-state-error" role="alert">
              {recordNotice}
            </p>
          )}

          {lastScore !== null && (
            <p
              className={`vault-practice-result word-mission-score ${lastScore >= WM_PASS_SCORE ? "good" : "bad"}`}
            >
              {lastScore}% — {WM_LEVEL_NAMES[practiceLevel]}
              {lastScore >= WM_PASS_SCORE ? " · Passed" : " · Try again"}
            </p>
          )}

          {recorderState.assessment && azureWords.length > 0 && (
            <details className="pron-captain-technical word-mission-technical">
              <summary>Pronunciation details</summary>
              <div className="voice-coach-azure-scores vault-azure-scores word-mission-azure-scores">
                <div className="voice-score">
                  <strong>{recorderState.assessment.accuracyScore}</strong>
                  <span>accuracy</span>
                </div>
                <div className="voice-score">
                  <strong>{recorderState.assessment.fluencyScore}</strong>
                  <span>fluency</span>
                </div>
              </div>
              {azureWords.map((w) => (
                <p key={w.word} className="vault-word-azure-detail">
                  {w.word}: {w.accuracyScore}% — {errorTypeLabel(w.errorType)}
                </p>
              ))}
            </details>
          )}
        </footer>
      </div>
    </div>
  );
}
