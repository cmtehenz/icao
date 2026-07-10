"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { listAchievements } from "@/lib/academy/achievements";
import { buildCareerGoals } from "@/lib/academy/career";
import { loadLogbookFlights } from "@/lib/academy/logbook";
import { ACADEMY_CHANGE_EVENT } from "@/lib/academy/store";
import { readAcademyStatistics } from "@/lib/academy/stats";
import { buildExamReadiness } from "@/lib/captainDelta/memory/readiness";
import { CAPTAIN_DELTA_MEMORY_EVENT } from "@/lib/captainDelta/memory/store";
import { STUDY_ACTIVITY_RECORDED_EVENT } from "@/lib/studyActivityRecord";

const QUICK_LINKS = [
  { href: "/escutar-prova", label: "Escutar Prova", desc: "Full exam listening", icon: "🎧" },
  { href: "/icao-flix", label: "ICAOFlix", desc: "Curated video library", icon: "🎬" },
  { href: "/simulado", label: "Simulado", desc: "Mock exam", icon: "🎯" },
  { href: "/conta", label: "Account", desc: "Profile & vault", icon: "👤" },
] as const;

function formatFlightDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** Read-only academy widgets — no mission orchestration (ADR-010, ADR-011). */
export default function AcademyHomeWidgets() {
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    const events = [
      ACADEMY_CHANGE_EVENT,
      CAPTAIN_DELTA_MEMORY_EVENT,
      STUDY_ACTIVITY_RECORDED_EVENT,
    ];
    for (const ev of events) window.addEventListener(ev, refresh);
    return () => {
      for (const ev of events) window.removeEventListener(ev, refresh);
    };
  }, [refresh]);

  const readiness = useMemo(() => buildExamReadiness(), [tick]);
  const stats = useMemo(() => readAcademyStatistics(), [tick]);
  const achievements = useMemo(() => listAchievements(), [tick]);
  const flights = useMemo(() => loadLogbookFlights(5), [tick]);
  const career = useMemo(() => buildCareerGoals(), [tick]);

  const progressMetrics = [
    { label: "Coverage", value: readiness.coverage },
    { label: "Confidence", value: readiness.confidence },
    { label: "Pronunciation", value: readiness.pronunciation },
  ];

  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;

  return (
    <div className="home-academy-widgets" aria-label="Academy progress">
      <section className="cda-quick-nav" aria-label="Quick links">
        <h2>Academy links</h2>
        <div className="cda-quick-grid">
          {QUICK_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="cda-quick-card">
              <span className="cda-quick-icon" aria-hidden>
                {item.icon}
              </span>
              <strong>{item.label}</strong>
              <span>{item.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="cda-progress" aria-label="Readiness">
        <header className="cda-section-head">
          <h2>Exam readiness</h2>
          <p>
            Estimated ICAO <strong>{readiness.estimatedIcao.toFixed(1)}</strong>
          </p>
        </header>
        <div className="cda-progress-grid">
          {progressMetrics.map((m) => (
            <div key={m.label} className="cda-progress-metric">
              <span>{m.label}</span>
              <strong>{m.value}%</strong>
              <div className="cda-progress-bar" aria-hidden>
                <div style={{ width: `${m.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cda-stats" aria-label="Academy statistics">
        <h2>Academy statistics</h2>
        <div className="cda-stats-grid">
          <div>
            <span>Flight hours studied</span>
            <strong>{stats.hoursStudied}h</strong>
          </div>
          <div>
            <span>Current streak</span>
            <strong>{stats.currentStreak} days</strong>
          </div>
          <div>
            <span>Achievements</span>
            <strong>
              {unlockedCount}/{achievements.length}
            </strong>
          </div>
        </div>
      </section>

      <section className="cda-career" aria-label="Career goals">
        <h2>Career mode</h2>
        <p className="cda-career-desc">{career.current.title}</p>
      </section>

      {flights.length > 0 && (
        <details className="cda-panel">
          <summary>Recent flights</summary>
          <ul className="cda-logbook">
            {flights.map((f) => (
              <li key={f.flightNumber} className="cda-logbook-entry">
                <strong>Flight #{f.flightNumber}</strong>
                <span> · {formatFlightDate(f.date)} · {f.mission}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
