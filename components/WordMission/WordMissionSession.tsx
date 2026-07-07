"use client";

import CaptainDeltaTarget from "@/components/CaptainDelta/Visual/CaptainDeltaTarget";
import KnowledgeReviewPanel from "@/components/WordMission/KnowledgeReviewPanel";
import WordPhoneticHint from "@/components/WordPhoneticHint";
import { usePronunciationRecordingController } from "@/hooks/usePronunciationRecordingController";
import type { IcaoVocabularyItem } from "@/data/icaoVocabulary";
import { errorTypeLabel } from "@/lib/azure/pronunciation";
import { publishActivePronunciationWord } from "@/lib/captainDelta/lessonContext";
import { missionCardStatusLine } from "@/lib/pronunciation/missionCardStatusLine";
import { isPronunciationRecordingActive } from "@/lib/pronunciation/pronunciationRecordingController";
import {
  isVocabMissionTermComplete,
  nextVocabMissionLevel,
} from "@/lib/vocabGraduation";
import { KNOWLEDGE_REVIEW_ENABLED } from "@/lib/knowledge/review";
import { SKYBRARY_UI_LABEL } from "@/lib/wordMission/lesson/knowledgeSource";
import { buildWordMissionLesson, lessonSpeakTextForLevel } from "@/lib/wordMission/lesson/lessonEngine";
import { shouldEnableRecording, stepIdForLevel } from "@/lib/wordMission/lesson/simpleFlow";
import {
  markWordMissionStepViewed,
  recordWordMissionLevelAttempt,
} from "@/lib/wordMission/progress";
import { WM_LEVEL_NAMES, WM_PASS_SCORE, type WordMissionLevel } from "@/lib/wordMission/types";
import { vaultWordFromVocabTerm } from "@/lib/wordMission/vaultAdapter";
import type { PracticeLevel } from "@/lib/pronunciationVault";
import type { VocabItemProgress } from "@/utils/spacedRepetition";
import { useCallback, useEffect, useMemo, useState } from "react";

const STEPS: WordMissionLevel[] = [1, 2, 3, 4];

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
  const lesson = useMemo(() => buildWordMissionLesson(item), [item]);
  const termComplete = isVocabMissionTermComplete(progress);
  const [lastScore, setLastScore] = useState<number | null>(null);

  const step = lesson.steps[practiceLevel - 1]!;
  const recordingEnabled = shouldEnableRecording(stepIdForLevel(practiceLevel));
  const speakText = lessonSpeakTextForLevel(lesson, practiceLevel);

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
        onPracticeLevelChange(nextVocabMissionLevel(result.progress));
      }
      if (result.termComplete) {
        onSelectNextMissionTerm();
      }
      setLastScore(score);
      return { levelPassed: result.passed, termComplete: result.termComplete };
    },
    [item.id, onLevelAdvanced, onPracticeLevelChange, onProgressRefresh, onSelectNextMissionTerm],
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

  const { micUi, captainDebrief, recordNotice, azureEnvMissing, state: recorderState } = recording;

  useEffect(() => {
    if (recorderState.phase !== "success" || recorderState.score == null) return;
    setLastScore(recorderState.score);
  }, [recorderState.phase, recorderState.score]);

  const continueStep = useCallback(() => {
    if (practiceLevel > 2) return;
    markWordMissionStepViewed(item.id, practiceLevel as 1 | 2);
    onProgressRefresh();
    const next = (practiceLevel + 1) as WordMissionLevel;
    onPracticeLevelChange(next);
    onLevelAdvanced(practiceLevel);
  }, [item.id, onLevelAdvanced, onPracticeLevelChange, onProgressRefresh, practiceLevel]);

  if (termComplete) {
    return (
      <section className="vocab-mission-complete word-mission-complete">
        <h3>Mission complete</h3>
        <p className="sub">
          You learned how pilots use &ldquo;{item.term}&rdquo; — meaning, operations, and ICAO practice.
        </p>
      </section>
    );
  }

  const azureWords =
    recorderState.assessment?.words?.filter((w) => w.errorType && w.errorType !== "None") ?? [];

  return (
    <div className="vocab-studio-training vocab-mission-panel word-mission-panel">
      <p className="vocab-mission-badge vocab-mission-badge-inline">Word Mission</p>

      <div className="vocab-studio-hero word-mission-hero">
        <div className="vocab-studio-hero-top">
          <h2 className="vocab-studio-hero-term word-mission-term">
            <CaptainDeltaTarget id="word-mission-term" className="cdv-pronunciation-word">
              {item.term}
            </CaptainDeltaTarget>
            <WordPhoneticHint word={item.term} className="vault-word-phonetic word-mission-phonetic" />
          </h2>
        </div>

        <div
          className="word-mission-step-tabs"
          role="tablist"
          aria-label="Word Mission steps"
        >
          {STEPS.map((l) => {
            const active = l === practiceLevel;
            const passed = !!progress.levelsPassed?.[l];
            return (
              <button
                key={l}
                type="button"
                role="tab"
                aria-selected={active}
                disabled={l > nextVocabMissionLevel(progress) && !passed}
                className={`word-mission-step-tab ${active ? "active" : ""} ${passed ? "passed" : ""}`}
                onClick={() => {
                  if (l <= nextVocabMissionLevel(progress) || passed) onPracticeLevelChange(l);
                }}
              >
                {WM_LEVEL_NAMES[l]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="word-mission-body word-mission-simple-card">
        <p className="word-mission-step-label">{step.label}</p>

        <div className="word-mission-content-card word-mission-lesson-card">
          <p className="word-mission-content-label">Captain Delta</p>
          <p className="word-mission-lesson-message">{step.captainLine}</p>
          {step.detail && <p className="word-mission-step-detail">{step.detail}</p>}
          {lesson.knowledgeSource?.provider === "skybrary" && (
            <p className="word-mission-source-label">{SKYBRARY_UI_LABEL}</p>
          )}
          {KNOWLEDGE_REVIEW_ENABLED && lesson.knowledgeReview && (
            <KnowledgeReviewPanel review={lesson.knowledgeReview} />
          )}
        </div>

        {recordingEnabled && (
          <div className="vocab-studio-practice-box word-mission-speak-box">
            <span className="vocab-studio-practice-label">Speak this</span>
            <p className="vocab-studio-practice-text">{speakText}</p>
          </div>
        )}

        <div className="word-mission-lesson-nav">
          {!recordingEnabled ? (
            <button type="button" className="btn purple" onClick={continueStep}>
              Continue
            </button>
          ) : (
            <p className="word-mission-action-hint">Use Captain Recorder below — then speak.</p>
          )}
        </div>

        {captainDebrief && recordingEnabled && (
          <div className="word-mission-captain-block">
            <div className="pron-captain-coaching-card word-mission-coaching">
              <p className="pron-captain-coaching-message">{captainDebrief.message}</p>
            </div>
          </div>
        )}

        <footer className="word-mission-recorder-foot">
          {azureEnvMissing && recordingEnabled && (
            <p className="voice-coach-warn word-mission-warn">
              Azure Speech is not configured. Use Captain mic when speech keys are set.
            </p>
          )}

          {recordingEnabled && (
            <>
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
              </div>

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
            </>
          )}

          {recordNotice && micUi.phase === "idle" && recordingEnabled && (
            <p className="pron-recording-state pron-recording-state-error" role="alert">
              {recordNotice}
            </p>
          )}

          {lastScore !== null && recordingEnabled && (
            <p
              className={`vault-practice-result word-mission-score ${lastScore >= WM_PASS_SCORE ? "good" : "bad"}`}
            >
              {lastScore}% — {step.label}
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
            </details>
          )}
        </footer>
      </div>
    </div>
  );
}
