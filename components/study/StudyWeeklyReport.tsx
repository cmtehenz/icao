"use client";

import { useCallback, useEffect, useState } from "react";
import {
  buildStudyWeeklyReport,
  type StudyWeeklyReportData,
} from "@/lib/studyWeeklyReport";
import { STUDY_TIME_CHANGE_EVENT } from "@/lib/studyTime";
import { READBACK_QUEUE_CHANGE_EVENT } from "@/lib/part2ReadbackQueue";
import { INTERACTION_QUEUE_CHANGE_EVENT } from "@/lib/part2InteractionQueue";
import { VAULT_CHANGE_EVENT } from "@/lib/pronunciationVault";

export default function StudyWeeklyReport() {
  const [report, setReport] = useState<StudyWeeklyReportData | null>(null);

  const refresh = useCallback(() => setReport(buildStudyWeeklyReport()), []);

  useEffect(() => {
    refresh();
    const events = [
      STUDY_TIME_CHANGE_EVENT,
      READBACK_QUEUE_CHANGE_EVENT,
      INTERACTION_QUEUE_CHANGE_EVENT,
      VAULT_CHANGE_EVENT,
    ];
    for (const ev of events) window.addEventListener(ev, refresh);
    return () => {
      for (const ev of events) window.removeEventListener(ev, refresh);
    };
  }, [refresh]);

  if (!report) return null;

  const maxPoints = Math.max(...report.days.map((d) => d.points), 1);

  return (
    <section className="account-section study-weekly-report" aria-label="Relatório semanal">
      <h2>Relatório desta semana</h2>
      <div className="weekly-report-stats">
        <div className="weekly-report-stat">
          <strong>{report.weekGood.good}/{report.weekGood.target}</strong>
          <span>dias bons</span>
        </div>
        <div className="weekly-report-stat">
          <strong>{report.totalPoints}</strong>
          <span>pontos totais</span>
        </div>
        <div className="weekly-report-stat">
          <strong>{report.shadowPoints}</strong>
          <span>pts shadow</span>
        </div>
        <div className="weekly-report-stat">
          <strong>{report.avgPointsPerDay}</strong>
          <span>média/dia</span>
        </div>
      </div>

      <div className="weekly-report-bars" aria-hidden>
        {report.days.map((d) => (
          <div key={d.date} className={`weekly-report-bar-col ${d.goalMet ? "good" : ""}`}>
            <div
              className="weekly-report-bar-fill"
              style={{ height: `${Math.round((d.points / maxPoints) * 100)}%` }}
              title={`${d.points} pts`}
            />
            <span className="weekly-report-bar-label">{d.label}</span>
          </div>
        ))}
      </div>

      <ul className="weekly-report-details">
        <li>
          Shadow Part 1:{" "}
          <strong>{report.days.reduce((s, d) => s + d.shadow, 0)}</strong> sessões
        </li>
        <li>
          Shadow Part 2:{" "}
          <strong>{report.days.reduce((s, d) => s + d.shadowPart2, 0)}</strong> sessões
        </li>
        <li>
          Banco de pronúncia:{" "}
          <strong>{report.vaultCritical}</strong> críticas de {report.vaultTotal}
        </li>
        {report.readbackQueueTotal > 0 && (
          <li>
            Fila readback:{" "}
            <strong>
              {report.readbackQueueDone}/{report.readbackQueueTotal}
            </strong>
          </li>
        )}
        {report.interactionQueueTotal > 0 && (
          <li>
            Fila interaction:{" "}
            <strong>
              {report.interactionQueueDone}/{report.interactionQueueTotal}
            </strong>
          </li>
        )}
      </ul>
    </section>
  );
}
