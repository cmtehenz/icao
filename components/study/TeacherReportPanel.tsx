"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { buildTeacherReport, type TeacherReportLine } from "@/lib/teacherReport";
import { PART1_COACH_HISTORY_EVENT } from "@/lib/part1CoachHistory";
import { PART1_DAILY_MISSION_EVENT } from "@/lib/part1DailyMission";
import { PART2_DAILY_MISSION_EVENT } from "@/lib/part2DailyMission";
import { PART2_PROGRESS_EVENT } from "@/lib/part2/progress";
import { PEEL_BLOCK_HISTORY_EVENT } from "@/lib/peelBlockHistory";
import { STUDY_ACTIVITY_RECORDED_EVENT } from "@/lib/studyActivityRecord";
import { VAULT_CHANGE_EVENT } from "@/lib/pronunciationVault";
import { VOCAB_DAILY_MISSION_EVENT } from "@/lib/vocabDailyMission";

function ReportSection({ title, lines }: { title: string; lines: TeacherReportLine[] }) {
  return (
    <div className="teacher-report-section">
      <h4>{title}</h4>
      {lines.length === 0 ? (
        <p className="teacher-report-empty">Nenhum dado de prática ainda.</p>
      ) : (
        <ul>
          {lines.map((line) => (
            <li key={`${title}-${line.label}`}>
              <span className="teacher-report-label">{line.label}</span>
              <span className="teacher-report-score">{line.score}</span>
              {line.note && <span className="teacher-report-note">{line.note}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function TeacherReportPanel() {
  const { user } = useAuth();
  const [tick, setTick] = useState(0);
  const [copied, setCopied] = useState(false);

  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    const events = [
      PART1_COACH_HISTORY_EVENT,
      PART1_DAILY_MISSION_EVENT,
      PART2_DAILY_MISSION_EVENT,
      PART2_PROGRESS_EVENT,
      PEEL_BLOCK_HISTORY_EVENT,
      STUDY_ACTIVITY_RECORDED_EVENT,
      VAULT_CHANGE_EVENT,
      VOCAB_DAILY_MISSION_EVENT,
    ];
    for (const ev of events) window.addEventListener(ev, refresh);
    return () => {
      for (const ev of events) window.removeEventListener(ev, refresh);
    };
  }, [refresh]);

  const studentName = user?.name?.split(" ")[0] || user?.email?.split("@")[0];
  const report = useMemo(() => buildTeacherReport(studentName, 6), [tick, studentName]);

  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(report.plainText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      /* ignore */
    }
  };

  const printReport = () => {
    window.print();
  };

  return (
    <section className="teacher-report-panel" aria-label="Relatório para o professor">
      <header className="teacher-report-head">
        <div>
          <h3>Relatório para o professor</h3>
          <p className="teacher-report-sub">
            Copie e envie por WhatsApp ou e-mail — pronúncia, Part 1, Part 2 speaking e vocabulário
            com base nas suas gravações reais.
          </p>
        </div>
        <div className="teacher-report-actions">
          <button type="button" className="btn secondary btn-sm" onClick={copyReport}>
            {copied ? "Copiado ✓" : "Copiar relatório"}
          </button>
          <button type="button" className="btn secondary btn-sm" onClick={printReport}>
            Imprimir / PDF
          </button>
        </div>
      </header>

      {report.focusSummary.length > 0 && (
        <div className="teacher-report-summary">
          <strong>Focos principais hoje</strong>
          <ol>
            {report.focusSummary.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </div>
      )}

      <div className="teacher-report-grid">
        <ReportSection title="Pronúncia" lines={report.pronunciation} />
        <ReportSection title="Part 1" lines={report.part1} />
        <ReportSection title="Part 2 speaking" lines={report.part2} />
        <ReportSection title="Vocabulário" lines={report.vocabulary} />
      </div>

      <pre className="teacher-report-preview" aria-label="Prévia do texto para copiar">
        {report.plainText}
      </pre>
    </section>
  );
}
