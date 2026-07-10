"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import FullSimulationMode from "@/components/Part2Trainer/FullSimulationMode";
import { getNextMissionAction } from "@/lib/dailyMission";
import { EXAM_LABELS } from "@/lib/exams/types";
import {
  getOrCreatePart2DailyMission,
  PART2_DAILY_MISSION_EVENT,
  resetPart2DailyMissionProgress,
} from "@/lib/part2DailyMission";
import { loadPart2Progress, type Part2ProgressStore } from "@/lib/part2/progress";

export default function Part2MissionApp() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tick, setTick] = useState(0);
  const [progress, setProgress] = useState<Part2ProgressStore>({
    items: {},
    vocabularyKnown: [],
    dailyCount: {},
  });

  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    setProgress(loadPart2Progress());
  }, []);

  useEffect(() => {
    window.addEventListener(PART2_DAILY_MISSION_EVENT, refresh);
    return () => window.removeEventListener(PART2_DAILY_MISSION_EVENT, refresh);
  }, [refresh]);

  useEffect(() => {
    if (searchParams.get("reset") !== "1") return;
    resetPart2DailyMissionProgress();
    refresh();
    router.replace("/part2");
  }, [searchParams, router, refresh]);

  const mission = useMemo(() => {
    void tick;
    return getOrCreatePart2DailyMission();
  }, [tick]);

  const missionContinue = useMemo(() => {
    void tick;
    const next = getNextMissionAction();
    if (next?.href.startsWith("/part2")) return null;
    return {
      href: next?.href ?? "/",
      label: next ? `Continue — ${next.title}` : "Back to today's flight",
    };
  }, [tick]);

  const restartToday = () => {
    const ok = window.confirm(
      "Restart today's Part 2 exam? Progress on today's 5 situations will reset.",
    );
    if (!ok) return;
    resetPart2DailyMissionProgress();
    refresh();
    router.replace("/part2?reset=1");
  };

  return (
    <div className="part1-mission-page part2-mission-page">
      <header className="part1-mission-head wrap">
        <p className="part1-mission-kicker">Captain Delta · CRUISE · Part 2</p>
        <h1>SDEA Part 2 — interacting as a pilot</h1>
        <p className="sub part1-mission-sub">
          Today · {EXAM_LABELS[mission.examVersion]} — 5 situations · paper notes like the real
          exam
        </p>
      </header>

      <div className="wrap part1-mission-body">
        <FullSimulationMode
          missionMode
          progress={progress}
          onProgressChange={setProgress}
          forcedExamVersion={mission.examVersion}
          missionContinueHref={missionContinue?.href}
          missionContinueLabel={missionContinue?.label}
        />

        <p className="part1-browse-link sub">
          <Link href="/part2?browse=1">Browse readback / interaction / reported</Link> (open practice
          — not today&apos;s flight)
          {" · "}
          <button type="button" className="part1-restart-link" onClick={restartToday}>
            Restart today&apos;s Part 2
          </button>
        </p>
      </div>
    </div>
  );
}
