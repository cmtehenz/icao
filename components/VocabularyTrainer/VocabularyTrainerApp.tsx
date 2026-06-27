"use client";

import { useState } from "react";
import ProgressDashboard from "@/components/VocabularyTrainer/ProgressDashboard";
import ShadowingMode from "@/components/VocabularyTrainer/ShadowingMode";
import VocabularyTrainerMode from "@/components/VocabularyTrainer/VocabularyTrainerMode";
import { ICAO_CORE_VOCABULARY } from "@/data/icaoVocabulary";
import { useVocabularyProgress } from "@/hooks/useVocabularyProgress";
import { useTheme } from "@/hooks/useTheme";

type TrainerTab = "practice" | "shadowing";

export default function VocabularyTrainerApp() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { total, mission, masteredCount } = useVocabularyProgress();
  const [tab, setTab] = useState<TrainerTab>("practice");

  return (
    <>
      <header className="header delta-header">
        <div className="wrap delta-topbar">
          <div className="delta-brand">
            <span className="delta-logo">📚</span>
            <div>
              <strong>Vocabulary Trainer</strong>
              <span>Azure TTS + Pronunciation · ICAO/SDEA</span>
            </div>
          </div>
          <button type="button" className="btn icon-btn secondary" onClick={toggleTheme} aria-label="Theme">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      <section className="hero hero-compact hero-delta hero-vocab">
        <div className="wrap hero-delta-inner">
          <h1>ICAO Vocabulary</h1>
          <p className="sub">
            {ICAO_CORE_VOCABULARY.length} core SDEA expressions + extended library. Four training levels, shadowing, and spaced repetition.
          </p>
          <ProgressDashboard mission={mission} total={total} mastered={masteredCount} />
        </div>
      </section>

      <main className="main main-essential part2-main">
        <section className="wrap">
          <div className="vocab-trainer-tabs">
            <button
              type="button"
              className={`filter-chip ${tab === "practice" ? "active" : ""}`}
              onClick={() => setTab("practice")}
            >
              Practice
            </button>
            <button
              type="button"
              className={`filter-chip ${tab === "shadowing" ? "active" : ""}`}
              onClick={() => setTab("shadowing")}
            >
              Shadowing
            </button>
          </div>
          {tab === "practice" ? <VocabularyTrainerMode /> : <ShadowingMode />}
        </section>
      </main>
    </>
  );
}
