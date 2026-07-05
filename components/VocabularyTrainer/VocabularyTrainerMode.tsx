"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import VocabDailyMissionChecklist from "@/components/VocabularyTrainer/VocabDailyMissionChecklist";
import VocabMissionPanel from "@/components/VocabularyTrainer/VocabMissionPanel";
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
import { CAPTAIN_VOCAB_FLIGHT_DEBRIEF, CAPTAIN_VOCAB_MISSION_INTRO } from "@/lib/vocabCoach";
import {
  getOrCreateVocabDailyMission,
  isVocabTermInTodayMission,
  vocabDailyMissionProgress,
  VOCAB_DAILY_MISSION_EVENT,
  VOCAB_DAILY_WORD_COUNT,
} from "@/lib/vocabDailyMission";
import { isVocabMissionTermComplete, nextVocabMissionLevel, vbLevelCode } from "@/lib/vocabGraduation";
import { buildVocabMissionDebrief } from "@/lib/vocabMission";
import { isDueForReview, isMastered } from "@/utils/spacedRepetition";

type Filter = "all" | "due" | "learning" | "mastered";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "due", label: "Due today" },
  { id: "all", label: "All" },
  { id: "learning", label: "Learning" },
  { id: "mastered", label: "Mastered" },
];

function normalizeSearch(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
}

export default function VocabularyTrainerMode({ initialTermId }: { initialTermId?: string }) {
  const searchParams = useSearchParams();
  const { getProgress, recordAttempt, markDifficult, markMastered, refresh } = useVocabularyProgress();
  const [filter, setFilter] = useState<Filter>("due");
  const [category, setCategory] = useState<IcaoVocabCategoryId | "all">("all");
  const [search, setSearch] = useState("");
  const [activeItem, setActiveItem] = useState<IcaoVocabularyItem | null>(null);
  const [level, setLevel] = useState<1 | 2 | 3 | 4>(1);
  const [missionLegActive, setMissionLegActive] = useState(false);
  const [showDebrief, setShowDebrief] = useState(false);
  const [missionProgress, setMissionProgress] = useState(() =>
    vocabDailyMissionProgress(getOrCreateVocabDailyMission()),
  );
  const missionBootstrapped = useRef(false);

  const syncMissionProgress = useCallback(() => {
    setMissionProgress(vocabDailyMissionProgress(getOrCreateVocabDailyMission()));
  }, []);

  useEffect(() => {
    syncMissionProgress();
    window.addEventListener(VOCAB_DAILY_MISSION_EVENT, syncMissionProgress);
    return () => window.removeEventListener(VOCAB_DAILY_MISSION_EVENT, syncMissionProgress);
  }, [syncMissionProgress]);

  const debrief = useMemo(() => buildVocabMissionDebrief(), [missionProgress.done, showDebrief]);

  const selectTerm = useCallback((item: IcaoVocabularyItem) => {
    setActiveItem(item);
    setLevel(1);
    if (isVocabTermInTodayMission(item.id)) {
      setMissionLegActive(true);
      setShowDebrief(false);
    }
  }, []);

  const selectNextMissionTerm = useCallback(
    (completedIds?: string[]) => {
      const daily = getOrCreateVocabDailyMission();
      const done = completedIds ?? daily.completedIds;
      if (done.length >= daily.termIds.length) {
        setShowDebrief(true);
        setActiveItem(null);
        return;
      }
      const nextId = daily.termIds.find((id) => !done.includes(id));
      if (!nextId) {
        setShowDebrief(true);
        setActiveItem(null);
        return;
      }
      const item = ICAO_VOCABULARY.find((t) => t.id === nextId);
      if (item) selectTerm(item);
    },
    [selectTerm],
  );

  const startMission = useCallback(() => {
    const daily = getOrCreateVocabDailyMission();
    syncMissionProgress();
    setMissionLegActive(true);
    setShowDebrief(false);
    const nextId = daily.termIds.find((id) => !daily.completedIds.includes(id));
    if (!nextId) {
      setShowDebrief(true);
      setActiveItem(null);
      return;
    }
    const item = ICAO_VOCABULARY.find((t) => t.id === nextId);
    if (item) selectTerm(item);
  }, [selectTerm, syncMissionProgress]);

  useEffect(() => {
    const requested = searchParams.get("term")?.trim() ?? initialTermId?.trim();
    if (!requested) return;
    const daily = getOrCreateVocabDailyMission();
    syncMissionProgress();
    if (daily.termIds.includes(requested)) {
      setMissionLegActive(true);
      setShowDebrief(false);
    }
    const item = ICAO_VOCABULARY.find((t) => t.id === requested);
    if (item) selectTerm(item);
  }, [searchParams, initialTermId, selectTerm, syncMissionProgress]);

  useEffect(() => {
    if (missionBootstrapped.current) return;
    const requested = searchParams.get("term")?.trim() ?? initialTermId?.trim();
    if (requested) {
      missionBootstrapped.current = true;
      return;
    }
    missionBootstrapped.current = true;
    const progress = vocabDailyMissionProgress(getOrCreateVocabDailyMission());
    if (!progress.complete) {
      startMission();
    }
  }, [searchParams, initialTermId, startMission]);

  const selectTermById = (termId: string) => {
    const item = ICAO_VOCABULARY.find((t) => t.id === termId);
    if (item) {
      selectTerm(item);
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

  const handleMissionResult = async (
    item: IcaoVocabularyItem,
    practiceLevel: 1 | 2 | 3 | 4,
    assessment: Parameters<typeof recordAttempt>[1],
    audioBlob: Blob | null,
  ) => {
    const result = await recordAttempt(
      item.id,
      assessment,
      practiceLevel,
      item.term,
      getLevelText(item, practiceLevel),
      audioBlob,
    );
    refresh();
    syncMissionProgress();

    if (result.assessed === false) return result;

    if (missionLegActive && isVocabTermInTodayMission(item.id) && isVocabMissionTermComplete(result.progress)) {
      const daily = getOrCreateVocabDailyMission();
      setTimeout(() => selectNextMissionTerm(daily.completedIds), 800);
    }

    return result;
  };

  const activeProgress = activeItem ? getProgress(activeItem.id) : null;
  const showTraining = activeItem && activeProgress;
  const missionTotal = missionProgress.total;
  const termIndex =
    activeItem && missionTotal > 0
      ? getOrCreateVocabDailyMission().termIds.indexOf(activeItem.id) + 1
      : 0;
  const currentVbLevel = activeProgress ? nextVocabMissionLevel(activeProgress) : null;

  if (missionLegActive) {
    return (
      <div className="vocab-leg">
        {missionTotal > 0 && !showDebrief && (
          <>
            <p className="vocab-mission-progress" aria-live="polite">
              Today&apos;s mission · {missionProgress.done}/{missionTotal} terms
            </p>
            {activeItem && termIndex > 0 && (
              <p className="vocab-mission-progress-detail" aria-live="polite">
                Term {termIndex} of {missionTotal}: {activeItem.term}
                {currentVbLevel && !isVocabMissionTermComplete(activeProgress!) && (
                  <> · {vbLevelCode(currentVbLevel)}</>
                )}
              </p>
            )}
          </>
        )}

        {showDebrief && (
          <section className="vocab-debrief-card">
            <h2>Vocabulary Debrief</h2>
            <ul className="vocab-debrief-list">
              {debrief.strongTerms.length > 0 && (
                <li>
                  <strong>Graduated:</strong> {debrief.strongTerms.slice(0, 8).join(", ")}
                  {debrief.strongTerms.length > 8 ? "…" : ""}
                </li>
              )}
              {debrief.weakTerms.length > 0 && (
                <li>
                  <strong>Still needs work:</strong> {debrief.weakTerms.join(", ")}
                </li>
              )}
              {debrief.averageBestScore > 0 && (
                <li>
                  <strong>Average best score:</strong> {debrief.averageBestScore}%
                </li>
              )}
            </ul>
            <p className="vocab-mission-quote">&ldquo;{CAPTAIN_VOCAB_FLIGHT_DEBRIEF}&rdquo;</p>
            <div className="vocab-debrief-actions">
              <Link href="/part1" className="btn purple">
                Continue Flight — Part 1
              </Link>
              <button
                type="button"
                className="btn secondary"
                onClick={() => {
                  setShowDebrief(false);
                  setMissionLegActive(false);
                }}
              >
                Review catalog
              </button>
            </div>
          </section>
        )}

        {!activeItem && !showDebrief && (
          <section className="vocab-mission-card">
            <p className="vocab-mission-badge">Captain Delta · TAXI</p>
            <p className="vocab-mission-quote">&ldquo;{CAPTAIN_VOCAB_MISSION_INTRO}&rdquo;</p>
            <button type="button" className="btn purple" onClick={startMission}>
              {missionProgress.done > 0 ? "Continue Flight" : "Begin Vocabulary Mission"}
            </button>
            {missionTotal > 0 && (
              <p className="vocab-mission-meta">
                {missionProgress.done}/{missionTotal} terms complete · {VOCAB_DAILY_WORD_COUNT} today
              </p>
            )}
          </section>
        )}

        {showTraining && activeItem && (
          <VocabMissionPanel
            item={activeItem}
            progress={activeProgress}
            missionLegActive
            onClose={() => setActiveItem(null)}
            onNext={() => selectNextMissionTerm()}
            onMarkDifficult={() => markDifficult(activeItem.id)}
            onMarkMastered={() => markMastered(activeItem.id)}
            onProgressRefresh={() => {
              refresh();
              syncMissionProgress();
            }}
            onResult={(practiceLevel, _score, assessment, audioBlob) =>
              handleMissionResult(activeItem, practiceLevel, assessment, audioBlob)
            }
          />
        )}
      </div>
    );
  }

  return (
    <div className={`vocab-studio ${showTraining ? "has-training" : ""}`}>
      {!activeItem && !showDebrief && (
        <section className="vocab-mission-card vocab-mission-card-browse">
          <p className="vocab-mission-badge">Captain Delta · TAXI</p>
          <p className="vocab-mission-quote">&ldquo;{CAPTAIN_VOCAB_MISSION_INTRO}&rdquo;</p>
          <button type="button" className="btn purple" onClick={startMission}>
            {missionProgress.done > 0 ? "Continue Flight" : "Begin Vocabulary Mission"}
          </button>
          {missionTotal > 0 && (
            <p className="vocab-mission-meta">
              {missionProgress.done}/{missionTotal} terms complete today
            </p>
          )}
        </section>
      )}

      <aside className="vocab-studio-catalog" aria-label="Term catalog">
        <VocabDailyMissionChecklist onSelectTerm={selectTermById} />

        <div className="vocab-studio-controls">
          <div className="vocab-studio-search-wrap">
            <input
              type="search"
              className="vocab-studio-search"
              placeholder="Search term or meaning…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search vocabulary"
            />
          </div>

          <div className="vocab-studio-filters" role="tablist" aria-label="Status filter">
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
              All categories
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
            <span>{filtered.length} terms</span>
            <Link href="/pronunciation" className="vocab-studio-link">
              Pronunciation vault →
            </Link>
          </div>
        </div>

        <VocabTermTable
          terms={filtered}
          getProgress={getProgress}
          activeId={activeItem?.id}
          onSelect={selectTerm}
        />
      </aside>

      <section className="vocab-studio-workspace" aria-label="Training area">
        {showTraining ? (
          isVocabTermInTodayMission(activeItem.id) ? (
            <VocabMissionPanel
              item={activeItem}
              progress={activeProgress}
              onClose={() => setActiveItem(null)}
              onNext={() => selectNextMissionTerm()}
              onMarkDifficult={() => markDifficult(activeItem.id)}
              onMarkMastered={() => markMastered(activeItem.id)}
              onProgressRefresh={() => {
                refresh();
                syncMissionProgress();
              }}
              onResult={(practiceLevel, _score, assessment, audioBlob) =>
                handleMissionResult(activeItem, practiceLevel, assessment, audioBlob)
              }
            />
          ) : (
            <VocabTrainingPanel
              item={activeItem}
              progress={activeProgress}
              level={level}
              onLevelChange={setLevel}
              onClose={() => setActiveItem(null)}
              onNext={() => {
                const daily = getOrCreateVocabDailyMission();
                const idx = daily.termIds.indexOf(activeItem.id);
                if (idx >= 0) {
                  const nextId = daily.termIds[idx + 1];
                  if (nextId) {
                    const next = ICAO_VOCABULARY.find((t) => t.id === nextId);
                    if (next) {
                      setActiveItem(next);
                      return;
                    }
                  }
                }
                setActiveItem(null);
              }}
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
          )
        ) : (
          !showDebrief && (
            <div className="vocab-studio-welcome">
              <p className="sub">
                Select a term from the catalog, or begin today&apos;s {VOCAB_DAILY_WORD_COUNT}-term
                mission above.
              </p>
            </div>
          )
        )}
      </section>
    </div>
  );
}
