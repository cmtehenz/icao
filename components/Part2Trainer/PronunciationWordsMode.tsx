"use client";

import { useSearchParams } from "next/navigation";
import CallsignDrillPanel from "@/components/Part2Trainer/CallsignDrillPanel";
import YouGlishLink from "@/components/YouGlishLink";
import WordPhoneticHint from "@/components/WordPhoneticHint";
import CaptainDeltaTarget from "@/components/CaptainDelta/Visual/CaptainDeltaTarget";
import { useAzurePronunciation } from "@/hooks/useAzurePronunciation";
import { useAzureSpeech } from "@/hooks/useAzureSpeech";
import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import { errorTypeLabel } from "@/lib/azure/pronunciation";
import { emitCaptainDeltaSuggestion } from "@/lib/captainDelta/events";
import { emitLessonContext } from "@/lib/captainDelta/lessonContext";
import { buildPronunciationFocusPlan } from "@/lib/captainDelta/visual/plans";
import { emitVisualPlan } from "@/lib/captainDelta/visual/events";
import { splitSyllables, syllableTargetId } from "@/lib/captainDelta/visual/syllables";
import { ensureWordContext } from "@/lib/pronunciationContext";
import {
  captainFeedbackAfterAttempt,
  CAPTAIN_MISSION_DEBRIEF,
  CAPTAIN_MISSION_INTRO,
  levelLabel,
  statusLabel,
} from "@/lib/pronunciationCoach";
import { deriveVaultWordStatus } from "@/lib/pronunciationGraduation";
import {
  buildDailyPronunciationMission,
  buildMissionDebrief,
  loadActiveMission,
  loadMissionProgress,
  practiceTextForLevel,
  saveActiveMission,
  saveMissionProgress,
  type PronunciationMission,
} from "@/lib/pronunciationMission";
import {
  addManualWordsToVault,
  loadVault,
  parseManualVaultInput,
  recordWordPractice,
  removeVaultWord,
  VAULT_CHANGE_EVENT,
  VAULT_PASS_SCORE,
  vaultStats,
  type PracticeLevel,
  type VaultWord,
} from "@/lib/pronunciationVault";
import { markWarmupSatisfied } from "@/lib/part2Warmup";
import {
  studyActivityRejectReason,
  tryRecordStudyActivity,
} from "@/lib/studyActivityRecord";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";

const LEVELS: PracticeLevel[] = [1, 2, 3, 4];

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
      setMessage("Digite ao menos uma palavra em inglês (separe várias com vírgula).");
      return;
    }
    const { added, updated, total } = addManualWordsToVault(input, context);
    setInput("");
    setContext("");
    onAdded();
    if (added > 0) {
      setMessage(
        `${added} palavra${added > 1 ? "s" : ""} adicionada${added > 1 ? "s" : ""}` +
          (updated > 0 ? ` · ${updated} atualizada${updated > 1 ? "s" : ""}` : "") +
          ` · ${total} no banco.`,
      );
    } else if (updated > 0) {
      setMessage(`${updated} palavra${updated > 1 ? "s" : ""} já no banco — contexto atualizado.`);
    }
  };

  return (
    <form className="vault-add-form" onSubmit={handleSubmit}>
      <h2>Adicionar palavras</h2>
      <p className="sub">
        Separe várias com vírgula — ex.: <em>helicopter, clearance, turbulence</em>
      </p>
      <label className="field">
        <span>Palavra(s)</span>
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
        <span>Contexto (opcional)</span>
        <input
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Part 1 — weather"
          autoComplete="off"
        />
      </label>
      <div className="vault-add-actions">
        <button type="submit" className="btn green" disabled={!input.trim()}>
          Adicionar ao banco
        </button>
      </div>
      {message && <p className="vault-add-message">{message}</p>}
    </form>
  );
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
  const [showDebrief, setShowDebrief] = useState(false);
  const azure = useAzurePronunciation();
  const speech = useAzureSpeech();

  const refresh = useCallback(() => setWords(loadVault()), []);

  useEffect(() => {
    refresh();
    setMission(loadActiveMission());
    setMissionProgress(loadMissionProgress());
    window.addEventListener(VAULT_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(VAULT_CHANGE_EVENT, refresh);
  }, [refresh]);

  useEffect(() => {
    const requested = searchParams.get("word")?.trim().toLowerCase();
    if (!requested || !words.length) return;
    const match = words.find((w) => w.word.toLowerCase() === requested);
    if (match) selectWord(match);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, words]);

  const stats = vaultStats(words);
  const debrief = useMemo(
    () => (mission ? buildMissionDebrief(mission, missionProgress) : null),
    [mission, missionProgress],
  );

  const selectWord = (item: VaultWord) => {
    const pack = ensureWordContext(item.word, item.contextPack);
    const enriched = { ...item, contextPack: pack };
    setActiveWord(enriched);
    setPracticeLevel(item.practiceLevel ?? 1);
    setLastPracticeScore(null);
    setLastResult(null);
    setCaptainNote(null);
    azure.clear();
    emitLessonContext({ mode: "pronunciation", pronunciationWord: enriched.word });
  };

  const listenText = async (text: string) => {
    try {
      await speech.speak(text);
    } catch {
      /* speech.error */
    }
  };

  const startRecording = async (level: PracticeLevel = practiceLevel) => {
    if (!activeWord) return;
    setPracticeLevel(level);
    setLastPracticeScore(null);
    setLastResult(null);
    setCaptainNote(null);
    const text = practiceTextForLevel(activeWord, level);
    const type = level >= 4 ? "part1" : "part2-readback";
    await azure.start(text, type);
  };

  const finishPractice = async () => {
    if (!activeWord) return;
    const { assessment } = await azure.stop();
    const score = assessment?.accuracyScore ?? 0;
    setLastPracticeScore(score);
    setLastResult(assessment);

    const outcome = recordWordPractice(activeWord.word, score, practiceLevel);
    refresh();

    const updated = loadVault().find((w) => w.word.toLowerCase() === activeWord.word.toLowerCase());
    const status = outcome.status;
    const feedback = captainFeedbackAfterAttempt(
      updated ?? activeWord,
      score,
      practiceLevel,
      status,
    );
    setCaptainNote(feedback.message);
    emitLessonContext({ mode: "pronunciation", pronunciationWord: activeWord.word });
    emitCaptainDeltaSuggestion({
      text: feedback.message,
      speechText: feedback.speechText,
      kind: "coaching",
      primaryAction: { id: "ready", label: "Continue", primary: true },
      secondaryActions: [],
    });

    const ctx = { accuracy: score, recognizedText: assessment?.recognizedText };
    const counted = tryRecordStudyActivity("pronunciation", ctx);
    setActivityNote(counted ? null : studyActivityRejectReason("pronunciation", ctx));

    if (score >= VAULT_PASS_SCORE) markWarmupSatisfied();

    if (score < 80 && practiceLevel === 1) {
      const syllables = splitSyllables(activeWord.word);
      const weakWord = assessment?.words
        ?.slice()
        .sort((a, b) => a.accuracyScore - b.accuracyScore)[0]?.word;
      const weakSyllable =
        syllables.find((s) => weakWord?.toLowerCase().includes(s.toLowerCase())) ?? syllables[0];
      emitVisualPlan(buildPronunciationFocusPlan(activeWord.word, weakSyllable));
    }

    if (mission) {
      const next = [...missionProgress, activeWord.word.toLowerCase()];
      setMissionProgress(next);
      saveMissionProgress(next);
      if (next.length >= mission.words.length) setShowDebrief(true);
    }

    if (outcome.removed) {
      setTimeout(() => setActiveWord(null), 2800);
    } else if (outcome.advancedLevel && updated) {
      setActiveWord(updated);
      setPracticeLevel(updated.practiceLevel ?? practiceLevel);
    }
  };

  const startMission = () => {
    const m = buildDailyPronunciationMission(words);
    saveActiveMission(m);
    setMission(m);
    setMissionProgress([]);
    setShowDebrief(false);
    if (m.words[0]) selectWord(m.words[0]!.word);
  };

  if (!words.length) {
    return (
      <div className="part2-mode">
        <CallsignDrillPanel initialOpen={searchParams.get("callsign") !== "0"} />
        <VaultAddWordsForm onAdded={refresh} />
        <div className="exam-pick-card">
          <h2>Palavras para treinar</h2>
          <p className="sub">
            Adicione manualmente ou use <strong>Falar e corrigir</strong> no Part 1/Part 2 — palavras
            com pronúncia abaixo de 40% entram no banco automaticamente.
          </p>
        </div>
      </div>
    );
  }

  const pack = activeWord ? ensureWordContext(activeWord.word, activeWord.contextPack) : null;
  const wordStatus = activeWord ? deriveVaultWordStatus(activeWord) : null;
  const maxLevel = activeWord?.practiceLevel ?? 1;

  return (
    <div className="part2-mode">
      <CallsignDrillPanel initialOpen={searchParams.get("callsign") !== "0"} />
      <VaultAddWordsForm onAdded={refresh} />

      {!activeWord && !showDebrief && (
        <section className="pron-mission-card">
          <p className="pron-mission-badge">👨‍✈️ Captain Delta</p>
          <p className="pron-mission-quote">&ldquo;{CAPTAIN_MISSION_INTRO}&rdquo;</p>
          <button type="button" className="btn purple" onClick={startMission}>
            Start Pronunciation Mission
          </button>
          {mission && (
            <p className="pron-mission-meta">
              Missão de hoje: {missionProgress.length}/{mission.words.length} palavras
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
            {debrief.nextFocus && (
              <li>
                <strong>Next mission:</strong> focus on {debrief.nextFocus}
              </li>
            )}
          </ul>
          <p className="pron-mission-quote">&ldquo;{CAPTAIN_MISSION_DEBRIEF}&rdquo;</p>
          <button
            type="button"
            className="btn secondary"
            onClick={() => {
              setShowDebrief(false);
              setMission(null);
            }}
          >
            Voltar ao banco
          </button>
        </section>
      )}

      <header className="part2-mode-head">
        <span className="badge">Pronúncia — aviation coach</span>
        <span className="part2-counter">{stats.total} palavras</span>
      </header>

      <div className="vault-stats-row pron-status-row">
        <span className="vault-stat critical">{stats.critical} Critical</span>
        <span className="vault-stat warn">{stats.needsPractice} &lt;80%</span>
        <span className="vault-stat">{stats.practicing} Practicing</span>
        <span className="vault-stat">{stats.useSentence + stats.useIcao} In context</span>
      </div>

      {activeWord && pack ? (
        <article className="card card-essential part2-card vault-practice-card">
          <div className="card-top">
            <div className="pron-level-tabs" role="tablist">
              {LEVELS.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  role="tab"
                  aria-selected={practiceLevel === lvl}
                  className={`pron-level-tab ${practiceLevel === lvl ? "active" : ""} ${lvl > maxLevel ? "locked" : ""}`}
                  onClick={() => lvl <= maxLevel && setPracticeLevel(lvl)}
                  disabled={lvl > maxLevel}
                >
                  L{lvl}: {levelLabel(lvl)}
                </button>
              ))}
            </div>

            <span className={`pron-word-status pron-word-status-${statusClass(wordStatus!)}`}>
              {statusLabel(wordStatus!)}
            </span>

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

            <div className="pron-smart-progress">
              <span>Smart graduation:</span>
              <span>{activeWord.pass90Count ?? 0}/2 ≥90%</span>
              <span>{activeWord.pass85Count ?? 0}/3 ≥85%</span>
              <span>{activeWord.pass80Count ?? activeWord.passCount}/5 ≥80%</span>
            </div>

            {captainNote && (
              <p className="pron-captain-feedback">👨‍✈️ Captain Delta: {captainNote}</p>
            )}

            <div className="vault-youglish-row">
              <YouGlishLink word={activeWord.word} />
            </div>
            <p className="part2-situation">Contexto: {activeWord.context || "—"}</p>
          </div>

          <div className="card-body">
            <div className="pron-practice-actions">
              <button
                type="button"
                className="btn green btn-sm"
                onClick={() => void startRecording(1)}
                disabled={azure.assessing}
              >
                Practice Word
              </button>
              <button
                type="button"
                className="btn secondary btn-sm"
                onClick={() => void startRecording(2)}
                disabled={azure.assessing || maxLevel < 2}
              >
                Practice Expression
              </button>
              <button
                type="button"
                className="btn secondary btn-sm"
                onClick={() => void startRecording(3)}
                disabled={azure.assessing || maxLevel < 2}
              >
                Practice Sentence
              </button>
              <button
                type="button"
                className="btn purple btn-sm"
                onClick={() => void startRecording(4)}
                disabled={azure.assessing || maxLevel < 3}
              >
                Use in ICAO Answer
              </button>
            </div>

            <div className="voice-coach-actions">
              <button
                type="button"
                className="btn secondary"
                onClick={() => void listenText(practiceTextForLevel(activeWord, practiceLevel))}
                disabled={speech.speaking || azure.assessing || !speech.configured}
              >
                {speech.speaking ? "🔊 Playing…" : "🔊 Listen"}
              </button>
              {!azure.assessing ? (
                <button
                  type="button"
                  className="btn green"
                  onClick={() => void startRecording(practiceLevel)}
                  disabled={speech.speaking}
                >
                  ● Gravar
                </button>
              ) : (
                <button type="button" className="btn orange" onClick={() => void finishPractice()}>
                  ⏹ Parar e avaliar
                </button>
              )}
              <button
                type="button"
                className="btn secondary"
                onClick={() => {
                  setActiveWord(null);
                  azure.clear();
                }}
              >
                Voltar à lista
              </button>
            </div>

            {(azure.error || speech.error) && (
              <p className="voice-coach-error">{azure.error || speech.error}</p>
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
        !showDebrief && (
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
                        treinos
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
                      🔊 Listen
                    </button>
                    <YouGlishLink word={item.word} compact />
                    <button type="button" className="btn green btn-sm" onClick={() => selectWord(item)}>
                      Practice in Context
                    </button>
                    <button
                      type="button"
                      className="btn secondary btn-sm"
                      onClick={() => {
                        removeVaultWord(item.word);
                        refresh();
                      }}
                    >
                      Remover
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
