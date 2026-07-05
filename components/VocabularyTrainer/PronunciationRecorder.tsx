"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import YouGlishLink from "@/components/YouGlishLink";
import VocabRecordingsList from "@/components/VocabularyTrainer/VocabRecordingsList";
import { useAzureSpeech } from "@/hooks/useAzureSpeech";
import { useVocabularyCaptainBridge } from "@/hooks/useVocabularyCaptainBridge";
import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import { errorTypeLabel } from "@/lib/azure/pronunciation";
import { AZURE_RECOVERY_GUIDANCE } from "@/lib/vocabCoach";
import { VB_PASS_SCORE } from "@/lib/vocabGraduation";
import type { VocabItemProgress } from "@/utils/spacedRepetition";
import { pronunciationScore, scoreTier, scoreTierLabel } from "@/utils/spacedRepetition";

type Props = {
  referenceText: string;
  termLabel: string;
  progress: VocabItemProgress;
  missionLegActive?: boolean;
  onResult: (
    score: number,
    assessment: AzurePronunciationResult | null,
    audioBlob: Blob | null,
  ) => Promise<{ audioSaved: boolean; audioError?: string; assessed?: boolean } | void>;
  onMarkDifficult: () => void;
  onMarkMastered: () => void;
  onNext?: () => void;
};

export default function PronunciationRecorder({
  referenceText,
  termLabel,
  progress,
  missionLegActive = false,
  onResult,
  onMarkDifficult,
  onMarkMastered,
  onNext,
}: Props) {
  const azure = useAzureSpeech();
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [lastAssessment, setLastAssessment] = useState<AzurePronunciationResult | null>(null);
  const [assessingPending, setAssessingPending] = useState(false);
  const [assessmentUnavailable, setAssessmentUnavailable] = useState(false);
  const [audioNote, setAudioNote] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
        previewRef.current = null;
      }
    };
  }, []);

  const setPreview = (blob: Blob | null) => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
    }
    if (!blob) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(blob);
    previewRef.current = url;
    setPreviewUrl(url);
  };

  const handleListen = useCallback(async () => {
    try {
      await azure.speak(referenceText);
    } catch {
      /* error set in hook */
    }
  }, [azure, referenceText]);

  const startRecording = useCallback(async () => {
    setLastScore(null);
    setLastAssessment(null);
    setAssessmentUnavailable(false);
    setAudioNote(null);
    setPreview(null);
    await azure.startRecording(referenceText);
  }, [azure, referenceText]);

  const stopAndAssess = useCallback(async () => {
    setAssessingPending(true);
    setAudioNote(null);
    try {
      const { assessment, audioBlob } = await azure.stopRecording();
      if (!assessment) {
        setLastScore(null);
        setLastAssessment(null);
        setAssessmentUnavailable(true);
        setPreview(audioBlob);
        await onResult(0, null, audioBlob);
        return;
      }
      const score = pronunciationScore(
        assessment.accuracyScore,
        assessment.fluencyScore,
        assessment.completenessScore,
      );
      setLastScore(score);
      setLastAssessment(assessment);
      setPreview(audioBlob);
      const outcome = await onResult(score, assessment, audioBlob);
      if (outcome?.audioSaved) {
        setAudioNote("Recording saved — listen below anytime.");
      } else if (outcome?.audioError) {
        setAudioNote(outcome.audioError);
      } else if (audioBlob) {
        setAudioNote("Preview below — recording saves to your account.");
      }
    } finally {
      setAssessingPending(false);
    }
  }, [azure, onResult]);

  const handleRecord = async () => {
    if (azure.recording) {
      await stopAndAssess();
      return;
    }
    await startRecording();
  };

  useVocabularyCaptainBridge({
    termLabel: missionLegActive ? termLabel : null,
    azureRecording: azure.recording,
    speechSpeaking: azure.speaking,
    azureConfigured: azure.configured,
    onStartRecord: () => void startRecording(),
    onStopRecord: () => void stopAndAssess(),
    onListen: () => void handleListen(),
  });

  const handleTryAgain = () => {
    setLastScore(null);
    setLastAssessment(null);
    setAudioNote(null);
    setPreview(null);
    azure.clear();
  };

  const displayResult = lastAssessment ?? azure.result;
  const displayScore =
    lastScore ??
    (displayResult
      ? pronunciationScore(
          displayResult.accuracyScore,
          displayResult.fluencyScore,
          displayResult.completenessScore,
        )
      : null);

  const tier = displayScore !== null ? scoreTier(displayScore) : null;
  const showRecovery =
    !!azure.error ||
    assessmentUnavailable ||
    (displayScore !== null && displayScore < VB_PASS_SCORE);

  const primaryLabel = azure.recording
    ? "Stop & assess"
    : displayScore !== null && !missionLegActive
      ? "Record again"
      : "Record";

  return (
    <div className={`vocab-recorder ${missionLegActive ? "vocab-recorder-mission" : ""}`}>
      {!missionLegActive && (
        <p className="vocab-recorder-ref">
          <strong>Practice text:</strong> {referenceText}
        </p>
      )}

      {azure.recording && (
        <p className="vocab-recording-state" role="status" aria-live="polite">
          Recording — speak clearly, then tap Stop &amp; assess.
        </p>
      )}
      {assessingPending && (
        <p className="vocab-recording-state vocab-recording-state-assessing" role="status" aria-live="polite">
          Assessing your recording…
        </p>
      )}

      <div
        className={`vocab-recorder-actions ${missionLegActive ? "vocab-recorder-actions-mission" : ""}`}
      >
        <button
          type="button"
          className={missionLegActive ? "btn secondary btn-sm vocab-recorder-listen" : "btn secondary"}
          onClick={() => void handleListen()}
          disabled={azure.speaking || azure.recording || assessingPending}
          aria-label="Listen to model pronunciation"
        >
          {azure.speaking ? "Playing…" : "Listen"}
        </button>
        <button
          type="button"
          className={`btn ${azure.recording ? "orange" : "green"} vocab-recorder-primary`}
          onClick={() => void handleRecord()}
          disabled={azure.speaking || !azure.configured || assessingPending}
        >
          {primaryLabel}
        </button>
        {!missionLegActive && displayScore !== null && !azure.recording && !assessingPending && (
          <button type="button" className="btn secondary" onClick={handleTryAgain}>
            Try again
          </button>
        )}
        {!missionLegActive && onNext && displayScore !== null && !azure.recording && !assessingPending && (
          <button type="button" className="btn secondary" onClick={onNext}>
            Next →
          </button>
        )}
      </div>

      {!missionLegActive && (
        <div className="vault-youglish-row">
          <YouGlishLink word={termLabel} />
        </div>
      )}

      {!azure.configured && (
        <p className="voice-coach-warn">
          Azure Speech is not configured. Add AZURE_SPEECH_KEY and AZURE_SPEECH_REGION.
        </p>
      )}
      {azure.error && <p className="voice-coach-error">{azure.error}</p>}
      {showRecovery && (
        <p className="vocab-recovery-guidance">{AZURE_RECOVERY_GUIDANCE}</p>
      )}
      {audioNote && <p className="voice-coach-warn">{audioNote}</p>}

      {previewUrl && !missionLegActive && (
        <div className="vocab-preview-audio">
          <p className="vocab-preview-label">Recording preview</p>
          <audio className="exam-audio evaluation-audio" controls preload="metadata" src={previewUrl} />
        </div>
      )}

      {!missionLegActive && (
        <div className="vocab-recorder-stats">
          <span>
            Best: <strong>{progress.bestScore}</strong>
          </span>
          <span>
            Attempts: <strong>{progress.attempts}</strong>
          </span>
          <span>
            Last: <strong>{progress.lastScore}</strong>
          </span>
        </div>
      )}

      {displayScore !== null && tier && (
        <div className={`vocab-result-banner tier-${tier}`}>
          <strong>{scoreTierLabel(displayScore)}</strong>
          <span>Pronunciation score: {displayScore}</span>
        </div>
      )}

      {displayResult && (
        <div className="voice-coach-azure-scores vault-azure-scores">
          <div className="voice-score">
            <strong>{displayScore}</strong>
            <span>pronunciation</span>
          </div>
          <div className="voice-score">
            <strong>{displayResult.accuracyScore}</strong>
            <span>accuracy</span>
          </div>
          <div className="voice-score">
            <strong>{displayResult.fluencyScore}</strong>
            <span>fluency</span>
          </div>
          <div className="voice-score">
            <strong>{displayResult.completenessScore}</strong>
            <span>completeness</span>
          </div>
        </div>
      )}

      {displayResult?.words
        .filter((w) => w.errorType && w.errorType !== "None")
        .map((w) => (
          <p key={w.word} className="vault-word-azure-detail">
            {w.word}: {w.accuracyScore}% — {errorTypeLabel(w.errorType)}
          </p>
        ))}

      {!missionLegActive && <VocabRecordingsList recordings={progress.recordings} />}

      {!missionLegActive && (
        <div className="vocab-recorder-extra">
          <button type="button" className="btn secondary btn-sm" onClick={onMarkDifficult}>
            Mark difficult
          </button>
          <button type="button" className="btn secondary btn-sm" onClick={onMarkMastered}>
            Mark mastered
          </button>
        </div>
      )}
    </div>
  );
}
