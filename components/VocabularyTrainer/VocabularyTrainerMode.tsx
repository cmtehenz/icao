"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PronunciationRecorder from "@/components/VocabularyTrainer/PronunciationRecorder";
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
    <div className="part2-mode vocab-trainer">
      <header className="part2-mode-head">
        <span className="badge">Vocabulary Trainer</span>
        <span className="part2-counter">{filtered.length} items</span>
      </header>

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

      <div className="vocab-category-bar">
        <button
          type="button"
          className={`filter-chip vocab-cat-chip ${category === "all" ? "active" : ""}`}
          onClick={() => {
            setCategory("all");
            setActiveItem(null);
          }}
        >
          All categories
        </button>
        {ICAO_VOCAB_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`filter-chip vocab-cat-chip ${category === cat.id ? "active" : ""}`}
            onClick={() => {
              setCategory(cat.id);
              setActiveItem(null);
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="vault-stats-row">
        <Link href="/pronunciation" className="btn secondary btn-sm">
          Pronunciation bank →
        </Link>
      </div>

      {activeItem && activeProgress ? (
        <article className="card card-essential part2-card vault-practice-card vocab-practice-card">
          <div className="vocab-level-picker">
            {([1, 2, 3, 4] as const).map((l) => (
              <button
                key={l}
                type="button"
                className={`filter-chip ${level === l ? "active" : ""}`}
                onClick={() => setLevel(l)}
                title={getLevelText(activeItem, l)}
              >
                Level {l}
              </button>
            ))}
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
          <button type="button" className="btn secondary" onClick={() => setActiveItem(null)}>
            Back to list
          </button>
        </article>
      ) : (
        <div className="vocab-grouped-list">
          {filtered.length === 0 ? (
            <article className="exam-pick-card">
              <p className="sub">No items in this filter.</p>
            </article>
          ) : (
            grouped.map((group) => (
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
                    return (
                      <li
                        key={item.id}
                        className={`vault-word-item vocab-term-item ${due ? "warn" : mastered ? "done" : ""}`}
                      >
                        <VocabularyCard item={item} progress={p} compact />
                        <button type="button" className="btn green btn-sm" onClick={() => setActiveItem(item)}>
                          Train
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))
          )}
        </div>
      )}
    </div>
  );
}
