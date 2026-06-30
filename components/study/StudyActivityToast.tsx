"use client";

import { useEffect, useState } from "react";
import {
  STUDY_ACTIVITY_NEAR_MISS_EVENT,
  STUDY_ACTIVITY_RECORDED_EVENT,
  type StudyActivityNearMissDetail,
  type StudyActivityRecordedDetail,
} from "@/lib/studyActivityRecord";

type ToastItem =
  | ({ kind: "success" } & StudyActivityRecordedDetail & { id: number })
  | ({ kind: "near-miss" } & StudyActivityNearMissDetail & { id: number });

export default function StudyActivityToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    let seq = 0;
    const addToast = (item: Omit<ToastItem, "id">) => {
      const id = ++seq;
      setToasts((prev) => [...prev.slice(-2), { ...item, id } as ToastItem]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3200);
    };

    const onRecorded = (event: Event) => {
      const detail = (event as CustomEvent<StudyActivityRecordedDetail>).detail;
      if (!detail) return;
      addToast({ kind: "success", ...detail });
    };

    const onNearMiss = (event: Event) => {
      const detail = (event as CustomEvent<StudyActivityNearMissDetail>).detail;
      if (!detail) return;
      addToast({ kind: "near-miss", ...detail });
    };

    window.addEventListener(STUDY_ACTIVITY_RECORDED_EVENT, onRecorded);
    window.addEventListener(STUDY_ACTIVITY_NEAR_MISS_EVENT, onNearMiss);
    return () => {
      window.removeEventListener(STUDY_ACTIVITY_RECORDED_EVENT, onRecorded);
      window.removeEventListener(STUDY_ACTIVITY_NEAR_MISS_EVENT, onNearMiss);
    };
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="study-activity-toasts" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`study-activity-toast ${toast.kind === "near-miss" ? "near-miss" : ""}`}
        >
          {toast.kind === "success" ? (
            <>
              <strong>+{toast.points} pts</strong>
              <span>{toast.label}</span>
            </>
          ) : (
            <>
              <strong>{toast.accuracy}%</strong>
              <span>
                Quase — meta {toast.threshold}% · {toast.label}
              </span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
