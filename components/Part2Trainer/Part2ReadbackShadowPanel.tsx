"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAzureSpeech } from "@/hooks/useAzureSpeech";
import {
  SHADOW_PEEL_PASS_SCORE,
  studyActivityRejectReason,
  tryRecordStudyActivity,
} from "@/lib/studyActivityRecord";
import { tryMarkPart2DailyMissionPractice } from "@/lib/part2MissionComplete";
import AudioCompareReplay from "@/components/study/AudioCompareReplay";
import { recordPart2RecordingScore } from "@/lib/part2Warmup";
import { addWordsToVault, VAULT_PASS_SCORE } from "@/lib/pronunciationVault";
import { collectScriptedShadowVaultCandidates } from "@/lib/azure/pronunciation";

type Phase = "idle" | "listening" | "waiting" | "recording" | "result";

type Props = {
  audioSrc: string;
  audioLabel: string;
  modelReadback: string;
  context: string;
  situationId: string;
  initialOpen?: boolean;
  recordingBlocked?: boolean;
  recordingBlockedMessage?: string;
  embedded?: boolean;
};

const WAIT_MS = 1000;

export default function Part2ReadbackShadowPanel({
  audioSrc,
  audioLabel,
  modelReadback,
  context,
  situationId,
  initialOpen = false,
  recordingBlocked = false,
  recordingBlockedMessage,
  embedded = false,
}: Props) {
  const azure = useAzureSpeech();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [open, setOpen] = useState(embedded || initialOpen);
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
    if (embedded || initialOpen) setOpen(true);
  }, [embedded, initialOpen]);

  const playAtcAudio = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!audioSrc) {
        reject(new Error("no audio"));
        return;
      }
      const audio = new Audio(audioSrc);
      audioRef.current = audio;
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error("audio error"));
      void audio.play().catch(reject);
    });
  }, [audioSrc]);

  const startShadow = async () => {
    if (!azure.configured || !audioSrc || recordingBlocked) return;
    setNote(null);
    setScore(null);
    setCounted(false);
    azure.clear();
    setPhase("listening");
    try {
      await playAtcAudio();
      setPhase("waiting");
      await new Promise((r) => setTimeout(r, WAIT_MS));
      setPhase("recording");
      await azure.startRecording(modelReadback);
    } catch {
      setPhase("idle");
      setNote("Não foi possível tocar o áudio ATC. Verifique os arquivos de prova.");
    }
  };

  const stopShadow = async () => {
    if (phase !== "recording") return;
    const { assessment, audioBlob } = await azure.stopRecording();
    setLastAudioBlob(audioBlob);
    const accuracy = assessment?.accuracyScore ?? 0;
    recordPart2RecordingScore(accuracy);
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
        part2MissionKind: "readback" as const,
      };
      tryMarkPart2DailyMissionPractice({
        part2MissionKind: "readback",
        situationId,
        accuracy,
        recognizedText: assessment.recognizedText,
      });
      const ok = tryRecordStudyActivity("shadowPart2", ctx);
      setCounted(ok);
      if (!ok) {
        setNote(studyActivityRejectReason("shadowPart2", ctx));
      }
      const candidates = collectScriptedShadowVaultCandidates(assessment, modelReadback);
      if (candidates.length) {
        addWordsToVault(candidates, context.slice(0, 80));
      }
    } else {
      setNote("Nenhuma avaliação — tente falar mais alto.");
    }
    setPhase("result");
  };

  if (!open && !embedded) {
    return (
      <button type="button" className="btn green peel-shadowing-toggle" onClick={() => setOpen(true)}>
        🔁 Shadow readback
      </button>
    );
  }

  return (
    <div className={`peel-shadowing-panel part2-readback-shadow ${embedded ? "embedded" : ""}`}>
      {!embedded && (
        <div className="peel-shadowing-head">
          <h3>Shadow readback — ouvir ATC → repetir</h3>
          <button type="button" className="btn secondary btn-sm" onClick={() => setOpen(false)}>
            Fechar
          </button>
        </div>
      )}

      {!azure.configured ? (
        <p className="voice-coach-warn">
          Configure Azure Speech para avaliar o readback.
        </p>
      ) : (
        <p className="peel-shadowing-sub">
          Ouça a clearance ({audioLabel}) → espere 1s → repita o readback modelo → nota Azure.
        </p>
      )}

      {recordingBlocked && (
        <p className="voice-coach-warn voice-coach-blocked">
          {recordingBlockedMessage ?? "Complete o warm-up de pronúncia antes do shadow."}
        </p>
      )}

      <p className="part2-readback-shadow-model">{modelReadback}</p>

      {note && <p className="voice-coach-warn">{note}</p>}

      <div className="peel-shadowing-active">
        <p className="peel-shadowing-phase">
          {phase === "listening" && "🔊 Ouvindo ATC…"}
          {phase === "waiting" && "⏳ Prepare o readback…"}
          {phase === "recording" && "● Repita o readback agora"}
          {phase === "result" && score && `Resultado: ${score.accuracy}% accuracy`}
          {phase === "idle" && "Pronto para começar"}
        </p>

        {phase === "idle" && (
          <button
            type="button"
            className="btn purple"
            disabled={!azure.configured || !audioSrc || recordingBlocked}
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
            {score.accuracy < SHADOW_PEEL_PASS_SCORE && (
              <p className="peel-shadowing-tip">
                Fale mais devagar e articule — o Azure precisa ouvir o readback completo.
              </p>
            )}
            {score.heard && (
              <p className="peel-shadowing-heard">
                <strong>Ouviu:</strong> {score.heard}
              </p>
            )}
            <AudioCompareReplay
              modelAudioUrl={audioSrc}
              modelText={modelReadback}
              userAudioBlob={lastAudioBlob}
              modelLabel="ATC"
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
