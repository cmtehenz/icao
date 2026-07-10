"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import WordMissionSession from "@/components/WordMission/WordMissionSession";
import DailyPronunciationWarmup from "@/components/WordMission/DailyPronunciationWarmup";
import type { IcaoVocabularyItem } from "@/data/icaoVocabulary";
import { useVocabularyProgress } from "@/hooks/useVocabularyProgress";
import { getNextMissionAction } from "@/lib/dailyMission";
import { CAPTAIN_VOCAB_FLIGHT_DEBRIEF } from "@/lib/vocabCoach";
import {
  isVocabMissionTermComplete,
  nextVocabMissionLevel,
} from "@/lib/vocabGraduation";
import { buildVocabMissionDebrief } from "@/lib/vocabMission";
import {
  findWordMissionVocabItem,
  getWordMissionTermLabel,
} from "@/lib/wordMission/wordMissionCatalog";
import {
  getOrCreateWordDailyMission,
  getWordMissionTodayTermLabels,
  isWordMissionTermInTodayMission,
  markWordMissionTermComplete,
  nextWordMissionTermId,
  wordDailyMissionProgress,
  WORD_DAILY_MISSION_EVENT,
} from "@/lib/wordMission/wordDailyMission";
import { wmLevelCode } from "@/lib/wordMission/types";

const WORD_MISSION_INTRO =
  "Every word is a flight lesson — meaning, operational use, say it, then ICAO practice.";

export default function WordMissionMode({ initialTermId }: { initialTermId?: string }) {
  const searchParams = useSearchParams();
  const { getProgress, refresh } = useVocabularyProgress();
  const [activeItem, setActiveItem] = useState<IcaoVocabularyItem | null>(null);
  const [practiceLevel, setPracticeLevel] = useState<1 | 2 | 3 | 4>(1);
  const [missionLegActive, setMissionLegActive] = useState(false);
  const [showDebrief, setShowDebrief] = useState(false);
  const [missionProgress, setMissionProgress] = useState(() =>
    wordDailyMissionProgress(getOrCreateWordDailyMission()),
  );
  const missionBootstrapped = useRef(false);

  const syncMissionProgress = useCallback(() => {
    setMissionProgress(wordDailyMissionProgress(getOrCreateWordDailyMission()));
  }, []);

  useEffect(() => {
    syncMissionProgress();
    window.addEventListener(WORD_DAILY_MISSION_EVENT, syncMissionProgress);
    return () => window.removeEventListener(WORD_DAILY_MISSION_EVENT, syncMissionProgress);
  }, [syncMissionProgress]);

  const isWarmup = searchParams.get("warmup") === "1";
  const warmupWord = searchParams.get("word")?.trim() || undefined;

  const debrief = useMemo(() => buildVocabMissionDebrief(), [missionProgress.done, showDebrief]);
  const nextAfterWordMission = useMemo(
    () => (showDebrief ? getNextMissionAction() : null),
    [showDebrief, missionProgress.done],
  );

  const selectTerm = useCallback(
    (item: IcaoVocabularyItem) => {
      setActiveItem(item);
      const progress = getProgress(item.id);
      setPracticeLevel(nextVocabMissionLevel(progress));
      if (isWordMissionTermInTodayMission(item.id)) {
        setMissionLegActive(true);
        setShowDebrief(false);
      }
    },
    [getProgress],
  );

  const syncDailyCompletedFromVocab = useCallback(() => {
    const daily = getOrCreateWordDailyMission();
    for (const id of daily.termIds) {
      if (daily.completedIds.includes(id)) continue;
      if (isVocabMissionTermComplete(getProgress(id))) {
        markWordMissionTermComplete(id);
      }
    }
    syncMissionProgress();
  }, [getProgress, syncMissionProgress]);

  const selectNextMissionTerm = useCallback(
    (fromTermId?: string) => {
      if (fromTermId) {
        const daily = getOrCreateWordDailyMission();
        if (daily.termIds.includes(fromTermId) && !daily.completedIds.includes(fromTermId)) {
          markWordMissionTermComplete(fromTermId);
        }
      }
      syncDailyCompletedFromVocab();
      const daily = getOrCreateWordDailyMission();
      const nextId = nextWordMissionTermId(daily);
      if (!nextId) {
        setShowDebrief(true);
        setActiveItem(null);
        syncMissionProgress();
        return;
      }
      const item = findWordMissionVocabItem(nextId);
      if (item) selectTerm(item);
      syncMissionProgress();
    },
    [selectTerm, syncDailyCompletedFromVocab, syncMissionProgress],
  );

  const startMission = useCallback(() => {
    syncDailyCompletedFromVocab();
    setMissionLegActive(true);
    setShowDebrief(false);
    selectNextMissionTerm();
  }, [selectNextMissionTerm, syncDailyCompletedFromVocab]);

  useEffect(() => {
    if (isWarmup) return;
    const requested = searchParams.get("term")?.trim() ?? initialTermId?.trim();
    if (!requested) return;
    const daily = getOrCreateWordDailyMission();
    syncMissionProgress();
    if (daily.termIds.includes(requested)) {
      setMissionLegActive(true);
      setShowDebrief(false);
    }
    const item = findWordMissionVocabItem(requested);
    if (item) selectTerm(item);
  }, [isWarmup, searchParams, initialTermId, selectTerm, syncMissionProgress]);

  useEffect(() => {
    if (isWarmup) return;
    if (missionBootstrapped.current) return;
    if (searchParams.get("term") || initialTermId) return;
    missionBootstrapped.current = true;
    const daily = getOrCreateWordDailyMission();
    if (daily.completedIds.length < daily.termIds.length) {
      startMission();
    }
  }, [isWarmup, searchParams, initialTermId, startMission]);

  const todayTermLabels = useMemo(
    () => getWordMissionTodayTermLabels(getOrCreateWordDailyMission()),
    [missionProgress.done, missionProgress.total],
  );

  const activeProgress = activeItem ? getProgress(activeItem.id) : null;
  const missionTotal = missionProgress.total;
  const termIndex =
    activeItem && missionTotal > 0
      ? getOrCreateWordDailyMission().termIds.indexOf(activeItem.id) + 1
      : 0;

  const handleLevelAdvanced = useCallback(
    (level: 1 | 2 | 3 | 4) => {
      if (!activeItem) return;
      refresh();
      const progress = getProgress(activeItem.id);
      if (isVocabMissionTermComplete(progress)) return;
      const next = nextVocabMissionLevel(progress);
      if (next !== level) setPracticeLevel(next);
    },
    [activeItem, getProgress, refresh],
  );

  return (
    <div className="word-mission-leg vocab-leg">
      {isWarmup ? (
        <DailyPronunciationWarmup initialWord={warmupWord} />
      ) : null}

      {!isWarmup && missionTotal > 0 && !showDebrief && (
        <>
          <p className="vocab-mission-progress" aria-live="polite">
            Today&apos;s mission · {missionProgress.done}/{missionTotal} terms
          </p>
          {activeItem && termIndex > 0 && (
            <p className="vocab-mission-progress-detail" aria-live="polite">
              {getWordMissionTermLabel(activeItem)}
              {activeProgress && !isVocabMissionTermComplete(activeProgress) && (
                <> · {wmLevelCode(practiceLevel)} — {missionProgress.total - missionProgress.done} terms left</>
              )}
            </p>
          )}
        </>
      )}

      {!isWarmup && showDebrief && (
        <section className="vocab-debrief-card">
          <h2>Word Mission Debrief</h2>
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
            <Link href={nextAfterWordMission?.href ?? "/part1"} className="btn purple">
              {nextAfterWordMission
                ? `Ready — ${nextAfterWordMission.title}`
                : "Ready — Continue Flight"}
            </Link>
          </div>
        </section>
      )}

      {!isWarmup && !activeItem && !showDebrief && (
        <section className="vocab-mission-card word-mission-intro-card">
          <p className="vocab-mission-badge">Captain Delta · ENGINE START</p>
          <p className="vocab-mission-quote">&ldquo;{WORD_MISSION_INTRO}&rdquo;</p>
          {missionTotal > 0 && todayTermLabels.length > 0 && (
            <p className="vocab-mission-today-terms">
              Today&apos;s terms: {todayTermLabels.join(" · ")}
            </p>
          )}
          <button type="button" className="btn purple" onClick={startMission}>
            {missionProgress.done > 0 ? "Continue Flight" : "Begin Word Mission"}
          </button>
          {missionTotal > 0 && (
            <p className="vocab-mission-meta">
              {missionProgress.done}/{missionTotal} terms complete
            </p>
          )}
        </section>
      )}

      {!isWarmup && activeItem && activeProgress && !showDebrief && (
        <WordMissionSession
          item={activeItem}
          progress={activeProgress}
          practiceLevel={practiceLevel}
          missionLegActive={missionLegActive}
          termIndex={termIndex}
          missionTotal={missionTotal}
          missionDone={missionProgress.done}
          onPracticeLevelChange={setPracticeLevel}
          onProgressRefresh={() => {
            refresh();
            syncMissionProgress();
          }}
          onLevelAdvanced={handleLevelAdvanced}
          onSelectNextMissionTerm={(fromTermId) => selectNextMissionTerm(fromTermId ?? activeItem?.id)}
        />
      )}
    </div>
  );
}
