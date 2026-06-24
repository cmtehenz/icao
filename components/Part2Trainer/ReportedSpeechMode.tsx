"use client";

import { useEffect, useState } from "react";
import Part2TimerBar from "@/components/Part2Trainer/Part2TimerBar";
import { REPORTED_SPEECH_SCENARIOS } from "@/data/part2ReportedSpeech";
import { REPORTED_TEMPLATES } from "@/lib/part2/types";
import {
  getPart2ItemProgress,
  setPart2ItemStatus,
  type Part2ProgressStore,
} from "@/lib/part2/progress";
import ProgressBadge from "@/components/study/ProgressBadge";
import type { CardProgressStatus } from "@/lib/progress";

type Props = {
  progress: Part2ProgressStore;
  onProgressChange: (store: Part2ProgressStore) => void;
};

export default function ReportedSpeechMode({ progress, onProgressChange }: Props) {
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [autoRevealed, setAutoRevealed] = useState(false);
  const scenario = REPORTED_SPEECH_SCENARIOS[index];
  const itemProgress = getPart2ItemProgress(progress, scenario.id);

  const go = (delta: number) => {
    setIndex((i) => (i + delta + REPORTED_SPEECH_SCENARIOS.length) % REPORTED_SPEECH_SCENARIOS.length);
    setShowAnswer(false);
    setAutoRevealed(false);
  };

  const mark = (status: "difficult" | "mastered") => {
    onProgressChange(setPart2ItemStatus(progress, scenario.id, status));
  };

  const handleSpeakDone = () => {
    setShowAnswer(true);
    setAutoRevealed(true);
  };

  useEffect(() => {
    setShowAnswer(false);
    setAutoRevealed(false);
  }, [index]);

  return (
    <div className="part2-mode">
      <header className="part2-mode-head">
        <span className="badge">Reported Speech Mode</span>
        <ProgressBadge status={itemProgress.status as CardProgressStatus} />
        <span className="part2-counter">
          {index + 1} / {REPORTED_SPEECH_SCENARIOS.length}
        </span>
      </header>

      <article className="card card-essential part2-card">
        <div className="card-top">
          <h2 className="question">{scenario.title}</h2>
          <p className="part2-prompt-label">ATC said</p>
          <p className="part2-atc-message">{scenario.atcMessage}</p>
          <Part2TimerBar onSpeakDone={handleSpeakDone} />
        </div>
        <div className="card-body">
          <div className="part2-template-chip">
            <strong>Template:</strong> {REPORTED_TEMPLATES[scenario.speechType]}
          </div>
          <p className="part2-hint">Transform the message into reported speech for the examiner.</p>

          <div className="study-toolbar">
            <button type="button" className="btn secondary" onClick={() => setShowAnswer((s) => !s)}>
              {showAnswer ? "Hide Answer" : "Show Answer"}
            </button>
            <button type="button" className="btn secondary" onClick={() => go(1)}>
              Next →
            </button>
          </div>

          {showAnswer && (
            <div className="part2-model-answer">
              <h3>Model answer {autoRevealed ? "(auto-revealed)" : ""}</h3>
              <p>{scenario.modelAnswer}</p>
            </div>
          )}

          <div className="study-toolbar study-toolbar-secondary">
            <button type="button" className="btn orange" onClick={() => mark("difficult")}>
              Mark difficult
            </button>
            <button type="button" className="btn green" onClick={() => mark("mastered")}>
              Mark mastered
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
