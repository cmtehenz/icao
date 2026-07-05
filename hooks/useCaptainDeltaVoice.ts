"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { synthesizeExamMp3, stopAzureSpeech, type AzureVoiceRole } from "@/lib/azure/azureTts";
import { warnCaptain } from "@/lib/captainDelta/devLog";
import { isCaptainDeltaVoiceEnabled } from "@/lib/captainDelta/voiceConfig";
import { speakText as browserSpeak, stopSpeaking as browserStop } from "@/lib/tts";

export type VoicePlaybackState = "idle" | "loading" | "playing" | "paused" | "error";

export type VoiceSpeakChannel = "azure-client" | "server" | "browser" | "disabled" | "none";

export type VoiceSpeakResult = {
  ok: boolean;
  channel: VoiceSpeakChannel;
  error?: string;
};

const CAPTAIN_VOICE: AzureVoiceRole = "captain_delta";

export function useCaptainDeltaVoice() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const lastTextRef = useRef("");
  const [state, setState] = useState<VoicePlaybackState>("idle");
  const [lastChannel, setLastChannel] = useState<VoiceSpeakChannel>("none");
  const [lastError, setLastError] = useState<string | null>(null);
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
    async (blob: Blob, channel: VoiceSpeakChannel): Promise<boolean> => {
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
      audio.onerror = () => {
        setState("error");
        setLastError("Audio playback failed");
        warnCaptain("voice", "Audio element playback error");
      };

      if (mutedRef.current) {
        setState("playing");
        setLastChannel(channel);
        return true;
      }

      try {
        await audio.play();
        setLastChannel(channel);
        return true;
      } catch (err) {
        setState("error");
        const message = err instanceof Error ? err.message : "Autoplay blocked";
        setLastError(message);
        warnCaptain("voice", "Audio play() rejected — try Play in the coaching card", err);
        return false;
      }
    },
    [cleanupBlob],
  );

  const speak = useCallback(
    async (text: string): Promise<VoiceSpeakResult> => {
      const trimmed = text.trim();
      if (!trimmed) {
        return { ok: false, channel: "none", error: "empty text" };
      }

      if (!isCaptainDeltaVoiceEnabled()) {
        warnCaptain("voice", "Voice disabled via NEXT_PUBLIC_CAPTAIN_DELTA_VOICE_ENABLED");
        return { ok: false, channel: "disabled", error: "voice disabled" };
      }

      lastTextRef.current = trimmed;
      stop();
      setState("loading");
      setLastError(null);

      try {
        const blob = await synthesizeExamMp3(trimmed, CAPTAIN_VOICE);
        if (blob) {
          const played = await playBlob(blob, "azure-client");
          return played
            ? { ok: true, channel: "azure-client" }
            : { ok: false, channel: "azure-client", error: "playback failed" };
        }
        warnCaptain("voice", "Client Azure TTS returned no audio — trying /api/tts");
      } catch (err) {
        warnCaptain("voice", "Client Azure TTS failed — trying /api/tts", err);
      }

      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: trimmed, voiceType: CAPTAIN_VOICE }),
        });
        if (res.ok) {
          const played = await playBlob(await res.blob(), "server");
          return played
            ? { ok: true, channel: "server" }
            : { ok: false, channel: "server", error: "playback failed" };
        }
        warnCaptain("voice", `/api/tts returned ${res.status} — trying browser SpeechSynthesis`);
      } catch (err) {
        warnCaptain("voice", "/api/tts request failed — trying browser SpeechSynthesis", err);
      }

      if (mutedRef.current) {
        setState("playing");
        setLastChannel("browser");
        return { ok: true, channel: "browser" };
      }

      const browserOk = browserSpeak(trimmed);
      if (browserOk) {
        setState("playing");
        setLastChannel("browser");
        return { ok: true, channel: "browser" };
      }

      setState("error");
      const message = "Browser speech synthesis unavailable";
      setLastError(message);
      warnCaptain("voice", message);
      return { ok: false, channel: "none", error: message };
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
    return speak(lastTextRef.current);
  }, [speak]);

  const toggleMute = useCallback(() => {
    setMuted((m) => !m);
  }, []);

  return {
    state,
    muted,
    lastChannel,
    lastError,
    speak,
    pause,
    resume,
    replay,
    stop,
    toggleMute,
    lastText: lastTextRef.current,
  };
}
