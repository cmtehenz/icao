"use client";

import { useCallback, useEffect, useState } from "react";
import {
  buildStudyAgenda,
  buildWeekPreview,
  getAgendaProgress,
  loadStudyPlanMode,
  saveStudyPlanMode,
  STUDY_PLAN_CHANGE_EVENT,
  type StudyAgendaDay,
  type StudyPlanMode,
  type StudyWeekPreview,
} from "@/lib/studyAgenda";
import { getTodayStudyTime, STUDY_TIME_CHANGE_EVENT } from "@/lib/studyTime";

export function useStudyAgenda() {
  const [mode, setModeState] = useState<StudyPlanMode>(() => loadStudyPlanMode());
  const [today, setToday] = useState(getTodayStudyTime);
  const [agenda, setAgenda] = useState<StudyAgendaDay>(() => buildStudyAgenda(today.date, mode));
  const [week, setWeek] = useState<StudyWeekPreview[]>(() => buildWeekPreview(today.date, mode));

  const refresh = useCallback(() => {
    const day = getTodayStudyTime();
    const currentMode = loadStudyPlanMode();
    setToday(day);
    setModeState(currentMode);
    setAgenda(buildStudyAgenda(day.date, currentMode));
    setWeek(buildWeekPreview(day.date, currentMode));
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(STUDY_TIME_CHANGE_EVENT, refresh);
    window.addEventListener(STUDY_PLAN_CHANGE_EVENT, refresh);
    return () => {
      window.removeEventListener(STUDY_TIME_CHANGE_EVENT, refresh);
      window.removeEventListener(STUDY_PLAN_CHANGE_EVENT, refresh);
    };
  }, [refresh]);

  const setMode = useCallback(
    (next: StudyPlanMode) => {
      saveStudyPlanMode(next);
      setModeState(next);
      setAgenda(buildStudyAgenda(today.date, next));
      setWeek(buildWeekPreview(today.date, next));
    },
    [today.date],
  );

  const progress = getAgendaProgress(agenda, today);

  return { mode, setMode, agenda, week, today, progress };
}
