"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PronunciationRecorder from "@/components/VocabularyTrainer/PronunciationRecorder";
import VocabDailyMissionChecklist from "@/components/VocabularyTrainer/VocabDailyMissionChecklist";
import VocabularyCard from "@/components/VocabularyTrainer/VocabularyCard";
import {
  ICAO_VOCAB_CATEGORIES,
  ICAO_VOCABULARY,
  getCategoryLabel,
  getLevelText,
  type IcaoVocabCategoryId,
  type IcaoVocabularyItem,
} from "@/data/icaoVocabulary";
import { useVocabularyProgress } from "@/hooks/useVocabularyProgress";
import { isDueForReview, isMastered } from "@/utils/spacedRepetition";

type Filter = "all" | "due" | "learning" | "mastered";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "due", label: "Due today" },
  { id: "all", label: "All" },
  { id: "learning", label: "Learning" },
  { id: "mastered", label: "Mastered" },
];

function VocabTermList({
  grouped,
  filteredLength,
  getProgress,
  activeItemId,
  onSelect,
}: {
  grouped: { id: string; label: string; terms: IcaoVocabularyItem[] }[];
  filteredLength: number;
  getProgress: (id: string) => import("@/utils/spacedRepetition").VocabItemProgress;
  activeItemId?: string;
  onSelect: (item: IcaoVocabularyItem) => void;
}) {
  if (filteredLength === 0) {
    return (
      <article className="vocab-empty-state">
        <p className="sub">No items in this filter.</p>
      </article>
    );
  }

  return (
    <div className="vocab-grouped-list">
      {grouped.map((group) => (
        <section key={group.id} className="vocab-category-section">
          <header className="vocab-category-head">
            <h3 className="vocab-category-title">{group.label}</h3>
            <span className="vocab-category-count">{group.terms.length}</span>
          </header>
          <ul className="vault-word-list vocab-term-list">
            {group.terms.map((item) => {
              const p = getProgress(item.id);
              const mastered = isMastered(p);
              const due = isDueForReview(p);
              const isActive = item.id === activeItemId;
              return (
                <li
                  key={item.id}
                  className={`vault-word-item vocab-term-item ${due ? "warn" : mastered ? "done" : ""} ${isActive ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="vocab-term-select"
                    onClick={() => onSelect(item)}
                  >
                    <span className="vocab-term-select-inner">
                      <VocabularyCard item={item} progress={p} compact />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default function VocabularyTrainerMode({ initialTermId }: { initialTermId?: string }) {
  const { getProgress, recordAttempt, markDifficult, markMastered } = useVocabularyProgress();
  const [filter, setFilter] = useState<Filter>("due");
  const [category, setCategory] = useState<IcaoVocabCategoryId | "all">("all");
  const [activeItem, setActiveItem] = useState<IcaoVocabularyItem | null>(null);
  const [level, setLevel] = useState<1 | 2 | 3 | 4>(1);

  useEffect(() => {
    if (!initialTermId) return;
    const item = ICAO_VOCABULARY.find((t) => t.id === initialTermId);
    if (item) {
      setActiveItem(item);
      setFilter("all");
    }
  }, [initialTermId]);

  const selectTermById = (termId: string) => {
    const item = ICAO_VOCABULARY.find((t) => t.id === termId);
    if (item) {
      setActiveItem(item);
      setFilter("all");
    }
  };

  const filtered = useMemo(() => {
    return ICAO_VOCABULARY.filter((item) => {
      const p = getProgress(item.id);
      if (category !== "all" && item.categoryId !== category) return false;
      switch (filter) {
        case "due":
          return isDueForReview(p);
        case "learning":
          return p.attempts > 0 && !isMastered(p);
        case "mastered":
          return isMastered(p);
        default:
          return true;
      }
    });
  }, [filter, category, getProgress]);

  const grouped = useMemo(() => {
    if (category !== "all") {
      return [
        {
          id: category,
          label: getCategoryLabel(category),
          terms: filtered,
        },
      ];
    }
    return ICAO_VOCAB_CATEGORIES.map((cat) => ({
      id: cat.id,
      label: cat.label,
      terms: filtered.filter((t) => t.categoryId === cat.id),
    })).filter((g) => g.terms.length > 0);
  }, [filtered, category]);

  const goNext = () => {
    if (!activeItem) return;
    const idx = filtered.findIndex((t) => t.id === activeItem.id);
    const next = filtered[idx + 1] ?? filtered[0];
    if (next) setActiveItem(next);
  };

  const activeProgress = activeItem ? getProgress(activeItem.id) : null;
  const referenceText = activeItem ? getLevelText(activeItem, level) : "";

  return (
    <div className={`vocab-trainer ${activeItem ? "vocab-trainer-has-panel" : ""}`}>
      <div className="vocab-toolbar">
        <div className="vocab-toolbar-row">
          <div className="vocab-filter-bar">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`filter-chip ${filter === f.id ? "active" : ""}`}
                onClick={() => {
                  setFilter(f.id);
                  setActiveItem(null);
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <span className="vocab-toolbar-count">{filtered.length} termos</span>
        </div>

        <div className="vocab-toolbar-row vocab-toolbar-row-secondary">
          <label className="vocab-category-select-wrap">
            <span className="vocab-category-select-label">Categoria</span>
            <select
              className="vocab-category-select"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as IcaoVocabCategoryId | "all");
                setActiveItem(null);
              }}
            >
              <option value="all">Todas as categorias</option>
              {ICAO_VOCAB_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </label>
          <Link href="/pronunciation" className="btn secondary btn-sm">
            Banco de pronúncia →
          </Link>
        </div>
      </div>

      <VocabDailyMissionChecklist onSelectTerm={selectTermById} defaultCollapsed />

      <div className="vocab-page-layout">
        <aside className="vocab-sidebar" aria-label="Lista de termos">
          <VocabTermList
            grouped={grouped}
            filteredLength={filtered.length}
            getProgress={getProgress}
            activeItemId={activeItem?.id}
            onSelect={setActiveItem}
          />
        </aside>

        <div className="vocab-main">
          {activeItem && activeProgress ? (
            <article className="card card-essential part2-card vault-practice-card vocab-practice-card">
              <div className="vocab-practice-head">
                <button
                  type="button"
                  className="btn secondary btn-sm vocab-mobile-back"
                  onClick={() => setActiveItem(null)}
                >
                  ← Lista
                </button>
                <div className="vocab-level-picker">
                  {([1, 2, 3, 4] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      className={`filter-chip ${level === l ? "active" : ""}`}
                      onClick={() => setLevel(l)}
                      title={getLevelText(activeItem, l)}
                    >
                      Nível {l}
                    </button>
                  ))}
                </div>
              </div>

              <VocabularyCard item={activeItem} progress={activeProgress} trainingLevel={level} />

              <PronunciationRecorder
                referenceText={referenceText}
                termLabel={activeItem.term}
                progress={activeProgress}
                onResult={async (_score, assessment, audioBlob) =>
                  recordAttempt(
                    activeItem.id,
                    assessment,
                    level,
                    activeItem.term,
                    referenceText,
                    audioBlob,
                  )
                }
                onMarkDifficult={() => markDifficult(activeItem.id)}
                onMarkMastered={() => markMastered(activeItem.id)}
                onNext={goNext}
              />

              <button type="button" className="btn secondary vocab-close-panel" onClick={() => setActiveItem(null)}>
                Fechar
              </button>
            </article>
          ) : (
            <article className="vocab-panel-hint vocab-main-placeholder">
              <h3>Selecione um termo</h3>
              <p className="sub">
                Escolha um termo na lista à esquerda ou use a missão diária para começar o treino de pronúncia.
              </p>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}
