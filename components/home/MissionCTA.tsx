"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getDailyMissionSummary,
  getNextMissionAction,
  isDailyMissionComplete,
} from "@/lib/dailyMission";
import { MISSION_REFRESH_EVENTS } from "@/lib/home/missionRefreshEvents";

export default function MissionCTA() {
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    for (const ev of MISSION_REFRESH_EVENTS) {
      window.addEventListener(ev, refresh);
    }
    return () => {
      for (const ev of MISSION_REFRESH_EVENTS) {
        window.removeEventListener(ev, refresh);
      }
    };
  }, [refresh]);

  const complete = useMemo(() => isDailyMissionComplete(), [tick]);
  const summary = useMemo(() => getDailyMissionSummary(), [tick]);
  const next = useMemo(() => getNextMissionAction(), [tick]);

  if (complete) {
    return (
      <section className="mission-cta" aria-label="Today's flight">
        <p className="mission-cta-complete">✓ Today&apos;s flight mission is complete.</p>
        <p className="sub">Exam {summary.examLabel} — all legs finished. See you tomorrow, pilot.</p>
      </section>
    );
  }

  const label =
    summary.completedSections > 0 ? "Ready — Continue Flight" : "Ready — Begin Flight";

  return (
    <section className="mission-cta" aria-label="Today's flight">
      <Link
        href={next?.href ?? "/word-mission"}
        className="btn purple btn-large mission-cta-btn"
        aria-describedby={next ? "mission-cta-desc" : undefined}
      >
        {label}
      </Link>
      {next && (
        <p id="mission-cta-desc" className="mission-cta-hint">
          <span className="mission-cta-next">{next.title}</span>
          <span className="mission-cta-next-detail">{next.hint}</span>
        </p>
      )}
    </section>
  );
}
