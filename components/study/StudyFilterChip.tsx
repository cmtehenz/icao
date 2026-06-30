"use client";

import { EXAM_LABELS, type ExamVersion } from "@/lib/exams/types";
import type { CardFilter } from "@/components/study/FilterBar";

type Props = {
  examVersion: ExamVersion | "all";
  filter: CardFilter;
  total: number;
  onOpen: () => void;
};

export function studyFilterLabel(examVersion: ExamVersion | "all", filter: CardFilter, total: number): string {
  const exam = examVersion === "all" ? "Todas" : EXAM_LABELS[examVersion];
  const fav = filter === "favorites" ? " · ★" : "";
  return `${exam}${fav} (${total})`;
}

export default function StudyFilterChip({ examVersion, filter, total, onOpen }: Props) {
  return (
    <button type="button" className="study-filter-chip filter-chip" onClick={onOpen}>
      Filtrar: {studyFilterLabel(examVersion, filter, total)}
    </button>
  );
}
