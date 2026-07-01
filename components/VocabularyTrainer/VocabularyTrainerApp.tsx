"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import ShadowingMode from "@/components/VocabularyTrainer/ShadowingMode";
import VocabularyTrainerMode from "@/components/VocabularyTrainer/VocabularyTrainerMode";
import { ICAO_CORE_VOCABULARY } from "@/data/icaoVocabulary";
import { useVocabularyProgress } from "@/hooks/useVocabularyProgress";
import { useTheme } from "@/hooks/useTheme";
import "@/app/vocabulario/vocab-studio.css";

type TrainerTab = "practice" | "shadowing";

export default function VocabularyTrainerApp() {
  const searchParams = useSearchParams();
  const { theme, toggle: toggleTheme } = useTheme();
  const { mission, masteredCount } = useVocabularyProgress();
  const [tab, setTab] = useState<TrainerTab>("practice");
  const initialTermId = searchParams.get("term") ?? undefined;

  return (
    <div className="vocab-studio-page">
      <header className="vocab-studio-header">
        <div className="wrap vocab-studio-header-inner">
          <div className="vocab-studio-brand">
            <span className="vocab-studio-brand-icon" aria-hidden>
              📚
            </span>
            <div>
              <strong>ICAO Vocabulary</strong>
              <span>Azure pronunciation · {ICAO_CORE_VOCABULARY.length} expressões core</span>
            </div>
          </div>

          <div className="vocab-studio-header-actions">
            <div className="vocab-studio-stats" aria-label="Progresso">
              <div className="vocab-studio-stat">
                <strong>{masteredCount}</strong>
                <span>dominados</span>
              </div>
              <div className="vocab-studio-stat">
                <strong>{mission.dueToday}</strong>
                <span>revisar</span>
              </div>
              <div className="vocab-studio-stat">
                <strong>{mission.streak}</strong>
                <span>dias streak</span>
              </div>
            </div>

            <div className="vocab-studio-tabs" role="tablist" aria-label="Modo de treino">
              <button
                type="button"
                role="tab"
                aria-selected={tab === "practice"}
                className={`vocab-studio-tab ${tab === "practice" ? "active" : ""}`}
                onClick={() => setTab("practice")}
              >
                Practice
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "shadowing"}
                className={`vocab-studio-tab ${tab === "shadowing" ? "active" : ""}`}
                onClick={() => setTab("shadowing")}
              >
                Shadowing
              </button>
            </div>

            <button
              type="button"
              className="btn icon-btn secondary"
              onClick={toggleTheme}
              aria-label="Alternar tema"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </header>

      <main className="wrap vocab-studio-main">
        {tab === "practice" ? (
          <VocabularyTrainerMode initialTermId={initialTermId} />
        ) : (
          <ShadowingMode />
        )}
      </main>
    </div>
  );
}
