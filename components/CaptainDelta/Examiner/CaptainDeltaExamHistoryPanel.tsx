"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  EXAMINER_HISTORY_EVENT,
  loadExaminerHistory,
} from "@/lib/captainDelta/examiner/store";

export default function CaptainDeltaExamHistoryPanel() {
  const [items, setItems] = useState(() => loadExaminerHistory().slice(0, 5));

  const refresh = useCallback(() => setItems(loadExaminerHistory().slice(0, 5)), []);

  useEffect(() => {
    window.addEventListener(EXAMINER_HISTORY_EVENT, refresh);
    window.addEventListener("icao-simulado-change", refresh);
    return () => {
      window.removeEventListener(EXAMINER_HISTORY_EVENT, refresh);
      window.removeEventListener("icao-simulado-change", refresh);
    };
  }, [refresh]);

  if (!items.length) return null;

  return (
    <section className="cde-exam-history" aria-label="Mock exam history">
      <h2>Mock exam history</h2>
      <ul>
        {items.map((item) => (
          <li key={item.reportId}>
            <div className="cde-exam-row">
              <strong>
                {new Date(item.date).toLocaleDateString("pt-BR")} · {item.mode} · {item.examVersion}
              </strong>
              <span>ICAO {item.estimatedLevel}</span>
            </div>
            <div className="cde-exam-meta">
              {item.strongestPart != null && <span>Strongest: Part {item.strongestPart}</span>}
              {item.weakestPart != null && <span>Weakest: Part {item.weakestPart}</span>}
              {item.avgResponseSec != null && <span>Avg {item.avgResponseSec}s</span>}
              <span>{item.completionPct}% complete</span>
            </div>
          </li>
        ))}
      </ul>
      <Link href="/simulado" className="btn secondary btn-sm">
        New mock exam →
      </Link>
    </section>
  );
}
