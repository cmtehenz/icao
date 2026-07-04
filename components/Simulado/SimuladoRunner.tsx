"use client";

import { useCallback, useEffect } from "react";
import SimuladoStepView, { formatTime } from "@/components/Simulado/SimuladoStepView";
import { useSimuladoSession } from "@/hooks/useSimuladoSession";
import type { SimuladoSessionConfig, SimuladoStepResult, SimulationReport } from "@/lib/simulado/types";
import { modeLabel } from "@/lib/simulado/buildSteps";

type Props = {
  config: SimuladoSessionConfig;
  onFinish: (report: import("@/lib/simulado/types").SimulationReport) => void;
  onExit: () => void;
};

const PART_LABELS: Record<number, string> = {
  1: "Parte 1",
  2: "Parte 2",
  3: "Parte 3",
  4: "Parte 4",
};

export default function SimuladoRunner({ config, onFinish, onExit }: Props) {
  const session = useSimuladoSession(config);

  const handleRecordComplete = useCallback(
    (result: SimuladoStepResult) => {
      session.addResult(result);
    },
    [session],
  );

  const handleFinish = () => {
    session.finish();
  };

  useEffect(() => {
    if (session.report) onFinish(session.report);
  }, [session.report, onFinish]);

  if (session.report) return null;

  const step = session.currentStep;
  if (!step) {
    return (
      <div className="sim-runner">
        <p>Nenhum passo encontrado para este modo.</p>
        <button type="button" className="btn secondary" onClick={onExit}>Voltar</button>
      </div>
    );
  }

  const existingResult = session.results.find((r) => r.stepId === step.id);

  const nextHint = !session.stepReady
    ? step.kind === "record"
      ? "Grave sua resposta com o microfone para liberar Próximo."
      : step.kind === "listen"
        ? "Ouça o ATC até o fim ou toque no botão verde abaixo do áudio."
        : step.kind === "examiner" || step.kind === "picture"
          ? "Ouça a examinadora ou toque Continuar → no card."
          : null
    : null;

  return (
    <div className="sim-runner">
      <header className="sim-runner-head">
        <div>
          <span className="sim-mode-badge">{modeLabel(config.mode, config.customParts)}</span>
          <span className="sim-exam-badge">Prova {config.examVersion}</span>
        </div>
        <div className="sim-runner-meta">
          <span className="sim-timer-inline">{formatTime(session.elapsedSec)}</span>
          <span className="sim-step-counter">
            {session.stepIndex + 1} / {session.steps.length}
          </span>
        </div>
      </header>

      <div className="sim-part-bar" aria-label="Current part">
        <span>{PART_LABELS[step.part]}</span>
        <div className="sim-progress-track">
          <div className="sim-progress-fill" style={{ width: `${session.progressPct}%` }} />
        </div>
      </div>

      <SimuladoStepView
        step={step}
        notes={session.notes}
        onNoteChange={session.setNote}
        existingResult={existingResult}
        onListenDone={session.markReady}
        onRecordComplete={handleRecordComplete}
      />

      <footer className="sim-runner-foot">
        {nextHint && <p className="sim-next-hint">{nextHint}</p>}
        <button type="button" className="btn secondary" onClick={onExit}>
          Sair
        </button>
        <button
          type="button"
          className="btn orange"
          onClick={handleFinish}
        >
          Finalizar simulado
        </button>
        <button
          type="button"
          className="btn green"
          onClick={session.next}
          disabled={!session.stepReady}
        >
          {session.stepIndex >= session.steps.length - 1 ? "Ver relatório" : "Próximo"}
        </button>
      </footer>
    </div>
  );
}
