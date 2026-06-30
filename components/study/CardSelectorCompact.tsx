"use client";

type Props = {
  label: string;
  subtitle: string;
  position: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  onOpenPicker: () => void;
};

export default function CardSelectorCompact({
  label,
  subtitle,
  position,
  total,
  onPrevious,
  onNext,
  onOpenPicker,
}: Props) {
  return (
    <div className="card-selector-compact">
      <button type="button" className="btn secondary icon-btn" onClick={onPrevious} aria-label="Pergunta anterior">
        ←
      </button>
      <button type="button" className="card-selector-main" onClick={onOpenPicker}>
        <span className="card-selector-label">{label}</span>
        <span className="card-selector-sub">{subtitle}</span>
        <span className="card-selector-change">Trocar pergunta · {position}/{total}</span>
      </button>
      <button type="button" className="btn secondary icon-btn" onClick={onNext} aria-label="Próxima pergunta">
        →
      </button>
    </div>
  );
}
