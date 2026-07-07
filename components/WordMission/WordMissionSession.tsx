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
import { buildWordMissionLesson } from "@/lib/wordMission/lesson/lessonEngine";
import {
  advanceLessonContext,
  createLessonContext,
  currentPhaseContent,
  groupedPhaseLabel,
  isLessonComplete,
  practiceLevelForPhase,
  shouldEnableRecording,
} from "@/lib/wordMission/lesson/lessonFlow";
import {
  WORD_MISSION_PHASE_ORDER,
  WORD_MISSION_PHASE_LABELS,
  type WordMissionPhaseId,
} from "@/lib/wordMission/lesson/types";
import { recordWordMissionLevelAttempt } from "@/lib/wordMission/progress";
import { WM_PASS_SCORE, type WordMissionLevel } from "@/lib/wordMission/types";
import { vaultWordFromVocabTerm } from "@/lib/wordMission/vaultAdapter";
import type { PracticeLevel } from "@/lib/pronunciationVault";
import type { VocabItemProgress } from "@/utils/spacedRepetition";
import { useCallback, useEffect, useMemo, useState } from "react";

const PHASE_GROUPS = ["Brief", "Learn", "Speak", "Master", "Fly"] as const;

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
  const lesson = useMemo(() => buildWordMissionLesson(item), [item]);
  const termComplete = isVocabMissionTermComplete(progress);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [lessonCtx, setLessonCtx] = useState(() => createLessonContext(lesson));

  useEffect(() => {
    setLessonCtx(createLessonContext(lesson));
  }, [lesson]);

  const phase = currentPhaseContent(lessonCtx);
  const recordingEnabled = shouldEnableRecording(lessonCtx);
  const showListen = practiceLevel >= 3 || lessonCtx.phaseIndex >= 4;

  useEffect(() => {
    publishActivePronunciationWord(item.term);
  }, [item.id, item.term]);

  useEffect(() => {
    onPracticeLevelChange(practiceLevelForPhase(lessonCtx.currentPhaseId));
  }, [lessonCtx.currentPhaseId, onPracticeLevelChange]);

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

  const advancePhase = useCallback(() => {
    setLessonCtx((prev) => {
      const next = advanceLessonContext(prev);
      if (isLessonComplete(next)) return next;
      return next;
    });
  }, []);

  if (termComplete) {
    return (
      <section className="vocab-mission-complete word-mission-complete">
        <h3>Mission complete</h3>
        <p className="sub">
          You learned how real pilots use &ldquo;{item.term}&rdquo; — not just the dictionary definition.
        </p>
      </section>
    );
  }

  const speakText = speakTextForLevel(item, practiceLevel);
  const azureWords =
    recorderState.assessment?.words?.filter((w) => w.errorType && w.errorType !== "None") ?? [];
  const activeGroup = groupedPhaseLabel(lessonCtx.currentPhaseId);

  return (
    <div className="vocab-studio-training vocab-mission-panel word-mission-panel">
      <p className="vocab-mission-badge vocab-mission-badge-inline">Micro-flight · Word Mission 2.0</p>

      <div className="vocab-studio-hero word-mission-hero">
        <div className="vocab-studio-hero-top">
          <h2 className="vocab-studio-hero-term word-mission-term">
            <CaptainDeltaTarget id="word-mission-term" className="cdv-pronunciation-word">
              {item.term}
            </CaptainDeltaTarget>
            <WordPhoneticHint word={item.term} className="vault-word-phonetic word-mission-phonetic" />
          </h2>
          <div className="word-mission-lesson-progress" aria-label="Lesson progress">
            <strong>{lessonCtx.phaseIndex + 1}</strong>
            <span>/{WORD_MISSION_PHASE_ORDER.length}</span>
          </div>
        </div>

        <div
          className="word-mission-lesson-groups"
          role="tablist"
          aria-label="Word Mission lesson groups"
        >
          {PHASE_GROUPS.map((group) => (
            <span
              key={group}
              className={`word-mission-lesson-group ${group === activeGroup ? "active" : ""}`}
            >
              {group}
            </span>
          ))}
        </div>
      </div>

      <div id="wm-lesson-panel" role="tabpanel" className="word-mission-body">
        <div className="word-mission-level-head">
          <span className="vocab-mission-level-label word-mission-phase-label">
            {phase.label}
          </span>
          <span className="word-mission-phase-hint">
            {phase.studentTurn ? "Your turn — speak out loud" : "Captain Delta"}
          </span>
        </div>

        <div className="word-mission-content-card word-mission-lesson-card">
          <p className="word-mission-content-label">Captain Delta</p>
          <p className="word-mission-lesson-message">{phase.message}</p>
        </div>

        {recordingEnabled && (
          <div className="vocab-studio-practice-box word-mission-speak-box">
            <span className="vocab-studio-practice-label">
              {lessonCtx.currentPhaseId === "micro_challenge" ? "Micro challenge" : "Speak this"}
            </span>
            <p className="vocab-studio-practice-text">{speakText}</p>
          </div>
        )}

        {!isLessonComplete(lessonCtx) && (
          <div className="word-mission-lesson-nav">
            <button type="button" className="btn purple btn-sm" onClick={advancePhase}>
              Continue sortie
            </button>
          </div>
        )}

        {isLessonComplete(lessonCtx) && (
          <div className="word-mission-lesson-nav">
            <button type="button" className="btn purple" onClick={onSelectNextMissionTerm}>
              Next mission
            </button>
          </div>
        )}

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

          {showListen && recordingEnabled && (
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

          {recordingEnabled && (
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
              {lastScore}% — {WORD_MISSION_PHASE_LABELS[lessonCtx.currentPhaseId as WordMissionPhaseId]}
              {lastScore >= WM_PASS_SCORE ? " · Solid readback" : " · Try again"}
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
