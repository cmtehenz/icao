"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ExamAudioItem, FullExamId, ListeningMode } from "@/lib/fullExamListening/types";
import { getExamPlaylist } from "@/data/fullExams";
import {
  loadListeningProgress,
  markExamCompleted,
  saveListeningProgress,
} from "@/lib/fullExamListening/progress";
import {
  beginSpeechSession,
  getExamAudioSession,
  pauseSpeech,
  playExamOriginalAudio,
  resumeSpeech,
  speakText,
  stopSpeech,
} from "@/utils/speech";
import type { VoiceType } from "@/utils/speech";

export type PlayerStatus = "idle" | "playing" | "paused" | "waiting_reveal" | "waiting_shadow" | "error";

type Options = {
  examId: FullExamId;
  mode: ListeningMode;
  startIndex?: number;
  onComplete?: () => void;
};

function voiceForItem(item: ExamAudioItem): VoiceType {
  if (item.speaker === "male_candidate") return "male_candidate";
  return "female_examiner";
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function useFullExamPlayer({ examId, mode, startIndex = 0, onComplete }: Options) {
  const items = getExamPlaylist(examId);
  const indexRef = useRef(startIndex);
  const speedRef = useRef(1);
  const modeRef = useRef(mode);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runLockRef = useRef(false);
  const userInterruptedRef = useRef(false);

  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [status, setStatus] = useState<PlayerStatus>("idle");
  const [speed, setSpeed] = useState(1);
  const [showTranscript, setShowTranscript] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const currentItem = items[currentIndex] ?? null;
  const progressPct = items.length ? Math.round((currentIndex / items.length) * 100) : 0;

  const isActiveSession = useCallback((ticket: number) => getExamAudioSession() === ticket, []);

  const clearPauseTimer = useCallback(() => {
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
  }, []);

  const beginSession = useCallback(() => {
    clearPauseTimer();
    setPlaybackError(null);
    userInterruptedRef.current = false;
    const ticket = beginSpeechSession();
    runLockRef.current = true;
    setStatus("playing");
    return ticket;
  }, [clearPauseTimer]);

  const endSession = useCallback(() => {
    userInterruptedRef.current = true;
    runLockRef.current = false;
    stopSpeech();
    clearPauseTimer();
  }, [clearPauseTimer]);

  const goToIndex = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    indexRef.current = clamped;
    setCurrentIndex(clamped);
    saveListeningProgress({ lastExamId: examId, lastItemIndex: clamped });
  }, [examId, items.length]);

  const stop = useCallback(() => {
    endSession();
    setStatus("idle");
  }, [endSession]);

  const failPlayback = useCallback((message: string) => {
    setPlaybackError(message);
    runLockRef.current = false;
    setStatus("error");
  }, []);

  const playPause = useCallback(
    (seconds: number, ticket: number) =>
      new Promise<void>((resolve) => {
        if (!isActiveSession(ticket)) {
          resolve();
          return;
        }
        clearPauseTimer();
        pauseTimerRef.current = setTimeout(() => {
          pauseTimerRef.current = null;
          resolve();
        }, seconds * 1000 / speedRef.current);
      }),
    [clearPauseTimer, isActiveSession],
  );

  const playTts = useCallback(
    async (text: string, voice: VoiceType, ticket: number): Promise<boolean> => {
      if (!isActiveSession(ticket)) return false;
      const ok = await speakText(text, voice, {
        rate: speedRef.current,
        ticket,
        onError: (err) => setPlaybackError(err),
      });
      return ok && isActiveSession(ticket);
    },
    [isActiveSession],
  );

  const playAudioFile = useCallback(
    async (src: string, ticket: number): Promise<boolean> => {
      if (!isActiveSession(ticket) || !src) return false;
      const ok = await playExamOriginalAudio(src, speedRef.current, ticket);
      return ok && isActiveSession(ticket);
    },
    [isActiveSession],
  );

  const playShadowSentences = useCallback(
    async (text: string, ticket: number): Promise<boolean> => {
      for (const sentence of splitSentences(text)) {
        if (!isActiveSession(ticket)) return false;
        setStatus("playing");
        const ok = await playTts(sentence, "male_candidate", ticket);
        if (!ok) return false;
        if (!isActiveSession(ticket)) return false;
        setStatus("waiting_shadow");
        await playPause(3, ticket);
      }
      return true;
    },
    [isActiveSession, playPause, playTts],
  );

  const shouldSkipModel = (item: ExamAudioItem) =>
    modeRef.current === "question_only" && item.type === "model_answer";

  const playItem = useCallback(
    async (item: ExamAudioItem, ticket: number): Promise<"next" | "wait_reveal" | "fail"> => {
      if (!isActiveSession(ticket)) return "fail";

      if (shouldSkipModel(item)) {
        setStatus("waiting_reveal");
        return "wait_reveal";
      }

      if (item.type === "pause") {
        await playPause(item.pauseSeconds ?? 1, ticket);
        return isActiveSession(ticket) ? "next" : "fail";
      }

      if (item.type === "original_audio" && item.audioSrc) {
        setStatus("playing");
        const ok = await playAudioFile(item.audioSrc, ticket);
        if (!ok) return "fail";
        return "next";
      }

      if (!item.text) return "next";

      if (modeRef.current === "shadowing" && item.type === "model_answer") {
        setStatus("playing");
        const ok = await playShadowSentences(item.text, ticket);
        return ok && isActiveSession(ticket) ? "next" : "fail";
      }

      setStatus("playing");
      const ok = await playTts(item.text, voiceForItem(item), ticket);
      return ok ? "next" : "fail";
    },
    [isActiveSession, playAudioFile, playPause, playShadowSentences, playTts],
  );

  const runFrom = useCallback(
    async (fromIndex: number, ticket: number) => {
      let i = fromIndex;
      while (i < items.length && isActiveSession(ticket)) {
        goToIndex(i);
        const result = await playItem(items[i], ticket);

        if (!isActiveSession(ticket)) break;
        if (result === "wait_reveal") {
          runLockRef.current = false;
          return;
        }
        if (result === "fail") {
          if (!userInterruptedRef.current) {
            failPlayback("Não foi possível reproduzir este áudio. Toque Play para tentar de novo.");
          }
          return;
        }

        i += 1;
      }

      if (isActiveSession(ticket) && i >= items.length) {
        markExamCompleted(examId);
        setStatus("idle");
        runLockRef.current = false;
        onComplete?.();
      } else if (isActiveSession(ticket)) {
        setStatus("idle");
        runLockRef.current = false;
      }
    },
    [examId, failPlayback, goToIndex, isActiveSession, items, onComplete, playItem],
  );

  const startPlayback = useCallback(
    (fromIndex: number) => {
      const ticket = beginSession();
      void runFrom(fromIndex, ticket);
    },
    [beginSession, runFrom],
  );

  const play = useCallback(() => {
    if (status === "waiting_reveal" || status === "waiting_shadow") return;

    if (status === "paused") {
      void resumeSpeech(speedRef.current).then((resumed) => {
        if (resumed) {
          setStatus("playing");
          return;
        }
        startPlayback(indexRef.current);
      });
      return;
    }

    if (runLockRef.current || status === "playing") return;

    if (status === "idle" || status === "error") {
      const p = loadListeningProgress();
      saveListeningProgress({
        lastExamId: examId,
        sessionCount: p.sessionCount + 1,
        lastPlayedAt: new Date().toISOString(),
      });
    }

    startPlayback(indexRef.current);
  }, [examId, startPlayback, status]);

  const pause = useCallback(() => {
    if (status !== "playing" && status !== "waiting_shadow") return;
    clearPauseTimer();
    const pausedMidClip = pauseSpeech();
    if (!pausedMidClip) {
      userInterruptedRef.current = true;
      stopSpeech();
      runLockRef.current = false;
    }
    setStatus("paused");
  }, [clearPauseTimer, status]);

  const revealAndContinue = useCallback(() => {
    const item = items[indexRef.current];
    if (!item || item.type !== "model_answer") return;
    const ticket = beginSession();
    void (async () => {
      const ok =
        modeRef.current === "shadowing"
          ? await playShadowSentences(item.text ?? "", ticket)
          : await playTts(item.text ?? "", "male_candidate", ticket);
      if (!ok || !isActiveSession(ticket)) {
        if (!ok && !userInterruptedRef.current) {
          failPlayback("Não foi possível reproduzir a resposta modelo.");
        }
        return;
      }
      goToIndex(indexRef.current + 1);
      void runFrom(indexRef.current, ticket);
    })();
  }, [beginSession, failPlayback, goToIndex, isActiveSession, items, playShadowSentences, playTts, runFrom]);

  const next = useCallback(() => {
    endSession();
    const idx = Math.min(items.length - 1, indexRef.current + 1);
    goToIndex(idx);
    startPlayback(idx);
  }, [endSession, goToIndex, items.length, startPlayback]);

  const previous = useCallback(() => {
    endSession();
    const idx = Math.max(0, indexRef.current - 1);
    goToIndex(idx);
    startPlayback(idx);
  }, [endSession, goToIndex, startPlayback]);

  const restart = useCallback(() => {
    endSession();
    goToIndex(0);
    startPlayback(0);
  }, [endSession, goToIndex, startPlayback]);

  return {
    items,
    currentItem,
    currentIndex,
    status,
    progressPct,
    speed,
    setSpeed,
    showTranscript,
    setShowTranscript,
    autoPlay,
    setAutoPlay,
    playbackError,
    play,
    pause,
    stop,
    next,
    previous,
    restart,
    revealAndContinue,
    goToIndex,
  };
}
