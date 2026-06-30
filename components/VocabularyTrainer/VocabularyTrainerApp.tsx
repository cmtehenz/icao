"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import ShadowingMode from "@/components/VocabularyTrainer/ShadowingMode";
import VocabularyTrainerMode from "@/components/VocabularyTrainer/VocabularyTrainerMode";
import { ICAO_CORE_VOCABULARY } from "@/data/icaoVocabulary";
import { useVocabularyProgress } from "@/hooks/useVocabularyProgress";
import { useTheme } from "@/hooks/useTheme";

type TrainerTab = "practice" | "shadowing";

export default function VocabularyTrainerApp() {
  const searchParams = useSearchParams();
  const { theme, toggle: toggleTheme } = useTheme();
  const { mission, masteredCount } = useVocabularyProgress();
  const [tab, setTab] = useState<TrainerTab>("practice");
  const initialTermId = searchParams.get("term") ?? undefined;

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
          <div className="hero-vocab-top">
            <div>
              <h1>ICAO Vocabulary</h1>
              <p className="sub hero-sub-compact">
                {ICAO_CORE_VOCABULARY.length} expressões core · 4 níveis · shadowing · gravações
              </p>
            </div>
            <div className="hero-vocab-stats">
              <span>
                <strong>{masteredCount}</strong> dominados
              </span>
              <span>
                <strong>{mission.dueToday}</strong> para revisar
              </span>
              <span>
                <strong>{mission.streak}</strong> dias streak
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="main main-essential part2-main vocab-page-main">
        <section className="wrap vocab-page-wrap">
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
          {tab === "practice" ? (
            <VocabularyTrainerMode initialTermId={initialTermId} />
          ) : (
            <ShadowingMode />
          )}
        </section>
      </main>
    </>
  );
}
