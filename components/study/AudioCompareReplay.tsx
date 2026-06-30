"use client";

import { useCallback, useRef, useState } from "react";
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAll = useCallback(() => {
    stopSpeaking();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlaying(false);
    setStep("idle");
  }, []);

  const playUser = useCallback(() => {
    if (!userAudioBlob) return;
    setStep("user");
    const url = URL.createObjectURL(userAudioBlob);
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onended = () => {
      URL.revokeObjectURL(url);
      stopAll();
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      stopAll();
    };
    void audio.play();
  }, [stopAll, userAudioBlob]);

  const playModel = useCallback(() => {
    if (modelAudioUrl) {
      setStep("model");
      const audio = new Audio(modelAudioUrl);
      audioRef.current = audio;
      audio.onended = () => {
        audioRef.current = null;
        playUser();
      };
      audio.onerror = () => stopAll();
      void audio.play().catch(() => stopAll());
      return;
    }

    if (!modelText?.trim()) {
      playUser();
      return;
    }

    setStep("model");
    const ok = speakText(modelText, () => {
      playUser();
    });
    if (!ok) playUser();
  }, [modelAudioUrl, modelText, playUser, stopAll]);

  const startCompare = () => {
    if (!userAudioBlob || playing) return;
    if (!modelText?.trim() && !modelAudioUrl) return;
    setPlaying(true);
    playModel();
  };

  if (!userAudioBlob) return null;

  return (
    <div className="audio-compare-replay">
      <button
        type="button"
        className="btn secondary btn-sm"
        disabled={playing || (!modelText?.trim() && !modelAudioUrl)}
        onClick={startCompare}
      >
        {playing
          ? step === "model"
            ? `▶ ${modelLabel}…`
            : `▶ ${userLabel}…`
          : `🔊 Comparar: ${modelLabel} → ${userLabel}`}
      </button>
      {playing && (
        <button type="button" className="btn secondary btn-sm" onClick={stopAll}>
          Parar
        </button>
      )}
    </div>
  );
}
