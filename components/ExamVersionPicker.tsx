"use client";

import { EXAM_LABELS, EXAM_VERSIONS, type ExamVersion } from "@/lib/exams/types";

type Props = {
  value: ExamVersion | "all";
  onChange: (version: ExamVersion | "all") => void;
};

export default function ExamVersionPicker({ value, onChange }: Props) {
  return (
    <div className="exam-version-picker">
      <button
        type="button"
        className={`filter-chip ${value === "all" ? "active" : ""}`}
        onClick={() => onChange("all")}
      >
        Todas
      </button>
      {EXAM_VERSIONS.map((v) => (
        <button
          key={v}
          type="button"
          className={`filter-chip exam-chip ${value === v ? "active" : ""}`}
          onClick={() => onChange(v)}
        >
          {EXAM_LABELS[v]}
        </button>
      ))}
    </div>
  );
}
