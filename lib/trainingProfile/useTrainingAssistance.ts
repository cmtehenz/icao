"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  assistanceFromProfile,
  assistanceLabel,
  part1AssistanceDefaults,
  wordMissionAssistanceDefaults,
  type AssistanceLevel,
  type Part1AssistanceDefaults,
  type WordMissionAssistanceDefaults,
} from "@/lib/trainingProfile/assistance";
import { getTrainingProfile, TRAINING_PROFILE_EVENT } from "@/lib/trainingProfile/store";

export type TrainingAssistance = {
  level: AssistanceLevel;
  label: string;
  part1: Part1AssistanceDefaults;
  wordMission: WordMissionAssistanceDefaults;
};

/** Client hook — reads StudentTrainingProfile for progressive scaffolding (RFC-004 Phase 4). */
export function useTrainingAssistance(): TrainingAssistance {
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    window.addEventListener(TRAINING_PROFILE_EVENT, refresh);
    return () => window.removeEventListener(TRAINING_PROFILE_EVENT, refresh);
  }, [refresh]);

  return useMemo(() => {
    const profile = getTrainingProfile();
    const level = assistanceFromProfile(profile);
    return {
      level,
      label: assistanceLabel(level),
      part1: part1AssistanceDefaults(level),
      wordMission: wordMissionAssistanceDefaults(level),
    };
  }, [tick]);
}
