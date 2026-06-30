"use client";

import { useCallback, useRef, useState } from "react";
import { synthesizeAzureSpeech } from "@/lib/azure/synthesizeSpeech";
import { speakText, stopSpeaking } from "@/lib/tts";

type Props = {
  modelText?: string;
  modelAudioUrl?: string;
  userAudioBlob: Blob | null;
  modelLabel?: string;
  userLabel?: string;
};

export default function AudioCompareReplay({
  modelText,
  modelAudioUrl,
  userAudioBlob,
  modelLabel = "Modelo",
  userLabel = "Você",
}: Props) {
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState<"idle" | "model" | "user">("idle");
  const [loadingModel, setLoadingModel] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAll = useCallback(() => {
    stopSpeaking();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlaying(false);
    setLoadingModel(false);
    setStep("idle");
  }, []);

  const playBlob = useCallback(
    (blob: Blob, onDone: () => void) => {
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        URL.revokeObjectURL(url);
        audioRef.current = null;
        onDone();
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        stopAll();
      };
      void audio.play().catch(() => stopAll());
    },
    [stopAll],
  );

  const playUser = useCallback(() => {
    if (!userAudioBlob) return;
    setStep("user");
    playBlob(userAudioBlob, stopAll);
  }, [playBlob, stopAll, userAudioBlob]);

  const playModelFromUrl = useCallback(
    (url: string) => {
      setStep("model");
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        audioRef.current = null;
        playUser();
      };
      audio.onerror = () => stopAll();
      void audio.play().catch(() => stopAll());
    },
    [playUser, stopAll],
  );

  const playModel = useCallback(async () => {
    if (modelAudioUrl) {
      playModelFromUrl(modelAudioUrl);
      return;
    }

    if (!modelText?.trim()) {
      playUser();
      return;
    }

    setLoadingModel(true);
    const azureBlob = await synthesizeAzureSpeech(modelText);
    setLoadingModel(false);

    if (azureBlob) {
      setStep("model");
      playBlob(azureBlob, playUser);
      return;
    }

    setStep("model");
    const ok = speakText(modelText, () => {
      playUser();
    });
    if (!ok) playUser();
  }, [modelAudioUrl, modelText, playBlob, playModelFromUrl, playUser]);

  const startCompare = () => {
    if (!userAudioBlob || playing || loadingModel) return;
    if (!modelText?.trim() && !modelAudioUrl) return;
    setPlaying(true);
    void playModel();
  };

  if (!userAudioBlob) return null;

  return (
    <div className="audio-compare-replay">
      <button
        type="button"
        className="btn secondary btn-sm"
        disabled={playing || loadingModel || (!modelText?.trim() && !modelAudioUrl)}
        onClick={startCompare}
      >
        {loadingModel
          ? "Preparando modelo…"
          : playing
            ? step === "model"
              ? `▶ ${modelLabel}…`
              : `▶ ${userLabel}…`
            : `🔊 Comparar: ${modelLabel} → ${userLabel}`}
      </button>
      {(playing || loadingModel) && (
        <button type="button" className="btn secondary btn-sm" onClick={stopAll}>
          Parar
        </button>
      )}
    </div>
  );
}
