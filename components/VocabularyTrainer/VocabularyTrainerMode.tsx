"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import VocabDailyMissionChecklist from "@/components/VocabularyTrainer/VocabDailyMissionChecklist";
import VocabTermTable from "@/components/VocabularyTrainer/VocabTermTable";
import VocabTrainingPanel from "@/components/VocabularyTrainer/VocabTrainingPanel";
import {
  ICAO_VOCAB_CATEGORIES,
  ICAO_VOCABULARY,
  getLevelText,
  type IcaoVocabCategoryId,
  type IcaoVocabularyItem,
} from "@/data/icaoVocabulary";
import { useVocabularyProgress } from "@/hooks/useVocabularyProgress";
import { isDueForReview, isMastered } from "@/utils/spacedRepetition";

type Filter = "all" | "due" | "learning" | "mastered";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "due", label: "Revisar hoje" },
  { id: "all", label: "Todos" },
  { id: "learning", label: "Aprendendo" },
  { id: "mastered", label: "Dominados" },
];

function normalizeSearch(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
}

export default function VocabularyTrainerMode({ initialTermId }: { initialTermId?: string }) {
  const { getProgress, recordAttempt, markDifficult, markMastered } = useVocabularyProgress();
  const [filter, setFilter] = useState<Filter>("due");
  const [category, setCategory] = useState<IcaoVocabCategoryId | "all">("all");
  const [search, setSearch] = useState("");
  const [activeItem, setActiveItem] = useState<IcaoVocabularyItem | null>(null);
  const [level, setLevel] = useState<1 | 2 | 3 | 4>(1);

  useEffect(() => {
    if (!initialTermId) return;
    const item = ICAO_VOCABULARY.find((t) => t.id === initialTermId);
    if (item) {
      setActiveItem(item);
      setFilter("all");
      setCategory("all");
    }
  }, [initialTermId]);

  const selectTermById = (termId: string) => {
    const item = ICAO_VOCABULARY.find((t) => t.id === termId);
    if (item) {
      setActiveItem(item);
      setFilter("all");
      setCategory("all");
      setSearch("");
    }
  };

  const filtered = useMemo(() => {
    const q = normalizeSearch(search.trim());
    return ICAO_VOCABULARY.filter((item) => {
      const p = getProgress(item.id);
      if (category !== "all" && item.categoryId !== category) return false;
      if (q) {
        const hay = normalizeSearch(`${item.term} ${item.meaning} ${item.example} ${item.category}`);
        if (!hay.includes(q)) return false;
      }
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
  }, [filter, category, search, getProgress]);

  const goNext = () => {
    if (!activeItem) return;
    const idx = filtered.findIndex((t) => t.id === activeItem.id);
    const next = filtered[idx + 1] ?? filtered[0];
    if (next) setActiveItem(next);
  };

  const activeProgress = activeItem ? getProgress(activeItem.id) : null;
  const showTraining = activeItem && activeProgress;

  return (
    <div className={`vocab-studio ${showTraining ? "has-training" : ""}`}>
      <aside className="vocab-studio-catalog" aria-label="Catálogo de termos">
        <VocabDailyMissionChecklist onSelectTerm={selectTermById} defaultCollapsed />

        <div className="vocab-studio-controls">
          <div className="vocab-studio-search-wrap">
            <input
              type="search"
              className="vocab-studio-search"
              placeholder="Buscar termo ou significado…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar vocabulário"
            />
          </div>

          <div className="vocab-studio-filters" role="tablist" aria-label="Filtro de status">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                className={`vocab-studio-filter ${filter === f.id ? "active" : ""}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="vocab-studio-categories">
            <button
              type="button"
              className={`vocab-studio-cat ${category === "all" ? "active" : ""}`}
              onClick={() => setCategory("all")}
            >
              Todas
            </button>
            {ICAO_VOCAB_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`vocab-studio-cat ${category === cat.id ? "active" : ""}`}
                onClick={() => setCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="vocab-studio-catalog-meta">
            <span>{filtered.length} termos</span>
            <Link href="/pronunciation" className="vocab-studio-link">
              Banco de pronúncia →
            </Link>
          </div>
        </div>

        <VocabTermTable
          terms={filtered}
          getProgress={getProgress}
          activeId={activeItem?.id}
          onSelect={setActiveItem}
        />
      </aside>

      <section className="vocab-studio-workspace" aria-label="Área de treino">
        {showTraining ? (
          <VocabTrainingPanel
            item={activeItem}
            progress={activeProgress}
            level={level}
            onLevelChange={setLevel}
            onClose={() => setActiveItem(null)}
            onNext={goNext}
            onMarkDifficult={() => markDifficult(activeItem.id)}
            onMarkMastered={() => markMastered(activeItem.id)}
            onResult={async (_score, assessment, audioBlob) =>
              recordAttempt(
                activeItem.id,
                assessment,
                level,
                activeItem.term,
                getLevelText(activeItem, level),
                audioBlob,
              )
            }
          />
        ) : (
          <div className="vocab-studio-welcome">
            <div className="vocab-studio-welcome-icon" aria-hidden>
              📚
            </div>
            <h2>Vocabulary Studio</h2>
            <p>
              Selecione um termo na tabela para treinar pronúncia com Azure — 4 níveis de
              complexidade, do termo isolado à frase completa.
            </p>
            <ul className="vocab-studio-welcome-tips">
              <li>Use <strong>Revisar hoje</strong> para o que o SRS pede</li>
              <li>Missão diária: 20 palavras rotativas</li>
              <li>Gravações ficam salvas na sua conta</li>
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
