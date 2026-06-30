"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import YouGlishLink from "@/components/YouGlishLink";
import AudioCompareReplay from "@/components/study/AudioCompareReplay";
import { useAzureSpeech } from "@/hooks/useAzureSpeech";
import {
  SHADOW_PEEL_PASS_SCORE,
  studyActivityRejectReason,
  tryRecordStudyActivity,
} from "@/lib/studyActivityRecord";
import { collectVaultWordCandidates } from "@/lib/azure/pronunciation";
import { getPeelBlocks, type PeelBlock, type PeelBlockId } from "@/lib/peelBlocks";
import { peelBlockActivityKey } from "@/lib/shadowPeelDedup";
import { getPeelBlockHistory, recordPeelBlockAttempt } from "@/lib/peelBlockHistory";
import { addWordsToVault, VAULT_PASS_SCORE } from "@/lib/pronunciationVault";
import type { Card } from "@/lib/types";
import { highlightConnectors } from "@/utils/highlightConnectors";

type Phase = "idle" | "listening" | "waiting" | "recording" | "result";

type BlockScore = {
  accuracy: number;
  fluency: number;
  completeness: number;
  heard?: string;
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
  const [open, setOpen] = useState(embedded || initialOpen);
  const [activeId, setActiveId] = useState<PeelBlockId | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [scores, setScores] = useState<Partial<Record<PeelBlockId, BlockScore>>>({});
  const [vaultNote, setVaultNote] = useState<string | null>(null);
  const [activityNote, setActivityNote] = useState<string | null>(null);
  const [lastAudioBlob, setLastAudioBlob] = useState<Blob | null>(null);
  const [runAllIndex, setRunAllIndex] = useState<number | null>(null);

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
    accuracy: number,
  ) => {
    if (accuracy >= VAULT_PASS_SCORE) return;
    const candidates = collectVaultWordCandidates(assessment);
    if (!candidates.length) return;
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
  };

  const startBlock = async (block: PeelBlock, indexForRunAll: number | null = null) => {
    setVaultNote(null);
    setActivityNote(null);
    setActiveId(block.id);
    setRunAllIndex(indexForRunAll);
    await azure.clear();
    setPhase("listening");
    try {
      await azure.speak(block.text);
      setPhase("waiting");
      await new Promise((r) => setTimeout(r, WAIT_MS));
      setPhase("recording");
      await azure.startRecording(block.text);
    } catch {
      setPhase("idle");
      setRunAllIndex(null);
    }
  };

  const stopBlock = async () => {
    if (!activeBlock || phase !== "recording") return;
    const { assessment, audioBlob } = await azure.stopRecording();
    setLastAudioBlob(audioBlob);
    const accuracy = assessment?.accuracyScore ?? 0;
    setScores((prev) => ({
      ...prev,
      [activeBlock.id]: {
        accuracy,
        fluency: assessment?.fluencyScore ?? 0,
        completeness: assessment?.completenessScore ?? 0,
        heard: assessment?.recognizedText,
      },
    }));
    if (assessment) {
      recordPeelBlockAttempt(card.num, activeBlock.id, accuracy);
      saveWeakWords(activeBlock, assessment, accuracy);
      const ctx = {
        accuracy,
        recognizedText: assessment.recognizedText,
        peelBlockKey: peelBlockActivityKey(card.num, activeBlock.id),
      };
      const counted = tryRecordStudyActivity("shadow", ctx);
      if (!counted) {
        setActivityNote(studyActivityRejectReason("shadow", ctx));
      } else {
        setActivityNote(null);
      }
    } else {
      setActivityNote("Azure não avaliou este bloco — grave de novo com o microfone mais perto.");
    }
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

      {!azure.configured ? (
        <p className="voice-coach-warn">
          Configure <code>AZURE_SPEECH_KEY</code> e <code>AZURE_SPEECH_REGION</code> para ouvir e
          avaliar cada bloco.
        </p>
      ) : (
        <p className="peel-shadowing-sub">
          Ouça o bloco (Azure) → espere 1s → repita em voz alta → veja a nota de pronúncia. Cada
          bloco com ≥{SHADOW_PEEL_PASS_SCORE}% conta +1 pt na meta (máx. 1× por bloco/dia).
        </p>
      )}

      <div className="peel-shadowing-actions">
        <button
          type="button"
          className="btn purple btn-sm"
          disabled={!azure.configured || phase === "listening" || phase === "recording"}
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
                  disabled={!azure.configured || phase === "listening" || phase === "recording"}
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
                <p className="voice-coach-transcript">
                  <strong>Azure ouviu:</strong> {activeScore.heard}
                </p>
              )}
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
              {activeScore.accuracy < VAULT_PASS_SCORE && (
                <div className="peel-shadowing-youglish">
                  <YouGlishLink
                    word={
                      activeBlock.text.split(/\s+/).find((w) => w.length > 5)?.replace(/[^\w-]/g, "") ??
                      "aviation"
                    }
                  />
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
