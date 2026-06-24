"use client";

import { useState } from "react";
import Part2TimerBar from "@/components/Part2Trainer/Part2TimerBar";
import { INTERACTION_SCENARIOS } from "@/data/part2Interactions";
import { INTERACTION_HELPERS } from "@/lib/part2/types";
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

export default function InteractionMode({ progress, onProgressChange }: Props) {
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const scenario = INTERACTION_SCENARIOS[index];
  const itemProgress = getPart2ItemProgress(progress, scenario.id);

  const go = (delta: number) => {
    setIndex((i) => (i + delta + INTERACTION_SCENARIOS.length) % INTERACTION_SCENARIOS.length);
    setShowAnswer(false);
    setShowTemplate(false);
  };

  const mark = (status: "difficult" | "mastered") => {
    onProgressChange(setPart2ItemStatus(progress, scenario.id, status));
  };

  return (
    <div className="part2-mode">
      <header className="part2-mode-head">
        <span className="badge">Interaction Mode</span>
        <ProgressBadge status={itemProgress.status as CardProgressStatus} />
        <span className="part2-counter">
          {index + 1} / {INTERACTION_SCENARIOS.length}
        </span>
      </header>

      <article className="card card-essential part2-card">
        <div className="card-top">
          <h2 className="question">{scenario.title}</h2>
          <div className="part2-meta-row">
            <span className="part2-tag">Phase: {scenario.flightPhase}</span>
            <span className={`part2-tag urgency-${scenario.urgency.toLowerCase()}`}>
              {scenario.urgency}
            </span>
          </div>
          <p className="part2-situation">{scenario.situation}</p>
          <Part2TimerBar />
        </div>
        <div className="card-body">
          <p className="part2-hint">
            Report to ATC using: <strong>{scenario.atcName}</strong> + <strong>{scenario.callsign}</strong> + urgency + problem + intention + request.
          </p>

          {showTemplate && (
            <div className="part2-helper-blocks">
              <div className="part2-helper block orange-b">
                <h4>Problem</h4>
                <p>{INTERACTION_HELPERS.problem}</p>
                <p className="part2-helper-example">{scenario.problem}</p>
              </div>
              <div className="part2-helper block purple-b">
                <h4>Intention</h4>
                <p>{INTERACTION_HELPERS.intention}</p>
                <p className="part2-helper-example">{scenario.intention}</p>
              </div>
              <div className="part2-helper block green-b">
                <h4>Request</h4>
                <p>{INTERACTION_HELPERS.request}</p>
                <p className="part2-helper-example">{scenario.request}</p>
              </div>
            </div>
          )}

          <div className="study-toolbar">
            <button type="button" className="btn secondary" onClick={() => setShowTemplate((s) => !s)}>
              {showTemplate ? "Hide Template" : "Show Template"}
            </button>
            <button type="button" className="btn purple btn-large" onClick={() => setShowAnswer((s) => !s)}>
              {showAnswer ? "Hide Answer" : "Show Answer"}
            </button>
            <button type="button" className="btn secondary" onClick={() => go(1)}>
              Next →
            </button>
          </div>

          {showAnswer && (
            <div className="part2-model-answer">
              <h3>Model report</h3>
              <p>{scenario.modelReport}</p>
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
