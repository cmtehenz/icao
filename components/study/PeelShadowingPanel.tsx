"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import YouGlishLink from "@/components/YouGlishLink";
import WordPhoneticHint from "@/components/WordPhoneticHint";
import AudioCompareReplay from "@/components/study/AudioCompareReplay";
import { useAzureSpeech } from "@/hooks/useAzureSpeech";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import {
  SHADOW_PEEL_PASS_SCORE,
  studyActivityRejectReason,
  tryRecordStudyActivity,
} from "@/lib/studyActivityRecord";
import {
  collectScriptedShadowVaultCandidates,
  type VaultWordCandidate,
} from "@/lib/azure/pronunciation";
import { compareTranscriptToModel } from "@/lib/evaluate/compareAnswer";
import { getPeelBlocks, type PeelBlock, type PeelBlockId } from "@/lib/peelBlocks";
import { peelBlockActivityKey } from "@/lib/shadowPeelDedup";
import { getPeelBlockHistory, recordPeelBlockAttempt } from "@/lib/peelBlockHistory";
import { addWordsToVault, VAULT_PASS_SCORE } from "@/lib/pronunciationVault";
import type { Card } from "@/lib/types";
import { speakText } from "@/lib/tts";
import { highlightConnectors } from "@/utils/highlightConnectors";

type Phase = "idle" | "listening" | "waiting" | "recording" | "result";

type BlockScore = {
  accuracy: number;
  fluency: number;
  completeness: number;
  heard?: string;
  weakWords?: VaultWordCandidate[];
};

type Props = {
  card: Card;
  question: string;
  initialOpen?: boolean;
  initialBlockId?: PeelBlockId | null;
  embedded?: boolean;
};

const WAIT_MS = 1000;

export default function PeelShadowingPanel({
  card,
  question,
  initialOpen = false,
  initialBlockId = null,
  embedded = false,
}: Props) {
  const blocks = useMemo(() => getPeelBlocks(card), [card]);
  const azure = useAzureSpeech();
  const speech = useSpeechRecognition("en-US");
  const [usesAzure, setUsesAzure] = useState(true);
  const recordingModeRef = useRef<"azure" | "browser">("azure");
  const [open, setOpen] = useState(embedded || initialOpen);
  const [activeId, setActiveId] = useState<PeelBlockId | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [scores, setScores] = useState<Partial<Record<PeelBlockId, BlockScore>>>({});
  const [vaultNote, setVaultNote] = useState<string | null>(null);
  const [activityNote, setActivityNote] = useState<string | null>(null);
  const [lastAudioBlob, setLastAudioBlob] = useState<Blob | null>(null);
  const [runAllIndex, setRunAllIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/azure-speech-token")
      .then((r) => r.json())
      .then((d: { configured?: boolean }) => setUsesAzure(Boolean(d.configured)))
      .catch(() => setUsesAzure(false));
  }, []);

  const speakModel = useCallback(
    async (text: string) => {
      if (usesAzure) {
        try {
          await azure.speak(text);
          return;
        } catch {
          /* browser TTS fallback */
        }
      }
      await new Promise<void>((resolve) => {
        if (!speakText(text, resolve)) resolve();
      });
    },
    [azure, usesAzure],
  );

  const canRecord = usesAzure || speech.supported;

  useEffect(() => {
    if (embedded || initialOpen) setOpen(true);
  }, [embedded, initialOpen]);

  useEffect(() => {
    if (!initialBlockId) return;
    setOpen(true);
    setActiveId(initialBlockId);
  }, [initialBlockId]);

  const activeBlock = blocks.find((b) => b.id === activeId) ?? null;
  const activeScore = activeId ? scores[activeId] : undefined;

  const resetSession = useCallback(() => {
    azure.clear();
    setActiveId(null);
    setPhase("idle");
    setVaultNote(null);
    setActivityNote(null);
    setRunAllIndex(null);
  }, [azure]);

  useEffect(() => {
    azure.clear();
    setActiveId(null);
    setPhase("idle");
    setVaultNote(null);
    setActivityNote(null);
    setRunAllIndex(null);
    setScores({});
    const history = getPeelBlockHistory(card.num);
    const fromHistory: Partial<Record<PeelBlockId, BlockScore>> = {};
    for (const [id, record] of Object.entries(history)) {
      fromHistory[id as PeelBlockId] = {
        accuracy: record.lastAccuracy,
        fluency: 0,
        completeness: 0,
      };
    }
    setScores(fromHistory);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when card changes
  }, [card.num]);

  const saveWeakWords = (
    block: PeelBlock,
    assessment: NonNullable<typeof azure.result>,
  ) => {
    const candidates = collectScriptedShadowVaultCandidates(assessment, block.text);
    if (!candidates.length) return [];
    const { added, updated } = addWordsToVault(
      candidates,
      `${question.slice(0, 40)} — ${block.label}`,
    );
    const n = added + updated;
    if (n > 0) {
      setVaultNote(
        `${n} palavra${n > 1 ? "s" : ""} salva${n > 1 ? "s" : ""} no banco de pronúncia.`,
      );
    }
    return candidates;
  };

  const applyBlockScore = (
    block: PeelBlock,
    accuracy: number,
    heard: string,
    weakWords: VaultWordCandidate[] = [],
    fluency = 0,
    completeness = 0,
  ) => {
    recordPeelBlockAttempt(card.num, block.id, accuracy);
    setScores((prev) => ({
      ...prev,
      [block.id]: { accuracy, fluency, completeness, heard, weakWords },
    }));
    const ctx = {
      accuracy,
      recognizedText: heard,
      peelBlockKey: peelBlockActivityKey(card.num, block.id),
      cardNum: card.num,
    };
    const counted = tryRecordStudyActivity("shadow", ctx);
    if (!counted) {
      setActivityNote(studyActivityRejectReason("shadow", ctx));
    } else {
      setActivityNote(null);
    }
  };

  const startBlock = async (block: PeelBlock, indexForRunAll: number | null = null) => {
    if (!canRecord) return;
    setVaultNote(null);
    setActivityNote(null);
    setActiveId(block.id);
    setRunAllIndex(indexForRunAll);
    await azure.clear();
    speech.clear();
    setPhase("listening");
    try {
      await speakModel(block.text);
      setPhase("waiting");
      await new Promise((r) => setTimeout(r, WAIT_MS));
      setPhase("recording");
      if (usesAzure) {
        try {
          await azure.startRecording(block.text);
          recordingModeRef.current = "azure";
          return;
        } catch {
          /* browser speech fallback */
        }
      }
      speech.start();
      recordingModeRef.current = "browser";
    } catch {
      setPhase("idle");
      setRunAllIndex(null);
    }
  };

  const stopBlock = async () => {
    if (!activeBlock || phase !== "recording") return;

    if (recordingModeRef.current === "azure") {
      const { assessment, audioBlob } = await azure.stopRecording();
      setLastAudioBlob(audioBlob);
      const accuracy = assessment?.accuracyScore ?? 0;

      if (assessment) {
        const weakWords = saveWeakWords(activeBlock, assessment);
        applyBlockScore(
          activeBlock,
          accuracy,
          assessment.recognizedText,
          weakWords,
          assessment.fluencyScore ?? 0,
          assessment.completenessScore ?? 0,
        );
      } else {
        setScores((prev) => ({
          ...prev,
          [activeBlock.id]: { accuracy: 0, fluency: 0, completeness: 0 },
        }));
        setActivityNote("Não ouvimos este bloco — grave de novo com o microfone mais perto.");
      }
      setPhase("result");
      return;
    }

    speech.stop();
    await new Promise((r) => setTimeout(r, 400));
    const heard = speech.transcript.trim();
    const compare = compareTranscriptToModel(heard, activeBlock.text);
    const accuracy = compare.overlapPercent;
    applyBlockScore(activeBlock, accuracy, heard, [], accuracy, accuracy);
    setLastAudioBlob(null);
    setPhase("result");
  };

  const goNextInRunAll = () => {
    if (runAllIndex === null) return;
    const next = runAllIndex + 1;
    if (next >= blocks.length) {
      setRunAllIndex(null);
      setActiveId(null);
      setPhase("idle");
      return;
    }
    void startBlock(blocks[next], next);
  };

  const startRunAll = () => {
    if (!blocks.length) return;
    setScores({});
    void startBlock(blocks[0], 0);
  };

  const averageScore = useMemo(() => {
    const values = Object.values(scores);
    if (!values.length) return null;
    return Math.round(values.reduce((sum, s) => sum + s.accuracy, 0) / values.length);
  }, [scores]);

  if (!open && !embedded) {
    return (
      <button
        type="button"
        className="btn green peel-shadowing-toggle"
        onClick={() => setOpen(true)}
      >
        🔁 Shadowing PEEL
      </button>
    );
  }

  return (
    <div className={`peel-shadowing-panel ${embedded ? "embedded" : ""}`}>
      {!embedded && (
        <div className="peel-shadowing-head">
          <h3>Shadowing PEEL — bloco a bloco</h3>
          <button type="button" className="btn secondary btn-sm" onClick={() => setOpen(false)}>
            Fechar
          </button>
        </div>
      )}

      <p className="peel-shadowing-sub">
        Ouça o bloco → espere 1s → repita em voz alta → veja a nota. Cada bloco com ≥
        {SHADOW_PEEL_PASS_SCORE}% conta na meta (máx. 1× por bloco/dia).
      </p>

      {!canRecord && (
        <p className="peel-shadowing-sub">
          Use Chrome ou Edge no desktop para gravar e avaliar cada bloco.
        </p>
      )}

      <div className="peel-shadowing-actions">
        <button
          type="button"
          className="btn purple btn-sm"
          disabled={!canRecord || phase === "listening" || phase === "recording"}
          onClick={startRunAll}
        >
          Treinar todos ({blocks.length})
        </button>
        {averageScore !== null && (
          <span className="peel-shadowing-avg">
            Média: <strong>{averageScore}%</strong> ({Object.keys(scores).length}/{blocks.length})
          </span>
        )}
      </div>

      <ol className="peel-shadowing-blocks">
        {blocks.map((block) => {
          const blockScore = scores[block.id];
          const isActive = activeId === block.id;
          return (
            <li
              key={block.id}
              className={`peel-shadowing-block ${block.color}-b ${isActive ? "active" : ""} ${
                initialBlockId === block.id ? "highlight" : ""
              } ${
                blockScore ? (blockScore.accuracy >= VAULT_PASS_SCORE ? "good" : "warn") : ""
              }`}
            >
              <div className="peel-shadowing-block-head">
                <span className="peel-shadowing-block-label">{block.label}</span>
                {blockScore && (
                  <span
                    className={`peel-shadowing-block-score ${
                      blockScore.accuracy >= VAULT_PASS_SCORE ? "good" : "warn"
                    }`}
                  >
                    {blockScore.accuracy}%
                  </span>
                )}
              </div>
              <p className="peel-shadowing-block-text">{highlightConnectors(block.text)}</p>
              {!isActive && (
                <button
                  type="button"
                  className="btn secondary btn-sm"
                  disabled={!canRecord || phase === "listening" || phase === "recording"}
                  onClick={() => void startBlock(block)}
                >
                  Treinar este bloco
                </button>
              )}
            </li>
          );
        })}
      </ol>

      {activeBlock && phase !== "idle" && (
        <div className="peel-shadowing-active">
          <p className="peel-shadowing-phase">
            {phase === "listening" && "🔊 Ouvindo o modelo…"}
            {phase === "waiting" && "⏳ Prepare-se para repetir…"}
            {phase === "recording" && "● Repita agora — toque Parar quando terminar"}
            {phase === "result" && activeScore && `Resultado: ${activeScore.accuracy}% accuracy`}
          </p>

          {phase === "recording" && (
            <button type="button" className="btn orange" onClick={() => void stopBlock()}>
              ⏹ Parar e avaliar
            </button>
          )}

          {phase === "result" && activeScore && (
            <div className="peel-shadowing-result">
              <div className="voice-coach-azure-scores peel-shadowing-scores">
                <div className="voice-score">
                  <strong>{activeScore.accuracy}</strong>
                  <span>accuracy</span>
                </div>
                <div className="voice-score">
                  <strong>{activeScore.fluency}</strong>
                  <span>fluency</span>
                </div>
                <div className="voice-score">
                  <strong>{activeScore.completeness}</strong>
                  <span>completeness</span>
                </div>
              </div>
              {activeScore.heard && (
                <>
                  <p className="voice-coach-transcript">
                    <strong>Ouvimos:</strong> {activeScore.heard}
                  </p>
                  {(() => {
                    const compare = compareTranscriptToModel(activeScore.heard!, activeBlock.text);
                    if (
                      !compare.missingContentWords.length &&
                      !compare.extraContentWords.length
                    ) {
                      return null;
                    }
                    return (
                      <div className="shadow-block-compare">
                        <h4>Comparação com o bloco</h4>
                        {compare.missingContentWords.length > 0 && (
                          <p className="shadow-block-compare-missing">
                            <strong>Faltaram no script:</strong>{" "}
                            {compare.missingContentWords.join(", ")}
                          </p>
                        )}
                        {compare.extraContentWords.length > 0 && (
                          <p className="shadow-block-compare-extra">
                            <strong>Palavras diferentes:</strong>{" "}
                            {compare.extraContentWords.join(", ")}
                          </p>
                        )}
                      </div>
                    );
                  })()}
                </>
              )}

              <div className="voice-coach-mispronounced">
                <h4>Palavras para treinar na pronúncia</h4>
                {activeScore.weakWords && activeScore.weakWords.length > 0 ? (
                  <ul className="mispronounced-list">
                    {activeScore.weakWords.map((w) => (
                      <li
                        key={`${w.word}-${w.errorType}`}
                        className={`mispronounced-item ${w.accuracyScore < 60 ? "bad" : "warn"}`}
                      >
                        <span className="mispronounced-word">
                          {w.word}
                          <WordPhoneticHint word={w.word} className="vault-word-phonetic" />
                        </span>
                        <span className="mispronounced-score">{w.accuracyScore}%</span>
                        <span className="mispronounced-error">{w.errorLabel}</span>
                        <YouGlishLink word={w.word} compact />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mispronounced-none">
                    Nenhuma palavra difícil detectada neste bloco.
                  </p>
                )}
              </div>

              {activeScore.accuracy < VAULT_PASS_SCORE && (
                <p className="peel-shadowing-tip">
                  Abaixo de {VAULT_PASS_SCORE}% — ouça palavras difíceis no YouGlish e tente de novo.
                </p>
              )}
              {vaultNote && <p className="vault-saved-banner">{vaultNote}</p>}
              {activityNote && <p className="voice-coach-warn">{activityNote}</p>}
              {activeScore.accuracy >= SHADOW_PEEL_PASS_SCORE && (
                <p className="study-activity-counted">✓ Contou na meta de hoje</p>
              )}
              <AudioCompareReplay
                modelText={activeBlock.text}
                userAudioBlob={lastAudioBlob}
                modelLabel="Modelo"
                userLabel="Você"
              />
              <div className="voice-coach-actions">
                <button
                  type="button"
                  className="btn green"
                  onClick={() => void startBlock(activeBlock)}
                >
                  Repetir bloco
                </button>
                {runAllIndex !== null ? (
                  <button type="button" className="btn purple" onClick={goNextInRunAll}>
                    {runAllIndex + 1 < blocks.length ? "Próximo bloco →" : "Concluir"}
                  </button>
                ) : (
                  <button type="button" className="btn secondary" onClick={resetSession}>
                    Voltar à lista
                  </button>
                )}
              </div>
              {activeScore.weakWords && activeScore.weakWords.length > 0 && (
                <div className="peel-shadowing-youglish">
                  <YouGlishLink word={activeScore.weakWords[0].word} />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {azure.error && <p className="voice-coach-error">{azure.error}</p>}
    </div>
  );
}
