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
  pauseSpeech,
  playExamOriginalAudio,
  resumeSpeech,
  speakText,
  stopSpeech,
} from "@/utils/speech";
import type { VoiceType } from "@/utils/speech";

export type PlayerStatus = "idle" | "playing" | "paused" | "waiting_reveal" | "waiting_shadow";

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
  const sessionRef = useRef(0);
  const indexRef = useRef(startIndex);
  const speedRef = useRef(1);
  const modeRef = useRef(mode);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runLockRef = useRef(false);

  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [status, setStatus] = useState<PlayerStatus>("idle");
  const [speed, setSpeed] = useState(1);
  const [showTranscript, setShowTranscript] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const currentItem = items[currentIndex] ?? null;
  const progressPct = items.length ? Math.round((currentIndex / items.length) * 100) : 0;

  const isActiveSession = useCallback((ticket: number) => sessionRef.current === ticket, []);

  const clearPauseTimer = useCallback(() => {
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
  }, []);

  const beginSession = useCallback(() => {
    clearPauseTimer();
    const ticket = beginSpeechSession();
    sessionRef.current = ticket;
    runLockRef.current = true;
    setStatus("playing");
    return ticket;
  }, [clearPauseTimer]);

  const endSession = useCallback(() => {
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
    sessionRef.current += 1;
    endSession();
    setStatus("idle");
  }, [endSession]);

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
    (text: string, voice: VoiceType, ticket: number) =>
      new Promise<void>((resolve) => {
        if (!isActiveSession(ticket)) {
          resolve();
          return;
        }
        speakText(text, voice, {
          rate: speedRef.current,
          ticket,
          onEnd: () => resolve(),
        });
      }),
    [isActiveSession],
  );

  const playAudioFile = useCallback(
    (src: string, ticket: number) =>
      new Promise<void>((resolve) => {
        if (!isActiveSession(ticket) || !src) {
          resolve();
          return;
        }
        playExamOriginalAudio(src, speedRef.current, ticket, () => resolve());
      }),
    [isActiveSession],
  );

  const playShadowSentences = useCallback(
    async (text: string, ticket: number) => {
      for (const sentence of splitSentences(text)) {
        if (!isActiveSession(ticket)) return;
        setStatus("playing");
        await playTts(sentence, "male_candidate", ticket);
        if (!isActiveSession(ticket)) return;
        setStatus("waiting_shadow");
        await playPause(3, ticket);
      }
    },
    [isActiveSession, playPause, playTts],
  );

  const shouldSkipModel = (item: ExamAudioItem) =>
    modeRef.current === "question_only" && item.type === "model_answer";

  const playItem = useCallback(
    async (item: ExamAudioItem, ticket: number): Promise<"next" | "wait_reveal" | "done"> => {
      if (!isActiveSession(ticket)) return "done";

      if (shouldSkipModel(item)) {
        setStatus("waiting_reveal");
        return "wait_reveal";
      }

      if (item.type === "pause") {
        await playPause(item.pauseSeconds ?? 1, ticket);
        return isActiveSession(ticket) ? "next" : "done";
      }

      if (item.type === "original_audio" && item.audioSrc) {
        setStatus("playing");
        await playAudioFile(item.audioSrc, ticket);
        return isActiveSession(ticket) ? "next" : "done";
      }

      if (!item.text) return "next";

      if (modeRef.current === "shadowing" && item.type === "model_answer") {
        setStatus("playing");
        await playShadowSentences(item.text, ticket);
        return isActiveSession(ticket) ? "next" : "done";
      }

      setStatus("playing");
      await playTts(item.text, voiceForItem(item), ticket);
      return isActiveSession(ticket) ? "next" : "done";
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
        if (result === "done") break;

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
    [examId, goToIndex, isActiveSession, items, onComplete, playItem],
  );

  const play = useCallback(() => {
    if (status === "waiting_reveal" || status === "waiting_shadow") return;

    if (status === "paused") {
      resumeSpeech(voiceForItem(currentItem ?? items[0]), speed);
      setStatus("playing");
      return;
    }

    if (runLockRef.current || status === "playing") return;
    runLockRef.current = true;

    if (status === "idle") {
      const p = loadListeningProgress();
      saveListeningProgress({
        lastExamId: examId,
        sessionCount: p.sessionCount + 1,
        lastPlayedAt: new Date().toISOString(),
      });
    }

    const ticket = beginSession();
    void runFrom(indexRef.current, ticket);
  }, [beginSession, currentItem, examId, items, runFrom, speed, status]);

  const pause = useCallback(() => {
    if (status !== "playing" && status !== "waiting_shadow") return;
    clearPauseTimer();
    pauseSpeech();
    setStatus("paused");
  }, [clearPauseTimer, status]);

  const revealAndContinue = useCallback(() => {
    const item = items[indexRef.current];
    if (!item || item.type !== "model_answer") return;
    const ticket = beginSession();
    void (async () => {
      if (modeRef.current === "shadowing") {
        await playShadowSentences(item.text ?? "", ticket);
      } else {
        await playTts(item.text ?? "", "male_candidate", ticket);
      }
      if (!isActiveSession(ticket)) return;
      goToIndex(indexRef.current + 1);
      void runFrom(indexRef.current, ticket);
    })();
  }, [beginSession, goToIndex, isActiveSession, items, playShadowSentences, playTts, runFrom]);

  const next = useCallback(() => {
    sessionRef.current += 1;
    const ticket = beginSession();
    goToIndex(Math.min(items.length - 1, indexRef.current + 1));
    void runFrom(indexRef.current, ticket);
  }, [beginSession, goToIndex, items.length, runFrom]);

  const previous = useCallback(() => {
    stop();
    goToIndex(Math.max(0, indexRef.current - 1));
  }, [goToIndex, stop]);

  const restart = useCallback(() => {
    sessionRef.current += 1;
    const ticket = beginSession();
    goToIndex(0);
    void runFrom(0, ticket);
  }, [beginSession, goToIndex, runFrom]);

  useEffect(() => {
    return () => {
      sessionRef.current += 1;
      endSession();
    };
  }, [endSession]);

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
