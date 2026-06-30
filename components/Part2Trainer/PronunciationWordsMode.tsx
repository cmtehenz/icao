"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import YouGlishLink from "@/components/YouGlishLink";
import { useAzurePronunciation } from "@/hooks/useAzurePronunciation";
import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import { errorTypeLabel } from "@/lib/azure/pronunciation";
import {
  addManualWordsToVault,
  loadVault,
  parseManualVaultInput,
  recordWordPractice,
  removeVaultWord,
  VAULT_CHANGE_EVENT,
  VAULT_PASS_SCORE,
  VAULT_PASSES_TO_GRADUATE,
  vaultStats,
  type VaultWord,
} from "@/lib/pronunciationVault";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  studyActivityRejectReason,
  tryRecordStudyActivity,
} from "@/lib/studyActivityRecord";
import { markWarmupSatisfied } from "@/lib/part2Warmup";

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
      setMessage(`${updated} palavra${updated > 1 ? "s" : ""} já estava${updated > 1 ? "m" : ""} no banco — contexto atualizado.`);
    }
  };

  return (
    <form className="vault-add-form" onSubmit={handleSubmit}>
      <h2>Adicionar palavras</h2>
      <p className="sub">
        Digite termos de aviação para treinar. Separe várias com vírgula — ex.:{" "}
        <em>helicopter, autorotation, phraseology</em>
      </p>
      <label className="field">
        <span>Palavra(s)</span>
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setMessage(null);
          }}
          placeholder="helicopter, hover, check ride"
          autoComplete="off"
        />
      </label>
      <label className="field">
        <span>Contexto (opcional)</span>
        <input
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Part 1 — check ride"
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
  const [lastPracticeScore, setLastPracticeScore] = useState<number | null>(null);
  const [lastPassCount, setLastPassCount] = useState<number | null>(null);
  const [lastResult, setLastResult] = useState<AzurePronunciationResult | null>(null);
  const [activityNote, setActivityNote] = useState<string | null>(null);
  const azure = useAzurePronunciation();

  const refresh = useCallback(() => setWords(loadVault()), []);

  useEffect(() => {
    refresh();
    window.addEventListener(VAULT_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(VAULT_CHANGE_EVENT, refresh);
  }, [refresh]);

  useEffect(() => {
    const requested = searchParams.get("word")?.trim().toLowerCase();
    if (!requested || !words.length) return;
    const match = words.find((w) => w.word.toLowerCase() === requested);
    if (match) setActiveWord(match);
  }, [searchParams, words]);

  const stats = vaultStats(words);

  const selectWord = (item: VaultWord) => {
    setActiveWord(item);
    setLastPracticeScore(null);
    setLastPassCount(null);
    setLastResult(null);
    azure.clear();
  };

  const startRecording = async () => {
    if (!activeWord) return;
    setLastPracticeScore(null);
    setLastPassCount(null);
    setLastResult(null);
    await azure.start(activeWord.word, "part2-readback");
  };

  const finishPractice = async () => {
    if (!activeWord) return;
    const { assessment } = await azure.stop();
    const score = assessment?.accuracyScore ?? 0;
    setLastPracticeScore(score);
    setLastResult(assessment);
    const outcome = recordWordPractice(activeWord.word, score);
    setLastPassCount(outcome.passCount);
    refresh();
    const ctx = {
      accuracy: score,
      recognizedText: assessment?.recognizedText,
    };
    const counted = tryRecordStudyActivity("pronunciation", ctx);
    setActivityNote(counted ? null : studyActivityRejectReason("pronunciation", ctx));
    if (score >= VAULT_PASS_SCORE) {
      markWarmupSatisfied();
    }
    if (outcome.removed) {
      setTimeout(() => setActiveWord(null), 2500);
    }
  };

  const resetForRetry = () => {
    setLastPracticeScore(null);
    setLastPassCount(null);
    setLastResult(null);
    setActivityNote(null);
    azure.clear();
  };

  if (!words.length) {
    return (
      <div className="part2-mode">
        <VaultAddWordsForm onAdded={refresh} />
        <div className="exam-pick-card">
          <h2>Palavras para treinar</h2>
          <p className="sub">
            Ainda não há palavras salvas. Adicione manualmente acima ou use{" "}
            <strong>Falar e corrigir</strong> no Part 1/Part 2 — palavras com pronúncia fraca são
            salvas automaticamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="part2-mode">
      <VaultAddWordsForm onAdded={refresh} />
      <header className="part2-mode-head">
        <span className="badge">Pronúncia — banco de palavras</span>
        <span className="part2-counter">{stats.total} palavras</span>
      </header>

      <div className="vault-stats-row">
        <span className="vault-stat critical">{stats.critical} críticas (&lt;60%)</span>
        <span className="vault-stat warn">{stats.needsPractice} para treinar (&lt;80%)</span>
        <span className="vault-stat vault-stat-hint">
          Apagar banco em <Link href="/conta">Conta</Link>
        </span>
      </div>

      {activeWord ? (
        <article className="card card-essential part2-card vault-practice-card">
          <div className="card-top">
            <h2 className="question">Praticar: {activeWord.word}</h2>
            <p className="part2-hint vault-practice-steps">
              <span className="vault-step">1. Ouça no YouGlish</span>
              <span className="vault-step">2. Grave a palavra</span>
              <span className="vault-step">3. Veja a nota Azure</span>
              <span className="vault-step">4. Repita até 5× acima de {VAULT_PASS_SCORE}%</span>
            </p>
            <div className="vocab-recording-progress">
              <div className="vocab-recording-progress-head">
                <span>Progresso</span>
                <strong>
                  {(lastPassCount ?? activeWord.passCount)}/{VAULT_PASSES_TO_GRADUATE} aprovadas
                </strong>
              </div>
              <div className="daily-study-bar" aria-hidden>
                <div
                  className="daily-study-bar-fill"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        ((lastPassCount ?? activeWord.passCount) / VAULT_PASSES_TO_GRADUATE) * 100,
                      ),
                    )}%`,
                  }}
                />
              </div>
            </div>
            <div className="vault-youglish-row">
              <YouGlishLink word={activeWord.word} />
            </div>
            <p className="part2-situation">Contexto: {activeWord.context || "—"}</p>
            <p className="part2-meta-row">
              <span className="part2-tag">Última nota: {activeWord.lastAccuracy}%</span>
              <span className="part2-tag">Pior nota: {activeWord.lowestAccuracy}%</span>
              <span className="part2-tag">{activeWord.errorLabel}</span>
            </p>
          </div>
          <div className="card-body">
            <div className="voice-coach-actions">
              {!azure.assessing ? (
                <button type="button" className="btn green" onClick={startRecording}>
                  ● {lastPracticeScore !== null ? "Gravar novamente" : "Gravar palavra"}
                </button>
              ) : (
                <button type="button" className="btn orange" onClick={finishPractice}>
                  ⏹ Parar e avaliar (Azure)
                </button>
              )}
              {lastPracticeScore !== null && !azure.assessing && (
                <button type="button" className="btn secondary" onClick={resetForRetry}>
                  Limpar resultado
                </button>
              )}
              <button type="button" className="btn secondary" onClick={() => { setActiveWord(null); azure.clear(); }}>
                Voltar à lista
              </button>
            </div>
            {azure.error && <p className="voice-coach-error">{azure.error}</p>}
            {!azure.configured && (
              <p className="voice-coach-warn">Configure AZURE_SPEECH_KEY no .env para avaliar pronúncia.</p>
            )}
            {lastPracticeScore !== null && (
              <p
                className={`vault-practice-result ${
                  lastPracticeScore >= VAULT_PASS_SCORE ? "good" : "bad"
                }`}
              >
                {lastPracticeScore >= VAULT_PASS_SCORE
                  ? lastPassCount !== null && lastPassCount >= VAULT_PASSES_TO_GRADUATE
                    ? `Excelente — ${lastPracticeScore}%! ${VAULT_PASSES_TO_GRADUATE}/${VAULT_PASSES_TO_GRADUATE} — palavra removida da lista.`
                    : `Bom — ${lastPracticeScore}%! ${lastPassCount ?? activeWord.passCount}/${VAULT_PASSES_TO_GRADUATE} aprovadas. Continue treinando.`
                  : `${lastPracticeScore}% — ouça no YouGlish e grave novamente.`}
              </p>
            )}
            {activityNote && <p className="voice-coach-warn">{activityNote}</p>}
            {lastPracticeScore !== null && lastPracticeScore >= VAULT_PASS_SCORE && !activityNote && (
              <p className="study-activity-counted">✓ Contou na meta de hoje</p>
            )}
            {(lastResult || (azure.result && !lastResult)) && (
              <div className="voice-coach-azure-scores vault-azure-scores">
                <div className="voice-score">
                  <strong>{(lastResult ?? azure.result)!.accuracyScore}</strong>
                  <span>accuracy</span>
                </div>
                <div className="voice-score">
                  <strong>{(lastResult ?? azure.result)!.fluencyScore}</strong>
                  <span>fluency</span>
                </div>
                <div className="voice-score">
                  <strong>{(lastResult ?? azure.result)!.completenessScore}</strong>
                  <span>completeness</span>
                </div>
                <div className="voice-score">
                  <strong>{(lastResult ?? azure.result)!.prosodyScore}</strong>
                  <span>prosody</span>
                </div>
              </div>
            )}
            {lastResult?.recognizedText && (
              <p className="voice-coach-transcript vault-recognized">
                Azure ouviu: <em>{lastResult.recognizedText}</em>
              </p>
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
        <ul className="vault-word-list">
          {words.map((item) => (
            <li key={item.word} className={`vault-word-item ${item.lowestAccuracy < 60 ? "bad" : "warn"}`}>
              <div className="vault-word-top">
                <div className="vault-word-headline">
                  <strong className="vault-word-title">{item.word}</strong>
                  <span className={`vault-word-pct ${item.lowestAccuracy < 60 ? "bad" : "warn"}`}>
                    {item.lowestAccuracy}%
                  </span>
                </div>
                <div className="vault-word-meta">
                  <span className="vault-word-scores">
                    visto {item.timesSeen}x
                    {item.practiceCount > 0 && ` · ${item.practiceCount} treino${item.practiceCount > 1 ? "s" : ""}`}
                    {` · ${item.passCount}/${VAULT_PASSES_TO_GRADUATE} aprovadas`}
                  </span>
                  <span className="vault-word-error">{item.errorLabel}</span>
                  {item.context && <span className="vault-word-context">{item.context}</span>}
                </div>
              </div>
              <div className="vault-word-actions">
                <YouGlishLink word={item.word} compact />
                <button type="button" className="btn green btn-sm" onClick={() => selectWord(item)}>
                  Praticar
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
          ))}
        </ul>
      )}
    </div>
  );
}
