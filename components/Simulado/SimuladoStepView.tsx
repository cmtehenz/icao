"use client";

import { useEffect, useRef } from "react";
import ExamAudioPlayer from "@/components/ExamAudioPlayer";
import SimuladoRecordPanel from "@/components/Simulado/SimuladoRecordPanel";
import { speakText, stopSpeech } from "@/services/azureSpeech";
import type { EvaluateFeedback } from "@/lib/evaluate/types";
import type { SimuladoStep, SimuladoStepResult } from "@/lib/simulado/types";

type Props = {
  step: SimuladoStep;
  notes: Record<string, string>;
  onNoteChange: (stepId: string, value: string) => void;
  existingResult?: SimuladoStepResult;
  onListenDone: () => void;
  onRecordComplete: (result: SimuladoStepResult) => void;
};

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function SimuladoStepView({
  step,
  notes,
  onNoteChange,
  existingResult,
  onListenDone,
  onRecordComplete,
}: Props) {
  const spokeRef = useRef(false);

  useEffect(() => {
    spokeRef.current = false;
    stopSpeech();
    return () => stopSpeech();
  }, [step.id]);

  useEffect(() => {
    if (step.kind !== "examiner" || spokeRef.current) return;
    spokeRef.current = true;
    void speakText(step.text, "female_examiner").then(() => onListenDone());
  }, [step, onListenDone]);

  useEffect(() => {
    if (step.kind !== "picture" || spokeRef.current) return;
    spokeRef.current = true;
    void speakText(step.examinerPrompt, "female_examiner");
  }, [step, onListenDone]);

  if (step.kind === "instruction") {
    return (
      <div className="sim-step-card">
        <p className="sim-step-label">{step.label}</p>
        <p className="sim-step-text">{step.text}</p>
      </div>
    );
  }

  if (step.kind === "listen") {
    return (
      <div className="sim-step-card">
        <p className="sim-step-label">{step.label}</p>
        <ExamAudioPlayer src={step.audioSrc} label="ATC audio" autoPlay />
        <button type="button" className="btn secondary btn-sm sim-listen-done" onClick={onListenDone}>
          Áudio ouvido — continuar
        </button>
      </div>
    );
  }

  if (step.kind === "examiner") {
    return (
      <div className="sim-step-card examiner">
        <p className="sim-step-label">{step.label}</p>
        <div className="sim-examiner-bubble">
          <span className="sim-examiner-avatar" aria-hidden>👩‍✈️</span>
          <p>{step.text}</p>
        </div>
        <button type="button" className="btn secondary btn-sm" onClick={onListenDone}>
          Repetir pergunta
        </button>
      </div>
    );
  }

  if (step.kind === "notes") {
    return (
      <div className="sim-step-card">
        <p className="sim-step-label">{step.label}</p>
        <p className="sim-step-hint">{step.prompt}</p>
        <textarea
          className="sim-notes"
          rows={6}
          placeholder="Suas anotações…"
          value={notes[step.id] ?? ""}
          onChange={(e) => onNoteChange(step.id, e.target.value)}
        />
      </div>
    );
  }

  if (step.kind === "picture") {
    return (
      <div className="sim-step-card">
        <p className="sim-step-label">{step.label}</p>
        <div className="sim-picture-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={step.imageSrc} alt={step.imageAlt} className="sim-picture" />
        </div>
        <p className="sim-step-hint">{step.examinerPrompt}</p>
      </div>
    );
  }

  if (step.kind === "record") {
    if (existingResult) {
      return (
        <div className="sim-step-card done">
          <p className="sim-step-label">{step.label}</p>
          <p className="sim-record-done">✓ Avaliado · {existingResult.feedback.scores.overall}/100</p>
          <p className="sim-transcript">{existingResult.feedback.transcript}</p>
        </div>
      );
    }

    return (
      <div className="sim-step-card">
        <p className="sim-step-label">{step.label}</p>
        {step.question && <p className="sim-step-question">{step.question}</p>}
        <SimuladoRecordPanel
          question={step.question}
          modelAnswer={step.modelAnswer}
          evaluateType={step.evaluateType}
          keywords={step.keywords}
          prepSeconds={step.prepSeconds}
          answerSeconds={step.answerSeconds ?? 60}
          onComplete={(feedback: EvaluateFeedback, _audio) => {
            onRecordComplete({
              stepId: step.id,
              part: step.part,
              label: step.label,
              question: step.question,
              modelAnswer: step.modelAnswer,
              evaluateType: step.evaluateType,
              feedback,
            });
          }}
        />
      </div>
    );
  }

  return null;
}

export { formatTime };
