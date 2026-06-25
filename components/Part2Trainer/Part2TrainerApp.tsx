"use client";

import { useEffect, useState } from "react";
import FullSimulationMode from "@/components/Part2Trainer/FullSimulationMode";
import InteractionMode from "@/components/Part2Trainer/InteractionMode";
import ReadbackMode from "@/components/Part2Trainer/ReadbackMode";
import ReportedSpeechMode from "@/components/Part2Trainer/ReportedSpeechMode";
import VocabularyDrill from "@/components/Part2Trainer/VocabularyDrill";
import { VOCABULARY_TERMS } from "@/data/part2Vocabulary";
import { useTheme } from "@/hooks/useTheme";
import { loadPart2Progress, part2Stats, type Part2ProgressStore } from "@/lib/part2/progress";
import type { Part2Mode } from "@/lib/part2/types";

const MODES: { id: Part2Mode; label: string; desc: string }[] = [
  { id: "readback", label: "Readback", desc: "Repeat ATC clearances" },
  { id: "interaction", label: "Interaction", desc: "Report abnormal situations" },
  { id: "reported", label: "Reported Speech", desc: "Tell the examiner what ATC said" },
  { id: "vocabulary", label: "Vocabulary", desc: "Part 2 aviation terms" },
  { id: "simulation", label: "Full Simulation", desc: "Complete Part 2 flow" },
];

export default function Part2TrainerApp() {
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

  const stats = part2Stats(progress, VOCABULARY_TERMS.length);

  return (
    <>
      <header className="header delta-header">
        <div className="wrap delta-topbar">
          <div className="delta-brand">
            <span className="delta-logo">📡</span>
            <div>
              <strong>SDEA Part 2 Trainer</strong>
              <span>Interacting as a Pilot</span>
            </div>
          </div>
          <button type="button" className="btn icon-btn secondary" onClick={toggleTheme} aria-label="Theme">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      <section className="hero hero-compact hero-delta">
        <div className="wrap hero-delta-inner">
          <h1>Part 2 — Pilot Interaction</h1>
          <p className="sub">
            Train readbacks, abnormal reports, reported speech, vocabulary, and full exam simulation.
          </p>
          <div className="delta-dashboard part2-dashboard">
            <div className="delta-stat mastered">
              <strong>{stats.mastered}</strong>
              <span>mastered</span>
            </div>
            <div className="delta-stat difficult">
              <strong>{stats.difficult}</strong>
              <span>difficult</span>
            </div>
            <div className="delta-stat learning">
              <strong>{stats.vocabKnown}</strong>
              <span>vocab known</span>
            </div>
            <div className="delta-stat daily">
              <strong>{stats.daily}</strong>
              <span>today</span>
            </div>
          </div>
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
            <ReadbackMode progress={progress} onProgressChange={setProgress} />
          )}
          {mode === "interaction" && (
            <InteractionMode progress={progress} onProgressChange={setProgress} />
          )}
          {mode === "reported" && (
            <ReportedSpeechMode progress={progress} onProgressChange={setProgress} />
          )}
          {mode === "vocabulary" && (
            <VocabularyDrill progress={progress} onProgressChange={setProgress} />
          )}
          {mode === "simulation" && (
            <FullSimulationMode progress={progress} onProgressChange={setProgress} />
          )}
        </section>
      </main>
    </>
  );
}
