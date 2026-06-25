"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ConnectorsBank from "@/components/ConnectorsBank";
import PilotProfileModal from "@/components/PilotProfileModal";
import QuickPhrasesMenu from "@/components/QuickPhrasesMenu";
import AnswerPanel from "@/components/study/AnswerPanel";
import ExamSession from "@/components/study/ExamSession";
import FilterBar, { type CardFilter } from "@/components/study/FilterBar";
import KeywordsPanel from "@/components/study/KeywordsPanel";
import MemoryFlow from "@/components/study/MemoryFlow";
import ProgressBadge from "@/components/study/ProgressBadge";
import StructureBlocks from "@/components/study/StructureBlocks";
import StudyDashboard from "@/components/study/StudyDashboard";
import { HELICOPTER_CORE_NUMS, isCoreQuestion } from "@/data/coreQuestions";
import { useTheme } from "@/hooks/useTheme";
import { useTimer } from "@/hooks/useTimer";
import { CATEGORIES } from "@/lib/categories";
import { CARDS } from "@/lib/cards";
import { loadConnectorSet, saveConnectorSet, type ConnectorSetId } from "@/lib/connectors";
import { isFavorite, loadFavorites, toggleFavorite } from "@/lib/favorites";
import { getKeywords } from "@/lib/icaoStructure";
import { personalizeCard } from "@/lib/personalize";
import { getSimplePhrases } from "@/lib/simplePhrases";
import {
  getCardProgress,
  loadProgress,
  recordPractice,
  setCardStatus,
  type ProgressStore,
} from "@/lib/progress";
import { DEFAULT_PROFILE, loadProfile, type PilotProfile } from "@/lib/profile";
import type { StudyMode } from "@/lib/types";
import { isSpeaking, speakText, stopSpeaking } from "@/lib/tts";
import { wordCount } from "@/lib/utils";

const ANSWER_SECONDS = 45;
const MODE_KEY = "icao_mode_v1";

type FilteredCard = { card: (typeof CARDS)[number]; idx: number };

export default function FlashcardApp() {
  const { theme, toggle: toggleTheme, hydrated } = useTheme();
  const [current, setCurrent] = useState(0);
  const [mode, setMode] = useState<StudyMode>("study");
  const [view, setView] = useState<"study" | "exam">("study");
  const [filter, setFilter] = useState<CardFilter>("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [progress, setProgress] = useState<ProgressStore>({ cards: {}, dailyCount: {} });
  const [profile, setProfile] = useState<PilotProfile>(DEFAULT_PROFILE);
  const [connectorSet, setConnectorSet] = useState<ConnectorSetId>("classic");
  const [profileOpen, setProfileOpen] = useState(false);
  const [connectorsOpen, setConnectorsOpen] = useState(false);
  const [phrasesOpen, setPhrasesOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showKeywords, setShowKeywords] = useState(true);
  const [keywordsOnly, setKeywordsOnly] = useState(false);
  const [showStructure, setShowStructure] = useState(false);

  const timer = useTimer(ANSWER_SECONDS);

  const filtered = useMemo((): FilteredCard[] => {
    return CARDS.map((card, idx) => ({ card, idx })).filter(({ card }) => {
      if (filter === "favorites") return favorites.includes(card.num);
      if (filter === "core") return isCoreQuestion(card.num);
      return true;
    });
  }, [filter, favorites]);

  const card = useMemo(
    () => personalizeCard(CARDS[current], profile, connectorSet),
    [current, profile, connectorSet],
  );

  const keywords = getKeywords(card);
  const cardProgress = getCardProgress(progress, card.num);
  const favorite = isFavorite(favorites, card.num);
  const simplePhrases = useMemo(() => getSimplePhrases(card), [card]);
  const answerWords = card.targetWords ?? wordCount(card.answer);
  const isExamStudy = mode === "exam";

  const selectCard = useCallback(
    (idx: number) => {
      stopSpeaking();
      setSpeaking(false);
      setCurrent(idx);
      setShowAnswer(false);
      setShowStructure(false);
      setKeywordsOnly(false);
      timer.reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [timer],
  );

  const navigateFiltered = useCallback(
    (delta: number) => {
      if (!filtered.length) return;
      const pos = filtered.findIndex((f) => f.idx === current);
      const nextPos = pos === -1 ? 0 : (pos + delta + filtered.length) % filtered.length;
      selectCard(filtered[nextPos].idx);
    },
    [current, filtered, selectCard],
  );

  const practiceAgain = useCallback(() => {
    setShowAnswer(false);
    setKeywordsOnly(true);
    timer.reset();
    const next = recordPractice(progress, card.num);
    setProgress(next);
  }, [card.num, progress, timer]);

  const markStatus = useCallback(
    (status: "difficult" | "mastered") => {
      const next = setCardStatus(progress, card.num, status);
      setProgress(next);
    },
    [card.num, progress],
  );

  const toggleStar = useCallback(() => {
    setFavorites((prev) => toggleFavorite(prev, card.num));
  }, [card.num]);

  const copyPhrase = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  }, []);

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
    if (!hydrated) return;
    setProfile(loadProfile());
    setConnectorSet(loadConnectorSet());
    setFavorites(loadFavorites());
    setProgress(loadProgress());
    const storedMode = localStorage.getItem(MODE_KEY);
    if (storedMode === "study" || storedMode === "exam") setMode(storedMode);
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(MODE_KEY, mode);
  }, [mode, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveConnectorSet(connectorSet);
  }, [connectorSet, hydrated]);

  useEffect(() => {
    if (filtered.length && !filtered.some((f) => f.idx === current)) {
      selectCard(filtered[0].idx);
    }
  }, [filtered, current, selectCard]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (view === "exam") return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigateFiltered(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        navigateFiltered(1);
      } else if (e.key === " ") {
        e.preventDefault();
        if (keywordsOnly) setShowAnswer((p) => !p);
        else setKeywordsOnly(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigateFiltered, view, keywordsOnly]);

  if (view === "exam") {
    return (
      <ExamSession
        profile={profile}
        filter={filter}
        favorites={favorites}
        coreNums={HELICOPTER_CORE_NUMS}
        progress={progress}
        onProgressChange={setProgress}
        onExit={() => setView("study")}
      />
    );
  }

  const posInFilter = filtered.findIndex((f) => f.idx === current);

  return (
    <>
      <PilotProfileModal
        open={profileOpen}
        profile={profile}
        onClose={() => setProfileOpen(false)}
        onSave={setProfile}
      />
      <ConnectorsBank open={connectorsOpen} onClose={() => setConnectorsOpen(false)} />
      <QuickPhrasesMenu
        open={phrasesOpen}
        profile={profile}
        connectorSet={connectorSet}
        currentNum={card.num}
        onClose={() => setPhrasesOpen(false)}
        onSelect={selectCard}
      />

      <header className="header delta-header">
        <div className="wrap delta-topbar">
          <div className="delta-brand">
            <span className="delta-logo">✈</span>
            <div>
              <strong>ICAO Delta</strong>
              <span>Helicopter Part 1 Trainer</span>
            </div>
          </div>
          <div className="delta-topbar-actions">
            <div className="mode-toggle">
              <button
                type="button"
                className={`mode-btn ${mode === "study" ? "active" : ""}`}
                onClick={() => setMode("study")}
              >
                Study
              </button>
              <button
                type="button"
                className={`mode-btn ${mode === "exam" ? "active" : ""}`}
                onClick={() => setMode("exam")}
              >
                Quick Exam
              </button>
            </div>
            <button type="button" className="btn icon-btn secondary" onClick={toggleTheme} aria-label="Theme">
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <button type="button" className="btn purple" onClick={() => setView("exam")}>
              Exam Mode
            </button>
          </div>
        </div>
      </header>

      <section className="hero hero-compact hero-delta">
        <div className="wrap hero-delta-inner">
          <h1>Train ICAO answers daily</h1>
          <p className="sub">
            Keywords first, speak out loud, 35–60 seconds. Built for helicopter pilots — no script memorization.
          </p>
          <StudyDashboard progress={progress} total={CARDS.length} />
          <FilterBar
            filter={filter}
            favoriteCount={favorites.length}
            coreCount={HELICOPTER_CORE_NUMS.length}
            total={CARDS.length}
            onChange={setFilter}
          />
        </div>
      </section>

      <div className="wrap topic-pills topic-pills-delta">
        {filtered.map(({ card: c, idx }) => {
          const st = getCardProgress(progress, c.num);
          return (
            <button
              key={c.num}
              type="button"
              className={`topic-pill ${current === idx ? "active" : ""} status-${st.status}`}
              onClick={() => selectCard(idx)}
              title={c.question}
            >
              <span className="topic-pill-label">#{c.num}</span>
              {favorites.includes(c.num) && <span className="pill-star">★</span>}
            </button>
          );
        })}
      </div>

      <main className="main main-essential">
        <section>
          <article className="card card-essential">
          <div className="card-top">
            <div className="card-meta">
              <span className="card-num">#{card.num}</span>
              <span className="category-badge">{CATEGORIES[card.category]}</span>
              <span className={`diff ${card.difficulty}`}>{card.difficulty}</span>
              <ProgressBadge status={cardProgress.status} compact />
              <button
                type="button"
                className={`btn-star ${favorite ? "active" : ""}`}
                onClick={toggleStar}
                aria-label="Favorite"
              >
                {favorite ? "★" : "☆"}
              </button>
            </div>

            <h2 className="question">{card.question}</h2>

            {!isExamStudy && (
              <div className="memory">
                Memory flow
                <MemoryFlow memory={card.memory} memoryLabels={card.memoryLabels} />
              </div>
            )}

            {isExamStudy && (
              <div className="exam-banner">
                Quick exam — hide the script, use keywords, start the 45s timer and speak.
              </div>
            )}

            <div className="timer timer-compact">
              <button type="button" className="btn green" onClick={timer.start}>
                ▶ {ANSWER_SECONDS}s
              </button>
              <button type="button" className="btn secondary btn-sm" onClick={timer.reset}>
                Reset
              </button>
              <div className="clock">{timer.clock}</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${timer.progress}%` }} />
              </div>
            </div>
          </div>

          <div className="card-body">
            <KeywordsPanel keywords={keywords} hidden={!showKeywords && !keywordsOnly} />

            {keywordsOnly && !showAnswer && (
              <div className="keywords-only-banner">
                <p>Keywords only — try answering out loud before revealing the model.</p>
              </div>
            )}

            {!isExamStudy && <StructureBlocks card={card} show={showStructure && !keywordsOnly} />}

            {!isExamStudy && !keywordsOnly && (
              <div className="phrases-inline">
                <div className="phrases-inline-head">
                  <h3>4 quick phrases</h3>
                  <button type="button" className="btn secondary btn-sm" onClick={() => setPhrasesOpen(true)}>
                    All questions
                  </button>
                </div>
                <ol className="phrases-four phrases-four-inline">
                  {simplePhrases.map((phrase, i) => (
                    <li key={phrase.label}>
                      <button
                        type="button"
                        className="phrase-line"
                        onClick={() => copyPhrase(phrase.text)}
                        title="Copy"
                      >
                        <span className="phrase-label">
                          {i + 1}. {phrase.label}
                        </span>
                        <span className="phrase-text">{phrase.text}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="study-toolbar">
              <button
                type="button"
                className={`btn ${keywordsOnly ? "purple" : "secondary"}`}
                onClick={() => {
                  setKeywordsOnly((k) => !k);
                  if (!keywordsOnly) setShowAnswer(false);
                }}
              >
                {keywordsOnly ? "Exit keywords only" : "Keywords only"}
              </button>
              <button
                type="button"
                className="btn secondary"
                onClick={() => setShowKeywords((s) => !s)}
              >
                {showKeywords ? "Hide keywords" : "Show keywords"}
              </button>
              {!keywordsOnly && (
                <button type="button" className="btn secondary" onClick={() => setShowStructure((s) => !s)}>
                  {showStructure ? "Hide structure" : "Show structure"}
                </button>
              )}
              <button
                type="button"
                className="btn purple btn-large"
                onClick={() => setShowAnswer((p) => !p)}
              >
                {showAnswer ? "Hide answer" : "Show answer"}
              </button>
              <button type="button" className="btn secondary" onClick={toggleSpeak}>
                {speaking ? "Stop" : "Listen"}
              </button>
            </div>

            <AnswerPanel card={card} show={showAnswer} />

            <div className="study-toolbar study-toolbar-secondary">
              <button type="button" className="btn secondary" onClick={practiceAgain}>
                Practice again
              </button>
              <button type="button" className="btn orange" onClick={() => markStatus("difficult")}>
                Mark difficult
              </button>
              <button type="button" className="btn green" onClick={() => markStatus("mastered")}>
                Mark mastered
              </button>
              <button type="button" className="btn blue" onClick={() => navigateFiltered(1)}>
                Next question →
              </button>
            </div>

            <div className="card-footer-meta">
              <span>{answerWords} words</span>
              <span>
                {posInFilter + 1} / {filtered.length}
              </span>
            </div>

            <div className="nav-row">
              <button type="button" className="btn secondary" onClick={() => navigateFiltered(-1)}>
                ← Previous
              </button>
              <button type="button" className="btn secondary" onClick={() => setProfileOpen(true)}>
                Profile
              </button>
              <button type="button" className="btn secondary" onClick={() => setConnectorsOpen(true)}>
                Connectors
              </button>
              <button type="button" className="btn secondary" onClick={() => setPhrasesOpen(true)}>
                4 phrases
              </button>
            </div>
          </div>
          </article>
        </section>
      </main>
    </>
  );
}
