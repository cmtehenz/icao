"use client";

import { useEffect, useRef, useState } from "react";
import { useAzurePronunciation } from "@/hooks/useAzurePronunciation";
import { fetchEvaluation } from "@/lib/evaluate/clientEvaluate";
import type { EvaluateFeedback, EvaluateType } from "@/lib/evaluate/types";

type Props = {
  question: string;
  modelAnswer: string;
  evaluateType: EvaluateType;
  keywords?: string[];
  prepSeconds?: number;
  answerSeconds?: number;
  onComplete: (
    feedback: EvaluateFeedback,
    audioBlob: Blob | null,
    meta?: { durationSec: number; pauseCount: number },
  ) => void;
};

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function SimuladoRecordPanel({
  question,
  modelAnswer,
  evaluateType,
  keywords,
  prepSeconds = 0,
  answerSeconds = 60,
  onComplete,
}: Props) {
  const azure = useAzurePronunciation();
  const [phase, setPhase] = useState<"prep" | "record" | "done">(prepSeconds > 0 ? "prep" : "record");
  const [countdown, setCountdown] = useState(prepSeconds > 0 ? prepSeconds : answerSeconds);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);
  const recordStartRef = useRef<number | null>(null);

  useEffect(() => {
    setPhase(prepSeconds > 0 ? "prep" : "record");
    setCountdown(prepSeconds > 0 ? prepSeconds : answerSeconds);
    setError(null);
    startedRef.current = false;
    azure.clear();
  }, [question]);

  useEffect(() => {
    if (phase === "done") return;
    const timer = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "prep" || prepSeconds <= 0) return;
    if (countdown > 0) return;
    setPhase("record");
    setCountdown(answerSeconds);
    void startRecording();
  }, [phase, countdown, prepSeconds, answerSeconds]);

  useEffect(() => {
    if (phase !== "record" || azure.assessing || startedRef.current) return;
    void startRecording();
  }, [phase]);

  const startRecording = async () => {
    if (startedRef.current && azure.assessing) return;
    startedRef.current = true;
    recordStartRef.current = Date.now();
    setError(null);
    azure.clear();
    await azure.start(modelAnswer, evaluateType);
  };

  const finishRecording = async () => {
    setLoading(true);
    setError(null);
    try {
      const { assessment, audioBlob } = await azure.stop();
      const text = assessment?.recognizedText?.trim() ?? "";
      if (!text) {
        setError("Nenhuma fala detectada. Tente novamente.");
        startedRef.current = false;
        return;
      }
      const feedback = await fetchEvaluation(
        text,
        question,
        modelAnswer,
        evaluateType,
        assessment ?? undefined,
        keywords,
      );
      const durationSec = recordStartRef.current
        ? Math.max(1, Math.round((Date.now() - recordStartRef.current) / 1000))
        : 0;
      const pauseCount =
        assessment && assessment.fluencyScore < 70
          ? Math.max(1, Math.round((70 - assessment.fluencyScore) / 15))
          : 0;
      setPhase("done");
      onComplete(feedback, audioBlob, { durationSec, pauseCount });
    } catch {
      setError("Erro ao avaliar. Tente gravar novamente.");
      startedRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  if (azure.envConfigured === null) {
    return (
      <div className="sim-record">
        <p className="sub">Verificando Azure Speech…</p>
      </div>
    );
  }

  if (azure.envMissing || !azure.configured) {
    return (
      <div className="sim-record blocked">
        <p className="voice-coach-error">
          {azure.envMissing
            ? "Azure Speech é obrigatório. Configure AZURE_SPEECH_KEY e AZURE_SPEECH_REGION no servidor."
            : (azure.error ?? "Azure Speech indisponível. Faça login e tente de novo.")}
        </p>
      </div>
    );
  }

  return (
    <div className="sim-record">
      <div className="sim-timer" aria-live="polite">
        <span className="sim-timer-label">{phase === "prep" ? "Prepare" : "Time"}</span>
        <strong className="sim-timer-value">{formatTime(countdown)}</strong>
      </div>

      {phase === "prep" && (
        <p className="sim-record-hint">Prepare sua resposta. A gravação começa ao fim do tempo.</p>
      )}

      <div className="sim-mic-wrap">
        {phase === "prep" ? (
          <button
            type="button"
            className="sim-mic-btn"
            onClick={() => {
              setPhase("record");
              setCountdown(answerSeconds);
              void startRecording();
            }}
          >
            <span className="sim-mic-icon">▶</span>
            <span>Começar agora</span>
          </button>
        ) : phase !== "done" ? (
          <button
            type="button"
            className={`sim-mic-btn${azure.assessing ? " recording" : ""}`}
            onClick={() => void finishRecording()}
            disabled={loading || !azure.assessing}
          >
            {azure.assessing && <span className="sim-mic-pulse" aria-hidden />}
            <span className="sim-mic-icon">{azure.assessing ? "●" : "🎤"}</span>
            <span>{loading ? "Avaliando…" : azure.assessing ? "Parar e enviar" : "Iniciando…"}</span>
          </button>
        ) : (
          <p className="sim-record-done">✓ Resposta gravada e avaliada</p>
        )}
      </div>

      {azure.assessing && (
        <div className="sim-wave" aria-hidden>
          <span /><span /><span /><span /><span />
        </div>
      )}

      {(error || azure.error) && <p className="voice-coach-error">{error || azure.error}</p>}
      {azure.result?.recognizedText && phase !== "done" && (
        <p className="sim-transcript">
          <strong>Ouvindo:</strong> {azure.result.recognizedText}
        </p>
      )}
    </div>
  );
}
