"use client";

import { useState } from "react";
import ChunkTags from "@/components/Part2Trainer/ChunkTags";
import Part2TimerBar from "@/components/Part2Trainer/Part2TimerBar";
import { READBACK_SCENARIOS } from "@/data/part2Readback";
import { INTERACTION_SCENARIOS } from "@/data/part2Interactions";
import { REPORTED_SPEECH_SCENARIOS } from "@/data/part2ReportedSpeech";
import { setPart2ItemStatus, type Part2ProgressStore } from "@/lib/part2/progress";

const SIM_ID = "sim-full-01";

/** Fixed scenario bundle for full Part 2 simulation. */
const SIM = {
  readback: READBACK_SCENARIOS[1],
  interaction: INTERACTION_SCENARIOS[0],
  atcMisunderstanding:
    "Helicol One Two Three, roger engine vibration, say again your intentions.",
  atcCorrection:
    "Negative, Helicol One Two Three, confirm you have engine failure and wish to return for landing.",
  reported: REPORTED_SPEECH_SCENARIOS[3],
};

const STEPS = [
  { id: 1, title: "ATC instruction", type: "listen" as const },
  { id: 2, title: "Your readback", type: "speak" as const },
  { id: 3, title: "Abnormal situation", type: "situation" as const },
  { id: 4, title: "Report problem", type: "speak" as const },
  { id: 5, title: "ATC response", type: "listen" as const },
  { id: 6, title: "Confirm or correct", type: "speak" as const },
  { id: 7, title: "Examiner question", type: "question" as const },
  { id: 8, title: "Reported speech", type: "speak" as const },
  { id: 9, title: "Review", type: "review" as const },
];

type Props = {
  progress: Part2ProgressStore;
  onProgressChange: (store: Part2ProgressStore) => void;
};

export default function FullSimulationMode({ progress, onProgressChange }: Props) {
  const [step, setStep] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [checklist, setChecklist] = useState<boolean[]>(STEPS.map(() => false));
  const current = STEPS[step];

  const next = () => {
    setShowAnswer(false);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const toggleCheck = (i: number) => {
    setChecklist((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  const finish = (status: "difficult" | "mastered") => {
    onProgressChange(setPart2ItemStatus(progress, SIM_ID, status));
  };

  return (
    <div className="part2-mode">
      <header className="part2-mode-head">
        <span className="badge">Full Simulation</span>
        <span className="part2-counter">
          Step {step + 1} / {STEPS.length}
        </span>
      </header>

      <div className="part2-sim-progress">
        {STEPS.map((s, i) => (
          <span key={s.id} className={`part2-sim-dot ${i <= step ? "active" : ""} ${i === step ? "current" : ""}`}>
            {s.id}
          </span>
        ))}
      </div>

      <article className="card card-essential part2-card">
        <div className="card-top">
          <h2 className="question">{current.title}</h2>
          {(current.type === "speak" || current.type === "question") && <Part2TimerBar />}
        </div>
        <div className="card-body">
          {step === 0 && (
            <>
              <p className="part2-atc-message">{SIM.readback.instruction}</p>
              <ChunkTags chunks={SIM.readback.chunks} />
            </>
          )}
          {step === 1 && (
            <p className="part2-hint">Perform your readback out loud, then reveal the model answer.</p>
          )}
          {step === 2 && (
            <>
              <p className="part2-situation">{SIM.interaction.situation}</p>
              <span className="part2-tag">Phase: {SIM.interaction.flightPhase}</span>
            </>
          )}
          {step === 3 && (
            <p className="part2-hint">Report: ATC name + callsign + PAN-PAN + problem + intention + request.</p>
          )}
          {step === 4 && <p className="part2-atc-message">{SIM.atcMisunderstanding}</p>}
          {step === 5 && (
            <p className="part2-hint">Correct the misunderstanding — confirm engine failure and intention to return.</p>
          )}
          {step === 6 && (
            <p className="part2-examiner-q">What did the controller say?</p>
          )}
          {step === 7 && (
            <>
              <p className="part2-atc-message">{SIM.reported.atcMessage}</p>
              <p className="part2-hint">Answer using reported speech.</p>
            </>
          )}
          {step === 8 && (
            <div className="part2-sim-review">
              <div className="part2-model-answer">
                <h3>Readback model</h3>
                <p>{SIM.readback.modelReadback}</p>
              </div>
              <div className="part2-model-answer">
                <h3>Problem report model</h3>
                <p>{SIM.interaction.modelReport}</p>
              </div>
              <div className="part2-model-answer">
                <h3>Reported speech model</h3>
                <p>{SIM.reported.modelAnswer}</p>
              </div>
              <div className="checklist">
                <h3>Self-check</h3>
                {STEPS.slice(0, 8).map((s, i) => (
                  <label key={s.id} className={`checklist-item ${checklist[i] ? "checked" : ""}`}>
                    <input type="checkbox" checked={checklist[i]} onChange={() => toggleCheck(i)} />
                    <span>{s.title}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 1 && showAnswer && (
            <div className="part2-model-answer">
              <h3>Model readback</h3>
              <p>{SIM.readback.modelReadback}</p>
            </div>
          )}
          {(step === 3 || step === 5) && showAnswer && (
            <div className="part2-model-answer">
              <h3>Model report</h3>
              <p>{step === 5 ? SIM.atcCorrection : SIM.interaction.modelReport}</p>
            </div>
          )}
          {step === 7 && showAnswer && (
            <div className="part2-model-answer">
              <h3>Model reported speech</h3>
              <p>{SIM.reported.modelAnswer}</p>
            </div>
          )}

          <div className="study-toolbar">
            {step < 8 && (
              <>
                {[1, 3, 5, 7].includes(step) && (
                  <button type="button" className="btn purple" onClick={() => setShowAnswer((s) => !s)}>
                    {showAnswer ? "Hide Answer" : "Show Answer"}
                  </button>
                )}
                <button type="button" className="btn blue" onClick={next}>
                  Next step →
                </button>
              </>
            )}
            {step === 8 && (
              <>
                <button type="button" className="btn green" onClick={() => finish("mastered")}>
                  Mark mastered
                </button>
                <button type="button" className="btn orange" onClick={() => finish("difficult")}>
                  Mark difficult
                </button>
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => {
                    setStep(0);
                    setShowAnswer(false);
                    setChecklist(STEPS.map(() => false));
                  }}
                >
                  Practice again
                </button>
              </>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
