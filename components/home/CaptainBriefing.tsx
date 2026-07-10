"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { buildTodayBriefing } from "@/lib/captainDelta/briefing";
import { daysUntilExam } from "@/lib/captainDelta/examDate";
import { MISSION_REFRESH_EVENTS } from "@/lib/home/missionRefreshEvents";
import { todayKey } from "@/lib/studyTime";
import {
  getTrainingProfile,
  needsCheckride,
  TRAINING_PROFILE_EVENT,
} from "@/lib/trainingProfile/store";

export default function CaptainBriefing() {
  const { user } = useAuth();
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

  const firstName =
    user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "Pilot";

  const briefing = useMemo(
    () => buildTodayBriefing(firstName, todayKey(), { surface: "home" }),
    [firstName, tick],
  );

  const daysLeft = useMemo(() => daysUntilExam(), [tick]);
  const profile = useMemo(() => getTrainingProfile(), [tick]);
  const awaitingCheckride = needsCheckride(profile);

  return (
    <header className="cda-hero home-captain-briefing academy-briefing" aria-label="Captain briefing">
      <div className="academy-captain-mark" aria-hidden>
        <span>CD</span>
      </div>
      <div className="cda-hero-copy">
        <p className="cda-hero-label">Captain Delta · Flight Briefing</p>
        <h1>{awaitingCheckride ? "Speaking Checkride" : "Today's Flight Mission"}</h1>
        {awaitingCheckride ? (
          <p className="cda-hero-welcome">
            Before we fly, I need to hear you speak — a short checkride so I can set your
            training phase.
          </p>
        ) : (
          briefing.text.split("\n").map((line) => (
            <p key={line} className="cda-hero-welcome">
              {line}
            </p>
          ))
        )}
      </div>
      <div className="cda-exam-countdown academy-exam-countdown">
        <span>ICAO Exam</span>
        <strong>{daysLeft}</strong>
        <span>days remaining</span>
      </div>
    </header>
  );
}
