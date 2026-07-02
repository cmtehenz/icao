"use client";

import { useCallback, useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { FULL_EXAM_METAS } from "@/data/fullExams";
import type { FullExamId, ListeningMode } from "@/lib/fullExamListening/types";
import { loadListeningProgress, type FullExamListeningProgress } from "@/lib/fullExamListening/progress";
import ExamSelectScreen from "./ExamSelectScreen";
import ExamPlayer from "./ExamPlayer";

type View = "list" | "player";

export default function FullExamListeningApp() {
  const { theme, toggle: toggleTheme, hydrated } = useTheme();
  const [view, setView] = useState<View>("list");
  const [selectedExamId, setSelectedExamId] = useState<FullExamId | null>(null);
  const [startIndex, setStartIndex] = useState(0);
  const [mode, setMode] = useState<ListeningMode>("full");
  const [progress, setProgress] = useState<FullExamListeningProgress>(() => loadListeningProgress());

  const refreshProgress = useCallback(() => {
    setProgress(loadListeningProgress());
  }, []);

  useEffect(() => {
    refreshProgress();
    const onChange = () => refreshProgress();
    window.addEventListener("icao-full-exam-listening-change", onChange);
    return () => window.removeEventListener("icao-full-exam-listening-change", onChange);
  }, [refreshProgress]);

  const handleSelect = (examId: FullExamId, index = 0) => {
    setSelectedExamId(examId);
    setStartIndex(index);
    setView("player");
  };

  const handleBack = () => {
    setView("list");
    refreshProgress();
  };

  const selectedExam = FULL_EXAM_METAS.find((e) => e.id === selectedExamId);

  return (
    <>
      <header className="header delta-header fel-header">
        <div className="wrap delta-topbar">
          <div className="delta-brand">
            <span className="delta-logo">🎧</span>
            <div>
              <strong>Escutar Prova</strong>
              <span>Full Exam Listening · 23C–26C</span>
            </div>
          </div>
          {hydrated && (
            <button type="button" className="btn icon-btn secondary" onClick={toggleTheme} aria-label="Theme">
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          )}
        </div>
      </header>

      <section className="hero hero-compact hero-delta fel-hero">
        <div className="wrap hero-delta-inner">
          <h1>Escutar Prova</h1>
          <p className="sub hero-sub-compact">
            Ouça a prova completa como uma aula de áudio — examinadora, candidato modelo e áudios ATC originais.
          </p>
          <div className="delta-dashboard delta-dashboard-compact fel-stats" aria-label="Listening progress">
            <div className="delta-stat mastered">
              <strong>{progress.completedExams.length}</strong>
              <span>provas ouvidas</span>
            </div>
            <div className="delta-stat">
              <strong>{progress.sessionCount}</strong>
              <span>sessões</span>
            </div>
            <div className="delta-stat difficult">
              <strong>{progress.difficultItemIds.length}</strong>
              <span>itens difíceis</span>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap fel-body">
        {view === "list" && (
          <ExamSelectScreen exams={FULL_EXAM_METAS} progress={progress} onSelect={handleSelect} />
        )}
        {view === "player" && selectedExam && (
          <ExamPlayer
            key={`${selectedExam.id}-${mode}-${startIndex}`}
            exam={selectedExam}
            mode={mode}
            startIndex={startIndex}
            onBack={handleBack}
            onModeChange={setMode}
          />
        )}
      </div>
    </>
  );
}
