"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CHECKLIST_ITEMS } from "@/lib/categories";
import { CARDS } from "@/lib/cards";
import { personalizeCard } from "@/lib/personalize";
import type { PilotProfile } from "@/lib/profile";
import { isSpeaking, speakText, stopSpeaking } from "@/lib/tts";

const SIM_QUESTIONS = 6;
const TIMER_SECONDS = 45;

type SimResult = {
  num: string;
  question: string;
  checklistScore: number;
  answerRevealed: boolean;
};

type Props = {
  profile: PilotProfile;
  onExit: () => void;
};

function shuffleIndices(count: number): number[] {
  const indices = CARDS.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, count);
}

export default function Part1Simulator({ profile, onExit }: Props) {
  const [queue] = useState(() => shuffleIndices(SIM_QUESTIONS));
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState<SimResult[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [checklist, setChecklist] = useState<boolean[]>(() => CHECKLIST_ITEMS.map(() => false));
  const [elapsed, setElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cardIdx = queue[step];
  const card = useMemo(
    () => personalizeCard(CARDS[cardIdx], profile),
    [cardIdx, profile],
  );
  const checklistDone = checklist.filter(Boolean).length;

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setTimerRunning(false);
  }, []);

  const resetRound = useCallback(() => {
    stopTimer();
    stopSpeaking();
    setSpeaking(false);
    setElapsed(0);
    setShowAnswer(false);
    setChecklist(CHECKLIST_ITEMS.map(() => false));
  }, [stopTimer]);

  useEffect(() => {
    resetRound();
  }, [step, resetRound]);

  useEffect(() => {
    if (!timerRunning) return;
    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        if (prev + 1 >= TIMER_SECONDS) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          setTimerRunning(false);
        }
        return prev + 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  const finishQuestion = () => {
    const result: SimResult = {
      num: card.num,
      question: card.question,
      checklistScore: checklistDone,
      answerRevealed: showAnswer,
    };
    const nextResults = [...results, result];

    if (step + 1 >= queue.length) {
      setResults(nextResults);
      setFinished(true);
      resetRound();
      return;
    }

    setResults(nextResults);
    setStep((s) => s + 1);
  };

  const avgScore =
    results.length === 0
      ? 0
      : Math.round(
          (results.reduce((sum, r) => sum + r.checklistScore, 0) / results.length) * 10,
        ) / 10;

  const clock = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
  const progress = Math.min(100, (elapsed / TIMER_SECONDS) * 100);

  if (finished) {
    return (
      <div className="simulator-wrap">
        <div className="card">
          <div className="card-top">
            <div className="card-num">PART 1 SIMULATOR — COMPLETE</div>
            <h2 className="question">Session summary</h2>
            <p className="sub">
              You completed {queue.length} questions in exam-style flow. Average structure score:{" "}
              <strong>{avgScore} / {CHECKLIST_ITEMS.length}</strong>
            </p>
          </div>
          <div className="card-body">
            {results.map((r, i) => (
              <div key={r.num} className="block">
                <h3>
                  Q{i + 1} · {r.num} — {r.checklistScore}/{CHECKLIST_ITEMS.length} structure
                </h3>
                <p>{r.question}</p>
              </div>
            ))}
            <div className="nav-row">
              <button type="button" className="btn green" onClick={onExit}>
                Back to study app
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="simulator-wrap">
      <div className="card">
        <div className="card-top">
          <div className="card-num">
            PART 1 SIMULATOR · Question {step + 1} / {queue.length}
          </div>
          <h2 className="question">{card.question}</h2>
          <div className="exam-banner">
            Simulator mode — answer out loud, use the checklist, reveal the model answer, then
            continue.
          </div>
          <div className="timer">
            <button
              type="button"
              className="btn green"
              onClick={() => {
                stopTimer();
                setElapsed(0);
                setTimerRunning(true);
              }}
            >
              ▶ Start 45s
            </button>
            <button type="button" className="btn secondary" onClick={stopTimer}>
              Stop
            </button>
            <div className="clock">{clock}</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="checklist">
            <h3>✅ Self-check — ICAO 5 structure</h3>
            {CHECKLIST_ITEMS.map((item, i) => (
              <label key={item.id} className={`checklist-item ${checklist[i] ? "checked" : ""}`}>
                <input
                  type="checkbox"
                  checked={checklist[i]}
                  onChange={() =>
                    setChecklist((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
                  }
                />
                <span>{item.label}</span>
              </label>
            ))}
            <div className="checklist-score">
              Structure score: {checklistDone} / {CHECKLIST_ITEMS.length}
            </div>
          </div>

          <div className="nav-row">
            <button type="button" className="btn purple" onClick={() => setShowAnswer((p) => !p)}>
              {showAnswer ? "Hide model answer" : "Show model answer"}
            </button>
            <button
              type="button"
              className="btn secondary"
              onClick={() => {
                if (speaking || isSpeaking()) {
                  stopSpeaking();
                  setSpeaking(false);
                  return;
                }
                const ok = speakText(card.answer, () => setSpeaking(false));
                if (ok) setSpeaking(true);
              }}
            >
              {speaking ? "⏹ Stop audio" : "🔊 Listen to answer"}
            </button>
          </div>

          {showAnswer && (
            <div className="answer show">
              <h3>🎤 ICAO 5 MODEL ANSWER</h3>
              <div className="word-meta">
                <span>{card.targetWords} words</span>
              </div>
              <p className="answer-text">{card.answer}</p>
            </div>
          )}

          <div className="nav-row">
            <button type="button" className="btn secondary" onClick={onExit}>
              Exit simulator
            </button>
            <button type="button" className="btn green" onClick={finishQuestion}>
              {step + 1 >= queue.length ? "Finish session" : "Next question →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
