"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import FullSimulationMode from "@/components/Part2Trainer/FullSimulationMode";
import InteractionMode from "@/components/Part2Trainer/InteractionMode";
import ReadbackMode from "@/components/Part2Trainer/ReadbackMode";
import ReportedSpeechMode from "@/components/Part2Trainer/ReportedSpeechMode";
import { ICAO_VOCABULARY, ICAO_CORE_VOCABULARY } from "@/data/icaoVocabulary";
import { useTheme } from "@/hooks/useTheme";
import { useSimulationUnlock } from "@/hooks/useSimulationUnlock";
import { ALL_EXAM_SITUATIONS } from "@/data/exams/part2Data";
import { loadPart2Progress, part2Stats, type Part2ProgressStore } from "@/lib/part2/progress";
import type { Part2Mode } from "@/lib/part2/types";

const MODES: { id: Part2Mode; label: string; desc: string }[] = [
  { id: "readback", label: "Readback", desc: "20 clearances reais com áudio" },
  { id: "interaction", label: "Interaction", desc: "Reportar problemas — 20 cenários" },
  { id: "reported", label: "Reported Speech", desc: "What did the controller say?" },
  { id: "simulation", label: "Simulação", desc: "5 situações × prova completa" },
];

export default function Part2TrainerApp() {
  const searchParams = useSearchParams();
  const { theme, toggle: toggleTheme, hydrated } = useTheme();
  const { unlocked: simUnlocked, hint: simHint } = useSimulationUnlock();
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
    } else if (requested === "simulation" && simUnlocked) {
      setMode("simulation");
    }
  }, [searchParams, simUnlocked]);

  useEffect(() => {
    if (mode === "simulation" && !simUnlocked) {
      setMode("readback");
    }
  }, [mode, simUnlocked]);

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
          <h1>Part 2 — Interacting as a Pilot</h1>
          <p className="sub">
            Treine as 5 situações de cada prova real: readback com áudio, reporte de emergência, AFFIRM/NEGATIVE e reported speech.
          </p>
          <div className="delta-dashboard part2-dashboard">
            <div className="delta-stat mastered">
              <strong>{stats.mastered}</strong>
              <span>dominados</span>
            </div>
            <div className="delta-stat difficult">
              <strong>{stats.difficult}</strong>
              <span>difíceis</span>
            </div>
            <div className="delta-stat learning">
              <strong>{ALL_EXAM_SITUATIONS.length}</strong>
              <span>situações</span>
            </div>
          </div>
          <Link href="/vocabulario" className="pronunciation-vault-card vocab-part2-link">
            <span className="pronunciation-vault-icon" aria-hidden>📚</span>
            <div className="pronunciation-vault-body">
              <strong>Vocabulário Part 2</strong>
              <span>
                {ICAO_CORE_VOCABULARY.length} core + {ICAO_VOCABULARY.length} total · Azure TTS & shadowing
              </span>
            </div>
            <span className="pronunciation-vault-cta">Treinar →</span>
          </Link>
        </div>
      </section>

      <div className="wrap part2-mode-nav">
        {MODES.map((m) => {
          const locked = m.id === "simulation" && !simUnlocked;
          return (
            <button
              key={m.id}
              type="button"
              className={`part2-mode-btn ${mode === m.id ? "active" : ""} ${locked ? "locked" : ""}`}
              onClick={() => {
                if (locked) return;
                setMode(m.id);
              }}
              disabled={locked}
              title={locked ? simHint : undefined}
            >
              <strong>
                {m.label}
                {locked && " 🔒"}
              </strong>
              <span>{locked ? simHint : m.desc}</span>
            </button>
          );
        })}
      </div>

      <main className="main main-essential part2-main">
        <section>
          {mode === "readback" && (
            <ReadbackMode
              progress={progress}
              onProgressChange={setProgress}
              openShadow={searchParams.get("shadow") === "1"}
            />
          )}
          {mode === "interaction" && (
            <InteractionMode
              progress={progress}
              onProgressChange={setProgress}
              openShadow={searchParams.get("shadow") === "1"}
            />
          )}
          {mode === "reported" && (
            <ReportedSpeechMode progress={progress} onProgressChange={setProgress} />
          )}
          {mode === "simulation" && simUnlocked && (
            <FullSimulationMode progress={progress} onProgressChange={setProgress} />
          )}
        </section>
      </main>
    </>
  );
}
