"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import InteractionMode from "@/components/Part2Trainer/InteractionMode";
import ReadbackMode from "@/components/Part2Trainer/ReadbackMode";
import ReportedSpeechMode from "@/components/Part2Trainer/ReportedSpeechMode";
import { ICAO_VOCABULARY, ICAO_CORE_VOCABULARY } from "@/data/icaoVocabulary";
import { useTheme } from "@/hooks/useTheme";
import { ALL_EXAM_SITUATIONS } from "@/data/exams/part2Data";
import { loadPart2Progress, part2Stats, type Part2ProgressStore } from "@/lib/part2/progress";
import type { Part2Mode } from "@/lib/part2/types";

const MODES: { id: Part2Mode; label: string; desc: string }[] = [
  { id: "readback", label: "Readback", desc: "20 clearances reais com áudio" },
  { id: "interaction", label: "Interaction", desc: "Reportar problemas — 20 cenários" },
  { id: "reported", label: "Reported Speech", desc: "What did the controller say?" },
];

export default function Part2TrainerApp() {
  const searchParams = useSearchParams();
  const scenarioId = searchParams.get("scenario");
  const openShadow = searchParams.get("shadow") === "1";
  const openPractice = searchParams.get("practice") === "1";
  const { theme, toggle: toggleTheme, hydrated } = useTheme();
  const [mode, setMode] = useState<Part2Mode>("readback");
  const [progress, setProgress] = useState<Part2ProgressStore>({
    items: {},
    vocabularyKnown: [],
    dailyCount: {},
  });

  useEffect(() => {
    if (!hydrated) return;
    setProgress(loadPart2Progress());
  }, [hydrated]);

  useEffect(() => {
    const requested = searchParams.get("mode");
    if (requested === "readback" || requested === "interaction" || requested === "reported") {
      setMode(requested);
    }
  }, [searchParams]);

  const stats = part2Stats(progress, ICAO_VOCABULARY.length);

  return (
    <>
      <header className="header delta-header">
        <div className="wrap delta-topbar">
          <div className="delta-brand">
            <span className="delta-logo">📡</span>
            <div>
              <strong>SDEA Part 2</strong>
              <span>Provas reais 23C–26C — {ALL_EXAM_SITUATIONS.length} situações</span>
            </div>
          </div>
          <button type="button" className="btn icon-btn secondary" onClick={toggleTheme} aria-label="Theme">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      <section className="hero hero-compact hero-delta">
        <div className="wrap hero-delta-inner">
          <h1>Part 2 — Open practice</h1>
          <p className="sub hero-sub-compact">
            Readback, interaction e reported speech — revisão livre, fora do voo de hoje.
          </p>
          <div className="delta-dashboard delta-dashboard-compact part2-dashboard" aria-label="Progresso Part 2">
            <div className="delta-stat mastered">
              <strong>{stats.mastered}</strong>
              <span>dominados</span>
            </div>
            <div className="delta-stat difficult">
              <strong>{stats.difficult}</strong>
              <span>difíceis</span>
            </div>
          </div>
          <p className="hero-inline-links">
            <Link href="/word-mission" className="hero-inline-link">
              Vocabulário Part 2 ({ICAO_CORE_VOCABULARY.length} core) →
            </Link>
            {" · "}
            <Link href="/part2" className="hero-inline-link">
              ← Prova completa de hoje (missão)
            </Link>
          </p>
        </div>
      </section>

      <div className="wrap part2-mode-nav">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`part2-mode-btn ${mode === m.id ? "active" : ""}`}
            onClick={() => setMode(m.id)}
          >
            <strong>{m.label}</strong>
            <span>{m.desc}</span>
          </button>
        ))}
      </div>

      <main className="main main-essential part2-main">
        <section>
          {mode === "readback" && (
            <ReadbackMode
              progress={progress}
              onProgressChange={setProgress}
              openShadow={openShadow}
              openPractice={openPractice}
              scenarioId={scenarioId}
            />
          )}
          {mode === "interaction" && (
            <InteractionMode
              progress={progress}
              onProgressChange={setProgress}
              openShadow={openShadow}
              openPractice={openPractice}
              scenarioId={scenarioId}
            />
          )}
          {mode === "reported" && (
            <ReportedSpeechMode
              progress={progress}
              onProgressChange={setProgress}
              openShadow={openShadow}
              openPractice={openPractice}
              scenarioId={scenarioId}
            />
          )}
        </section>
      </main>
    </>
  );
}
