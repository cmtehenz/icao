"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { buildLearnerSnapshot } from "@/lib/captainDelta/memory/aggregate";
import { CAPTAIN_DELTA_MEMORY_EVENT } from "@/lib/captainDelta/memory/store";
import { useAuth } from "@/components/AuthProvider";

export default function CaptainDeltaReadinessPanel() {
  const { user } = useAuth();
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    window.addEventListener(CAPTAIN_DELTA_MEMORY_EVENT, refresh);
    return () => window.removeEventListener(CAPTAIN_DELTA_MEMORY_EVENT, refresh);
  }, [refresh]);

  if (!user) return null;

  const firstName = user.name?.split(" ")[0] || user.email.split("@")[0] || "piloto";
  const snapshot = buildLearnerSnapshot(firstName);
  const r = snapshot.readiness;

  const metrics = [
    { label: "Coverage", value: r.coverage },
    { label: "Confidence", value: r.confidence },
    { label: "Pronunciation", value: r.pronunciation },
    { label: "Vocabulary", value: r.vocabulary },
    { label: "Fluency", value: r.fluency },
    { label: "Structure", value: r.structure },
  ];

  return (
    <section className="cdm-readiness" aria-label="Exam readiness">
      <header className="cdm-readiness-head">
        <h2>Exam readiness</h2>
        <p className="cdm-readiness-icao">
          Estimated ICAO <strong>{r.estimatedIcao.toFixed(1)}</strong>
          {r.trendDelta != null && r.trendDelta !== 0 && (
            <span className={r.trendDelta > 0 ? "up" : "down"}>
              {r.trendDelta > 0 ? " ↑" : " ↓"}
              {Math.abs(r.trendDelta)} pts
            </span>
          )}
          <span className="cdm-readiness-days"> · {r.daysRemaining} days left</span>
        </p>
      </header>

      <div className="cdm-readiness-grid">
        {metrics.map((m) => (
          <div key={m.label} className="cdm-readiness-metric">
            <span>{m.label}</span>
            <strong>{m.value}%</strong>
            <div className="cdm-readiness-bar" aria-hidden>
              <div className="cdm-readiness-bar-fill" style={{ width: `${m.value}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="cdm-readiness-topics">
        <p>
          <span className="weak">Weakest</span> {r.weakestTopic}
        </p>
        <p>
          <span className="strong">Strongest</span> {r.strongestTopic}
        </p>
      </div>

      {snapshot.adaptivePriority.length > 0 && (
        <ul className="cdm-adaptive-list">
          {snapshot.adaptivePriority.map((p) => (
            <li key={p.area}>
              <Link href={p.href}>{p.area}</Link> — {p.reason}
            </li>
          ))}
        </ul>
      )}

      {snapshot.patterns.length > 0 && (
        <details className="cdm-patterns">
          <summary>Captain noticed a habit</summary>
          <ul>
            {snapshot.patterns.map((p) => (
              <li key={p.id}>
                <strong>{p.label}</strong>
                <span>{p.missionHint}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
