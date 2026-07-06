"use client";

import { useState } from "react";
import { useAzurePronunciation } from "@/hooks/useAzurePronunciation";
import { warnCaptain } from "@/lib/captainDelta/devLog";
import { emitCaptainDeltaSuggestion } from "@/lib/captainDelta/events";
import { buildPart2StepCoaching } from "@/lib/captainDelta/part2StepCoaching";
import { fetchEvaluation } from "@/lib/evaluate/clientEvaluate";
import { saveEvaluationRecord } from "@/lib/evaluate/saveEvaluation";
import type { EvaluateFeedback, EvaluateType } from "@/lib/evaluate/types";

type Props = {
  question: string;
  modelAnswer: string;
  evaluateType: EvaluateType;
  /** Heading when model is revealed, e.g. "Readback modelo (ICAO 5)". */
  modelTitle?: string;
  /** Step label for Captain coaching, e.g. "Seu readback". */
  stepLabel?: string;
  onComplete: (feedback: EvaluateFeedback, audioBlob: Blob | null) => void;
  onRetry: () => void;
  completed?: EvaluateFeedback | null;
};

export default function Part2SimulationRecord({
  question,
  modelAnswer,
  evaluateType,
  modelTitle = "Modelo ICAO 5",
  stepLabel = "This response",
  onComplete,
  onRetry,
  completed,
}: Props) {
  const azure = useAzurePronunciation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModel, setShowModel] = useState(false);

  const finishAzure = async () => {
    setLoading(true);
    setError(null);
    try {
      const { assessment, audioBlob } = await azure.stop();
      const text = assessment?.recognizedText?.trim() ?? "";
      if (!text) {
        setError("Nenhuma fala detectada. Fale mais alto e tente de novo.");
        return;
      }
      const feedback = await fetchEvaluation(text, question, modelAnswer, evaluateType, assessment ?? undefined);
      const coaching = buildPart2StepCoaching(feedback, stepLabel);
      emitCaptainDeltaSuggestion({
        text: coaching.text,
        speechText: coaching.speechText,
        kind: "coaching",
        primaryAction: { id: "ready", label: "Continue", primary: true },
      });
      onComplete(feedback, audioBlob);
    } catch (err) {
      warnCaptain("part2SimulationRecord", "Assessment failed after recording", err);
      setError("Erro ao avaliar. Tente gravar novamente.");
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    setError(null);
    azure.clear();
    await azure.start(modelAnswer, evaluateType);
  };

  if (completed) {
    const level = completed.icaoLevel?.overall;
    return (
      <div className="part2-sim-record done">
        <button
          type="button"
          className="btn secondary btn-sm part2-show-model-btn"
          onClick={() => setShowModel((v) => !v)}
        >
          {showModel ? "Esconder modelo" : "Mostrar modelo ICAO 5"}
        </button>
        {showModel && (
          <div className="part2-model-answer part2-model-answer-primary">
            <h3>{modelTitle}</h3>
            <p>{modelAnswer}</p>
          </div>
        )}
        <p className="part2-sim-record-status">
          ✓ Gravação avaliada{level != null ? ` · ICAO ${level} nesta resposta` : ""}
        </p>
        {completed.transcript && (
          <p className="part2-sim-record-transcript">
            <strong>Você disse:</strong> {completed.transcript}
          </p>
        )}
        <button type="button" className="btn secondary btn-sm" onClick={onRetry}>
          Gravar de novo
        </button>
      </div>
    );
  }

  if (!azure.configured) {
    return (
      <div className="part2-sim-record blocked">
        <p className="voice-coach-error">
          Azure Speech é obrigatório na simulação. Configure <code>AZURE_SPEECH_KEY</code> e{" "}
          <code>AZURE_SPEECH_REGION</code> no <code>.env</code> e reinicie o servidor.
        </p>
      </div>
    );
  }

  return (
    <div className="part2-sim-record">
      <button
        type="button"
        className="btn secondary btn-sm part2-show-model-btn"
        onClick={() => setShowModel((v) => !v)}
      >
        {showModel ? "Esconder modelo" : "Mostrar modelo ICAO 5"}
      </button>
      {showModel && (
        <div className="part2-model-answer part2-model-answer-primary">
          <h3>{modelTitle}</h3>
          <p>{modelAnswer}</p>
        </div>
      )}
      <p className="part2-sim-record-hint">
        Grave sua resposta com Azure — pronúncia e conteúdo serão avaliados ao final da simulação.
      </p>
      <div className="voice-coach-actions">
        {!azure.assessing ? (
          <button type="button" className="btn green" data-record-source="legacy" onClick={startRecording} disabled={loading}>
            ● Gravar resposta
          </button>
        ) : (
          <button type="button" className="btn orange" onClick={finishAzure} disabled={loading}>
            {loading ? "Avaliando…" : "⏹ Parar e enviar"}
          </button>
        )}
      </div>
      {(error || azure.error) && <p className="voice-coach-error">{error || azure.error}</p>}
      {azure.result?.recognizedText && !completed && (
        <p className="part2-sim-record-transcript">
          <strong>Transcrição:</strong> {azure.result.recognizedText}
        </p>
      )}
    </div>
  );
}
