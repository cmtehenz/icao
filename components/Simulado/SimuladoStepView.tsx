"use client";

import { useEffect, useRef } from "react";
import ExamAudioPlayer from "@/components/ExamAudioPlayer";
import SimuladoExaminerAudio from "@/components/Simulado/SimuladoExaminerAudio";
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
  const notesSpokeRef = useRef(false);

  useEffect(() => {
    stopSpeech();
    notesSpokeRef.current = false;
    return () => stopSpeech();
  }, [step.id]);

  useEffect(() => {
    if (step.kind !== "notes" || notesSpokeRef.current) return;
    notesSpokeRef.current = true;
    void speakText(step.prompt, "female_examiner");
  }, [step]);

  if (step.kind === "instruction") {
    return (
      <div className="sim-step-card examiner sim-step-audio-only">
        <SimuladoExaminerAudio text={step.text} onDone={onListenDone} />
      </div>
    );
  }

  if (step.kind === "listen") {
    return (
      <div className="sim-step-card sim-step-listen">
        <p className="sim-step-kicker">🎧 Áudio ATC</p>
        <ExamAudioPlayer src={step.audioSrc} label="ATC" autoPlay onEnded={onListenDone} />
        <button type="button" className="btn green btn-sm sim-listen-done" onClick={onListenDone}>
          Áudio ouvido — liberar próximo passo
        </button>
      </div>
    );
  }

  if (step.kind === "examiner") {
    return (
      <div className="sim-step-card examiner sim-step-audio-only">
        <SimuladoExaminerAudio text={step.text} onDone={onListenDone} />
      </div>
    );
  }

  if (step.kind === "notes") {
    return (
      <div className="sim-step-card sim-step-notes">
        <p className="sim-step-kicker">📝 Anotações</p>
        <span className="sr-only">{step.prompt}</span>
        <textarea
          className="sim-notes"
          rows={6}
          placeholder="Suas anotações…"
          value={notes[step.id] ?? ""}
          onChange={(e) => onNoteChange(step.id, e.target.value)}
          aria-label="Anotações do simulado"
        />
      </div>
    );
  }

  if (step.kind === "picture") {
    return (
      <div className="sim-step-card sim-step-picture">
        <div className="sim-picture-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={step.imageSrc} alt={step.imageAlt} className="sim-picture" />
        </div>
        <SimuladoExaminerAudio text={step.examinerPrompt} onDone={onListenDone} />
      </div>
    );
  }

  if (step.kind === "record") {
    if (existingResult) {
      return (
        <div className="sim-step-card done sim-step-audio-only">
          <p className="sim-record-done">✓ Resposta gravada · {existingResult.feedback.scores.overall}/100</p>
          <span className="sr-only">{existingResult.feedback.transcript}</span>
        </div>
      );
    }

    return (
      <div className="sim-step-card sim-step-record">
        <p className="sim-step-kicker">🎤 Sua resposta</p>
        <p className="sim-record-hint-block">
          Grave com o microfone abaixo. O botão <strong>Próximo</strong> libera após a avaliação Azure.
        </p>
        <span className="sr-only">{step.question}</span>
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
