"use client";

import { useEffect, useState } from "react";
import {
  STUDY_ACTIVITY_RECORDED_EVENT,
  type StudyActivityRecordedDetail,
} from "@/lib/studyActivityRecord";

type ToastItem = StudyActivityRecordedDetail & { id: number };

export default function StudyActivityToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    let seq = 0;
    const onRecorded = (event: Event) => {
      const detail = (event as CustomEvent<StudyActivityRecordedDetail>).detail;
      if (!detail) return;
      const id = ++seq;
      setToasts((prev) => [...prev.slice(-2), { ...detail, id }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3200);
    };

    window.addEventListener(STUDY_ACTIVITY_RECORDED_EVENT, onRecorded);
    return () => window.removeEventListener(STUDY_ACTIVITY_RECORDED_EVENT, onRecorded);
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="study-activity-toasts" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className="study-activity-toast">
          <strong>+{toast.points} pts</strong>
          <span>{toast.label}</span>
        </div>
      ))}
    </div>
  );
}
