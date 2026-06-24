export type CardFilter = "all" | "favorites" | "core";

type Props = {
  filter: CardFilter;
  favoriteCount: number;
  coreCount: number;
  total: number;
  onChange: (filter: CardFilter) => void;
};

export default function FilterBar({ filter, favoriteCount, coreCount, total, onChange }: Props) {
  return (
    <div className="filter-bar">
      <button
        type="button"
        className={`filter-chip ${filter === "all" ? "active" : ""}`}
        onClick={() => onChange("all")}
      >
        All ({total})
      </button>
      <button
        type="button"
        className={`filter-chip ${filter === "core" ? "active" : ""}`}
        onClick={() => onChange("core")}
      >
        Helicopter Core ({coreCount})
      </button>
      <button
        type="button"
        className={`filter-chip ${filter === "favorites" ? "active" : ""}`}
        onClick={() => onChange("favorites")}
      >
        ★ Favorites ({favoriteCount})
      </button>
    </div>
  );
}
