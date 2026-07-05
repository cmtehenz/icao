"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getDailyMissionSummary } from "@/lib/dailyMission";
import { buildFlightProgress } from "@/lib/flightProgress/buildFlightProgress";
import { buildFlightPhaseBriefingLine } from "@/lib/flightProgress/flightProgressCopy";
import type { FlightPhaseStatus } from "@/lib/flightProgress/flightProgressTypes";
import { MISSION_REFRESH_EVENTS } from "@/lib/home/missionRefreshEvents";
import styles from "./FlightProgressStrip.module.css";

type FlightProgressStripProps = {
  /** Show Captain phase copy below the strip (mission sub-routes). */
  showCaptainCopy?: boolean;
  /** Compact strip without Captain copy (mission screens). */
  compact?: boolean;
  /** Flush layout without card chrome (home flight deck). */
  embedded?: boolean;
};

function phaseClassName(status: FlightPhaseStatus): string {
  switch (status) {
    case "completed":
      return styles.flightProgressPhaseCompleted;
    case "current":
      return styles.flightProgressPhaseCurrent;
    case "optional":
      return styles.flightProgressPhaseOptional;
    default:
      return "";
  }
}

export default function FlightProgressStrip({
  showCaptainCopy = false,
  compact = false,
  embedded = false,
}: FlightProgressStripProps) {
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

  const progress = useMemo(() => {
    void tick;
    return buildFlightProgress(getDailyMissionSummary());
  }, [tick]);

  const captainLine = buildFlightPhaseBriefingLine(progress.currentPhase);
  const visiblePhases = progress.phases.filter(
    (phase) => phase.id !== "shutdown" || progress.missionComplete,
  );

  return (
    <section
      className={`${styles.flightProgressStrip} ${embedded ? styles.flightProgressStripEmbedded : ""}`}
      aria-label="Today's flight progress"
    >
      <div className={styles.flightProgressHead}>
        <p className={styles.flightProgressTitle}>Flight progress</p>
        {progress.estimatedRemainingMinutes != null && !progress.missionComplete && (
          <p className={styles.flightProgressEta}>
            ~{progress.estimatedRemainingMinutes} min remaining
          </p>
        )}
      </div>

      {progress.youAreHereLabel && (
        <p className={styles.flightProgressYouAreHere}>{progress.youAreHereLabel}</p>
      )}

      <div className={styles.flightProgressTrack} role="list">
        {visiblePhases.map((phase) => (
          <div
            key={phase.id}
            role="listitem"
            className={`${styles.flightProgressPhase} ${phaseClassName(phase.status)}`}
            aria-current={phase.status === "current" ? "step" : undefined}
            aria-label={`${phase.aviationLabel}, ${phase.missionLabel}${
              phase.status === "optional" ? ", optional" : ""
            }`}
          >
            <span className={styles.flightProgressDot} aria-hidden />
            <p className={styles.flightProgressAviation}>{phase.aviationLabel}</p>
            <p className={styles.flightProgressMission}>{phase.missionLabel}</p>
            {phase.status === "optional" && (
              <span className={styles.flightProgressOptionalTag}>Optional</span>
            )}
          </div>
        ))}
      </div>

      {showCaptainCopy && !compact && (
        <p className={styles.flightProgressCaptain}>
          <strong>Captain Delta:</strong> {captainLine}
        </p>
      )}
    </section>
  );
}
