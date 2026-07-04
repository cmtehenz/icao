"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SimuladoStepView, { formatTime } from "@/components/Simulado/SimuladoStepView";
import { useSimuladoSession } from "@/hooks/useSimuladoSession";
import type { SimuladoExamId } from "@/data/exams";
import { CAPTAIN_DELTA_EXAM_STEP } from "@/lib/captainDelta/examiner/events";
import { formatPartTimer } from "@/lib/captainDelta/examiner/prompts";
import type {
  SimuladoPart,
  SimuladoSessionConfig,
  SimuladoSessionSnapshot,
  SimuladoStepResult,
  SimulationReport,
} from "@/lib/simulado/types";
import { modeLabel } from "@/lib/simulado/buildSteps";

type Props = {
  config: SimuladoSessionConfig;
  examId: SimuladoExamId;
  resumeSnapshot?: SimuladoSessionSnapshot | null;
  examinerMode?: boolean;
  onFinish: (report: SimulationReport, results: SimuladoStepResult[]) => void;
  onExit: () => void;
};

const PART_LABELS: Record<number, string> = {
  1: "Part 1 · Aviation Topics",
  2: "Part 2 · Interacting as a Pilot",
  3: "Part 3 · Unexpected Situations",
  4: "Part 4 · Picture Description",
};

export default function SimuladoRunner({
  config,
  examId,
  resumeSnapshot,
  examinerMode = false,
  onFinish,
  onExit,
}: Props) {
  const session = useSimuladoSession(config, { examId, resumeSnapshot });
  const partStartRef = useRef<number>(0);
  const lastPartRef = useRef<SimuladoPart | null>(null);
  const [partElapsed, setPartElapsed] = useState(0);

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
    if (session.report) onFinish(session.report, session.results);
  }, [session.report, session.results, onFinish]);

  useEffect(() => {
    const step = session.currentStep;
    if (!step || !examinerMode) return;
    window.dispatchEvent(
      new CustomEvent(CAPTAIN_DELTA_EXAM_STEP, {
        detail: { step, examinerMode: true },
      }),
    );
    if (lastPartRef.current !== step.part) {
      lastPartRef.current = step.part;
      partStartRef.current = session.elapsedSec;
    }
  }, [session.currentStep?.id, examinerMode, session.elapsedSec, session.currentStep]);

  useEffect(() => {
    if (!examinerMode || !session.currentStep) return;
    const id = window.setInterval(() => {
      setPartElapsed(session.elapsedSec - partStartRef.current);
    }, 1000);
    return () => window.clearInterval(id);
  }, [examinerMode, session.currentStep?.part, session.elapsedSec, session.currentStep]);

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
      ? examinerMode
        ? "Record your answer to continue."
        : "Grave sua resposta com o microfone para liberar Próximo."
      : step.kind === "listen"
        ? "Ouça o ATC até o fim ou toque no botão verde abaixo do áudio."
        : step.kind === "examiner" || step.kind === "picture"
          ? examinerMode
            ? "Listen to the examiner, then continue."
            : "Ouça a examinadora ou toque Continuar → no card."
          : null
    : null;

  return (
    <div className={`sim-runner${examinerMode ? " sim-runner-examiner" : ""}`}>
      <header className="sim-runner-head">
        <div>
          <span className="sim-mode-badge">{modeLabel(config.mode, config.customParts)}</span>
          <span className="sim-exam-badge">Prova {config.examVersion}</span>
          {examinerMode && <span className="sim-examiner-badge">Examiner Mode</span>}
        </div>
        <div className="sim-runner-meta">
          {examinerMode ? (
            <span className="sim-part-timer">{formatPartTimer(step.part, partElapsed)}</span>
          ) : (
            <span className="sim-timer-inline">{formatTime(session.elapsedSec)}</span>
          )}
          <span className="sim-step-counter">
            {session.stepIndex + 1} / {session.steps.length}
          </span>
        </div>
      </header>

      <div className="sim-part-bar" aria-label="Current part">
        <span>{PART_LABELS[step.part] ?? `Parte ${step.part}`}</span>
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
        examinerMode={examinerMode}
      />

      <footer className="sim-runner-foot">
        {nextHint && <p className="sim-next-hint">{nextHint}</p>}
        <button type="button" className="btn secondary" onClick={onExit}>
          {examinerMode ? "Exit exam" : "Sair"}
        </button>
        <button type="button" className="btn orange" onClick={handleFinish}>
          {examinerMode ? "Finish exam" : "Finalizar simulado"}
        </button>
        <button
          type="button"
          className="btn green"
          onClick={session.next}
          disabled={!session.stepReady}
        >
          {session.stepIndex >= session.steps.length - 1
            ? examinerMode
              ? "Finish & debrief"
              : "Ver relatório"
            : examinerMode
              ? "Next"
              : "Próximo"}
        </button>
      </footer>
    </div>
  );
}
