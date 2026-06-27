"use client";

import { useState } from "react";
import YouGlishLink from "@/components/YouGlishLink";
import { useAzureSpeech } from "@/hooks/useAzureSpeech";
import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import { errorTypeLabel } from "@/lib/azure/pronunciation";
import type { VocabItemProgress } from "@/utils/spacedRepetition";
import { pronunciationScore, scoreTier, scoreTierLabel } from "@/utils/spacedRepetition";

type Props = {
  referenceText: string;
  termLabel: string;
  progress: VocabItemProgress;
  onResult: (score: number, assessment: AzurePronunciationResult | null) => void;
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

  const handleListen = async () => {
    try {
      await azure.speak(referenceText);
    } catch {
      /* error set in hook */
    }
  };

  const handleRecord = async () => {
    if (azure.recording) {
      const assessment = await azure.stopRecording();
      const score = assessment
        ? pronunciationScore(
            assessment.accuracyScore,
            assessment.fluencyScore,
            assessment.completenessScore,
          )
        : 0;
      setLastScore(score);
      setLastAssessment(assessment);
      onResult(score, assessment);
      return;
    }
    setLastScore(null);
    setLastAssessment(null);
    await azure.startRecording(referenceText);
  };

  const handleTryAgain = () => {
    setLastScore(null);
    setLastAssessment(null);
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
          disabled={azure.speaking || azure.recording}
        >
          {azure.speaking ? "🔊 Playing…" : "🔊 Listen"}
        </button>
        <button
          type="button"
          className={`btn ${azure.recording ? "orange" : "green"}`}
          onClick={handleRecord}
          disabled={azure.speaking || !azure.configured}
        >
          {azure.recording ? "⏹ Stop & evaluate" : "● Record"}
        </button>
        {displayScore !== null && !azure.recording && (
          <button type="button" className="btn secondary" onClick={handleTryAgain}>
            Try again
          </button>
        )}
        {onNext && displayScore !== null && !azure.recording && (
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
