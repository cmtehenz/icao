"use client";

type Props = {
  onDifficult: () => void;
  onMastered: () => void;
  difficultLabel?: string;
  masteredLabel?: string;
};

export default function CardStatusActions({
  onDifficult,
  onMastered,
  difficultLabel = "Marcar como difícil",
  masteredLabel = "Marcar como dominada",
}: Props) {
  return (
    <span className="card-status-actions" role="group" aria-label="Marcar progresso">
      <button
        type="button"
        className="card-status-btn difficult"
        onClick={onDifficult}
        title={difficultLabel}
        aria-label={difficultLabel}
      >
        👎
      </button>
      <button
        type="button"
        className="card-status-btn mastered"
        onClick={onMastered}
        title={masteredLabel}
        aria-label={masteredLabel}
      >
        ✓
      </button>
    </span>
  );
}
