"use client";

import { useEffect, useMemo, useState } from "react";
import { useAzureSpeech } from "@/hooks/useAzureSpeech";
import { useAzurePronunciation } from "@/hooks/useAzurePronunciation";
import {
  callsignDrillSteps,
  EXAM_CALLSIGN,
  type CallsignDrillStep,
} from "@/lib/callsignSpeech";
import { markWarmupSatisfied } from "@/lib/part2Warmup";
import { VAULT_PASS_SCORE } from "@/lib/pronunciationVault";

type Props = {
  initialOpen?: boolean;
};

export default function CallsignDrillPanel({ initialOpen = true }: Props) {
  const steps = useMemo(() => callsignDrillSteps(EXAM_CALLSIGN), []);
  const [open, setOpen] = useState(initialOpen);
  const [stepId, setStepId] = useState<CallsignDrillStep["id"]>("full");
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [heard, setHeard] = useState<string | null>(null);
  const azure = useAzurePronunciation();
  const speech = useAzureSpeech();

  const step = steps.find((s) => s.id === stepId) ?? steps[0];

  useEffect(() => {
    if (initialOpen) setOpen(true);
  }, [initialOpen]);

  const resetResult = () => {
    setLastScore(null);
    setHeard(null);
    azure.clear();
  };

  const listenModel = async () => {
    if (!step) return;
    resetResult();
    try {
      await speech.speak(step.referenceText);
    } catch {
      /* speech error surfaced in speech.error */
    }
  };

  const startRecording = async () => {
    if (!step) return;
    setLastScore(null);
    setHeard(null);
    await azure.startWithReference(step.referenceText);
  };

  const stopRecording = async () => {
    const { assessment } = await azure.stop();
    const score = assessment?.accuracyScore ?? 0;
    setLastScore(score);
    setHeard(assessment?.recognizedText ?? null);
    if (score >= VAULT_PASS_SCORE) {
      markWarmupSatisfied();
    }
  };

  if (!open) {
    return (
      <button type="button" className="btn green callsign-drill-toggle" onClick={() => setOpen(true)}>
        📻 Treinar callsign {EXAM_CALLSIGN}
      </button>
    );
  }

  return (
    <article className="card card-essential part2-card callsign-drill-card">
      <header className="callsign-drill-head">
        <div>
          <span className="badge">Callsign SDEA</span>
          <h2 className="question">Como falar {EXAM_CALLSIGN}</h2>
          <p className="sub">
            Na SDEA fala-se <strong>ANAC 123</strong> junto — bloco “ANAC” + dígitos separados (wun too
            tree). Não é alfabeto fonético letra a letra.
          </p>
        </div>
        <button type="button" className="btn secondary btn-sm" onClick={() => setOpen(false)}>
          Fechar
        </button>
      </header>

      <div className="callsign-drill-reference">
        <div className="callsign-drill-written">
          <span className="callsign-drill-label">Escrito</span>
          <strong>{step?.display}</strong>
        </div>
        <div className="callsign-drill-spoken">
          <span className="callsign-drill-label">Fale assim</span>
          <strong>{step?.referenceText}</strong>
        </div>
      </div>

      <div className="callsign-drill-steps" role="tablist" aria-label="Etapas do callsign">
        {steps.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={stepId === s.id}
            className={`filter-chip ${stepId === s.id ? "active" : ""}`}
            onClick={() => {
              setStepId(s.id);
              resetResult();
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {step && <p className="callsign-drill-hint">{step.hint}</p>}

      <div className="callsign-drill-actions">
        <button
          type="button"
          className="btn secondary"
          disabled={!speech.configured || speech.speaking || azure.assessing}
          onClick={() => void listenModel()}
        >
          {speech.speaking ? "Ouvindo…" : "🔊 Ouvir modelo"}
        </button>
        {!azure.assessing ? (
          <button
            type="button"
            className="btn green"
            disabled={!azure.configured}
            onClick={() => void startRecording()}
          >
            ● Gravar
          </button>
        ) : (
          <button type="button" className="btn orange" onClick={() => void stopRecording()}>
            ⏹ Parar e avaliar
          </button>
        )}
      </div>

      {lastScore !== null && (
        <div className="callsign-drill-result">
          <p>
            <strong>{lastScore}%</strong> accuracy
            {lastScore >= VAULT_PASS_SCORE ? " — bom para usar no Part 2 ✓" : ` — meta ≥${VAULT_PASS_SCORE}%`}
          </p>
          {heard && (
            <p className="voice-coach-transcript">
              <strong>Azure ouviu:</strong> {heard}
            </p>
          )}
        </div>
      )}

      {(azure.error || speech.error) && (
        <p className="voice-coach-error">{azure.error ?? speech.error}</p>
      )}
    </article>
  );
}
