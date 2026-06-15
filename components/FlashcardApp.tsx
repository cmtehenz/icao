"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import ConnectorsBank from "@/components/ConnectorsBank";
import Part1Simulator from "@/components/Part1Simulator";
import PilotProfileModal from "@/components/PilotProfileModal";
import { CATEGORIES, CHECKLIST_ITEMS, type Category } from "@/lib/categories";
import { CARDS } from "@/lib/cards";
import {
  CONNECTOR_SETS,
  loadConnectorSet,
  resolveConnectorSet,
  saveConnectorSet,
  type ConnectorSetId,
} from "@/lib/connectors";
import { personalizeCard } from "@/lib/personalize";
import { DEFAULT_PROFILE, formatFlightHours, loadProfile, type PilotProfile } from "@/lib/profile";
import type { Card, Difficulty, StudyMode } from "@/lib/types";
import { isSpeaking, speakText, stopSpeaking } from "@/lib/tts";
import { formatIdea, parseMemoryFlow, wordCount } from "@/lib/utils";

type FilteredCard = Card & { idx: number };

const TIMER_SECONDS = 45;
const DONE_KEY = "icao_done_v2";
const THEME_KEY = "icao_theme";
const MODE_KEY = "icao_mode_v1";

function MemoryFlow({
  memory,
  memoryLabels,
  expanded,
}: {
  memory: string;
  memoryLabels: string[];
  expanded: boolean;
}) {
  const parts = parseMemoryFlow(memory);
  return (
    <div className="memory-flow">
      {parts.map((part, i) => (
        <Fragment key={`${part}-${i}`}>
          {i > 0 && <span className="arrow">→</span>}
          {expanded ? (
            <span className="pill-stack">
              <span className="pill pill-short">{part}</span>
              {memoryLabels[i] && <span className="pill-label">{memoryLabels[i]}</span>}
            </span>
          ) : (
            <span className="pill">{part}</span>
          )}
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

function categoryDoneCount(category: Category, done: string[]) {
  return CARDS.filter((c) => c.category === category && done.includes(c.num)).length;
}

function categoryTotal(category: Category) {
  return CARDS.filter((c) => c.category === category).length;
}

export default function FlashcardApp() {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState<string[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mode, setMode] = useState<StudyMode>("study");
  const [profile, setProfile] = useState<PilotProfile>(DEFAULT_PROFILE);
  const [connectorSet, setConnectorSet] = useState<ConnectorSetId>("classic");
  const [profileOpen, setProfileOpen] = useState(false);
  const [connectorsOpen, setConnectorsOpen] = useState(false);
  const [simulatorActive, setSimulatorActive] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "All">("All");
  const [category, setCategory] = useState<Category | "All">("All");
  const [showAnswer, setShowAnswer] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [checklist, setChecklist] = useState<boolean[]>(() => CHECKLIST_ITEMS.map(() => false));
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
        c.category,
        CATEGORIES[c.category],
        ...c.memoryLabels,
        ...c.ideas,
        ...c.verbs,
        ...c.vocab,
        ...c.tags,
      ]
        .join(" ")
        .toLowerCase();
      return (
        (!q || blob.includes(q)) &&
        (difficulty === "All" || c.difficulty === difficulty) &&
        (category === "All" || c.category === category)
      );
    });
  }, [search, difficulty, category]);

  const filteredIndices = useMemo(() => filtered.map((c) => c.idx), [filtered]);
  const card = useMemo(
    () => personalizeCard(CARDS[current], profile, connectorSet),
    [current, profile, connectorSet],
  );
  const activeConnectors = resolveConnectorSet(connectorSet, Number.parseInt(card.num, 10) || 0);
  const isCardDone = done.includes(card.num);
  const markDoneLabel = isCardDone ? "↩️ Undo done" : "✅ Mark done";
  const isExam = mode === "exam";
  const answerWords = card.targetWords ?? wordCount(card.answer);
  const checklistDone = checklist.filter(Boolean).length;

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

  const resetChecklist = useCallback(() => {
    setChecklist(CHECKLIST_ITEMS.map(() => false));
  }, []);

  const selectCard = useCallback(
    (idx: number) => {
      stopSpeaking();
      setSpeaking(false);
      setCurrent(idx);
      setShowAnswer(false);
      resetTimer();
      resetChecklist();
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [resetTimer, resetChecklist],
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

  const setStudyMode = useCallback(
    (next: StudyMode) => {
      setMode(next);
      setShowAnswer(false);
      resetChecklist();
    },
    [resetChecklist],
  );

  const toggleSpeak = useCallback(() => {
    if (speaking || isSpeaking()) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    const ok = speakText(card.answer, () => setSpeaking(false));
    if (ok) setSpeaking(true);
  }, [card.answer, speaking]);

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_KEY);
    if (storedTheme === "dark" || storedTheme === "light") setTheme(storedTheme);
    const storedMode = localStorage.getItem(MODE_KEY);
    if (storedMode === "study" || storedMode === "exam") setMode(storedMode);
    setProfile(loadProfile());
    setConnectorSet(loadConnectorSet());
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
    localStorage.setItem(MODE_KEY, mode);
  }, [mode, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(DONE_KEY, JSON.stringify(done));
  }, [done, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveConnectorSet(connectorSet);
  }, [connectorSet, hydrated]);

  useEffect(() => {
    if (filtered.length && !filtered.some((c) => c.idx === current)) {
      setCurrent(filtered[0].idx);
      setShowAnswer(false);
      resetTimer();
      resetChecklist();
    }
  }, [filtered, current, resetTimer, resetChecklist]);

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
      if (simulatorActive) return;
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
  }, [navigateFiltered, simulatorActive]);

  const clock = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
  const progress = Math.min(100, (elapsed / TIMER_SECONDS) * 100);

  if (simulatorActive) {
    return (
      <>
        <div className="header">
          <div className="wrap controls">
            <span className="badge">🎯 PART 1 SIMULATOR</span>
            <button type="button" className="btn secondary" onClick={() => setSimulatorActive(false)}>
              Exit simulator
            </button>
          </div>
        </div>
        <Part1Simulator profile={profile} onExit={() => setSimulatorActive(false)} />
      </>
    );
  }

  return (
    <>
      <PilotProfileModal
        open={profileOpen}
        profile={profile}
        onClose={() => setProfileOpen(false)}
        onSave={setProfile}
      />
      <ConnectorsBank open={connectorsOpen} onClose={() => setConnectorsOpen(false)} />

      <div className="header">
        <div className="wrap controls">
          <div className="left-controls">
            <div className="mode-toggle">
              <button
                type="button"
                className={`mode-btn ${mode === "study" ? "active" : ""}`}
                onClick={() => setStudyMode("study")}
              >
                📚 Study
              </button>
              <button
                type="button"
                className={`mode-btn ${mode === "exam" ? "active" : ""}`}
                onClick={() => setStudyMode("exam")}
              >
                🎤 Exam
              </button>
            </div>
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
              value={connectorSet}
              onChange={(e) => setConnectorSet(e.target.value as ConnectorSetId)}
              title="Vary idea connectors in answers"
            >
              <option value="classic">Connectors: Classic</option>
              {CONNECTOR_SETS.filter((set) => set.id !== "classic").map((set) => (
                <option key={set.id} value={set.id}>
                  Connectors: {set.label}
                </option>
              ))}
              <option value="random">Connectors: Random mix</option>
            </select>
            <select
              className="select"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category | "All")}
            >
              <option value="All">All categories</option>
              {(Object.entries(CATEGORIES) as [Category, string][]).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
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
            <button type="button" className="btn secondary" onClick={() => setProfileOpen(true)}>
              👤 Profile
            </button>
            <button type="button" className="btn secondary" onClick={() => setConnectorsOpen(true)}>
              🔗 Connectors
            </button>
            <button type="button" className="btn purple" onClick={() => setSimulatorActive(true)}>
              🎯 Simulator
            </button>
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
        <h1>{CARDS.length} Questions with ICAO 5 Answers</h1>
        <p className="sub">
          {isExam
            ? "Exam mode: answer out loud with only the question visible, use the checklist, then reveal the model answer."
            : "Study mode: read the structure, memory flow, vocabulary, then practice with the 45-second timer."}
        </p>
        <div className="profile-banner">
          <span>
            Profile: <strong>{profile.role}</strong> · {profile.aircraft} ·{" "}
            {formatFlightHours(profile.hours)} hours
          </span>
          <button type="button" className="btn secondary" onClick={() => setProfileOpen(true)}>
            Edit profile
          </button>
        </div>
        <div className="stats">
          <div className="stat">
            <strong>
              {done.length} / {CARDS.length}
            </strong>
            <span>cards completed</span>
          </div>
          <div className="stat">
            <strong>{isExam ? "Exam" : "Study"}</strong>
            <span>current mode</span>
          </div>
          <div className="stat">
            <strong>{answerWords}w</strong>
            <span>target answer length</span>
          </div>
          <div className="stat">
            <strong>6Q</strong>
            <span>simulator session</span>
          </div>
        </div>
      </section>

      <main className="main">
        <aside className="sidebar">
          <div className="sidebar-head">
            <h4>Progress by category</h4>
            <div className="category-progress">
              {(Object.entries(CATEGORIES) as [Category, string][]).map(([key, label]) => (
                <div key={key} className="category-row">
                  <span>{label}</span>
                  <strong>
                    {categoryDoneCount(key, done)} / {categoryTotal(key)}
                  </strong>
                </div>
              ))}
            </div>
          </div>
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
                <div className="list-meta">
                  <span className="list-tag">{CATEGORIES[c.category]}</span>
                  <span className={`diff ${c.difficulty}`}>{c.difficulty}</span>
                </div>
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
                <span className="category-badge">{CATEGORIES[card.category]}</span>
                {connectorSet !== "classic" && (
                  <span className="category-badge" style={{ background: "var(--orange-bg)", color: "var(--orange)" }}>
                    {activeConnectors.label} connectors
                  </span>
                )}
              </div>
              {connectorSet !== "classic" && (
                <p className="practice-note" style={{ marginTop: 12 }}>
                  Ideas use: <strong>{activeConnectors.idea1}</strong> ·{" "}
                  <strong>{activeConnectors.idea2}</strong> · <strong>{activeConnectors.idea3}</strong>
                </p>
              )}
              <h2 className="question">{card.question}</h2>

              {!isExam && (
                <div className="memory">
                  🧠 MEMORY FLOW
                  <MemoryFlow memory={card.memory} memoryLabels={card.memoryLabels} expanded />
                </div>
              )}

              {isExam && (
                <div className="exam-banner">
                  Exam mode active — no hints. Start the timer, answer out loud, mark the checklist,
                  then reveal the model answer.
                </div>
              )}

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
                Target: 35–60 seconds and about {answerWords} words. Shortcuts: ← → navigate, Space
                reveal answer.
              </p>
            </div>

            <div className="card-body">
              {!isExam && (
                <>
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
                </>
              )}

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
                  {checklistDone === CHECKLIST_ITEMS.length ? " — full ICAO 5!" : ""}
                </div>
              </div>

              <div className="nav-row">
                <button
                  type="button"
                  className="btn purple"
                  onClick={() => setShowAnswer((prev) => !prev)}
                >
                  {showAnswer ? "🎤 Hide ICAO 5 Answer" : "🎤 Show ICAO 5 Answer"}
                </button>
                <button type="button" className="btn secondary" onClick={toggleSpeak}>
                  {speaking ? "⏹ Stop audio" : "🔊 Listen to answer"}
                </button>
              </div>
              <div className={`answer ${showAnswer ? "show" : ""}`}>
                <h3>🎤 ICAO 5 MODEL ANSWER</h3>
                <div className="word-meta">
                  <span>{answerWords} words</span>
                  <span>Target: 35–60 seconds</span>
                  <span>
                    {card.targetWords >= 80 && card.targetWords <= 120
                      ? "Ideal length"
                      : "Reference length"}
                  </span>
                </div>
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
