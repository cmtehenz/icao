"use client";

import { useMemo } from "react";
import PeelBlockWeakBadge from "@/components/study/PeelBlockWeakBadge";
import ProgressBadge from "@/components/study/ProgressBadge";
import { getExamForCard } from "@/data/exams/part1";
import { EXAM_LABELS } from "@/lib/exams/types";
import { getCardProgress, type ProgressStore } from "@/lib/progress";
import type { Card } from "@/lib/types";

type FilteredCard = { card: Card; idx: number };

type Props = {
  open: boolean;
  onClose: () => void;
  filtered: FilteredCard[];
  currentIdx: number;
  progress: ProgressStore;
  favorites: string[];
  onSelect: (idx: number) => void;
};

export default function CardPickerModal({
  open,
  onClose,
  filtered,
  currentIdx,
  progress,
  favorites,
  onSelect,
}: Props) {
  const sorted = useMemo(
    () => [...filtered].sort((a, b) => Number(a.card.num) - Number(b.card.num)),
    [filtered],
  );

  if (!open) return null;

  const pick = (idx: number) => {
    onSelect(idx);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-wide card-picker-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Trocar pergunta</h2>
        <p className="modal-sub">{filtered.length} perguntas no filtro atual</p>

        <ul className="card-picker-list">
          {sorted.map(({ card, idx }) => {
            const exam = getExamForCard(card.num);
            const st = getCardProgress(progress, card.num);
            return (
              <li key={card.num}>
                <button
                  type="button"
                  className={`card-picker-item ${currentIdx === idx ? "active" : ""} status-${st.status}`}
                  onClick={() => pick(idx)}
                >
                  <span className="card-picker-meta">
                    {exam && <span className="exam-version-badge">{EXAM_LABELS[exam]}</span>}
                    <span className="card-num">#{card.num}</span>
                    {favorites.includes(card.num) && <span className="pill-star">★</span>}
                  </span>
                  <span className="card-picker-question">{card.question}</span>
                  <span className="card-picker-badges">
                    <ProgressBadge status={st.status} compact />
                    <PeelBlockWeakBadge cardNum={card.num} compact />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <button type="button" className="btn secondary" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
}
