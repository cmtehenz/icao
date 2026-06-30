"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ConnectorsBank from "@/components/ConnectorsBank";
import ExamVersionPicker from "@/components/ExamVersionPicker";
import PilotProfileModal from "@/components/PilotProfileModal";
import QuickPhrasesMenu from "@/components/QuickPhrasesMenu";
import AnswerPanel from "@/components/study/AnswerPanel";
import PeelBlockWeakBadge from "@/components/study/PeelBlockWeakBadge";
import PeelBlockWeakDetail from "@/components/study/PeelBlockWeakDetail";
import PeelShadowingPanel from "@/components/study/PeelShadowingPanel";
import Part1ToolsMenu from "@/components/study/Part1ToolsMenu";
import StudyPracticeToolbar, { type PracticePhase } from "@/components/study/StudyPracticeToolbar";
import VoicePracticePanel from "@/components/study/VoicePracticePanel";
import ExamSession from "@/components/study/ExamSession";
import FilterBar, { type CardFilter } from "@/components/study/FilterBar";
import KeywordsPanel from "@/components/study/KeywordsPanel";
import MemoryFlow from "@/components/study/MemoryFlow";
import ProgressBadge from "@/components/study/ProgressBadge";
import StudyDashboard from "@/components/study/StudyDashboard";
import PronunciationVaultCard from "@/components/PronunciationVaultCard";
import VoiceCoachPanel from "@/components/VoiceCoachPanel";
import { PART1_BY_EXAM } from "@/data/exams/part1";
import { useTheme } from "@/hooks/useTheme";
import { CATEGORIES } from "@/lib/categories";
import { CARDS } from "@/lib/cards";
import { loadConnectorSet, saveConnectorSet, type ConnectorSetId } from "@/lib/connectors";
import { isFavorite, loadFavorites, toggleFavorite } from "@/lib/favorites";
import { getExamForCard } from "@/data/exams/part1";
import { getKeywords } from "@/lib/icaoStructure";
import { personalizeCard } from "@/lib/personalize";
import {
  getCardProgress,
  loadProgress,
  recordPractice,
  setCardStatus,
  type ProgressStore,
} from "@/lib/progress";
import { DEFAULT_PROFILE, loadProfile, type PilotProfile } from "@/lib/profile";
import { EXAM_LABELS, type ExamVersion } from "@/lib/exams/types";
import { isSpeaking, speakText, stopSpeaking } from "@/lib/tts";
import { buildSpokenAnswer } from "@/lib/spokenAnswer";
import { wordCount } from "@/lib/utils";
import type { PeelBlockId } from "@/lib/peelBlocks";
import { useSimulationUnlock } from "@/hooks/useSimulationUnlock";

type FilteredCard = { card: (typeof CARDS)[number]; idx: number };

export default function FlashcardApp() {
  const searchParams = useSearchParams();
  const { theme, toggle: toggleTheme, hydrated } = useTheme();
  const [current, setCurrent] = useState(0);
  const [view, setView] = useState<"study" | "exam">("study");
  const [filter, setFilter] = useState<CardFilter>("all");
  const [examVersion, setExamVersion] = useState<ExamVersion | "all">("all");
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
  const [voicePracticeOpen, setVoicePracticeOpen] = useState(false);
  const [peelBlockId, setPeelBlockId] = useState<PeelBlockId | null>(null);
  const { unlocked: simUnlocked, hint: simHint } = useSimulationUnlock();

  const filtered = useMemo((): FilteredCard[] => {
    return CARDS.map((card, idx) => ({ card, idx })).filter(({ card }) => {
      if (filter === "favorites") return favorites.includes(card.num);
      if (examVersion !== "all") {
        const nums = PART1_BY_EXAM[examVersion];
        if (!nums.includes(card.num)) return false;
      }
      return true;
    });
  }, [filter, favorites, examVersion]);

  const card = useMemo(
    () => personalizeCard(CARDS[current], profile, connectorSet),
    [current, profile, connectorSet],
  );

  const cardExam = getExamForCard(card.num);
  const keywords = getKeywords(card);
  const cardProgress = getCardProgress(progress, card.num);
  const favorite = isFavorite(favorites, card.num);
  const answerWords = card.targetWords ?? wordCount(card.answer);

  const selectCard = useCallback(
    (idx: number) => {
      stopSpeaking();
      setSpeaking(false);
      setCurrent(idx);
      setShowAnswer(false);
      setKeywordsOnly(false);
      setPeelBlockId(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [],
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

  const markStatus = useCallback(
    (status: "difficult" | "mastered") => {
      const next = setCardStatus(progress, card.num, status);
      setProgress(next);
    },
    [card.num, progress],
  );

  const trainPeelBlock = useCallback((blockId: PeelBlockId) => {
    setPeelBlockId(blockId);
    setVoicePracticeOpen(true);
    window.scrollTo({ top: document.body.scrollHeight * 0.4, behavior: "smooth" });
  }, []);

  const toggleStar = useCallback(() => {
    setFavorites((prev) => toggleFavorite(prev, card.num));
  }, [card.num]);

  const toggleSpeak = useCallback(() => {
    if (speaking || isSpeaking()) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    const ok = speakText(buildSpokenAnswer(card.answer), () => setSpeaking(false));
    if (ok) setSpeaking(true);
  }, [card.answer, speaking]);

  useEffect(() => {
    if (!hydrated) return;
    setProfile(loadProfile());
    setConnectorSet(loadConnectorSet());
    setFavorites(loadFavorites());
    setProgress(loadProgress());
  }, [hydrated]);

  useEffect(() => {
    if (searchParams.get("view") === "exam" && simUnlocked) setView("exam");
  }, [searchParams, simUnlocked]);

  useEffect(() => {
    if (!hydrated) return;
    const cardNum = searchParams.get("card");
    if (!cardNum) return;
    const idx = CARDS.findIndex((c) => c.num === cardNum);
    if (idx >= 0) selectCard(idx);
    if (searchParams.get("shadow") === "1") setVoicePracticeOpen(true);
    const block = searchParams.get("block");
    if (block) {
      setPeelBlockId(block as PeelBlockId);
      setVoicePracticeOpen(true);
    }
  }, [hydrated, searchParams, selectCard]);

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

  const practicePhase: PracticePhase =
    !keywordsOnly && !showAnswer ? "full" : keywordsOnly && !showAnswer ? "keywords" : "answer";

  const handlePracticePrimary = useCallback(() => {
    if (practicePhase === "full") {
      setKeywordsOnly(true);
      setShowAnswer(false);
      setProgress(recordPractice(progress, card.num));
    } else if (practicePhase === "keywords") {
      setShowAnswer(true);
    } else {
      toggleSpeak();
    }
  }, [practicePhase, progress, card.num, toggleSpeak]);

  const resetPractice = useCallback(() => {
    stopSpeaking();
    setSpeaking(false);
    setKeywordsOnly(false);
    setShowAnswer(false);
  }, []);

  if (view === "exam") {
    return (
      <ExamSession
        profile={profile}
        examVersion={examVersion}
        progress={progress}
        onProgressChange={setProgress}
        onExit={() => setView("study")}
      />
    );
  }

  const posInFilter = filtered.findIndex((f) => f.idx === current);

  return (
    <div className="part1-page">
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
              <strong>SDEA Part 1</strong>
              <span>Provas reais 23C–26C</span>
            </div>
          </div>
          <div className="delta-topbar-actions">
            <Part1ToolsMenu
              onPrevious={() => navigateFiltered(-1)}
              onProfile={() => setProfileOpen(true)}
              onConnectors={() => setConnectorsOpen(true)}
              onPhrases={() => setPhrasesOpen(true)}
            />
            <button type="button" className="btn icon-btn secondary" onClick={toggleTheme} aria-label="Theme">
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            {simUnlocked ? (
              <button type="button" className="btn purple" onClick={() => setView("exam")}>
                Simular prova
              </button>
            ) : (
              <button
                type="button"
                className="btn secondary simulation-locked"
                disabled
                title={simHint}
              >
                Simulado bloqueado
              </button>
            )}
          </div>
        </div>
      </header>

      <section className="hero hero-compact hero-delta">
        <div className="wrap hero-delta-inner">
          <h1>Part 1 — Aviation Topics</h1>
          <p className="sub">
            12 perguntas das 4 provas reais de helicóptero. Na prova caem 3 — treine por versão ou simule o sorteio.
          </p>
          <StudyDashboard progress={progress} total={CARDS.length} />
          <PronunciationVaultCard />
          <ExamVersionPicker value={examVersion} onChange={setExamVersion} />
          <FilterBar
            filter={filter}
            favoriteCount={favorites.length}
            total={filtered.length}
            onChange={setFilter}
          />
        </div>
      </section>

      <main className="part1-study wrap">
        <div className="topic-pills topic-pills-delta">
          {filtered.map(({ card: c, idx }) => {
            const st = getCardProgress(progress, c.num);
            const exam = getExamForCard(c.num);
            return (
              <button
                key={c.num}
                type="button"
                className={`topic-pill ${current === idx ? "active" : ""} status-${st.status}`}
                onClick={() => selectCard(idx)}
                title={c.question}
              >
                <span className="topic-pill-label">{exam ?? `#${c.num}`}</span>
                <PeelBlockWeakBadge cardNum={c.num} compact />
                {favorites.includes(c.num) && <span className="pill-star">★</span>}
              </button>
            );
          })}
        </div>

        <article className="card card-essential part1-card">
          <div className="card-top">
            <div className="card-meta">
              {cardExam && <span className="exam-version-badge">{EXAM_LABELS[cardExam]}</span>}
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

            <div className="memory">
              Memory flow
              <MemoryFlow memory={card.memory} memoryLabels={card.memoryLabels} />
            </div>
          </div>

          <div className="card-body">
            <KeywordsPanel keywords={keywords} hidden={!showKeywords && !keywordsOnly} />

            {!keywordsOnly && (
              <VoicePracticePanel
                initialOpen={voicePracticeOpen || searchParams.get("shadow") === "1"}
                preferredTab={peelBlockId ? "shadow" : undefined}
                beforeTabs={
                  <PeelBlockWeakDetail cardNum={card.num} onTrainBlock={trainPeelBlock} />
                }
                shadow={
                  <PeelShadowingPanel
                    embedded
                    card={card}
                    question={card.question}
                    initialOpen
                    initialBlockId={peelBlockId}
                  />
                }
                coach={
                  <VoiceCoachPanel
                    embedded
                    question={card.question}
                    modelAnswer={card.answer}
                    evaluateType="part1"
                    keywords={keywords}
                  />
                }
              />
            )}

            {keywordsOnly && !showAnswer && (
              <div className="keywords-only-banner">
                <p>Só keywords — tente responder em voz alta antes de revelar.</p>
              </div>
            )}

            <StudyPracticeToolbar
              phase={practicePhase}
              showKeywords={showKeywords}
              speaking={speaking}
              onPrimary={handlePracticePrimary}
              onToggleKeywordsVisible={() => setShowKeywords((s) => !s)}
              onResetPractice={resetPractice}
            />

            <AnswerPanel card={card} show={showAnswer} />

            <div className="study-toolbar study-toolbar-secondary">
              <button type="button" className="btn orange btn-sm" onClick={() => markStatus("difficult")}>
                Difícil
              </button>
              <button type="button" className="btn green btn-sm" onClick={() => markStatus("mastered")}>
                Dominada
              </button>
              <button type="button" className="btn blue" onClick={() => navigateFiltered(1)}>
                Próxima →
              </button>
            </div>

            <div className="card-footer-meta">
              <span>{answerWords} words</span>
              <span>
                {posInFilter + 1} / {filtered.length}
              </span>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
