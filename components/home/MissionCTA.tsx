"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getDailyMissionSummary,
  getNextMissionAction,
  isDailyMissionComplete,
} from "@/lib/dailyMission";
import { MISSION_REFRESH_EVENTS } from "@/lib/home/missionRefreshEvents";
import {
  getTrainingProfile,
  needsCheckride,
  TRAINING_PROFILE_EVENT,
} from "@/lib/trainingProfile/store";
import { phaseBrief, phaseLabel } from "@/lib/trainingProfile/types";

export default function MissionCTA() {
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    for (const ev of MISSION_REFRESH_EVENTS) {
      window.addEventListener(ev, refresh);
    }
    window.addEventListener(TRAINING_PROFILE_EVENT, refresh);
    return () => {
      for (const ev of MISSION_REFRESH_EVENTS) {
        window.removeEventListener(ev, refresh);
      }
      window.removeEventListener(TRAINING_PROFILE_EVENT, refresh);
    };
  }, [refresh]);

  const profile = useMemo(() => getTrainingProfile(), [tick]);
  const checkrideNeeded = useMemo(() => needsCheckride(profile), [profile]);
  const complete = useMemo(() => isDailyMissionComplete(), [tick]);
  const summary = useMemo(() => getDailyMissionSummary(), [tick]);
  const next = useMemo(() => getNextMissionAction(), [tick]);

  if (checkrideNeeded) {
    return (
      <section className="mission-cta academy-cta" aria-label="Speaking checkride">
        <p className="mission-cta-phase">Before today&apos;s flight</p>
        <p className="sub mission-cta-phase-brief">
          A short speaking checkride so Captain Delta can build your training plan. About five
          minutes. You can skip and start in Foundation.
        </p>
        <Link href="/checkride" className="btn academy-primary btn-large mission-cta-btn">
          Start Checkride
        </Link>
        <p className="mission-cta-hint">
          <span className="mission-cta-next">Speak first</span>
          <span className="mission-cta-next-detail">Pronunciation · readback · short answer</span>
        </p>
      </section>
    );
  }

  if (complete) {
    return (
      <section className="mission-cta academy-cta" aria-label="Today's flight">
        <p className="mission-cta-complete">✓ Today&apos;s flight mission is complete.</p>
        <p className="sub">Exam {summary.examLabel} — all legs finished. See you tomorrow, pilot.</p>
      </section>
    );
  }

  const label =
    summary.completedSections > 0 ? "Ready — Continue Flight" : "Ready — Begin Flight";

  return (
    <section className="mission-cta academy-cta" aria-label="Today's flight">
      <p className="mission-cta-phase">
        Phase · {phaseLabel(profile.phase)}
      </p>
      <p className="sub mission-cta-phase-brief">{phaseBrief(profile.phase)}</p>
      {next && summary.planHint ? (
        <p className="sub mission-cta-phase-brief">{summary.planHint}</p>
      ) : null}
      <Link
        href={next?.href ?? "/word-mission"}
        className="btn academy-primary btn-large mission-cta-btn"
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
