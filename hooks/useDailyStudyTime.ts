"use client";

import { useEffect, useState } from "react";
import { getTodayStudyTime, STUDY_TIME_CHANGE_EVENT } from "@/lib/studyTime";

export function useDailyStudyTime() {
  const [time, setTime] = useState(getTodayStudyTime);

  useEffect(() => {
    const refresh = () => setTime(getTodayStudyTime());
    window.addEventListener(STUDY_TIME_CHANGE_EVENT, refresh);
    const interval = window.setInterval(refresh, 5000);
    return () => {
      window.removeEventListener(STUDY_TIME_CHANGE_EVENT, refresh);
      window.clearInterval(interval);
    };
  }, []);

  return time;
}
