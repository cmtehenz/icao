"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import ConnectorsBank from "@/components/ConnectorsBank";
import Part1Simulator from "@/components/Part1Simulator";
import PilotProfileModal from "@/components/PilotProfileModal";
import QuickPhrasesMenu from "@/components/QuickPhrasesMenu";
import { CATEGORIES, CHECKLIST_ITEMS, type Category } from "@/lib/categories";
import { CARDS } from "@/lib/cards";
import {
  CONNECTOR_SETS,
  loadConnectorSet,
  resolveConnectorSet,
  saveConnectorSet,
  type ConnectorSetId,
} from "@/lib/connectors";
import {
  ESSENTIAL_BY_CATEGORY,
  ESSENTIAL_CARD_NUMS,
  essentialLabelFor,
} from "@/lib/essential";
import { personalizeCard } from "@/lib/personalize";
import { getSimplePhrases, getSimplePhrasesText } from "@/lib/simplePhrases";
import { DEFAULT_PROFILE, formatFlightHours, loadProfile, type PilotProfile } from "@/lib/profile";
import type { AppVersion, Card, Difficulty, StudyMode } from "@/lib/types";
import { isSpeaking, speakText, stopSpeaking } from "@/lib/tts";
import { formatIdea, parseMemoryFlow, wordCount } from "@/lib/utils";

type FilteredCard = Card & { idx: number };

const TIMER_SECONDS = 45;
const DONE_KEY = "icao_done_v2";
const THEME_KEY = "icao_theme";
const MODE_KEY = "icao_mode_v1";
const VERSION_KEY = "icao_app_version_v1";

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

function categoryDoneCount(category: Category, done: string[], pool: Card[]) {
  return pool.filter((c) => c.category === category && done.includes(c.num)).length;
}

function categoryTotal(category: Category, pool: Card[]) {
  return pool.filter((c) => c.category === category).length;
}

export default function FlashcardApp() {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState<string[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mode, setMode] = useState<StudyMode>("study");
  const [appVersion, setAppVersion] = useState<AppVersion>("essential");
  const [profile, setProfile] = useState<PilotProfile>(DEFAULT_PROFILE);
  const [connectorSet, setConnectorSet] = useState<ConnectorSetId>("classic");
  const [profileOpen, setProfileOpen] = useState(false);
  const [connectorsOpen, setConnectorsOpen] = useState(false);
  const [phrasesOpen, setPhrasesOpen] = useState(false);
  const [simulatorActive, setSimulatorActive] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "All">("All");
  const [category, setCategory] = useState<Category | "All">("All");
  const [showAnswer, setShowAnswer] = useState(false);
  const [showStructure, setShowStructure] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [checklist, setChecklist] = useState<boolean[]>(() => CHECKLIST_ITEMS.map(() => false));
  const [hydrated, setHydrated] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isEssential = appVersion === "essential";

  const pool = useMemo(() => {
    if (isEssential) {
      return ESSENTIAL_CARD_NUMS.map((num) => CARDS.find((c) => c.num === num)!).filter(Boolean);
    }
    return CARDS;
  }, [isEssential]);

  const filtered = useMemo((): FilteredCard[] => {
    const q = search.toLowerCase();
    return pool
      .map((c) => ({ ...c, idx: CARDS.findIndex((x) => x.num === c.num) }))
      .filter((c) => {
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
  }, [pool, search, difficulty, category]);

  const filteredIndices = useMemo(() => filtered.map((c) => c.idx), [filtered]);
  const card = useMemo(
    () => personalizeCard(CARDS[current], profile, connectorSet),
    [current, profile, connectorSet],
  );
  const activeConnectors = resolveConnectorSet(connectorSet, Number.parseInt(card.num, 10) || 0);
  const isCardDone = done.includes(card.num);
  const markDoneLabel = isCardDone ? "Desfazer" : "Concluído";
  const isExam = mode === "exam";
  const answerWords = card.targetWords ?? wordCount(card.answer);
  const checklistDone = checklist.filter(Boolean).length;
  const poolDone = pool.filter((c) => done.includes(c.num)).length;
  const simplePhrases = useMemo(() => getSimplePhrases(card), [card]);

  const copyPhrase = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  }, []);

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
      setShowStructure(false);
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

  const setVersion = useCallback(
    (next: AppVersion) => {
      setAppVersion(next);
      setCategory("All");
      setSearch("");
      setShowAnswer(false);
      setShowStructure(false);
      resetChecklist();
      if (next === "essential") {
        const firstEssential = CARDS.findIndex((c) => c.num === ESSENTIAL_CARD_NUMS[0]);
        if (firstEssential >= 0) setCurrent(firstEssential);
      }
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
    const storedVersion = localStorage.getItem(VERSION_KEY);
    if (storedVersion === "essential" || storedVersion === "full") setAppVersion(storedVersion);
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
    localStorage.setItem(VERSION_KEY, appVersion);
  }, [appVersion, hydrated]);

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
          <div className="wrap topbar">
            <span className="badge">Part 1 Simulator</span>
            <button type="button" className="btn secondary" onClick={() => setSimulatorActive(false)}>
              Sair
            </button>
          </div>
        </div>
        <Part1Simulator profile={profile} essentialOnly={isEssential} onExit={() => setSimulatorActive(false)} />
      </>
    );
  }

  const structureBlocks = (
    <>
      <div className="block blue-b">
        <h3>Opener</h3>
        <p>{card.opener}</p>
      </div>
      <div className="block orange-b">
        <h3>Ideas</h3>
        {card.ideas.map((idea) => (
          <IdeaLine key={idea} text={idea} />
        ))}
      </div>
      <div className="block purple-b">
        <h3>Example</h3>
        <p>{card.example}</p>
      </div>
      <div className="block green-b">
        <h3>Conclusion</h3>
        <p>{card.conclusion}</p>
      </div>
      {!isEssential && (
        <div className="two">
          <div className="block">
            <h3>Power Verbs</h3>
            <div className="chips">
              {card.verbs.map((v) => (
                <span key={v} className="chip">
                  {v}
                </span>
              ))}
            </div>
          </div>
          <div className="block">
            <h3>Vocabulary</h3>
            <div className="chips">
              {card.vocab.map((v) => (
                <span key={v} className="chip">
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );

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
        essentialOnly={isEssential}
        profile={profile}
        connectorSet={connectorSet}
        currentNum={card.num}
        onClose={() => setPhrasesOpen(false)}
        onSelect={selectCard}
      />

      <div className="header">
        <div className="wrap topbar">
          <div className="topbar-primary">
            <div className="version-toggle">
              <button
                type="button"
                className={`version-btn ${isEssential ? "active" : ""}`}
                onClick={() => setVersion("essential")}
              >
                Essencial
              </button>
              <button
                type="button"
                className={`version-btn ${!isEssential ? "active" : ""}`}
                onClick={() => setVersion("full")}
              >
                Completo
              </button>
            </div>
            <div className="mode-toggle">
              <button
                type="button"
                className={`mode-btn ${mode === "study" ? "active" : ""}`}
                onClick={() => setStudyMode("study")}
              >
                Estudo
              </button>
              <button
                type="button"
                className={`mode-btn ${mode === "exam" ? "active" : ""}`}
                onClick={() => setStudyMode("exam")}
              >
                Prova
              </button>
            </div>
            <button
              type="button"
              className="btn icon-btn secondary"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            {!isEssential && (
              <input
                className="search"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            )}
          </div>
          <div className="topbar-secondary">
            <button
              type="button"
              className={`btn ${isCardDone ? "secondary" : "green"}`}
              onClick={toggleDone}
            >
              {markDoneLabel}
            </button>
            <button type="button" className="btn blue" onClick={() => setPhrasesOpen(true)}>
              4 frases
            </button>
            {!isEssential && (
              <button type="button" className="btn secondary" onClick={() => setToolsOpen((o) => !o)}>
                {toolsOpen ? "Fechar" : "Ferramentas"}
              </button>
            )}
          </div>
        </div>

        {!isEssential && toolsOpen && (
          <div className="wrap tools-panel">
            <select
              className="select"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category | "All")}
            >
              <option value="All">Todas categorias</option>
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
              <option value="All">Todas dificuldades</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <select
              className="select"
              value={connectorSet}
              onChange={(e) => setConnectorSet(e.target.value as ConnectorSetId)}
            >
              <option value="classic">Conectores: Classic</option>
              {CONNECTOR_SETS.filter((set) => set.id !== "classic").map((set) => (
                <option key={set.id} value={set.id}>
                  Conectores: {set.label}
                </option>
              ))}
              <option value="random">Conectores: Random</option>
            </select>
            <button type="button" className="btn secondary" onClick={() => setProfileOpen(true)}>
              Perfil
            </button>
            <button type="button" className="btn secondary" onClick={() => setConnectorsOpen(true)}>
              Conectores
            </button>
            <button type="button" className="btn purple" onClick={() => setSimulatorActive(true)}>
              Simulador
            </button>
            <button type="button" className="btn blue" onClick={randomCard}>
              Aleatório
            </button>
            <button type="button" className="btn orange" onClick={resetProgress}>
              Reset
            </button>
          </div>
        )}
      </div>

      <section className={`hero ${isEssential ? "hero-compact" : ""}`}>
        {isEssential ? (
          <>
            <h1>8 perguntas essenciais</h1>
            <p className="sub">
              Uma pergunta central por tema — ideal para começar ou revisar rápido antes da prova.
            </p>
            <div className="progress-summary">
              <div className="progress-track">
                <div
                  className="progress-track-fill"
                  style={{ width: `${pool.length ? (poolDone / pool.length) * 100 : 0}%` }}
                />
              </div>
              <span>
                {poolDone} / {pool.length} concluídas
              </span>
            </div>
            <div className="essential-actions">
              <button type="button" className="btn secondary" onClick={() => setPhrasesOpen(true)}>
                Menu 4 frases
              </button>
              <button type="button" className="btn secondary" onClick={() => setSimulatorActive(true)}>
                Simulador rápido
              </button>
            </div>
          </>
        ) : (
          <>
            <h1>{CARDS.length} perguntas ICAO Part 1</h1>
            <p className="sub">
              {isExam
                ? "Modo prova: responda em voz alta, use o checklist e revele a resposta modelo."
                : "Modo estudo: leia a estrutura, pratique com o timer de 45 segundos."}
            </p>
            <div className="stats">
              <div className="stat">
                <strong>
                  {done.length} / {CARDS.length}
                </strong>
                <span>concluídas</span>
              </div>
              <div className="stat">
                <strong>{isExam ? "Prova" : "Estudo"}</strong>
                <span>modo atual</span>
              </div>
              <div className="stat">
                <strong>{answerWords}w</strong>
                <span>palavras alvo</span>
              </div>
              <div className="stat">
                <strong>{profile.aircraft}</strong>
                <span>{formatFlightHours(profile.hours)}h</span>
              </div>
            </div>
          </>
        )}
      </section>

      {isEssential && (
        <div className="wrap topic-pills">
          {(Object.entries(ESSENTIAL_BY_CATEGORY) as [Category, string][]).map(([cat, num]) => {
            const idx = CARDS.findIndex((c) => c.num === num);
            const active = current === idx;
            return (
              <button
                key={cat}
                type="button"
                className={`topic-pill ${active ? "active" : ""} ${done.includes(num) ? "done" : ""}`}
                onClick={() => selectCard(idx)}
              >
                <span className="topic-pill-label">{CATEGORIES[cat]}</span>
                <span className="topic-pill-num">#{num}</span>
              </button>
            );
          })}
        </div>
      )}

      <main className={`main ${isEssential ? "main-essential" : ""}`}>
        {!isEssential && (
          <aside className="sidebar">
            <div className="sidebar-head">
              <h4>Progresso</h4>
              <div className="category-progress">
                {(Object.entries(CATEGORIES) as [Category, string][]).map(([key, label]) => (
                  <div key={key} className="category-row">
                    <span>{label}</span>
                    <strong>
                      {categoryDoneCount(key, done, pool)} / {categoryTotal(key, pool)}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
            {filtered.length === 0 ? (
              <p>Nenhum cartão encontrado.</p>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.num}
                  type="button"
                  className={`list-btn ${c.idx === current ? "active" : ""}`}
                  onClick={() => selectCard(c.idx)}
                >
                  <b>
                    {done.includes(c.num) ? "✓ " : ""}
                    {c.num}. {c.question}
                  </b>
                  <div className="list-meta">
                    <span className="list-tag">{CATEGORIES[c.category]}</span>
                    <span className={`diff ${c.difficulty}`}>{c.difficulty}</span>
                  </div>
                </button>
              ))
            )}
          </aside>
        )}

        <section>
          <article className={`card ${isEssential ? "card-essential" : ""}`}>
            <div className="card-top">
              <div className="card-meta">
                <span className="card-num">#{card.num}</span>
                <span className="category-badge">
                  {isEssential ? essentialLabelFor(card.num) : CATEGORIES[card.category]}
                </span>
                {!isEssential && (
                  <span className={`diff ${card.difficulty}`}>{card.difficulty}</span>
                )}
              </div>
              <h2 className="question">{card.question}</h2>

              {!isExam && (
                <div className="memory">
                  Memory flow
                  <MemoryFlow memory={card.memory} memoryLabels={card.memoryLabels} expanded={!isEssential} />
                </div>
              )}

              {isExam && (
                <div className="exam-banner">
                  Modo prova — sem dicas. Inicie o timer, responda em voz alta e revele a resposta.
                </div>
              )}

              <div className={`timer ${isEssential ? "timer-compact" : ""}`}>
                <button type="button" className="btn green" onClick={startTimer}>
                  ▶ {isEssential ? "45s" : "Start 45s"}
                </button>
                {!isEssential && (
                  <>
                    <button type="button" className="btn secondary" onClick={stopTimer}>
                      Stop
                    </button>
                    <button type="button" className="btn secondary" onClick={resetTimer}>
                      Reset
                    </button>
                  </>
                )}
                <div className="clock">{clock}</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>

            <div className="card-body">
              {!isExam && !isEssential && structureBlocks}

              {!isExam && isEssential && showStructure && structureBlocks}

              {!isExam && (
                <div className="phrases-inline">
                  <div className="phrases-inline-head">
                    <h3>4 frases simples</h3>
                    <button type="button" className="btn secondary btn-sm" onClick={() => setPhrasesOpen(true)}>
                      Ver todas
                    </button>
                  </div>
                  <ol className="phrases-four phrases-four-inline">
                    {simplePhrases.map((phrase, i) => (
                      <li key={phrase.label}>
                        <button
                          type="button"
                          className="phrase-line"
                          onClick={() => copyPhrase(phrase.text)}
                          title="Copiar frase"
                        >
                          <span className="phrase-label">
                            {i + 1}. {phrase.label}
                          </span>
                          <span className="phrase-text">{phrase.text}</span>
                        </button>
                      </li>
                    ))}
                  </ol>
                  <button
                    type="button"
                    className="btn secondary btn-sm phrases-copy-all"
                    onClick={() => copyPhrase(getSimplePhrasesText(card))}
                  >
                    Copiar as 4 frases
                  </button>
                </div>
              )}

              {!isExam && isEssential && (
                <button
                  type="button"
                  className="btn secondary structure-toggle"
                  onClick={() => setShowStructure((s) => !s)}
                >
                  {showStructure ? "Ocultar estrutura" : "Ver estrutura ICAO 5"}
                </button>
              )}

              {!isEssential && (
                <div className="checklist">
                  <h3>Self-check — ICAO 5</h3>
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
                    {checklistDone} / {CHECKLIST_ITEMS.length}
                    {checklistDone === CHECKLIST_ITEMS.length ? " — completo!" : ""}
                  </div>
                </div>
              )}

              <div className="nav-row answer-actions">
                <button
                  type="button"
                  className="btn purple btn-large"
                  onClick={() => setShowAnswer((prev) => !prev)}
                >
                  {showAnswer ? "Ocultar resposta" : "Mostrar resposta ICAO 5"}
                </button>
                <button type="button" className="btn secondary" onClick={toggleSpeak}>
                  {speaking ? "Parar áudio" : "Ouvir"}
                </button>
              </div>

              <div className={`answer ${showAnswer ? "show" : ""}`}>
                <p className="answer-text">{card.answer}</p>
                <div className="word-meta">
                  <span>{answerWords} palavras</span>
                  <span>Alvo: 35–60 segundos</span>
                </div>
              </div>

              <div className="nav-row">
                <button type="button" className="btn secondary" onClick={() => navigateFiltered(-1)}>
                  ← Anterior
                </button>
                {isEssential && (
                  <span className="nav-counter">
                    {filteredIndices.indexOf(current) + 1} / {filtered.length}
                  </span>
                )}
                <button type="button" className="btn secondary" onClick={() => navigateFiltered(1)}>
                  Próxima →
                </button>
              </div>
            </div>
          </article>
        </section>
      </main>
    </>
  );
}
