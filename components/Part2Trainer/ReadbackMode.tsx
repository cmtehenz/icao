"use client";

import { useState } from "react";
import ChunkTags from "@/components/Part2Trainer/ChunkTags";
import Part2TimerBar from "@/components/Part2Trainer/Part2TimerBar";
import { READBACK_SCENARIOS } from "@/data/part2Readback";
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

export default function ReadbackMode({ progress, onProgressChange }: Props) {
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const scenario = READBACK_SCENARIOS[index];
  const itemProgress = getPart2ItemProgress(progress, scenario.id);

  const go = (delta: number) => {
    setIndex((i) => (i + delta + READBACK_SCENARIOS.length) % READBACK_SCENARIOS.length);
    setShowAnswer(false);
  };

  const mark = (status: "difficult" | "mastered") => {
    onProgressChange(setPart2ItemStatus(progress, scenario.id, status));
  };

  return (
    <div className="part2-mode">
      <header className="part2-mode-head">
        <span className="badge">Readback Mode</span>
        <ProgressBadge status={itemProgress.status as CardProgressStatus} />
        <span className="part2-counter">
          {index + 1} / {READBACK_SCENARIOS.length}
        </span>
      </header>

      <article className="card card-essential part2-card">
        <div className="card-top">
          <h2 className="question">{scenario.title}</h2>
          <p className="part2-prompt-label">ATC Instruction</p>
          <p className="part2-atc-message">{scenario.instruction}</p>
          <Part2TimerBar />
        </div>
        <div className="card-body">
          <p className="part2-hint">Repeat the clearance out loud, then check the chunks and model readback.</p>
          <ChunkTags chunks={scenario.chunks} />

          <div className="study-toolbar">
            <button type="button" className="btn purple btn-large" onClick={() => setShowAnswer((s) => !s)}>
              {showAnswer ? "Hide Answer" : "Show Answer"}
            </button>
            <button type="button" className="btn secondary" onClick={() => go(1)}>
              Next →
            </button>
          </div>

          {showAnswer && (
            <div className="part2-model-answer">
              <h3>Correct readback</h3>
              <p>{scenario.modelReadback}</p>
            </div>
          )}

          <div className="study-toolbar study-toolbar-secondary">
            <button type="button" className="btn orange" onClick={() => mark("difficult")}>
              Mark difficult
            </button>
            <button type="button" className="btn green" onClick={() => mark("mastered")}>
              Mark mastered
            </button>
            <button type="button" className="btn secondary" onClick={() => go(-1)}>
              ← Previous
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
