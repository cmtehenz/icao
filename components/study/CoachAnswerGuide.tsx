"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { Level4Step } from "@/lib/types";
import { highlightConnectors } from "@/utils/highlightConnectors";
import CaptainDeltaTarget from "@/components/CaptainDelta/Visual/CaptainDeltaTarget";
import { emitCaptainDeltaSuggestion } from "@/lib/captainDelta/events";
import { buildReadingInterruptPlan } from "@/lib/captainDelta/visual/plans";
import { emitVisualPlan } from "@/lib/captainDelta/visual/events";
import { keywordTargetId } from "@/lib/captainDelta/visual/types";

export type Part1CoachGuide = {
  basicAnswer: string;
  elaborateAnswer?: string;
  exampleAnswer?: string;
  steps?: Level4Step[];
  memoryLabels?: string[];
};

const READING_INTERRUPT_MS = 25_000;

function AnswerToggle({
  id,
  label,
  hint,
  text,
  defaultOpen = false,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  text: string;
  defaultOpen?: boolean;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      emitVisualPlan(buildReadingInterruptPlan());
      emitCaptainDeltaSuggestion({
        text: "I don't want you memorizing. Now tell me the story.",
        kind: "coaching",
        primaryAction: { id: "explain_it", label: "🎤 Explain It", primary: true },
        secondaryActions: [],
      });
    }, READING_INTERRUPT_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  return (
    <CaptainDeltaTarget id={id} as="div" className={`coach-answer-toggle ${open ? "open" : ""}`}>
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
    </CaptainDeltaTarget>
  );
}

export default function CoachAnswerGuide({
  guide,
  showKeywords = true,
  basicDefaultOpen = false,
}: {
  guide: Part1CoachGuide;
  showKeywords?: boolean;
  /** Foundation only — default closed so students try memory first. */
  basicDefaultOpen?: boolean;
}) {
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

      {showKeywords && guide.memoryLabels?.length ? (
        <CaptainDeltaTarget id="coach-keywords" as="p" className="coach-answer-guide-keywords" hideWhenCollapsed={false}>
          Keywords:{" "}
          {guide.memoryLabels.map((label, i) => (
            <span key={label}>
              {i > 0 ? " → " : null}
              <CaptainDeltaTarget id={keywordTargetId(label)} className="coach-keyword-chip">
                {label}
              </CaptainDeltaTarget>
            </span>
          ))}
        </CaptainDeltaTarget>
      ) : null}

      <AnswerToggle
        id="coach-answer-basic"
        label="Resposta básica (Fácil)"
        hint="40–50 s"
        text={guide.basicAnswer}
        defaultOpen={basicDefaultOpen}
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
          id="coach-answer-elaborate"
          label="Resposta elaborada (ICAO 5)"
          hint="50–60 s"
          text={showElaborate}
        />
      ) : null}

      {showExample ? (
        <AnswerToggle
          id="coach-answer-example"
          label="Exemplo — vale pontos extras"
          text={showExample}
        />
      ) : null}
    </section>
  );
}
