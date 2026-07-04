"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/hooks/useTheme";
import SimuladoExamSelect from "@/components/Simulado/SimuladoExamSelect";
import SimuladoModeSelect from "@/components/Simulado/SimuladoModeSelect";
import SimuladoReport from "@/components/Simulado/SimuladoReport";
import SimuladoRunner from "@/components/Simulado/SimuladoRunner";
import { syncDailyMissionLog } from "@/lib/dailyMissionLog";
import { examVersionFromMeta } from "@/lib/simulado/buildSteps";
import { loadDashboardStats, saveSimuladoReport } from "@/lib/simulado/progress";
import { recordStudyActivity } from "@/lib/studyTime";
import type { SimuladoExamId } from "@/data/exams";
import type {
  SimulationMode,
  SimuladoPart,
  SimuladoSessionConfig,
  SimulationReport,
} from "@/lib/simulado/types";

type View = "home" | "mode" | "exam" | "session" | "report";

export default function SimuladoApp() {
  const router = useRouter();
  const { theme, toggle: toggleTheme, hydrated } = useTheme();
  const [view, setView] = useState<View>("home");
  const [mode, setMode] = useState<SimulationMode>("full");
  const [customParts, setCustomParts] = useState<SimuladoPart[] | undefined>();
  const [examId, setExamId] = useState<SimuladoExamId>("exam1");
  const [report, setReport] = useState<SimulationReport | null>(null);
  const [stats, setStats] = useState(() => loadDashboardStats());

  const refreshStats = useCallback(() => setStats(loadDashboardStats()), []);

  useEffect(() => {
    refreshStats();
    const onChange = () => refreshStats();
    window.addEventListener("icao-simulado-change", onChange);
    return () => window.removeEventListener("icao-simulado-change", onChange);
  }, [refreshStats]);

  const sessionConfig: SimuladoSessionConfig | null =
    view === "session"
      ? {
          examVersion: examVersionFromMeta(examId),
          mode,
          customParts: mode === "custom" ? customParts : undefined,
        }
      : null;

  const handleReport = useCallback(
    (r: SimulationReport) => {
      saveSimuladoReport(r);
      recordStudyActivity("simulate", 1);
      syncDailyMissionLog();
      setReport(r);
      setView("report");
      refreshStats();
    },
    [refreshStats],
  );

  const startSession = () => setView("session");

  return (
    <>
      <header className="header delta-header sim-header">
        <div className="wrap delta-topbar">
          <div className="delta-brand">
            <span className="delta-logo">🎯</span>
            <div>
              <strong>Simulado ICAO</strong>
              <span>SDEA mock exam · 23C–26C</span>
            </div>
          </div>
          {hydrated && (
            <button type="button" className="btn icon-btn secondary" onClick={toggleTheme} aria-label="Theme">
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          )}
        </div>
      </header>

      <section className="hero hero-compact hero-delta sim-hero">
        <div className="wrap hero-delta-inner">
          <h1>Simulado ICAO</h1>
          <p className="sub hero-sub-compact">
            Simulação realista com TTS da examinadora, áudios ATC originais, gravação e correção por IA.
          </p>
          {view === "home" && (
            <div className="delta-dashboard delta-dashboard-compact sim-stats" aria-label="Simulation stats">
              <div className="delta-stat mastered">
                <strong>{stats.totalSimulations}</strong>
                <span>simulados</span>
              </div>
              <div className="delta-stat">
                <strong>{stats.averageScore || "—"}</strong>
                <span>média</span>
              </div>
              <div className="delta-stat">
                <strong>{stats.bestScore || "—"}</strong>
                <span>melhor</span>
              </div>
              {stats.weakestPart && (
                <div className="delta-stat difficult">
                  <strong>Part {stats.weakestPart}</strong>
                  <span>mais fraca</span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="wrap sim-body">
        {view === "home" && (
          <div className="sim-home">
            <p className="sim-suggested">{stats.suggestedNext}</p>
            <button type="button" className="btn green sim-start-btn" onClick={() => setView("mode")}>
              Iniciar simulado
            </button>

            {stats.history.length > 0 && (
              <section className="sim-history">
                <h2>Histórico</h2>
                <ul>
                  {stats.history.map((h) => (
                    <li key={h.id}>
                      <span>{new Date(h.date).toLocaleDateString("pt-BR")}</span>
                      <span>{h.examVersion} · Nível {h.estimatedLevel}</span>
                      <strong>{h.overallScore}/100</strong>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}

        {view === "mode" && (
          <>
            <button type="button" className="btn secondary btn-sm" onClick={() => setView("home")}>
              ← Voltar
            </button>
            <SimuladoModeSelect
              onSelect={(m, parts) => {
                setMode(m);
                setCustomParts(parts);
                setView("exam");
              }}
            />
          </>
        )}

        {view === "exam" && (
          <>
            <button type="button" className="btn secondary btn-sm" onClick={() => setView("mode")}>
              ← Voltar
            </button>
            <SimuladoExamSelect
              onSelect={(id) => {
                setExamId(id);
                startSession();
              }}
            />
          </>
        )}

        {view === "session" && sessionConfig && (
          <SimuladoRunner
            key={`${examId}-${mode}-${customParts?.join("-")}`}
            config={sessionConfig}
            onFinish={handleReport}
            onExit={() => setView("home")}
          />
        )}

        {view === "report" && report && (
          <SimuladoReport
            report={report}
            onPracticeWeak={() => router.push("/part2")}
            onRepeat={() => {
              setReport(null);
              setView("session");
            }}
            onReviewVocab={() => router.push("/vocabulario")}
            onHome={() => {
              setReport(null);
              setView("home");
            }}
          />
        )}
      </div>
    </>
  );
}
