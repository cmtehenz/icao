"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CallsignDrillPanel from "@/components/Part2Trainer/CallsignDrillPanel";
import YouGlishLink from "@/components/YouGlishLink";
import WordPhoneticHint from "@/components/WordPhoneticHint";
import CaptainDeltaTarget from "@/components/CaptainDelta/Visual/CaptainDeltaTarget";
import { useAzurePronunciation } from "@/hooks/useAzurePronunciation";
import { useAzureSpeech } from "@/hooks/useAzureSpeech";
import { usePronunciationCaptainBridge } from "@/hooks/usePronunciationCaptainBridge";
import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import { errorTypeLabel } from "@/lib/azure/pronunciation";
import { emitCaptainDeltaSuggestion } from "@/lib/captainDelta/events";
import {
  clearActivePronunciationWord,
  publishActivePronunciationWord,
} from "@/lib/captainDelta/lessonContext";
import { buildPronunciationFocusPlan } from "@/lib/captainDelta/visual/plans";
import { emitVisualPlan } from "@/lib/captainDelta/visual/events";
import { splitSyllables, syllableTargetId } from "@/lib/captainDelta/visual/syllables";
import { ensureWordContext } from "@/lib/pronunciationContext";
import {
  captainFeedbackAfterAttempt,
  captainFeedbackBelowStoredLevel,
  CAPTAIN_MISSION_DEBRIEF,
  CAPTAIN_MISSION_INTRO,
  levelLabel,
  statusLabel,
} from "@/lib/pronunciationCoach";
import { deriveVaultWordStatus } from "@/lib/pronunciationGraduation";
import {
  buildDailyPronunciationMission,
  buildMissionDebrief,
  practiceTextForLevel,
  type PronunciationMission,
} from "@/lib/pronunciationMission";
import {
  getOrCreatePronunciationDailyMission,
  isPronunciationWordInTodayMission,
  markPronunciationDailyWordComplete,
  passesDailyMissionWordAttempt,
  PRONUNCIATION_DAILY_MISSION_EVENT,
} from "@/lib/pronunciationDailyMission";
import {
  addManualWordsToVault,
  loadVault,
  parseManualVaultInput,
  recordWordPractice,
  removeVaultWord,
  VAULT_CHANGE_EVENT,
  VAULT_PASS_SCORE,
  type PracticeLevel,
  type VaultWord,
} from "@/lib/pronunciationVault";
import { markWarmupSatisfied } from "@/lib/part2Warmup";
import {
  studyActivityRejectReason,
  tryRecordStudyActivity,
} from "@/lib/studyActivityRecord";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";

const LEVELS: PracticeLevel[] = [1, 2, 3, 4];
const AZURE_RECOVERY_GUIDANCE = "Listen → slow down → retry.";
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
  const searchParams = useSearchParams();
  const [words, setWords] = useState<VaultWord[]>([]);
  const [activeWord, setActiveWord] = useState<VaultWord | null>(null);
  const [practiceLevel, setPracticeLevel] = useState<PracticeLevel>(1);
  const [lastPracticeScore, setLastPracticeScore] = useState<number | null>(null);
  const [lastResult, setLastResult] = useState<AzurePronunciationResult | null>(null);
  const [activityNote, setActivityNote] = useState<string | null>(null);
  const [captainNote, setCaptainNote] = useState<string | null>(null);
  const [mission, setMission] = useState<PronunciationMission | null>(null);
  const [missionProgress, setMissionProgress] = useState<string[]>([]);
  const [missionLegActive, setMissionLegActive] = useState(false);
  const [showDebrief, setShowDebrief] = useState(false);
  const [assessingPending, setAssessingPending] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const azure = useAzurePronunciation();
  const speech = useAzureSpeech();
  const clearAzure = azure.clear;

  const refresh = useCallback(() => {
    const vault = loadVault();
    setWords(vault);
    const { mission: m, progress } = syncDailyMissionState(vault);
    setMission(m);
    setMissionProgress(progress);
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

  const selectWord = useCallback((item: VaultWord) => {
    const pack = ensureWordContext(item.word, item.contextPack);
    const enriched = { ...item, contextPack: pack };
    setActiveWord(enriched);
    setPracticeLevel(item.practiceLevel ?? 1);
    setLastPracticeScore(null);
    setLastResult(null);
    setCaptainNote(null);
    clearAzure();
    if (isPronunciationWordInTodayMission(item.word)) {
      setMissionLegActive(true);
    }
  }, [clearAzure]);

  const selectNextMissionWord = useCallback(
    (completedKeys: string[]) => {
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
      if (match) selectWord(match);
    },
    [selectWord],
  );

  useEffect(() => {
    const requested = searchParams.get("word")?.trim().toLowerCase();
    if (!requested || !words.length) return;
    const daily = getOrCreatePronunciationDailyMission();
    const m = missionFromDaily(words);
    setMission(m);
    setMissionProgress(daily.completedWords);
    if (daily.words.some((w) => w.toLowerCase() === requested)) {
      setMissionLegActive(true);
      setShowDebrief(false);
    }
    const match = words.find((w) => w.word.toLowerCase() === requested);
    if (match) selectWord(match);
  }, [searchParams, words, selectWord]);

  useEffect(() => {
    publishActivePronunciationWord(activeWord?.word ?? null);
  }, [activeWord?.word]);

  useEffect(() => {
    return () => clearActivePronunciationWord();
  }, []);

  const listenText = async (text: string) => {
    try {
      await speech.speak(text);
    } catch {
      /* speech.error */
    }
  };

  const startRecording = useCallback(async (level: PracticeLevel = practiceLevel) => {
    if (!activeWord) return;
    const text = practiceTextForLevel(activeWord, level);
    setPracticeLevel(level);
    setLastPracticeScore(null);
    setLastResult(null);
    setCaptainNote(null);
    setAssessingPending(false);
    const type = level >= 4 ? "part1" : "part2-readback";
    await azure.start(text, type);
  }, [activeWord, azure, practiceLevel]);

  const finishPractice = useCallback(async () => {
    if (!activeWord) return;
    setAssessingPending(true);
    try {
      const { assessment } = await azure.stop();

      if (!assessment) {
        const message = `Assessment unavailable. ${AZURE_RECOVERY_GUIDANCE}`;
        setCaptainNote(message);
        emitCaptainDeltaSuggestion({
          text: message,
          speechText: "Assessment unavailable. Listen to the model, slow down, then record again.",
          kind: "coaching",
          primaryAction: { id: "try_again", label: "Try again", primary: true },
          secondaryActions: [{ id: "slow_audio", label: "🎧 Slow Audio", primary: false }],
        });
        return;
      }

      const score = assessment.accuracyScore ?? 0;
      setLastPracticeScore(score);
      setLastResult(assessment);

      const outcome = recordWordPractice(activeWord.word, score, practiceLevel);
      refresh();

      const updated = loadVault().find((w) => w.word.toLowerCase() === activeWord.word.toLowerCase());
      const status = outcome.status;
      const belowLevel =
        updated && captainFeedbackBelowStoredLevel(updated, practiceLevel);
      const feedback =
        belowLevel ??
        captainFeedbackAfterAttempt(updated ?? activeWord, score, practiceLevel, status);

      const missionPass =
        missionLegActive &&
        mission &&
        isPronunciationWordInTodayMission(activeWord.word) &&
        passesDailyMissionWordAttempt(score, true);

      const recoveryHint = score < VAULT_PASS_SCORE ? ` ${AZURE_RECOVERY_GUIDANCE}` : "";
      const coachingText = feedback.message + recoveryHint;
      setCaptainNote(coachingText);
      emitCaptainDeltaSuggestion({
        text: coachingText,
        speechText: feedback.speechText,
        kind: "coaching",
        primaryAction: missionPass
          ? { id: "ready", label: "Continue", primary: true }
          : { id: "try_again", label: "Try again", primary: true },
        secondaryActions:
          score < VAULT_PASS_SCORE
            ? [{ id: "slow_audio", label: "🎧 Slow Audio", primary: false }]
            : [],
      });

      const ctx = { accuracy: score, recognizedText: assessment.recognizedText };
      const counted = tryRecordStudyActivity("pronunciation", ctx);
      setActivityNote(counted ? null : studyActivityRejectReason("pronunciation", ctx));

      if (score >= VAULT_PASS_SCORE) markWarmupSatisfied();

      if (score < 80 && practiceLevel === 1) {
        const syllables = splitSyllables(activeWord.word);
        const weakWord = assessment.words
          ?.slice()
          .sort((a, b) => a.accuracyScore - b.accuracyScore)[0]?.word;
        const weakSyllable =
          syllables.find((s) => weakWord?.toLowerCase().includes(s.toLowerCase())) ?? syllables[0];
        emitVisualPlan(buildPronunciationFocusPlan(activeWord.word, weakSyllable));
      }

      if (missionPass) {
        const daily = markPronunciationDailyWordComplete(activeWord.word);
        const next = [...daily.completedWords];
        setMissionProgress(next);
        if (outcome.removed) {
          setTimeout(() => selectNextMissionWord(next), 1200);
        } else {
          setTimeout(() => selectNextMissionWord(next), 800);
        }
        return;
      }

      if (outcome.removed) {
        setTimeout(() => setActiveWord(null), 2800);
      } else if (outcome.advancedLevel && updated) {
        setActiveWord(updated);
        setPracticeLevel(updated.practiceLevel ?? practiceLevel);
      }
    } finally {
      setAssessingPending(false);
    }
  }, [
    activeWord,
    azure,
    mission,
    missionLegActive,
    practiceLevel,
    refresh,
    selectNextMissionWord,
  ]);

  usePronunciationCaptainBridge({
    activeWord,
    practiceLevel,
    azureAssessing: azure.assessing,
    speechSpeaking: speech.speaking,
    azureConfigured: azure.configured,
    onStartRecord: () => void startRecording(practiceLevel),
    onStopRecord: () => void finishPractice(),
    onListen: () => {
      if (activeWord) void listenText(practiceTextForLevel(activeWord, practiceLevel));
    },
  });

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
        {browseMode && <CallsignDrillPanel initialOpen={callsignOpen} />}
        {browseMode && <VaultAddWordsForm onAdded={refresh} />}
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

      {browseMode && <CallsignDrillPanel initialOpen={callsignOpen} />}
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
            {!azure.configured && (
              <p className="voice-coach-warn">
                Azure Speech is not configured. Recording will not work until speech keys are set.
              </p>
            )}

            {azure.assessing && (
              <p className="pron-recording-state" role="status" aria-live="polite">
                Recording — speak clearly, then tap Stop &amp; assess.
              </p>
            )}
            {assessingPending && (
              <p className="pron-recording-state pron-recording-state-assessing" role="status" aria-live="polite">
                Assessing your recording…
              </p>
            )}

            <div className="voice-coach-actions pronunciation-record-actions">
              <button
                type="button"
                className="btn secondary"
                onClick={() => void listenText(practiceTextForLevel(activeWord, practiceLevel))}
                disabled={speech.speaking || azure.assessing || !speech.configured}
                aria-label="Listen to model pronunciation"
              >
                {speech.speaking ? "Playing…" : "Listen"}
              </button>
              {!azure.assessing ? (
                <button
                  type="button"
                  className="btn green"
                  onClick={() => void startRecording(practiceLevel)}
                  disabled={speech.speaking || !azure.configured || assessingPending}
                >
                  Record
                </button>
              ) : (
                <button
                  type="button"
                  className="btn orange"
                  onClick={() => void finishPractice()}
                  disabled={assessingPending}
                >
                  Stop &amp; assess
                </button>
              )}
              {!missionLegActive && (
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => {
                    setActiveWord(null);
                    azure.clear();
                  }}
                >
                  Back to list
                </button>
              )}
            </div>

            {(azure.error || speech.error) && (
              <p className="voice-coach-error">{azure.error || speech.error}</p>
            )}
            {(azure.error ||
              (lastPracticeScore !== null && lastPracticeScore < VAULT_PASS_SCORE) ||
              (captainNote?.includes("Assessment unavailable") ?? false)) && (
              <p className="pron-recovery-guidance">{AZURE_RECOVERY_GUIDANCE}</p>
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
                      onClick={() => void listenText(item.word)}
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
