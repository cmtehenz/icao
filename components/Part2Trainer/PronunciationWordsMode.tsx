"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import CallsignDrillPanel from "@/components/Part2Trainer/CallsignDrillPanel";
import YouGlishLink from "@/components/YouGlishLink";
import WordPhoneticHint from "@/components/WordPhoneticHint";
import CaptainDeltaTarget from "@/components/CaptainDelta/Visual/CaptainDeltaTarget";
import { useAzureSpeech } from "@/hooks/useAzureSpeech";
import { usePronunciationRecordingController } from "@/hooks/usePronunciationRecordingController";
import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import { errorTypeLabel } from "@/lib/azure/pronunciation";
import {
  clearActivePronunciationWord,
  getRecordBridgeOwnerId,
  publishActivePronunciationWord,
} from "@/lib/captainDelta/lessonContext";
import {
  PRON_RECORD_DEBUG_EVENT,
  type PronRecordDebugPayload,
} from "@/lib/captainDelta/recordRuntimeDebug";
import {
  RECORD_TRACE_EVENT,
  type RecordTracePayload,
} from "@/lib/captainDelta/pronunciationRecordTrace";
import {
  isPronunciationRecordingActive,
  sameStringList,
  type PronunciationRecordingPhase,
} from "@/lib/pronunciation/pronunciationRecordingController";
import { ensureWordContext } from "@/lib/pronunciationContext";
import { deriveVaultWordStatus } from "@/lib/pronunciationGraduation";
import {
  buildDailyPronunciationMission,
  buildMissionDebrief,
  practiceTextForLevel,
  pronunciationMissionKey,
  type PronunciationMission,
} from "@/lib/pronunciationMission";
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
  VAULT_PASS_SCORE,
  type PracticeLevel,
  type VaultWord,
} from "@/lib/pronunciationVault";
import { splitSyllables, syllableTargetId } from "@/lib/captainDelta/visual/syllables";
import {
  CAPTAIN_MISSION_DEBRIEF,
  CAPTAIN_MISSION_INTRO,
  levelLabel,
  statusLabel,
} from "@/lib/pronunciationCoach";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";

const LEVELS: PracticeLevel[] = [1, 2, 3, 4];
const LEVEL_PANEL_ID = "pron-level-panel";

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
  const [words, setWords] = useState<VaultWord[]>([]);
  const [activeWord, setActiveWord] = useState<VaultWord | null>(null);
  const [practiceLevel, setPracticeLevel] = useState<PracticeLevel>(1);
  const [lastPracticeScore, setLastPracticeScore] = useState<number | null>(null);
  const [lastResult, setLastResult] = useState<AzurePronunciationResult | null>(null);
  const [mission, setMission] = useState<PronunciationMission | null>(null);
  const [missionProgress, setMissionProgress] = useState<string[]>([]);
  const [missionLegActive, setMissionLegActive] = useState(false);
  const [showDebrief, setShowDebrief] = useState(false);
  const [recordTraceLine, setRecordTraceLine] = useState<{
    at: number;
    step: string;
    reason: string;
  } | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [recordDebugState, setRecordDebugState] = useState({
    lastEvent: "—",
    lastAt: 0,
    hitTarget: "—",
    handlerReached: false,
  });
  const speech = useAzureSpeech();
  const selectWordRef = useRef<(item: VaultWord) => void>(() => {});
  const resetRecordingRef = useRef<() => void>(() => {});
  const recorderPhaseRef = useRef<PronunciationRecordingPhase>("idle");

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

  const recording = usePronunciationRecordingController({
    activeWord,
    practiceLevel,
    missionLegActive,
    mission,
    onVaultRefresh: refresh,
    onMissionProgress: setMissionProgress,
    onSelectNextMissionWord: (completedKeys) => {
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
      const match = loadVault().find((w) => w.word.toLowerCase() === nextWord.toLowerCase());
      if (match) selectWordRef.current(match);
    },
    onWordAdvanced: (word, level) => {
      setActiveWord(word);
      setPracticeLevel(level);
    },
    onWordCleared: () => setActiveWord(null),
  });

  resetRecordingRef.current = recording.reset;
  recorderPhaseRef.current = recording.state.phase;

  const { micUi, captainNote, recordNotice, activityNote, configured, state: recorderState } =
    recording;

  useEffect(() => {
    if (recorderState.phase !== "success" || recorderState.score == null) return;
    setLastPracticeScore((prev) =>
      prev === recorderState.score ? prev : recorderState.score,
    );
    setLastResult((prev) =>
      prev === recorderState.assessment ? prev : recorderState.assessment,
    );
  }, [recorderState.phase, recorderState.score, recorderState.assessment]);

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

  const selectWord = useCallback((item: VaultWord) => {
    const pack = ensureWordContext(item.word, item.contextPack);
    const enriched = { ...item, contextPack: pack };
    const sameWord = activeWord?.word.toLowerCase() === item.word.toLowerCase();

    if (sameWord) {
      setActiveWord(enriched);
      setPracticeLevel(item.practiceLevel ?? 1);
      return;
    }

    if (isPronunciationRecordingActive(recorderPhaseRef.current)) {
      return;
    }

    setActiveWord(enriched);
    setPracticeLevel(item.practiceLevel ?? 1);
    setLastPracticeScore(null);
    setLastResult(null);
    resetRecordingRef.current();
    if (isPronunciationWordInTodayMission(item.word)) {
      setMissionLegActive(true);
    }
  }, [activeWord?.word]);

  selectWordRef.current = selectWord;

  useEffect(() => {
    const requested = searchParams.get("word")?.trim().toLowerCase();
    if (!requested || !words.length) return;
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
    if (daily.words.some((w) => w.toLowerCase() === requested)) {
      setMissionLegActive((prev) => (prev ? prev : true));
      setShowDebrief((prev) => (prev ? false : prev));
    }
    const match = words.find((w) => w.word.toLowerCase() === requested);
    if (match && activeWord?.word.toLowerCase() !== requested) {
      selectWordRef.current(match);
    }
  }, [searchParams, words, activeWord?.word]);

  useEffect(() => {
    publishActivePronunciationWord(activeWord?.word ?? null);
  }, [activeWord?.word]);

  useEffect(() => {
    return () => clearActivePronunciationWord();
  }, []);

  useEffect(() => {
    const onTrace = (e: Event) => {
      const detail = (e as CustomEvent<RecordTracePayload>).detail;
      if (!detail) return;
      setRecordTraceLine({
        at: detail.at,
        step: detail.step,
        reason: detail.reason,
      });
    };
    window.addEventListener(RECORD_TRACE_EVENT, onTrace);
    return () => window.removeEventListener(RECORD_TRACE_EVENT, onTrace);
  }, []);

  useEffect(() => {
    if (!recordDebug) return;
    const onDebug = (e: Event) => {
      const detail = (e as CustomEvent<PronRecordDebugPayload>).detail;
      if (!detail) return;
      setRecordDebugState((prev) => ({
        ...prev,
        lastEvent: `${detail.source}:${detail.phase}`,
        lastAt: Date.now(),
        hitTarget: detail.hitTarget ?? prev.hitTarget,
        handlerReached:
          detail.phase === "click" && detail.source === "captain-primary"
            ? true
            : prev.handlerReached,
      }));
    };
    window.addEventListener(PRON_RECORD_DEBUG_EVENT, onDebug);
    return () => window.removeEventListener(PRON_RECORD_DEBUG_EVENT, onDebug);
  }, [recordDebug]);

  const handleLevelTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, lvl: PracticeLevel) => {
    const unlocked = activeWord?.practiceLevel ?? 1;
    const idx = LEVELS.indexOf(lvl);
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    let next = idx;
    for (let i = 0; i < LEVELS.length; i += 1) {
      next = (next + dir + LEVELS.length) % LEVELS.length;
      if (LEVELS[next] <= unlocked) {
        setPracticeLevel(LEVELS[next]);
        tabRefs.current[next]?.focus();
        break;
      }
    }
  };

  const startMission = () => {
    const daily = getOrCreatePronunciationDailyMission();
    const m = missionFromDaily(words);
    setMission(m);
    setMissionProgress(daily.completedWords);
    setMissionLegActive(true);
    setShowDebrief(false);
    const nextWord =
      daily.words.find((w) => !daily.completedWords.includes(w.toLowerCase())) ??
      m.words[0]?.word.word;
    if (nextWord) {
      const match = words.find((w) => w.word.toLowerCase() === nextWord.toLowerCase());
      if (match) selectWord(match);
    }
  };

  if (!words.length) {
    return (
      <div className="pronunciation-leg">
        {browseMode && !activeWord && <CallsignDrillPanel initialOpen={callsignOpen} />}
        {browseMode && !activeWord && <VaultAddWordsForm onAdded={refresh} />}
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

  const pack = activeWord ? ensureWordContext(activeWord.word, activeWord.contextPack) : null;
  const wordStatus = activeWord ? deriveVaultWordStatus(activeWord) : null;
  const maxLevel = activeWord?.practiceLevel ?? 1;
  const missionTotal = mission?.words.length ?? 0;

  return (
    <div className="pronunciation-leg">
      {missionLegActive && missionTotal > 0 && (
        <p className="pron-mission-progress" aria-live="polite">
          Today&apos;s mission · {missionProgress.length}/{missionTotal} words
        </p>
      )}

      {browseMode && !activeWord && <CallsignDrillPanel initialOpen={callsignOpen} />}
      {browseMode && !activeWord && <VaultAddWordsForm onAdded={refresh} />}

      {!activeWord && !showDebrief && browseMode && (
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

      {activeWord && pack ? (
        <article className="card card-essential part2-card vault-practice-card">
          <div className="card-top">
            <div className="pron-level-tabs" role="tablist" aria-label="Practice level">
              {LEVELS.map((lvl, i) => (
                <button
                  key={lvl}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`pron-level-tab-${lvl}`}
                  aria-controls={LEVEL_PANEL_ID}
                  aria-selected={practiceLevel === lvl}
                  tabIndex={practiceLevel === lvl ? 0 : -1}
                  className={`pron-level-tab ${practiceLevel === lvl ? "active" : ""} ${lvl > maxLevel ? "locked" : ""}`}
                  onClick={() => lvl <= maxLevel && setPracticeLevel(lvl)}
                  onKeyDown={(e) => handleLevelTabKeyDown(e, lvl)}
                  disabled={lvl > maxLevel}
                >
                  L{lvl}: {levelLabel(lvl)}
                </button>
              ))}
            </div>

            <span className={`pron-word-status pron-word-status-${statusClass(wordStatus!)}`}>
              {statusLabel(wordStatus!)}
            </span>

            <div
              id={LEVEL_PANEL_ID}
              role="tabpanel"
              aria-labelledby={`pron-level-tab-${practiceLevel}`}
            >
            <h2 className="question">
              {practiceLevel === 1 && (
                <>
                  Word:{" "}
                  <CaptainDeltaTarget id="pronunciation-word" className="cdv-pronunciation-word">
                    {splitSyllables(activeWord.word).map((syll, i, arr) => (
                      <CaptainDeltaTarget
                        key={`${syll}-${i}`}
                        id={syllableTargetId(syll)}
                        className="cdv-syllable"
                      >
                        {syll}
                        {i < arr.length - 1 ? "·" : ""}
                      </CaptainDeltaTarget>
                    ))}
                  </CaptainDeltaTarget>
                </>
              )}
              {practiceLevel === 2 && <>Expression: {pack.expression}</>}
              {practiceLevel === 3 && <>Sentence: {pack.sentence}</>}
              {practiceLevel === 4 && <>ICAO: {pack.icaoPrompt}</>}
              <WordPhoneticHint word={activeWord.word} />
            </h2>

            {practiceLevel === 4 && (
              <p className="pron-model-fragment">
                Model fragment: <em>{pack.fragment}</em>
              </p>
            )}

            {captainNote && (
              <p className="pron-captain-feedback">Captain Delta: {captainNote}</p>
            )}

            {!missionLegActive && (
              <div className="vault-youglish-row">
                <YouGlishLink word={activeWord.word} />
              </div>
            )}
            <p className="part2-situation">Context: {activeWord.context || "—"}</p>
            </div>
          </div>

          <div className="card-body">
            {!configured && (
              <p className="voice-coach-warn">
                Azure Speech is not configured. Recording will not work until speech keys are set.
              </p>
            )}

            <div
              className={`pron-captain-recorder-panel pron-captain-recorder-panel--${micUi.visualState}`}
              role="status"
              aria-live="polite"
            >
              <p className="pron-captain-recorder-line">
                <span className="pron-captain-recorder-label">Captain Recorder</span>
                <span aria-hidden> · </span>
                <span
                  className={`pron-captain-recorder-status pron-captain-recorder-status--${micUi.visualState}`}
                >
                  {micUi.micStatusLine}
                </span>
              </p>
            </div>

            <div className="voice-coach-actions pronunciation-record-actions">
              {recordDebug && (
                <pre className="pron-record-debug" aria-live="polite">
                  {`captain recorder: ${micUi.primaryLabel} (${micUi.phase})
last event: ${recordDebugState.lastEvent}
handler reached: ${recordDebugState.handlerReached ? "yes" : "no"}
activeWord: ${activeWord?.word ?? "—"}
referenceText: ${activeWord ? practiceTextForLevel(activeWord, practiceLevel) : "—"}
controller.phase: ${recorderState.phase}
speech.speaking: ${String(speech.speaking)}
bridge owner: ${getRecordBridgeOwnerId() ?? "—"}
pathname: ${pathname}`}
                </pre>
              )}
              <button
                type="button"
                className="btn secondary"
                onClick={() => void recording.listen()}
                disabled={
                  speech.speaking ||
                  isPronunciationRecordingActive(recorderState.phase) ||
                  !speech.configured
                }
                aria-label="Listen to model pronunciation"
              >
                {speech.speaking ? "Playing…" : "Listen"}
              </button>
              {!missionLegActive && (
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => {
                    setActiveWord(null);
                    recording.reset();
                  }}
                  disabled={isPronunciationRecordingActive(recorderState.phase)}
                >
                  Back to list
                </button>
              )}
            </div>

            <p className="pron-record-trace" aria-live="polite">
              Last record click:{" "}
              {recordTraceLine
                ? `${new Date(recordTraceLine.at).toLocaleTimeString()} · stopped at ${recordTraceLine.step}${recordTraceLine.reason ? ` · ${recordTraceLine.reason}` : ""}`
                : "—"}
            </p>

            {(recordNotice || speech.error) && micUi.phase === "idle" && (
              <p className="pron-recording-state pron-recording-state-error" role="alert">
                {recordNotice ?? speech.error}
              </p>
            )}
            {(recorderState.phase === "error" ||
              (lastPracticeScore !== null && lastPracticeScore < 80)) && (
              <p className="pron-recovery-guidance">Listen → slow down → retry.</p>
            )}
            {lastPracticeScore !== null && (
              <p
                className={`vault-practice-result ${
                  lastPracticeScore >= VAULT_PASS_SCORE ? "good" : "bad"
                }`}
              >
                {lastPracticeScore}% — {levelLabel(practiceLevel)}
                {lastPracticeScore >= 90
                  ? " · Excellent"
                  : lastPracticeScore >= VAULT_PASS_SCORE
                    ? " · Good"
                    : " · Keep practicing"}
              </p>
            )}
            {activityNote && <p className="voice-coach-warn">{activityNote}</p>}

            {lastResult && (
              <div className="voice-coach-azure-scores vault-azure-scores">
                <div className="voice-score">
                  <strong>{lastResult.accuracyScore}</strong>
                  <span>accuracy</span>
                </div>
                <div className="voice-score">
                  <strong>{lastResult.fluencyScore}</strong>
                  <span>fluency</span>
                </div>
              </div>
            )}
            {lastResult?.words
              .filter((w) => w.errorType && w.errorType !== "None")
              .map((w) => (
                <p key={w.word} className="vault-word-azure-detail">
                  {w.word}: {w.accuracyScore}% — {errorTypeLabel(w.errorType)}
                </p>
              ))}
          </div>
        </article>
      ) : (
        !showDebrief &&
        browseMode && (
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
                      onClick={() => void speech.speak(item.word)}
                      disabled={speech.speaking || !speech.configured}
                    >
                      Listen
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
        )
      )}
    </div>
  );
}
