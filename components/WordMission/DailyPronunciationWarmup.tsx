"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import WordPhoneticHint from "@/components/WordPhoneticHint";
import { usePronunciationRecordingController } from "@/hooks/usePronunciationRecordingController";
import { getNextMissionAction } from "@/lib/dailyMission";
import { buildDailyPronunciationMission } from "@/lib/pronunciationMission";
import {
  getOrCreatePronunciationDailyMission,
  PRONUNCIATION_DAILY_MISSION_EVENT,
  pronunciationDailyMissionProgress,
} from "@/lib/pronunciationDailyMission";
import { isPronunciationRecordingActive } from "@/lib/pronunciation/pronunciationRecordingController";
import { loadVault, type VaultWord } from "@/lib/pronunciationVault";
import { todayKey } from "@/lib/studyTime";
import { findWordMissionVocabItem } from "@/lib/wordMission/wordMissionCatalog";
import {
  resolveVocabTermIdForWord,
} from "@/lib/wordMission/wordDailyMission";
import { vaultWordFromVocabTerm } from "@/lib/wordMission/vaultAdapter";

function vaultWordForWarmup(word: string): VaultWord | null {
  const fromVault = loadVault().find((w) => w.word.toLowerCase() === word.toLowerCase());
  if (fromVault) return fromVault;

  const termId = resolveVocabTermIdForWord(word);
  if (!termId) return null;
  const item = findWordMissionVocabItem(termId);
  if (!item) return null;
  return vaultWordFromVocabTerm(item);
}

type Props = {
  initialWord?: string;
};

/** ENGINE START warm-up — daily pronunciation words before Word Mission. */
export default function DailyPronunciationWarmup({ initialWord }: Props) {
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    window.addEventListener(PRONUNCIATION_DAILY_MISSION_EVENT, refresh);
    return () => window.removeEventListener(PRONUNCIATION_DAILY_MISSION_EVENT, refresh);
  }, [refresh]);

  const progress = useMemo(() => {
    void tick;
    return pronunciationDailyMissionProgress(getOrCreatePronunciationDailyMission());
  }, [tick]);

  const activeWordKey =
    initialWord?.trim() ||
    progress.currentWord ||
    getOrCreatePronunciationDailyMission().words[0] ||
    "";

  const activeWord = useMemo(
    () => (activeWordKey ? vaultWordForWarmup(activeWordKey) : null),
    [activeWordKey],
  );

  const mission = useMemo(() => {
    const daily = getOrCreatePronunciationDailyMission();
    const built = buildDailyPronunciationMission(loadVault());
    const allowed = new Set(daily.words.map((w) => w.toLowerCase()));
    return {
      date: built.date ?? todayKey(),
      words: built.words.filter((entry) => allowed.has(entry.word.word.toLowerCase())),
    };
  }, [tick]);

  const recording = usePronunciationRecordingController({
    activeWord,
    practiceLevel: 1,
    missionLegActive: true,
    mission,
    onVaultRefresh: refresh,
    onMissionProgress: () => refresh(),
    onSelectNextMissionWord: () => refresh(),
    onWordAdvanced: () => refresh(),
    onWordCleared: () => refresh(),
  });

  const next = useMemo(() => {
    void tick;
    return getNextMissionAction();
  }, [tick]);

  const recorderState = recording.state;
  const micUi = recording.micUi;

  if (progress.complete) {
    return (
      <section className="vocab-mission-card word-mission-intro-card">
        <p className="vocab-mission-badge">Captain Delta · ENGINE START</p>
        <h2>Pronunciation warm-up complete</h2>
        <p className="sub">Clear speech checked. Line up for Word Mission.</p>
        <Link href={next?.href ?? "/word-mission"} className="btn purple">
          {next?.title ? `Ready — ${next.title}` : "Begin Word Mission"}
        </Link>
      </section>
    );
  }

  if (!activeWord) {
    return (
      <section className="vocab-mission-card word-mission-intro-card">
        <p className="vocab-mission-badge">Captain Delta · ENGINE START</p>
        <p className="sub">Warm-up word unavailable — continue to Word Mission.</p>
        <Link href="/word-mission" className="btn purple">
          Begin Word Mission
        </Link>
      </section>
    );
  }

  return (
    <section className="word-mission-body word-mission-simple-card pronunciation-warmup-leg">
      <p className="vocab-mission-badge">Captain Delta · ENGINE START</p>
      <p className="vocab-mission-progress" aria-live="polite">
        Warm-up · {progress.done}/{progress.total} words
      </p>
      <h2 className="vocab-studio-hero-term word-mission-term">
        {activeWord.word}
        <WordPhoneticHint word={activeWord.word} className="vault-word-phonetic word-mission-phonetic" />
      </h2>
      <p className="sub">Speak the word clearly. Pass score unlocks the next warm-up word.</p>

      <footer className="word-mission-recorder-foot">
        <div className="word-mission-listen-row">
          <button
            type="button"
            className="btn secondary btn-sm word-mission-listen-btn"
            onClick={() => void recording.listen()}
            disabled={isPronunciationRecordingActive(recorderState.phase)}
          >
            Listen
          </button>
          {micUi.canStop ? (
            <button type="button" className="btn purple btn-sm" onClick={() => void recording.stop()}>
              Stop &amp; assess
            </button>
          ) : (
            <button
              type="button"
              className="btn purple btn-sm"
              onClick={() => void recording.start()}
              disabled={!micUi.canStart}
            >
              {micUi.primaryLabel}
            </button>
          )}
        </div>
        {recording.recordNotice ? (
          <p className="word-mission-warn" role="alert">
            {recording.recordNotice}
          </p>
        ) : null}
      </footer>
    </section>
  );
}
