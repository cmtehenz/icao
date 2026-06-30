"use client";

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
          <p className="sub">
            Ouça no YouGlish, grave com Azure e repita até 5× acima de 80%. Adicione palavras manualmente ou salve do Voice Coach.
          </p>
          <div className="delta-dashboard part2-dashboard pronunciation-dashboard">
            <div className="delta-stat daily">
              <strong>{vault.total}</strong>
              <span>salvas</span>
            </div>
            <div className="delta-stat difficult">
              <strong>{vault.critical}</strong>
              <span>críticas</span>
            </div>
            <div className="delta-stat learning">
              <strong>{vault.needsPractice}</strong>
              <span>para treinar</span>
            </div>
          </div>
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
