import type { ExamVersion } from "@/lib/exams/types";

export type CardFilter = "all" | "favorites" | ExamVersion;

type Props = {
  filter: CardFilter;
  favoriteCount: number;
  total: number;
  onChange: (filter: CardFilter) => void;
};

export default function FilterBar({ filter, favoriteCount, total, onChange }: Props) {
  return (
    <div className="filter-bar">
      <button
        type="button"
        className={`filter-chip ${filter === "all" ? "active" : ""}`}
        onClick={() => onChange("all")}
      >
        Todas ({total})
      </button>
      <button
        type="button"
        className={`filter-chip ${filter === "favorites" ? "active" : ""}`}
        onClick={() => onChange("favorites")}
      >
        ★ Favoritas ({favoriteCount})
      </button>
    </div>
  );
}
