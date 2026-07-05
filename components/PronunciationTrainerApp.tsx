"use client";

import Link from "next/link";
import PronunciationWordsMode from "@/components/Part2Trainer/PronunciationWordsMode";
import { usePronunciationVault } from "@/hooks/usePronunciationVault";
import { useTheme } from "@/hooks/useTheme";

export default function PronunciationTrainerApp() {
  const { theme, toggle: toggleTheme } = useTheme();
  const vault = usePronunciationVault();

  return (
    <>
      <header className="header delta-header">
        <div className="wrap delta-topbar">
          <div className="delta-brand">
            <span className="delta-logo">🎤</span>
            <div>
              <strong>Banco de pronúncia</strong>
              <span>Palavras salvas do Voice Coach</span>
            </div>
          </div>
          <button type="button" className="btn icon-btn secondary" onClick={toggleTheme} aria-label="Theme">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      <section className="hero hero-compact hero-delta hero-pronunciation">
        <div className="wrap hero-delta-inner">
          <h1>Pronúncia</h1>
          <p className="sub hero-sub-compact">
            Captain Delta coach · smart graduation · word → sentence → ICAO answer.
          </p>
          <div className="delta-dashboard delta-dashboard-compact pronunciation-dashboard" aria-label="Banco de pronúncia">
            <div className="delta-stat difficult">
              <strong>{vault.critical}</strong>
              <span>Critical</span>
            </div>
            <div className="delta-stat learning">
              <strong>{vault.needsPractice}</strong>
              <span>&lt;80%</span>
            </div>
            <div className="delta-stat">
              <strong>{vault.practicing}</strong>
              <span>Practicing</span>
            </div>
            <div className="delta-stat">
              <strong>{vault.useSentence + vault.useIcao}</strong>
              <span>In context</span>
            </div>
          </div>
          {vault.total > 0 && (
            <p className="hero-inline-links">
              <span className="hero-inline-meta">{vault.total} no banco</span>
              {" · "}
              <Link href="/conta" className="hero-inline-link">
                Gerenciar em Conta →
              </Link>
            </p>
          )}
        </div>
      </section>

      <main className="main main-essential part2-main pronunciation-main">
        <section className="wrap">
          <PronunciationWordsMode />
        </section>
      </main>
    </>
  );
}
