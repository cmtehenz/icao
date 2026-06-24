"use client";

import { useEffect, useState } from "react";
import { useTimer } from "@/hooks/useTimer";

const PREP_SECONDS = 5;
const SPEAK_SECONDS = 45;

type Phase = "idle" | "prep" | "speak" | "done";

type Props = {
  onSpeakDone?: () => void;
  autoStart?: boolean;
};

export default function Part2TimerBar({ onSpeakDone, autoStart }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const prep = useTimer(PREP_SECONDS);
  const speak = useTimer(SPEAK_SECONDS);

  useEffect(() => {
    if (autoStart && phase === "idle") {
      prep.reset();
      speak.reset();
      setPhase("prep");
      prep.start();
    }
  }, [autoStart, phase, prep, speak]);

  useEffect(() => {
    if (phase === "prep" && prep.finished) {
      speak.start();
      setPhase("speak");
    }
  }, [phase, prep.finished, speak]);

  useEffect(() => {
    if (phase === "speak" && speak.finished) {
      setPhase("done");
      onSpeakDone?.();
    }
  }, [phase, speak.finished, onSpeakDone]);

  const start = () => {
    prep.reset();
    speak.reset();
    setPhase("prep");
    prep.start();
  };

  const reset = () => {
    prep.reset();
    speak.reset();
    setPhase("idle");
  };

  if (phase === "idle") {
    return (
      <div className="part2-timer">
        <button type="button" className="btn green" onClick={start}>
          ▶ Start (5s prep + 45s speak)
        </button>
      </div>
    );
  }

  return (
    <div className="part2-timer">
      <div className={`part2-timer-phase ${phase}`}>
        {phase === "prep" && (
          <>
            <span className="part2-timer-label">Prepare</span>
            <span className="part2-timer-clock">{PREP_SECONDS - prep.elapsed}s</span>
            <div className="progress-bar">
              <div className="progress-fill prep-fill" style={{ width: `${prep.progress}%` }} />
            </div>
          </>
        )}
        {phase === "speak" && (
          <>
            <span className="part2-timer-label">Speak now</span>
            <span className="part2-timer-clock">{speak.clock}</span>
            <div className="progress-bar">
              <div className="progress-fill speak-fill" style={{ width: `${speak.progress}%` }} />
            </div>
          </>
        )}
        {phase === "done" && <span className="part2-timer-label">Time is up — reveal your answer</span>}
      </div>
      <button type="button" className="btn secondary btn-sm" onClick={reset}>
        Reset timer
      </button>
    </div>
  );
}
