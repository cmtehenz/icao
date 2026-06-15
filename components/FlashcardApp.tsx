"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CARDS } from "@/lib/cards";
import type { Card, Difficulty } from "@/lib/types";
import { formatIdea, parseMemoryFlow } from "@/lib/utils";

type FilteredCard = Card & { idx: number };

const TIMER_SECONDS = 45;
const DONE_KEY = "icao_done_v2";
const THEME_KEY = "icao_theme";

function MemoryFlow({ memory }: { memory: string }) {
  const parts = parseMemoryFlow(memory);
  return (
    <div className="memory-flow">
      {parts.map((part, i) => (
        <Fragment key={part + i}>
          {i > 0 && <span className="arrow">→</span>}
          <span className="pill">{part}</span>
        </Fragment>
      ))}
    </div>
  );
}

function IdeaLine({ text }: { text: string }) {
  const parsed = formatIdea(text);
  if (!parsed) return <p className="idea">{text}</p>;
  return (
    <p className="idea">
      <b>{parsed.label}</b>
      {parsed.rest}
    </p>
  );
}

export default function FlashcardApp() {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState<string[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "All">("All");
  const [showAnswer, setShowAnswer] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const filtered = useMemo((): FilteredCard[] => {
    const q = search.toLowerCase();
    return CARDS.map((c, idx) => ({ ...c, idx })).filter((c) => {
      const blob = [
        c.question,
        c.memory,
        c.opener,
        c.example,
        c.conclusion,
        ...c.ideas,
        ...c.verbs,
        ...c.vocab,
      ]
        .join(" ")
        .toLowerCase();
      return (!q || blob.includes(q)) && (difficulty === "All" || c.difficulty === difficulty);
    });
  }, [search, difficulty]);

  const filteredIndices = useMemo(() => filtered.map((c) => c.idx), [filtered]);
  const card = CARDS[current];
  const isCardDone = done.includes(card.num);
  const markDoneLabel = isCardDone ? "↩️ Undo done" : "✅ Mark done";

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setTimerRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    stopTimer();
    setElapsed(0);
  }, [stopTimer]);

  const startTimer = useCallback(() => {
    stopTimer();
    setElapsed(0);
    setTimerRunning(true);
  }, [stopTimer]);

  const selectCard = useCallback(
    (idx: number) => {
      setCurrent(idx);
      setShowAnswer(false);
      resetTimer();
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [resetTimer],
  );

  const navigateFiltered = useCallback(
    (delta: number) => {
      if (!filteredIndices.length) return;
      const pos = filteredIndices.indexOf(current);
      const nextPos = pos === -1 ? 0 : (pos + delta + filteredIndices.length) % filteredIndices.length;
      selectCard(filteredIndices[nextPos]);
    },
    [current, filteredIndices, selectCard],
  );

  const toggleDone = useCallback(() => {
    setDone((prev) => {
      const i = prev.indexOf(card.num);
      if (i >= 0) return prev.filter((n) => n !== card.num);
      return [...prev, card.num];
    });
  }, [card.num]);

  const resetProgress = useCallback(() => {
    if (confirm("Reset study progress?")) setDone([]);
  }, []);

  const randomCard = useCallback(() => {
    if (!filteredIndices.length) return;
    selectCard(filteredIndices[Math.floor(Math.random() * filteredIndices.length)]);
  }, [filteredIndices, selectCard]);

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_KEY);
    if (storedTheme === "dark" || storedTheme === "light") setTheme(storedTheme);
    try {
      setDone(JSON.parse(localStorage.getItem(DONE_KEY) || "[]"));
    } catch {
      setDone([]);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(DONE_KEY, JSON.stringify(done));
  }, [done, hydrated]);

  useEffect(() => {
    if (filtered.length && !filtered.some((c) => c.idx === current)) {
      setCurrent(filtered[0].idx);
      setShowAnswer(false);
      resetTimer();
    }
  }, [filtered, current, resetTimer]);

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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigateFiltered(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        navigateFiltered(1);
      } else if (e.key === " ") {
        e.preventDefault();
        setShowAnswer((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigateFiltered]);

  const clock = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
  const progress = Math.min(100, (elapsed / TIMER_SECONDS) * 100);

  return (
    <>
      <div className="header">
        <div className="wrap controls">
          <div className="left-controls">
            <button
              type="button"
              className="btn secondary"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
            <input
              className="search"
              placeholder="Search question, verb, vocabulary..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty | "All")}
            >
              <option value="All">All difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div className="right-controls">
            <button type="button" className="btn blue" onClick={randomCard}>
              🎲 Random
            </button>
            <button
              type="button"
              className={`btn ${isCardDone ? "secondary" : "green"}`}
              onClick={toggleDone}
            >
              {markDoneLabel}
            </button>
            <button type="button" className="btn orange" onClick={resetProgress}>
              Reset
            </button>
          </div>
        </div>
      </div>

      <section className="hero">
        <span className="badge">✈️ ICAO PART 1 MASTER · FLASHCARD APP</span>
        <h1>42 Questions with ICAO 5 Answers</h1>
        <p className="sub">
          Study like this: read the question, start the 45-second timer, answer using the colored
          structure, then reveal the ICAO 5 model answer.
        </p>
        <div className="stats">
          <div className="stat">
            <strong>
              {done.length} / {CARDS.length}
            </strong>
            <span>cards completed</span>
          </div>
          <div className="stat">
            <strong>45s</strong>
            <span>ideal answer time</span>
          </div>
          <div className="stat">
            <strong>5 parts</strong>
            <span>opener · ideas · example · conclusion</span>
          </div>
          <div className="stat">
            <strong>ICAO 5</strong>
            <span>target structure</span>
          </div>
        </div>
      </section>

      <main className="main">
        <aside className="sidebar">
          {filtered.length === 0 ? (
            <p>No cards found.</p>
          ) : (
            filtered.map((c) => (
              <button
                key={c.num}
                type="button"
                className={`list-btn ${c.idx === current ? "active" : ""}`}
                onClick={() => selectCard(c.idx)}
              >
                <b>
                  {done.includes(c.num) ? "✅ " : ""}
                  {c.num}. {c.question}
                </b>
                <small>Memory Flow: {c.memory}</small>
                <span className={`diff ${c.difficulty}`}>{c.difficulty}</span>
              </button>
            ))
          )}
        </aside>

        <section>
          <article className="card">
            <div className="card-top">
              <div className="card-num">
                QUESTION {card.num} ·{" "}
                <span className={`diff ${card.difficulty}`} style={{ marginLeft: 8 }}>
                  {card.difficulty}
                </span>
              </div>
              <h2 className="question">{card.question}</h2>
              <div className="memory">
                🧠 MEMORY FLOW
                <MemoryFlow memory={card.memory} />
              </div>
              <div className="timer">
                <button type="button" className="btn green" onClick={startTimer}>
                  ▶ Start 45s
                </button>
                <button type="button" className="btn secondary" onClick={stopTimer}>
                  Stop
                </button>
                <button type="button" className="btn secondary" onClick={resetTimer}>
                  Reset
                </button>
                <div className="clock">{clock}</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <p className="practice-note">
                Try to answer before opening the model answer. Your goal is 35–60 seconds. Shortcuts:
                ← → navigate, Space reveal answer.
              </p>
            </div>

            <div className="card-body">
              <div className="block blue-b">
                <h3>🔵 Opener</h3>
                <p>{card.opener}</p>
              </div>
              <div className="block orange-b">
                <h3>🟠 Numbered Ideas</h3>
                {card.ideas.map((idea) => (
                  <IdeaLine key={idea} text={idea} />
                ))}
              </div>
              <div className="block purple-b">
                <h3>🟣 Example / Contrast</h3>
                <p>{card.example}</p>
              </div>
              <div className="block green-b">
                <h3>🟢 Conclusion</h3>
                <p>{card.conclusion}</p>
              </div>
              <div className="two">
                <div className="block">
                  <h3>⭐ Power Verbs</h3>
                  <div className="chips">
                    {card.verbs.map((v) => (
                      <span key={v} className="chip">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="block">
                  <h3>⭐ Power Vocabulary</h3>
                  <div className="chips">
                    {card.vocab.map((v) => (
                      <span key={v} className="chip">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn purple"
                onClick={() => setShowAnswer((prev) => !prev)}
              >
                {showAnswer ? "🎤 Hide ICAO 5 Answer" : "🎤 Show ICAO 5 Answer"}
              </button>
              <div className={`answer ${showAnswer ? "show" : ""}`}>
                <h3>🎤 ICAO 5 MODEL ANSWER</h3>
                <p className="answer-text">{card.answer}</p>
              </div>
              <div className="nav-row">
                <button type="button" className="btn secondary" onClick={() => navigateFiltered(-1)}>
                  ← Previous
                </button>
                <button
                  type="button"
                  className={`btn ${isCardDone ? "secondary" : "green"}`}
                  onClick={toggleDone}
                >
                  {markDoneLabel}
                </button>
                <button type="button" className="btn secondary" onClick={() => navigateFiltered(1)}>
                  Next →
                </button>
              </div>
            </div>
          </article>
        </section>
      </main>
    </>
  );
}
