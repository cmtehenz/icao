"use client";

import { useCallback, useEffect, useState } from "react";
import AudioCompareReplay from "@/components/study/AudioCompareReplay";
import { useAzureSpeech } from "@/hooks/useAzureSpeech";
import {
  studyActivityRejectReason,
  tryRecordStudyActivity,
} from "@/lib/studyActivityRecord";
import { addWordsToVault, VAULT_PASS_SCORE } from "@/lib/pronunciationVault";
import { collectVaultWordCandidates } from "@/lib/azure/pronunciation";

type Phase = "idle" | "listening" | "waiting" | "recording" | "result";

type Props = {
  prompt: string;
  modelReport: string;
  context: string;
  situationId: string;
  initialOpen?: boolean;
};

const WAIT_MS = 1000;

export default function Part2InteractionShadowPanel({
  prompt,
  modelReport,
  context,
  situationId,
  initialOpen = false,
}: Props) {
  const azure = useAzureSpeech();
  const [open, setOpen] = useState(initialOpen);
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState<{
    accuracy: number;
    fluency: number;
    completeness: number;
    heard?: string;
  } | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [counted, setCounted] = useState(false);
  const [lastAudioBlob, setLastAudioBlob] = useState<Blob | null>(null);

  useEffect(() => {
    if (initialOpen) setOpen(true);
  }, [initialOpen]);

  const startShadow = useCallback(async () => {
    if (!azure.configured) return;
    setNote(null);
    setScore(null);
    setCounted(false);
    azure.clear();
    setPhase("listening");
    try {
      await azure.speak(prompt);
      setPhase("waiting");
      await new Promise((r) => setTimeout(r, WAIT_MS));
      setPhase("recording");
      await azure.startRecording(modelReport);
    } catch {
      setPhase("idle");
      setNote("Não foi possível iniciar o shadow. Verifique o Azure Speech.");
    }
  }, [azure, prompt, modelReport]);

  const stopShadow = async () => {
    if (phase !== "recording") return;
    const { assessment, audioBlob } = await azure.stopRecording();
    setLastAudioBlob(audioBlob);
    const accuracy = assessment?.accuracyScore ?? 0;
    setScore({
      accuracy,
      fluency: assessment?.fluencyScore ?? 0,
      completeness: assessment?.completenessScore ?? 0,
      heard: assessment?.recognizedText,
    });

    if (assessment) {
      const ctx = {
        accuracy,
        recognizedText: assessment.recognizedText,
        situationId,
      };
      const ok = tryRecordStudyActivity("shadowPart2", ctx);
      setCounted(ok);
      if (!ok) {
        setNote(studyActivityRejectReason("shadowPart2", ctx));
      }
      if (accuracy < VAULT_PASS_SCORE) {
        const candidates = collectVaultWordCandidates(assessment);
        if (candidates.length) {
          addWordsToVault(candidates, context.slice(0, 80));
        }
      }
    } else {
      setNote("Nenhuma avaliação — tente falar mais alto.");
    }
    setPhase("result");
  };

  if (!open) {
    return (
      <button type="button" className="btn green peel-shadowing-toggle" onClick={() => setOpen(true)}>
        🔁 Shadow interaction
      </button>
    );
  }

  return (
    <div className="peel-shadowing-panel part2-readback-shadow">
      <div className="peel-shadowing-head">
        <h3>Shadow interaction — ouvir cenário → reportar</h3>
        <button type="button" className="btn secondary btn-sm" onClick={() => setOpen(false)}>
          Fechar
        </button>
      </div>

      {!azure.configured ? (
        <p className="voice-coach-warn">Configure Azure Speech para avaliar o reporte.</p>
      ) : (
        <p className="peel-shadowing-sub">
          Ouça o cenário (TTS) → espere 1s → repita o reporte modelo → nota Azure.
        </p>
      )}

      <p className="part2-readback-shadow-model">{modelReport}</p>

      {note && <p className="voice-coach-warn">{note}</p>}

      <div className="peel-shadowing-active">
        <p className="peel-shadowing-phase">
          {phase === "listening" && "🔊 Ouvindo o cenário…"}
          {phase === "waiting" && "⏳ Prepare o reporte…"}
          {phase === "recording" && "● Reporte ao ATC agora"}
          {phase === "result" && score && `Resultado: ${score.accuracy}% accuracy`}
          {phase === "idle" && "Pronto para começar"}
        </p>

        {phase === "idle" && (
          <button
            type="button"
            className="btn purple"
            disabled={!azure.configured}
            onClick={() => void startShadow()}
          >
            Iniciar shadow
          </button>
        )}

        {phase === "recording" && (
          <button type="button" className="btn orange" onClick={() => void stopShadow()}>
            ⏹ Parar e avaliar
          </button>
        )}

        {phase === "result" && score && (
          <div className="peel-shadowing-result">
            <div className="voice-coach-azure-scores peel-shadowing-scores">
              <span>Accuracy {score.accuracy}%</span>
              <span>Fluency {score.fluency}%</span>
              <span>Complete {score.completeness}%</span>
            </div>
            {counted && <p className="study-activity-counted">✓ Contou na meta de hoje</p>}
            {score.heard && (
              <p className="peel-shadowing-heard">
                <strong>Ouviu:</strong> {score.heard}
              </p>
            )}
            <AudioCompareReplay
              modelText={modelReport}
              userAudioBlob={lastAudioBlob}
              modelLabel="Modelo"
              userLabel="Você"
            />
            <button type="button" className="btn green btn-sm" onClick={() => void startShadow()}>
              Tentar de novo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
