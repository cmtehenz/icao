"use client";

import { useEffect } from "react";
import ExamVersionPicker from "@/components/ExamVersionPicker";
import FilterBar, { type CardFilter } from "@/components/study/FilterBar";
import type { ExamVersion } from "@/lib/exams/types";

type Props = {
  open: boolean;
  onClose: () => void;
  examVersion: ExamVersion | "all";
  onExamVersionChange: (version: ExamVersion | "all") => void;
  filter: CardFilter;
  favoriteCount: number;
  total: number;
  onFilterChange: (filter: CardFilter) => void;
};

export default function StudyFilterSheet({
  open,
  onClose,
  examVersion,
  onExamVersionChange,
  filter,
  favoriteCount,
  total,
  onFilterChange,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="study-goal-sheet-backdrop" onClick={onClose} role="presentation">
      <div
        className="study-goal-sheet study-filter-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Filtrar perguntas"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="study-goal-sheet-handle" aria-hidden />
        <header className="study-goal-sheet-head">
          <h2>Filtrar perguntas</h2>
          <button type="button" className="btn icon-btn secondary" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </header>

        <div className="study-filter-section">
          <h3>Prova</h3>
          <ExamVersionPicker value={examVersion} onChange={onExamVersionChange} />
        </div>

        <div className="study-filter-section">
          <h3>Lista</h3>
          <FilterBar
            filter={filter}
            favoriteCount={favoriteCount}
            total={total}
            onChange={onFilterChange}
          />
        </div>

        <button type="button" className="btn purple study-filter-apply" onClick={onClose}>
          Aplicar ({total} perguntas)
        </button>
      </div>
    </div>
  );
}
