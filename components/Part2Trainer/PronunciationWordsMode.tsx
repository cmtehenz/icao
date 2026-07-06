"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import CallsignDrillPanel from "@/components/Part2Trainer/CallsignDrillPanel";
import PronunciationLessonSession from "@/components/Part2Trainer/PronunciationLessonSession";
import WordPhoneticHint from "@/components/WordPhoneticHint";
import { speakAzureText } from "@/lib/azure/azureTts";
import {
  clearActivePronunciationWord,
  publishActivePronunciationWord,
} from "@/lib/captainDelta/lessonContext";
import {
  sameStringList,
} from "@/lib/pronunciation/pronunciationRecordingController";
import { ensureWordContext } from "@/lib/pronunciationContext";
import { deriveVaultWordStatus } from "@/lib/pronunciationGraduation";
import {
  initialPracticeLevelForWord,
  practiceLevelAfterVaultRefresh,
} from "@/lib/pronunciation/practiceLevelSelection";
import {
  buildDailyPronunciationMission,
  buildMissionDebrief,
  pronunciationMissionKey,
  type PronunciationMission,
} from "@/lib/pronunciationMission";
import {
  buildPronunciationEntryTrace,
  nextIncompleteMissionWord,
  resolvePronunciationEntryWord,
  shouldMountCallsignDrill,
  tracePronunciationEntry,
} from "@/lib/pronunciation/pronunciationEntry";
import {
  getOrCreatePronunciationDailyMission,
  isPronunciationWordInTodayMission,
  PRONUNCIATION_DAILY_MISSION_EVENT,
} from "@/lib/pronunciationDailyMission";
import {
  addManualWordsToVault,
  loadVault,
  parseManualVaultInput,
  removeVaultWord,
  VAULT_CHANGE_EVENT,
  type PracticeLevel,
  type VaultWord,
} from "@/lib/pronunciationVault";
import {
  CAPTAIN_MISSION_DEBRIEF,
  CAPTAIN_MISSION_INTRO,
  statusLabel,
} from "@/lib/pronunciationCoach";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";

function statusClass(status: ReturnType<typeof deriveVaultWordStatus>): string {
  if (status === "critical") return "critical";
  if (status === "needs_review") return "review";
  if (status === "use_sentence" || status === "use_icao") return "context";
  if (status === "new") return "new";
  return "practicing";
}

function VaultAddWordsForm({ onAdded }: { onAdded: () => void }) {
  const [input, setInput] = useState("");
  const [context, setContext] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = parseManualVaultInput(input);
    if (!parsed.length) {
      setMessage("Enter at least one English word (separate multiple with commas).");
      return;
    }
    const { added, updated, total } = addManualWordsToVault(input, context);
    setInput("");
    setContext("");
    onAdded();
    if (added > 0) {
      setMessage(
        `${added} word${added > 1 ? "s" : ""} added` +
          (updated > 0 ? ` · ${updated} updated` : "") +
          ` · ${total} in vault.`,
      );
    } else if (updated > 0) {
      setMessage(`${updated} word${updated > 1 ? "s" : ""} already in vault — context updated.`);
    }
  };

  return (
    <form className="vault-add-form" onSubmit={handleSubmit}>
      <h2>Add words</h2>
      <p className="sub">
        Separate multiple with commas — e.g. <em>helicopter, clearance, turbulence</em>
      </p>
      <label className="field">
        <span>Word(s)</span>
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setMessage(null);
          }}
          placeholder="helicopter, hover, clearance"
          autoComplete="off"
        />
      </label>
      <label className="field">
        <span>Context (optional)</span>
        <input
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Part 1 — weather"
          autoComplete="off"
        />
      </label>
      <div className="vault-add-actions">
        <button type="submit" className="btn green" disabled={!input.trim()}>
          Add to vault
        </button>
      </div>
      {message && <p className="vault-add-message">{message}</p>}
    </form>
  );
}

function missionFromDaily(vault: VaultWord[]): PronunciationMission {
  const daily = getOrCreatePronunciationDailyMission();
  const built = buildDailyPronunciationMission(vault);
  const wordMap = new Map(built.words.map((m) => [m.word.word.toLowerCase(), m]));
  return {
    date: daily.date,
    words: daily.words.map((wordStr) => {
      const hit = wordMap.get(wordStr.toLowerCase());
      if (hit) return hit;
      const vaultWord = vault.find((w) => w.word.toLowerCase() === wordStr.toLowerCase());
      return {
        word: vaultWord ?? {
          word: wordStr,
          lowestAccuracy: 0,
          lastAccuracy: 0,
          errorType: "Manual",
          errorLabel: "daily mission",
          context: "",
          timesSeen: 1,
          practiceCount: 0,
          passCount: 0,
          returnCount: 0,
          lastSeenAt: new Date().toISOString(),
        },
        role: "below80" as const,
      };
    }),
  };
}

function syncDailyMissionState(vault: VaultWord[]): {
  mission: PronunciationMission;
  progress: string[];
} {
  const daily = getOrCreatePronunciationDailyMission();
  return {
    mission: missionFromDaily(vault),
    progress: daily.completedWords,
  };
}

export default function PronunciationWordsMode() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const recordDebug = searchParams.get("recordDebug") === "1";
  const missionWordParam = searchParams.get("word")?.trim() ?? null;
  const [words, setWords] = useState<VaultWord[]>([]);
  const [activeWord, setActiveWord] = useState<VaultWord | null>(null);
  const [practiceLevel, setPracticeLevel] = useState<PracticeLevel>(1);
  const [mission, setMission] = useState<PronunciationMission | null>(null);
  const [missionProgress, setMissionProgress] = useState<string[]>([]);
  const [missionLegActive, setMissionLegActive] = useState(false);
  const [showDebrief, setShowDebrief] = useState(false);
  const [entryResolved, setEntryResolved] = useState(!missionWordParam);
  const [missionEntryMissing, setMissionEntryMissing] = useState(false);
  const [listenWord, setListenWord] = useState<string | null>(null);
  const [listenError, setListenError] = useState<string | null>(null);
  const userLevelOverrideRef = useRef(false);
  const selectWordRef = useRef<(item: VaultWord) => void>(() => {});

  const refresh = useCallback(() => {
    const vault = loadVault();
    setWords(vault);
    const { mission: m, progress } = syncDailyMissionState(vault);
    setMission((prev) => {
      const nextKey = pronunciationMissionKey(m);
      const prevKey = prev ? pronunciationMissionKey(prev) : "";
      return nextKey === prevKey ? prev : m;
    });
    setMissionProgress((prev) => (sameStringList(prev, progress) ? prev : progress));
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(VAULT_CHANGE_EVENT, refresh);
    window.addEventListener(PRONUNCIATION_DAILY_MISSION_EVENT, refresh);
    return () => {
      window.removeEventListener(VAULT_CHANGE_EVENT, refresh);
      window.removeEventListener(PRONUNCIATION_DAILY_MISSION_EVENT, refresh);
    };
  }, [refresh]);

  const debrief = useMemo(
    () => (mission ? buildMissionDebrief(mission, missionProgress) : null),
    [mission, missionProgress],
  );

  const browseMode = !missionLegActive && !showDebrief;
  const callsignOpen = searchParams.get("callsign") === "1";
  const showCallsignDrill = shouldMountCallsignDrill(
    browseMode,
    activeWord,
    missionLegActive,
    missionWordParam,
  );

  const listenVaultWord = useCallback(async (word: string) => {
    setListenError(null);
    setListenWord(word);
    const ok = await speakAzureText(word, "female_examiner", 1, (msg) => setListenError(msg));
    setListenWord(null);
    if (!ok) {
      setListenError((prev) => prev ?? "Azure Speech is unavailable. Try again when logged in.");
    }
  }, []);

  const selectWord = useCallback((item: VaultWord) => {
    const pack = ensureWordContext(item.word, item.contextPack);
    const enriched = { ...item, contextPack: pack };
    const sameWord = activeWord?.word.toLowerCase() === item.word.toLowerCase();
    const recommended = initialPracticeLevelForWord(enriched);

    if (sameWord) {
      setActiveWord(enriched);
      if (!userLevelOverrideRef.current) {
        setPracticeLevel(recommended);
      }
      return;
    }

    userLevelOverrideRef.current = false;
    setActiveWord(enriched);
    setPracticeLevel(recommended);
    if (isPronunciationWordInTodayMission(item.word)) {
      setMissionLegActive(true);
    }
  }, [activeWord?.word]);

  selectWordRef.current = selectWord;

  useEffect(() => {
    const requested = missionWordParam?.toLowerCase();
    if (!requested) {
      setEntryResolved(true);
      setMissionEntryMissing(false);
      return;
    }

    const daily = getOrCreatePronunciationDailyMission();
    const m = missionFromDaily(words);
    setMission((prev) => {
      const nextKey = pronunciationMissionKey(m);
      const prevKey = prev ? pronunciationMissionKey(prev) : "";
      return nextKey === prevKey ? prev : m;
    });
    setMissionProgress((prev) =>
      sameStringList(prev, daily.completedWords) ? prev : daily.completedWords,
    );

    const inDaily = daily.words.some((w) => w.toLowerCase() === requested);
    if (!inDaily) {
      setMissionEntryMissing(true);
      setEntryResolved(true);
      return;
    }

    const resolved = resolvePronunciationEntryWord(requested, words);
    if (resolved) {
      setMissionLegActive(true);
      setShowDebrief(false);
      setMissionEntryMissing(false);
      setEntryResolved(true);
      if (activeWord?.word.toLowerCase() !== requested) {
        selectWordRef.current(resolved);
      }
    } else {
      setMissionEntryMissing(true);
      setEntryResolved(true);
    }
  }, [missionWordParam, words, activeWord?.word]);

  useEffect(() => {
    if (!activeWord?.word || !words.length) return;
    const fresh = words.find((w) => w.word.toLowerCase() === activeWord.word.toLowerCase());
    if (!fresh) return;
    const pack = ensureWordContext(fresh.word, fresh.contextPack);
    const enriched = { ...fresh, contextPack: pack };
    setActiveWord((prev) => {
      if (!prev || prev.word.toLowerCase() !== enriched.word.toLowerCase()) return prev;
      if (
        prev.practiceLevel === enriched.practiceLevel &&
        prev.status === enriched.status &&
        prev.lastAccuracy === enriched.lastAccuracy
      ) {
        return prev;
      }
      return enriched;
    });
    setPracticeLevel((prev) =>
      practiceLevelAfterVaultRefresh(enriched, prev, userLevelOverrideRef.current),
    );
  }, [activeWord?.word, words]);

  useEffect(() => {
    publishActivePronunciationWord(activeWord?.word ?? null);
  }, [activeWord?.word]);

  useEffect(() => {
    return () => clearActivePronunciationWord();
  }, []);

  useEffect(() => {
    const route =
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    tracePronunciationEntry(
      buildPronunciationEntryTrace({
        route,
        missionWordParam,
        activeWord,
        missionLegActive,
        callsignMounted: showCallsignDrill,
      }),
    );
  }, [
    pathname,
    searchParams,
    missionWordParam,
    activeWord,
    missionLegActive,
    showCallsignDrill,
  ]);

  const startMission = () => {
    const daily = getOrCreatePronunciationDailyMission();
    const m = missionFromDaily(words);
    setMission(m);
    setMissionProgress(daily.completedWords);
    setMissionLegActive(true);
    setShowDebrief(false);
    setMissionEntryMissing(false);
    const next = nextIncompleteMissionWord(words);
    if (next) {
      selectWord(next);
    } else {
      setMissionEntryMissing(true);
    }
  };

  const missionEmptyState =
    entryResolved &&
    !activeWord &&
    !showDebrief &&
    (missionEntryMissing ||
      (missionLegActive && (mission?.words.length ?? 0) === 0));

  if (!words.length && !missionWordParam && !missionLegActive && !showDebrief) {
    return (
      <div className="pronunciation-leg">
        {showCallsignDrill && <CallsignDrillPanel initialOpen={callsignOpen} />}
        <VaultAddWordsForm onAdded={refresh} />
        <section className="pron-mission-card pronunciation-empty-card">
          <p className="pron-mission-badge">Captain Delta · ENGINE START</p>
          <h2>Add words to begin today&apos;s pronunciation leg</h2>
          <p className="sub">
            Add words below, or practice Part 1 / Part 2 — words scored below 40% enter your vault
            automatically.
          </p>
        </section>
      </div>
    );
  }

  const missionTotal = mission?.words.length ?? 0;

  return (
    <div className="pronunciation-leg">
      {missionLegActive && missionTotal > 0 && (
        <p className="pron-mission-progress" aria-live="polite">
          Today&apos;s mission · {missionProgress.length}/{missionTotal} words
        </p>
      )}

      {showCallsignDrill && <CallsignDrillPanel initialOpen={callsignOpen} />}
      {browseMode && !activeWord && <VaultAddWordsForm onAdded={refresh} />}

      {missionEmptyState && (
        <section className="pron-mission-card pronunciation-empty-card">
          <p className="pron-mission-badge">Captain Delta · MISSION HOLD</p>
          <h2>Today&apos;s pronunciation word is not available</h2>
          <p className="sub">
            {missionWordParam
              ? `"${missionWordParam}" is not in your vault or today's mission. Add it below or pick another word.`
              : "No mission words are ready. Add words to your vault, then start the pronunciation leg again."}
          </p>
          <Link href="/" className="btn secondary">
            Back to Home
          </Link>
        </section>
      )}

      {!activeWord && !showDebrief && browseMode && !missionEmptyState && (
        <section className="pron-mission-card">
          <p className="pron-mission-badge">Captain Delta · ENGINE START</p>
          <p className="pron-mission-quote">&ldquo;{CAPTAIN_MISSION_INTRO}&rdquo;</p>
          <button type="button" className="btn purple" onClick={startMission}>
            {missionProgress.length > 0 ? "Continue Flight" : "Begin Pronunciation Mission"}
          </button>
          {mission && missionTotal > 0 && (
            <p className="pron-mission-meta">
              {missionProgress.length}/{missionTotal} words complete
            </p>
          )}
        </section>
      )}

      {showDebrief && debrief && (
        <section className="pron-debrief-card">
          <h2>Pronunciation Debrief</h2>
          <ul className="pron-debrief-list">
            {debrief.bestWord && (
              <li>
                <strong>Best word:</strong> {debrief.bestWord}
              </li>
            )}
            {debrief.mostImprovedWord && (
              <li>
                <strong>Most improved:</strong> {debrief.mostImprovedWord}
              </li>
            )}
            {debrief.stillCritical.length > 0 && (
              <li>
                <strong>Still critical:</strong> {debrief.stillCritical.join(", ")}
              </li>
            )}
            {debrief.graduated.length > 0 && (
              <li>
                <strong>Graduated:</strong> {debrief.graduated.join(", ")}
              </li>
            )}
          </ul>
          <p className="pron-mission-quote">&ldquo;{CAPTAIN_MISSION_DEBRIEF}&rdquo;</p>
          <div className="pron-debrief-actions">
            <Link href="/vocabulario" className="btn purple">
              Continue Flight — Vocabulary
            </Link>
            <button
              type="button"
              className="btn secondary"
              onClick={() => {
                setShowDebrief(false);
                setMissionLegActive(false);
              }}
            >
              Review vault
            </button>
          </div>
        </section>
      )}

      {activeWord && (
        <PronunciationLessonSession
          key={activeWord.word}
          activeWord={activeWord}
          practiceLevel={practiceLevel}
          missionLegActive={missionLegActive}
          mission={mission}
          recordDebug={recordDebug}
          userLevelOverrideRef={userLevelOverrideRef}
          onPracticeLevelChange={setPracticeLevel}
          onVaultRefresh={refresh}
          onMissionProgress={setMissionProgress}
          onSelectNextMissionWord={(completedKeys) => {
            const daily = getOrCreatePronunciationDailyMission();
            if (completedKeys.length >= daily.words.length) {
              setShowDebrief(true);
              setActiveWord(null);
              return;
            }
            const nextWord = daily.words.find((w) => !completedKeys.includes(w.toLowerCase()));
            if (!nextWord) {
              setShowDebrief(true);
              setActiveWord(null);
              return;
            }
            const resolved = resolvePronunciationEntryWord(nextWord, loadVault());
            if (resolved) selectWordRef.current(resolved);
          }}
          onWordAdvanced={(word, level) => {
            userLevelOverrideRef.current = false;
            setActiveWord(word);
            setPracticeLevel(level);
          }}
          onWordCleared={() => setActiveWord(null)}
          onPracticeLevelBelowStored={(level) => {
            userLevelOverrideRef.current = false;
            setPracticeLevel(level);
          }}
          onClearWord={() => setActiveWord(null)}
        />
      )}

      {!activeWord && !showDebrief && browseMode && !missionEmptyState && (
          <ul className="vault-word-list">
            {words.map((item) => {
              const st = deriveVaultWordStatus(item);
              return (
                <li
                  key={item.word}
                  className={`vault-word-item pron-status-${statusClass(st)}`}
                >
                  <div className="vault-word-top">
                    <div className="vault-word-headline">
                      <strong className="vault-word-title">
                        {item.word}
                        <WordPhoneticHint word={item.word} className="vault-word-phonetic" />
                      </strong>
                      <span className={`pron-word-status pron-word-status-${statusClass(st)}`}>
                        {statusLabel(st)}
                      </span>
                    </div>
                    <div className="vault-word-meta">
                      <span className="vault-word-scores">
                        L{item.practiceLevel ?? 1} · {item.lastAccuracy}% · {item.practiceCount}{" "}
                        sessions
                      </span>
                      {item.context && <span className="vault-word-context">{item.context}</span>}
                    </div>
                  </div>
                  <div className="vault-word-actions">
                    <button
                      type="button"
                      className="btn secondary btn-sm"
                      onClick={() => void listenVaultWord(item.word)}
                      disabled={listenWord === item.word}
                    >
                      {listenWord === item.word ? "Playing…" : "Listen"}
                    </button>
                    <button type="button" className="btn green btn-sm" onClick={() => selectWord(item)}>
                      Practice
                    </button>
                    <button
                      type="button"
                      className="btn secondary btn-sm"
                      onClick={() => {
                        removeVaultWord(item.word);
                        refresh();
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

      {listenError && browseMode && (
        <p className="pron-recording-state pron-recording-state-error" role="alert">
          {listenError}
        </p>
      )}
    </div>
  );
}
