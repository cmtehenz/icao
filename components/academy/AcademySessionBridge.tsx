"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { recordLogbookFlight } from "@/lib/academy/logbook";
import { loadAcademyStore } from "@/lib/academy/store";
import { evaluateAchievements } from "@/lib/academy/achievements";
import { buildDailyFlightMission } from "@/lib/academy/flightMission";
import { buildExamReadiness } from "@/lib/captainDelta/memory/readiness";
import { CAPTAIN_DELTA_EXAM_FINISHED } from "@/lib/captainDelta/examiner/events";
import { STUDY_ACTIVITY_RECORDED_EVENT } from "@/lib/studyActivityRecord";
import { loadStudyDays, studyDayMinutes, todayKey } from "@/lib/studyTime";
import { loadCaptainDeltaMemory } from "@/lib/captainDelta/memory/store";

function hasFlightToday(): boolean {
  const today = todayKey();
  return loadAcademyStore().flights.some((f) => f.date.slice(0, 10) === today);
}

function recordTodayFlight(mission: string, score?: number): void {
  if (hasFlightToday()) return;
  const days = loadStudyDays();
  const today = days[todayKey()];
  const duration = today ? studyDayMinutes(today) : 15;
  if (duration < 5) return;

  recordLogbookFlight({
    durationMinutes: duration,
    mission,
    score: score ?? buildExamReadiness().confidence,
  });
  evaluateAchievements();
}

export default function AcademySessionBridge() {
  const { user } = useAuth();
  const pathname = usePathname();
  const idleTimer = useRef<number | null>(null);
  const flightRecorded = useRef(false);

  useEffect(() => {
    if (!user || pathname === "/login") return;

    const scheduleFlightRecord = () => {
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => {
        if (flightRecorded.current || hasFlightToday()) return;
        const memory = loadCaptainDeltaMemory();
        const today = todayKey();
        if (!memory.sessionDates.includes(today)) return;

        flightRecorded.current = true;
        const mission = buildDailyFlightMission().title;
        recordTodayFlight(mission);
      }, 90_000);
    };

    const onActivity = () => scheduleFlightRecord();

    const onExamFinished = () => {
      const days = loadStudyDays();
      const today = days[todayKey()];
      const duration = today ? Math.max(studyDayMinutes(today), 30) : 45;
      recordLogbookFlight({
        durationMinutes: duration,
        mission: "Mock Exam",
        score: buildExamReadiness().confidence,
        activities: ["simulation"],
      });
      evaluateAchievements();
      flightRecorded.current = true;
    };

    window.addEventListener(STUDY_ACTIVITY_RECORDED_EVENT, onActivity);
    window.addEventListener(CAPTAIN_DELTA_EXAM_FINISHED, onExamFinished);

    return () => {
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      window.removeEventListener(STUDY_ACTIVITY_RECORDED_EVENT, onActivity);
      window.removeEventListener(CAPTAIN_DELTA_EXAM_FINISHED, onExamFinished);
    };
  }, [user, pathname]);

  return null;
}
