"use client";

import { useCaptainDeltaExaminer } from "@/components/CaptainDelta/Examiner/CaptainDeltaExaminerProvider";

export default function CaptainDeltaRoleIndicator() {
  const examiner = useCaptainDeltaExaminer();
  if (!examiner) return null;

  const isExaminer = examiner.role === "examiner";

  return (
    <div
      className={`cde-role-indicator ${isExaminer ? "examiner" : "instructor"}`}
      aria-live="polite"
    >
      <span className="cde-role-badge">👨‍✈️ Captain Delta</span>
      <strong>{isExaminer ? "Examiner Mode" : "Instructor Mode"}</strong>
    </div>
  );
}
