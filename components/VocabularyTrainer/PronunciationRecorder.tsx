"use client";

import { useEffect, useRef, useState } from "react";
import YouGlishLink from "@/components/YouGlishLink";
import VocabRecordingsList from "@/components/VocabularyTrainer/VocabRecordingsList";
import { useAzureSpeech } from "@/hooks/useAzureSpeech";
import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import { errorTypeLabel } from "@/lib/azure/pronunciation";
import type { VocabItemProgress } from "@/utils/spacedRepetition";
import { pronunciationScore, scoreTier, scoreTierLabel } from "@/utils/spacedRepetition";

type Props = {
  referenceText: string;
  termLabel: string;
  progress: VocabItemProgress;
  onResult: (
    score: number,
    assessment: AzurePronunciationResult | null,
    audioBlob: Blob | null,
  ) => Promise<{ audioSaved: boolean; audioError?: string } | void>;
  onMarkDifficult: () => void;
  onMarkMastered: () => void;
  onNext?: () => void;
};

export default function PronunciationRecorder({
  referenceText,
  termLabel,
  progress,
  onResult,
  onMarkDifficult,
  onMarkMastered,
  onNext,
}: Props) {
  const azure = useAzureSpeech();
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [lastAssessment, setLastAssessment] = useState<AzurePronunciationResult | null>(null);
  const [saving, setSaving] = useState(false);
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

  const handleListen = async () => {
    try {
      await azure.speak(referenceText);
    } catch {
      /* error set in hook */
    }
  };

  const handleRecord = async () => {
    if (azure.recording) {
      setSaving(true);
      setAudioNote(null);
      const { assessment, audioBlob } = await azure.stopRecording();
      const score = assessment
        ? pronunciationScore(
            assessment.accuracyScore,
            assessment.fluencyScore,
            assessment.completenessScore,
          )
        : 0;
      setLastScore(score);
      setLastAssessment(assessment);
      setPreview(audioBlob);
      try {
        const outcome = await onResult(score, assessment, audioBlob);
        if (outcome?.audioSaved) {
          setAudioNote("Gravação salva — ouça abaixo quando quiser.");
        } else if (outcome?.audioError) {
          setAudioNote(outcome.audioError);
        } else if (audioBlob) {
          setAudioNote("Ouça a prévia abaixo. A gravação será salva na sua conta.");
        }
      } finally {
        setSaving(false);
      }
      return;
    }
    setLastScore(null);
    setLastAssessment(null);
    setAudioNote(null);
    setPreview(null);
    await azure.startRecording(referenceText);
  };

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

  return (
    <div className="vocab-recorder">
      <p className="vocab-recorder-ref">
        <strong>Practice text:</strong> {referenceText}
      </p>

      <div className="vocab-recorder-actions">
        <button
          type="button"
          className="btn secondary"
          onClick={handleListen}
          disabled={azure.speaking || azure.recording || saving}
        >
          {azure.speaking ? "🔊 Playing…" : "🔊 Listen"}
        </button>
        <button
          type="button"
          className={`btn ${azure.recording ? "orange" : "green"}`}
          onClick={handleRecord}
          disabled={azure.speaking || !azure.configured || saving}
        >
          {saving
            ? "Salvando…"
            : azure.recording
              ? "⏹ Stop & evaluate"
              : "● Record"}
        </button>
        {displayScore !== null && !azure.recording && !saving && (
          <button type="button" className="btn secondary" onClick={handleTryAgain}>
            Try again
          </button>
        )}
        {onNext && displayScore !== null && !azure.recording && !saving && (
          <button type="button" className="btn secondary" onClick={onNext}>
            Next →
          </button>
        )}
      </div>

      <div className="vault-youglish-row">
        <YouGlishLink word={termLabel} />
      </div>

      {!azure.configured && (
        <p className="voice-coach-warn">Configure AZURE_SPEECH_KEY e AZURE_SPEECH_REGION no servidor.</p>
      )}
      {azure.error && <p className="voice-coach-error">{azure.error}</p>}
      {audioNote && <p className="voice-coach-warn">{audioNote}</p>}

      {previewUrl && (
        <div className="vocab-preview-audio">
          <p className="vocab-preview-label">Prévia desta gravação</p>
          <audio className="exam-audio evaluation-audio" controls preload="metadata" src={previewUrl} />
        </div>
      )}

      <div className="vocab-recorder-stats">
        <span>Best: <strong>{progress.bestScore}</strong></span>
        <span>Attempts: <strong>{progress.attempts}</strong></span>
        <span>Last: <strong>{progress.lastScore}</strong></span>
      </div>

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

      <VocabRecordingsList recordings={progress.recordings} />

      <div className="vocab-recorder-extra">
        <button type="button" className="btn secondary btn-sm" onClick={onMarkDifficult}>
          Mark difficult
        </button>
        <button type="button" className="btn secondary btn-sm" onClick={onMarkMastered}>
          Mark mastered
        </button>
      </div>
    </div>
  );
}
