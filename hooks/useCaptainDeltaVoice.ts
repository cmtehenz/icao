"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { synthesizeExamMp3, stopAzureSpeech, type AzureVoiceRole } from "@/lib/azure/azureTts";
import { speakText as browserSpeak, stopSpeaking as browserStop } from "@/lib/tts";

export type VoicePlaybackState = "idle" | "loading" | "playing" | "paused" | "error";

const CAPTAIN_VOICE: AzureVoiceRole = "captain_delta";

export function useCaptainDeltaVoice() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const lastTextRef = useRef("");
  const [state, setState] = useState<VoicePlaybackState>("idle");
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);

  useEffect(() => {
    mutedRef.current = muted;
    const audio = audioRef.current;
    if (audio) audio.muted = muted;
  }, [muted]);

  const cleanupBlob = useCallback(() => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    stopAzureSpeech();
    browserStop();
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    cleanupBlob();
    setState("idle");
  }, [cleanupBlob]);

  useEffect(() => () => stop(), [stop]);

  const playBlob = useCallback(
    (blob: Blob) => {
      cleanupBlob();
      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.muted = mutedRef.current;

      audio.onended = () => setState("idle");
      audio.onpause = () => {
        if (audio.currentTime > 0 && audio.currentTime < audio.duration) {
          setState("paused");
        }
      };
      audio.onplay = () => setState("playing");
      audio.onerror = () => setState("error");

      if (mutedRef.current) {
        setState("playing");
        return;
      }

      void audio.play().catch(() => setState("error"));
    },
    [cleanupBlob],
  );

  const speak = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      lastTextRef.current = trimmed;
      stop();
      setState("loading");

      const blob = await synthesizeExamMp3(trimmed, CAPTAIN_VOICE);
      if (blob) {
        playBlob(blob);
        return;
      }

      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: trimmed, voiceType: CAPTAIN_VOICE }),
        });
        if (res.ok) {
          playBlob(await res.blob());
          return;
        }
      } catch {
        /* fallback below */
      }

      if (mutedRef.current) {
        setState("playing");
        return;
      }

      browserSpeak(trimmed);
      setState("playing");
    },
    [playBlob, stop],
  );

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      audio.pause();
      setState("paused");
      return;
    }
    browserStop();
    setState("paused");
  }, []);

  const resume = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.paused && audio.currentTime > 0) {
      if (!mutedRef.current) void audio.play();
      setState("playing");
    }
  }, []);

  const replay = useCallback(() => {
    void speak(lastTextRef.current);
  }, [speak]);

  const toggleMute = useCallback(() => {
    setMuted((m) => !m);
  }, []);

  return {
    state,
    muted,
    speak,
    pause,
    resume,
    replay,
    stop,
    toggleMute,
    lastText: lastTextRef.current,
  };
}
