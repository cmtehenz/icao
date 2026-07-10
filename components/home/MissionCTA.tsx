"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import MissionPlanStrip from "@/components/home/MissionPlanStrip";
import PhaseBadge from "@/components/training/PhaseBadge";
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
  const isRecheckride = checkrideNeeded && profile.checkrideStatus !== "pending";
  const complete = useMemo(() => isDailyMissionComplete(), [tick]);
  const summary = useMemo(() => getDailyMissionSummary(), [tick]);
  const next = useMemo(() => getNextMissionAction(), [tick]);

  if (checkrideNeeded) {
    return (
      <section className="mission-cta academy-cta" aria-label="Speaking checkride">
        <p className="mission-cta-kicker">
          {isRecheckride ? "Progress check" : "Before today&apos;s flight"}
        </p>
        <p className="mission-cta-lead">
          {isRecheckride
            ? "A short speaking re-checkride so Captain Delta can update your training phase."
            : "A short speaking checkride so Captain Delta can set your training phase. About five minutes."}
        </p>
        <Link href="/checkride" className="btn academy-primary btn-large mission-cta-btn">
          {isRecheckride ? "Start Re-checkride" : "Start Checkride"}
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
        <PhaseBadge phase={profile.phase} />
        <p className="mission-cta-complete">Today&apos;s flight mission is complete.</p>
        <p className="mission-cta-lead">
          Exam {summary.examLabel} — all legs finished. See you tomorrow, pilot.
        </p>
        <p className="mission-cta-secondary-hint">
          Optional training below — listen to a full exam or watch Captain&apos;s picks.
        </p>
      </section>
    );
  }

  const label =
    summary.completedSections > 0 ? "Ready — Continue Flight" : "Ready — Begin Flight";

  return (
    <section className="mission-cta academy-cta" aria-label="Today's flight">
      <div className="mission-cta-top">
        <PhaseBadge phase={profile.phase} />
        <span className="mission-cta-exam-chip">{summary.examLabel}</span>
      </div>

      <MissionPlanStrip
        completed={summary.completedSections}
        total={summary.totalSections}
        hint={summary.planHint}
        nextTitle={next?.title}
      />

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
