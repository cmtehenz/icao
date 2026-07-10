"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isDailyMissionComplete } from "@/lib/dailyMission";
import { MISSION_REFRESH_EVENTS } from "@/lib/home/missionRefreshEvents";

const SECONDARY_MODES = [
  {
    href: "/escutar-prova",
    label: "Escutar Prova",
    desc: "Full exam listening — no recording required",
    icon: "🎧",
  },
  {
    href: "/icao-flix",
    label: "ICAOFlix",
    desc: "Curated references — watch before you speak",
    icon: "🎬",
  },
] as const;

/** Always-visible secondary training modes — subordinate to daily mission CTA (ADR-010). */
export default function SecondaryTrainingStrip() {
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    for (const ev of MISSION_REFRESH_EVENTS) {
      window.addEventListener(ev, refresh);
    }
    return () => {
      for (const ev of MISSION_REFRESH_EVENTS) window.removeEventListener(ev, refresh);
    };
  }, [refresh]);

  const complete = useMemo(() => isDailyMissionComplete(), [tick]);

  const kicker = complete
    ? "Today's flight is done — sharpen your ear or review references."
    : "Optional — before or after today's flight.";

  return (
    <section className="home-training-secondary" aria-label="Complementary training">
      <header className="home-training-secondary-head">
        <h2>Complement your training</h2>
        <p>{kicker}</p>
      </header>
      <div className="home-training-secondary-grid">
        {SECONDARY_MODES.map((mode) => (
          <Link key={mode.href} href={mode.href} className="home-training-secondary-card">
            <span className="home-training-secondary-icon" aria-hidden>
              {mode.icon}
            </span>
            <strong>{mode.label}</strong>
            <span>{mode.desc}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
