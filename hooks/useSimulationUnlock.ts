"use client";

import { useCallback, useEffect, useState } from "react";
import {
  isSimulationUnlocked,
  simulationUnlockHint,
  simulationUnlockProgress,
} from "@/lib/simulationUnlock";
import { STUDY_TIME_CHANGE_EVENT } from "@/lib/studyTime";

export function useSimulationUnlock() {
  const [unlocked, setUnlocked] = useState(true);
  const [hint, setHint] = useState("");
  const [progress, setProgress] = useState({ points: 0, target: 30, remaining: 30 });

  const refresh = useCallback(() => {
    setUnlocked(isSimulationUnlocked());
    setHint(simulationUnlockHint());
    const p = simulationUnlockProgress();
    setProgress({ points: p.points, target: p.target, remaining: p.remaining });
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(STUDY_TIME_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(STUDY_TIME_CHANGE_EVENT, refresh);
  }, [refresh]);

  return { unlocked, hint, progress };
}
