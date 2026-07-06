"use client";

import { usePathname } from "next/navigation";
import YouGlishLink from "@/components/YouGlishLink";
import WordPhoneticHint from "@/components/WordPhoneticHint";
import CaptainDeltaTarget from "@/components/CaptainDelta/Visual/CaptainDeltaTarget";
import { usePronunciationRecordingController } from "@/hooks/usePronunciationRecordingController";
import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import { errorTypeLabel } from "@/lib/azure/pronunciation";
import { getRecordBridgeOwnerId } from "@/lib/captainDelta/lessonContext";
import {
  PRON_RECORD_DEBUG_EVENT,
  type PronRecordDebugPayload,
} from "@/lib/captainDelta/recordRuntimeDebug";
import {
  RECORD_TRACE_EVENT,
  type RecordTracePayload,
} from "@/lib/captainDelta/pronunciationRecordTrace";
import { splitSyllables, syllableTargetId } from "@/lib/captainDelta/visual/syllables";
import { missionCardStatusLine } from "@/lib/pronunciation/missionCardStatusLine";
import { ensureWordContext } from "@/lib/pronunciationContext";
import { deriveVaultWordStatus } from "@/lib/pronunciationGraduation";
import {
  isPracticeLevelUnlocked,
  practiceLevelAfterVaultRefresh,
  unlockedPracticeLevel,
} from "@/lib/pronunciation/practiceLevelSelection";
import { practiceTextForLevel, type PronunciationMission } from "@/lib/pronunciationMission";
import {
  isPronunciationRecordingActive,
  type PronunciationRecordingPhase,
} from "@/lib/pronunciation/pronunciationRecordingController";
import { levelLabel, statusLabel } from "@/lib/pronunciationCoach";
import {
  VAULT_PASS_SCORE,
  type PracticeLevel,
  type VaultWord,
} from "@/lib/pronunciationVault";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

const LEVELS: PracticeLevel[] = [1, 2, 3, 4];
const LEVEL_PANEL_ID = "pron-level-panel";

function statusClass(status: ReturnType<typeof deriveVaultWordStatus>): string {
  if (status === "critical") return "critical";
  if (status === "needs_review") return "review";
  if (status === "use_sentence" || status === "use_icao") return "context";
  if (status === "new") return "new";
  return "practicing";
}

type Props = {
  activeWord: VaultWord;
  practiceLevel: PracticeLevel;
  missionLegActive: boolean;
  mission: PronunciationMission | null;
  recordDebug: boolean;
  userLevelOverrideRef: React.MutableRefObject<boolean>;
  onPracticeLevelChange: (level: PracticeLevel) => void;
  onVaultRefresh: () => void;
  onMissionProgress: (completed: string[]) => void;
  onSelectNextMissionWord: (completed: string[]) => void;
  onWordAdvanced: (word: VaultWord, level: PracticeLevel) => void;
  onWordCleared: () => void;
  onPracticeLevelBelowStored: (level: PracticeLevel) => void;
  onClearWord: () => void;
};

export default function PronunciationLessonSession({
  activeWord,
  practiceLevel,
  missionLegActive,
  mission,
  recordDebug,
  userLevelOverrideRef,
  onPracticeLevelChange,
  onVaultRefresh,
  onMissionProgress,
  onSelectNextMissionWord,
  onWordAdvanced,
  onWordCleared,
  onPracticeLevelBelowStored,
  onClearWord,
}: Props) {
  const pathname = usePathname();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const recorderPhaseRef = useRef<PronunciationRecordingPhase>("idle");
  const [lastPracticeScore, setLastPracticeScore] = useState<number | null>(null);
  const [lastResult, setLastResult] = useState<AzurePronunciationResult | null>(null);
  const [recordTraceLine, setRecordTraceLine] = useState<{
    at: number;
    step: string;
    reason: string;
  } | null>(null);
  const [recordDebugState, setRecordDebugState] = useState({
    lastEvent: "—",
    lastAt: 0,
    hitTarget: "—",
    handlerReached: false,
  });

  const recording = usePronunciationRecordingController({
    activeWord,
    practiceLevel,
    missionLegActive,
    mission,
    onVaultRefresh,
    onMissionProgress,
    onSelectNextMissionWord,
    onWordAdvanced,
    onWordCleared,
    onPracticeLevelBelowStored,
  });

  recorderPhaseRef.current = recording.state.phase;

  const {
    micUi,
    captainNote,
    captainDebrief,
    recordNotice,
    activityNote,
    azureEnvMissing,
    state: recorderState,
  } = recording;

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

  const pack = ensureWordContext(activeWord.word, activeWord.contextPack);
  const wordStatus = deriveVaultWordStatus(activeWord);
  const maxLevel = unlockedPracticeLevel(activeWord);

  const handleLevelTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, lvl: PracticeLevel) => {
    const unlocked = unlockedPracticeLevel(activeWord);
    const idx = LEVELS.indexOf(lvl);
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    let next = idx;
    for (let i = 0; i < LEVELS.length; i += 1) {
      next = (next + dir + LEVELS.length) % LEVELS.length;
      if (LEVELS[next] <= unlocked) {
        userLevelOverrideRef.current = true;
        onPracticeLevelChange(LEVELS[next]);
        tabRefs.current[next]?.focus();
        break;
      }
    }
  };

  return (
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
              onClick={() => {
                if (!isPracticeLevelUnlocked(activeWord, lvl)) return;
                userLevelOverrideRef.current = true;
                onPracticeLevelChange(lvl);
              }}
              onKeyDown={(e) => handleLevelTabKeyDown(e, lvl)}
              disabled={lvl > maxLevel}
            >
              L{lvl}: {levelLabel(lvl)}
            </button>
          ))}
        </div>

        <span className={`pron-word-status pron-word-status-${statusClass(wordStatus)}`}>
          {statusLabel(wordStatus)}
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

          {captainDebrief && (
            <div className="pron-captain-coaching-card">
              <h3 className="pron-captain-coaching-title">Captain feedback</h3>
              <p className="pron-captain-coaching-message">{captainDebrief.message}</p>
              {captainDebrief.focusLabel && (
                <p className="pron-captain-coaching-focus">Focus: {captainDebrief.focusLabel}</p>
              )}
              {captainDebrief.showYouGlish && captainDebrief.youGlishQuery && (
                <YouGlishLink
                  word={captainDebrief.youGlishQuery}
                  compact
                  label="Watch real examples"
                  className="pron-captain-youglish"
                />
              )}
              <details className="pron-captain-technical">
                <summary>Technical details</summary>
                <p>{captainDebrief.technicalDetails}</p>
              </details>
            </div>
          )}
          {!captainDebrief && captainNote && (
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
        {azureEnvMissing && (
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
            <span className="pron-captain-recorder-status-label">Status:</span>{" "}
            <span
              className={`pron-captain-recorder-status pron-captain-recorder-status--${micUi.visualState}`}
            >
              {missionCardStatusLine(recorderState.phase)}
            </span>
          </p>
        </div>

        <div className="voice-coach-actions pronunciation-record-actions">
          {recordDebug && (
            <pre className="pron-record-debug" aria-live="polite">
              {`captain recorder: ${micUi.primaryLabel} (${micUi.phase})
last event: ${recordDebugState.lastEvent}
handler reached: ${recordDebugState.handlerReached ? "yes" : "no"}
activeWord: ${activeWord.word}
referenceText: ${practiceTextForLevel(activeWord, practiceLevel)}
controller.phase: ${recorderState.phase}
bridge owner: ${getRecordBridgeOwnerId() ?? "—"}
pathname: ${pathname}`}
            </pre>
          )}
          <button
            type="button"
            className="btn secondary"
            onClick={() => void recording.listen()}
            disabled={isPronunciationRecordingActive(recorderState.phase)}
            aria-label="Listen to model pronunciation"
          >
            Listen
          </button>
          {!missionLegActive && (
            <button
              type="button"
              className="btn secondary"
              onClick={() => {
                onClearWord();
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

        {recordNotice && micUi.phase === "idle" && (
          <p className="pron-recording-state pron-recording-state-error" role="alert">
            {recordNotice}
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
  );
}
