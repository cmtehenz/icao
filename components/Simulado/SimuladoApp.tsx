"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/hooks/useTheme";
import SimuladoExamSelect from "@/components/Simulado/SimuladoExamSelect";
import SimuladoModeSelect from "@/components/Simulado/SimuladoModeSelect";
import SimuladoReport from "@/components/Simulado/SimuladoReport";
import SimuladoHistoryList from "@/components/Simulado/SimuladoHistoryList";
import SimuladoRunner from "@/components/Simulado/SimuladoRunner";
import CaptainDeltaExaminerIntro from "@/components/CaptainDelta/Examiner/CaptainDeltaExaminerIntro";
import CaptainDeltaExaminerDebrief from "@/components/CaptainDelta/Examiner/CaptainDeltaExaminerDebrief";
import { useCaptainDeltaExaminer } from "@/components/CaptainDelta/Examiner/CaptainDeltaExaminerProvider";
import { buildExaminerExamRecord } from "@/lib/captainDelta/examiner/debrief";
import { saveExaminerExamRecord } from "@/lib/captainDelta/examiner/store";
import { emitCaptainDeltaExamFinished } from "@/lib/captainDelta/examiner/events";
import { emitCaptainDeltaDebrief } from "@/lib/captainDelta/events";
import { syncDailyMissionLog } from "@/lib/dailyMissionLog";
import { examVersionFromMeta } from "@/lib/simulado/buildSteps";
import { loadDashboardStats, getSimuladoReportById, saveSimuladoReport } from "@/lib/simulado/progress";
import {
  clearSimuladoDraft,
  formatDraftSummary,
  loadSimuladoDraft,
  SIMULADO_DRAFT_CHANGE_EVENT,
} from "@/lib/simulado/sessionDraft";
import { recordStudyActivity } from "@/lib/studyTime";
import type { SimuladoExamId } from "@/data/exams";
import { SIMULADO_EXAMS } from "@/data/exams";
import type {
  SimulationMode,
  SimuladoPart,
  SimuladoSessionConfig,
  SimuladoSessionSnapshot,
  SimuladoStepResult,
  SimulationReport,
} from "@/lib/simulado/types";

type View = "home" | "mode" | "exam" | "examiner-intro" | "session" | "report";

export default function SimuladoApp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, toggle: toggleTheme, hydrated } = useTheme();
  const [view, setView] = useState<View>("home");
  const [mode, setMode] = useState<SimulationMode>("full");
  const [customParts, setCustomParts] = useState<SimuladoPart[] | undefined>();
  const [examId, setExamId] = useState<SimuladoExamId>("exam1");
  const [report, setReport] = useState<SimulationReport | null>(null);
  const [reportFromHistory, setReportFromHistory] = useState(false);
  const [stats, setStats] = useState(() => loadDashboardStats());
  const [draft, setDraft] = useState<SimuladoSessionSnapshot | null>(null);
  const [resumeSnapshot, setResumeSnapshot] = useState<SimuladoSessionSnapshot | null>(null);
  const [historyPage, setHistoryPage] = useState(1);
  const [captainExaminer, setCaptainExaminer] = useState(false);
  const [sessionResults, setSessionResults] = useState<SimuladoStepResult[]>([]);
  const examinerCtx = useCaptainDeltaExaminer();

  const refreshStats = useCallback(() => setStats(loadDashboardStats()), []);
  const refreshDraft = useCallback(() => setDraft(loadSimuladoDraft()), []);

  useEffect(() => {
    refreshStats();
    refreshDraft();
    const onChange = () => refreshStats();
    const onDraftChange = () => refreshDraft();
    window.addEventListener("icao-simulado-change", onChange);
    window.addEventListener(SIMULADO_DRAFT_CHANGE_EVENT, onDraftChange);
    return () => {
      window.removeEventListener("icao-simulado-change", onChange);
      window.removeEventListener(SIMULADO_DRAFT_CHANGE_EVENT, onDraftChange);
    };
  }, [refreshStats, refreshDraft]);

  useEffect(() => {
    const exam = searchParams.get("exam");
    if (exam && SIMULADO_EXAMS.some((e) => e.id === exam)) {
      setExamId(exam as SimuladoExamId);
    }
  }, [searchParams]);

  const sessionConfig: SimuladoSessionConfig | null =
    view === "session"
      ? {
          examVersion: examVersionFromMeta(examId),
          mode,
          customParts: mode === "custom" ? customParts : undefined,
        }
      : null;

  const sessionConfigMemo = useMemo(
    () => sessionConfig,
    [
      view,
      examId,
      mode,
      mode === "custom" ? customParts?.join(",") : "",
    ],
  );

  const handleReport = useCallback(
    (r: SimulationReport, results: SimuladoStepResult[]) => {
      saveSimuladoReport(r);
      recordStudyActivity("simulate", 1);
      syncDailyMissionLog();
      setSessionResults(results);
      if (captainExaminer && examinerCtx) {
        const recordSteps = results.length;
        saveExaminerExamRecord(
          buildExaminerExamRecord(r, examinerCtx.recordings, recordSteps),
        );
        emitCaptainDeltaExamFinished(r.id);
        emitCaptainDeltaDebrief({
          strengths: r.strengths.slice(0, 2),
          focus: r.weaknesses.slice(0, 2),
          estimatedMinutes: 15,
        });
      }
      setReport(r);
      setReportFromHistory(false);
      setHistoryPage(1);
      setView("report");
      refreshStats();
    },
    [refreshStats, captainExaminer, examinerCtx],
  );

  const openHistoryReport = useCallback((id: string) => {
    const r = getSimuladoReportById(id);
    if (!r) return;
    setReport(r);
    setReportFromHistory(true);
    setView("report");
  }, []);

  const startSession = () => {
    setResumeSnapshot(null);
    setView("session");
  };

  const resumeDraft = () => {
    const d = loadSimuladoDraft();
    if (!d) return;
    setExamId(d.examId as SimuladoExamId);
    setMode(d.config.mode);
    setCustomParts(d.config.customParts);
    setResumeSnapshot(d);
    setView("session");
  };

  const discardDraft = () => {
    clearSimuladoDraft();
    setDraft(null);
    setResumeSnapshot(null);
  };

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
            {draft && (
              <section className="sim-draft-banner" aria-label="Simulado em andamento">
                <div className="sim-draft-text">
                  <strong>Simulado em andamento</strong>
                  <p>{formatDraftSummary(draft)}</p>
                </div>
                <div className="sim-draft-actions">
                  <button type="button" className="btn green" onClick={resumeDraft}>
                    Continuar de onde parou
                  </button>
                  <button type="button" className="btn secondary" onClick={discardDraft}>
                    Descartar
                  </button>
                </div>
              </section>
            )}
            <p className="sim-suggested">{stats.suggestedNext}</p>
            <button
              type="button"
              className="btn green sim-start-btn"
              onClick={() => {
                setCaptainExaminer(false);
                setView("mode");
              }}
            >
              {draft ? "Novo simulado" : "Iniciar simulado"}
            </button>
            <button
              type="button"
              className="btn purple sim-captain-exam-btn"
              onClick={() => {
                setCaptainExaminer(true);
                setView("mode");
              }}
            >
              👨‍✈️ Captain Delta · Mock Exam
            </button>

            <SimuladoHistoryList
              page={historyPage}
              totalSimulations={stats.totalSimulations}
              onPageChange={setHistoryPage}
              onOpenReport={openHistoryReport}
            />
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

        {view === "examiner-intro" && (
          <>
            <button type="button" className="btn secondary btn-sm" onClick={() => setView("mode")}>
              ← Voltar
            </button>
            <CaptainDeltaExaminerIntro
              mode={mode}
              customParts={customParts}
              examVersion={examVersionFromMeta(examId)}
              onStart={startSession}
              onBack={() => setView("mode")}
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
                if (captainExaminer) {
                  setView("examiner-intro");
                } else {
                  startSession();
                }
              }}
            />
          </>
        )}

        {view === "session" && sessionConfigMemo && (
          <SimuladoRunner
            config={sessionConfigMemo}
            examId={examId}
            resumeSnapshot={resumeSnapshot}
            examinerMode={captainExaminer}
            onFinish={handleReport}
            onExit={() => {
              if (captainExaminer) examinerCtx?.exitExaminerMode();
              setResumeSnapshot(null);
              refreshDraft();
              setView("home");
            }}
          />
        )}

        {view === "report" && report && captainExaminer && !reportFromHistory && (
          <>
            <CaptainDeltaExaminerDebrief
              report={report}
              results={sessionResults}
              onRepeat={() => {
                setReport(null);
                setView("session");
              }}
              onHome={() => {
                examinerCtx?.exitExaminerMode();
                setCaptainExaminer(false);
                setReport(null);
                setView("home");
              }}
            />
          </>
        )}

        {view === "report" && report && (!captainExaminer || reportFromHistory) && (
          <>
            {reportFromHistory && (
              <button
                type="button"
                className="btn secondary btn-sm"
                onClick={() => {
                  setReport(null);
                  setReportFromHistory(false);
                  setView("home");
                }}
              >
                ← Voltar ao histórico
              </button>
            )}
            <SimuladoReport
              report={report}
              fromHistory={reportFromHistory}
              onPracticeWeak={() => router.push("/part2")}
              onRepeat={() => {
                setReport(null);
                setReportFromHistory(false);
                if (reportFromHistory) {
                  setView("mode");
                } else {
                  setView("session");
                }
              }}
              onReviewVocab={() => router.push("/word-mission")}
              onHome={() => {
                setReport(null);
                setReportFromHistory(false);
                setView("home");
              }}
            />
          </>
        )}
      </div>
    </>
  );
}
