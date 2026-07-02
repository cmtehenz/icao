"use client";

import { useState, type ReactNode } from "react";
import type { Level4Step } from "@/lib/types";
import { highlightConnectors } from "@/utils/highlightConnectors";

export type Part1CoachGuide = {
  basicAnswer: string;
  elaborateAnswer?: string;
  exampleAnswer?: string;
  steps?: Level4Step[];
  memoryLabels?: string[];
};

function AnswerToggle({
  label,
  hint,
  text,
  defaultOpen = false,
  children,
}: {
  label: string;
  hint?: string;
  text: string;
  defaultOpen?: boolean;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`coach-answer-toggle ${open ? "open" : ""}`}>
      <button
        type="button"
        className="coach-answer-toggle-btn"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="coach-answer-toggle-label">{label}</span>
        {hint ? <span className="coach-answer-toggle-hint">{hint}</span> : null}
        <span className="coach-answer-toggle-chevron" aria-hidden>
          {open ? "▾" : "▸"}
        </span>
      </button>
      {open && (
        <div className="coach-answer-toggle-body">
          {children}
          <p className="coach-answer-toggle-text">{highlightConnectors(text)}</p>
        </div>
      )}
    </div>
  );
}

export default function CoachAnswerGuide({ guide }: { guide: Part1CoachGuide }) {
  const showElaborate =
    guide.elaborateAnswer &&
    guide.elaborateAnswer.trim() !== guide.basicAnswer.trim()
      ? guide.elaborateAnswer
      : undefined;

  const showExample =
    guide.exampleAnswer?.trim() &&
    guide.exampleAnswer.trim() !== guide.basicAnswer.trim()
      ? guide.exampleAnswer
      : undefined;

  return (
    <section className="coach-answer-guide" aria-label="Exemplos de resposta">
      <p className="coach-answer-guide-intro">
        Tente responder sem olhar. Se precisar, abra o exemplo básico ou o mais elaborado.
      </p>

      {guide.memoryLabels?.length ? (
        <p className="coach-answer-guide-keywords">
          Keywords: <strong>{guide.memoryLabels.join(" → ")}</strong>
        </p>
      ) : null}

      <AnswerToggle
        label="Resposta básica (Fácil)"
        hint="40–50 s"
        text={guide.basicAnswer}
      >
        {guide.steps?.length ? (
          <ol className="coach-answer-steps">
            {guide.steps.map((step) => (
              <li key={step.label}>
                <span className="coach-answer-step-label">{step.label}</span>
                <span>{highlightConnectors(step.sentence)}</span>
              </li>
            ))}
          </ol>
        ) : null}
      </AnswerToggle>

      {showElaborate ? (
        <AnswerToggle
          label="Resposta elaborada (ICAO 5)"
          hint="50–60 s"
          text={showElaborate}
        />
      ) : null}

      {showExample ? (
        <AnswerToggle label="Exemplo — vale pontos extras" text={showExample} />
      ) : null}
    </section>
  );
}
