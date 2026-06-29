"use client";

import { useEffect, useState } from "react";
import { getTodayStudyTime, STUDY_TIME_CHANGE_EVENT } from "@/lib/studyTime";

export function useDailyStudyTime() {
  const [day, setDay] = useState(getTodayStudyTime);

  useEffect(() => {
    const refresh = () => setDay(getTodayStudyTime());
    window.addEventListener(STUDY_TIME_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(STUDY_TIME_CHANGE_EVENT, refresh);
  }, []);

  return day;
}
