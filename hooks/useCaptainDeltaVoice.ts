"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { synthesizeExamMp3, stopAzureSpeech, type AzureVoiceRole } from "@/lib/azure/azureTts";
import { warnCaptain } from "@/lib/captainDelta/devLog";
import { shouldAbortCaptainSpeak } from "@/lib/captainDelta/voiceGeneration";
import { detachHtmlAudio } from "@/lib/captainDelta/voicePlayback";
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
  const speakGenerationRef = useRef(0);
  const fetchAbortRef = useRef<AbortController | null>(null);
  const playingGenerationRef = useRef(0);

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

  const cancelPlayback = useCallback((): number => {
    speakGenerationRef.current += 1;
    const generation = speakGenerationRef.current;

    fetchAbortRef.current?.abort();
    fetchAbortRef.current = null;

    stopAzureSpeech();
    browserStop();

    detachHtmlAudio(audioRef.current);
    audioRef.current = null;
    cleanupBlob();

    playingGenerationRef.current = 0;
    setState("idle");
    setLastError(null);
    return generation;
  }, [cleanupBlob]);

  const stop = useCallback(() => {
    cancelPlayback();
  }, [cancelPlayback]);

  useEffect(() => () => {
    cancelPlayback();
  }, [cancelPlayback]);

  const playBlob = useCallback(
    async (blob: Blob, channel: VoiceSpeakChannel, generation: number): Promise<boolean> => {
      if (shouldAbortCaptainSpeak(generation, speakGenerationRef.current)) return false;

      detachHtmlAudio(audioRef.current);
      audioRef.current = null;
      cleanupBlob();

      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.muted = mutedRef.current;
      playingGenerationRef.current = generation;

      audio.onended = () => {
        if (shouldAbortCaptainSpeak(generation, speakGenerationRef.current)) return;
        if (playingGenerationRef.current !== generation) return;
        setState("idle");
        playingGenerationRef.current = 0;
      };
      audio.onpause = () => {
        if (shouldAbortCaptainSpeak(generation, speakGenerationRef.current)) return;
        if (playingGenerationRef.current !== generation) return;
        if (audio.currentTime > 0 && audio.currentTime < audio.duration) {
          setState("paused");
        }
      };
      audio.onplay = () => {
        if (shouldAbortCaptainSpeak(generation, speakGenerationRef.current)) return;
        if (playingGenerationRef.current !== generation) return;
        setState("playing");
      };
      audio.onerror = () => {
        if (shouldAbortCaptainSpeak(generation, speakGenerationRef.current)) return;
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
        if (shouldAbortCaptainSpeak(generation, speakGenerationRef.current)) {
          detachHtmlAudio(audio);
          if (audioRef.current === audio) audioRef.current = null;
          cleanupBlob();
          return false;
        }
        setLastChannel(channel);
        return true;
      } catch (err) {
        if (shouldAbortCaptainSpeak(generation, speakGenerationRef.current)) {
          return false;
        }
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

      const generation = cancelPlayback();
      lastTextRef.current = trimmed;
      setState("loading");

      const stale = () => shouldAbortCaptainSpeak(generation, speakGenerationRef.current);
      const controller = new AbortController();
      fetchAbortRef.current = controller;

      try {
        const blob = await synthesizeExamMp3(trimmed, CAPTAIN_VOICE);
        if (stale()) {
          return { ok: false, channel: "none", error: "stale" };
        }
        if (blob) {
          const played = await playBlob(blob, "azure-client", generation);
          if (stale()) {
            return { ok: false, channel: "none", error: "stale" };
          }
          return played
            ? { ok: true, channel: "azure-client" }
            : { ok: false, channel: "azure-client", error: "playback failed" };
        }
        warnCaptain("voice", "Client Azure TTS returned no audio — trying /api/tts");
      } catch (err) {
        if (stale()) {
          return { ok: false, channel: "none", error: "stale" };
        }
        warnCaptain("voice", "Client Azure TTS failed — trying /api/tts", err);
      }

      if (stale()) {
        return { ok: false, channel: "none", error: "stale" };
      }

      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: trimmed, voiceType: CAPTAIN_VOICE }),
          signal: controller.signal,
        });
        if (stale()) {
          return { ok: false, channel: "none", error: "stale" };
        }
        if (res.ok) {
          const played = await playBlob(await res.blob(), "server", generation);
          if (stale()) {
            return { ok: false, channel: "none", error: "stale" };
          }
          return played
            ? { ok: true, channel: "server" }
            : { ok: false, channel: "server", error: "playback failed" };
        }
        warnCaptain("voice", `/api/tts returned ${res.status} — trying browser SpeechSynthesis`);
      } catch (err) {
        if (stale() || (err instanceof DOMException && err.name === "AbortError")) {
          return { ok: false, channel: "none", error: "stale" };
        }
        warnCaptain("voice", "/api/tts request failed — trying browser SpeechSynthesis", err);
      }

      if (stale()) {
        return { ok: false, channel: "none", error: "stale" };
      }

      if (mutedRef.current) {
        setState("playing");
        setLastChannel("browser");
        return { ok: true, channel: "browser" };
      }

      browserStop();
      const browserOk = browserSpeak(trimmed);
      if (stale()) {
        browserStop();
        return { ok: false, channel: "none", error: "stale" };
      }
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
    [cancelPlayback, playBlob],
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
    cancelPlayback,
    toggleMute,
    lastText: lastTextRef.current,
  };
}
