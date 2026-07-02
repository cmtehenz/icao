"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ExamAudioItem, FullExamId, ListeningMode } from "@/lib/fullExamListening/types";
import { getExamPlaylist } from "@/data/fullExams";
import {
  loadListeningProgress,
  markExamCompleted,
  saveListeningProgress,
} from "@/lib/fullExamListening/progress";
import { pauseSpeech, resumeSpeech, speakText, stopSpeech } from "@/utils/speech";
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const indexRef = useRef(startIndex);
  const speedRef = useRef(1);
  const modeRef = useRef(mode);
  const runGenerationRef = useRef(0);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const isActiveRun = useCallback((runId: number) => runGenerationRef.current === runId, []);

  const cleanupAudio = useCallback(() => {
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.onended = null;
      a.onerror = null;
    }
    audioRef.current = null;
  }, []);

  const clearPauseTimer = useCallback(() => {
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
  }, []);

  const invalidateRun = useCallback(() => {
    runGenerationRef.current += 1;
    clearPauseTimer();
    stopSpeech();
    cleanupAudio();
  }, [cleanupAudio, clearPauseTimer]);

  const beginRun = useCallback(() => {
    invalidateRun();
    const runId = runGenerationRef.current;
    setStatus("playing");
    return runId;
  }, [invalidateRun]);

  const goToIndex = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    indexRef.current = clamped;
    setCurrentIndex(clamped);
    saveListeningProgress({ lastExamId: examId, lastItemIndex: clamped });
  }, [examId, items.length]);

  const stop = useCallback(() => {
    invalidateRun();
    setStatus("idle");
  }, [invalidateRun]);

  const playPause = useCallback(
    (seconds: number, runId: number) =>
      new Promise<void>((resolve) => {
        if (!isActiveRun(runId)) {
          resolve();
          return;
        }
        clearPauseTimer();
        pauseTimerRef.current = setTimeout(() => {
          pauseTimerRef.current = null;
          resolve();
        }, seconds * 1000 / speedRef.current);
      }),
    [clearPauseTimer, isActiveRun],
  );

  const playTts = useCallback(
    (text: string, voice: VoiceType, runId: number) =>
      new Promise<void>((resolve) => {
        if (!isActiveRun(runId)) {
          resolve();
          return;
        }
        let settled = false;
        speakText(text, voice, {
          rate: speedRef.current,
          onEnd: () => {
            if (settled || !isActiveRun(runId)) return;
            settled = true;
            resolve();
          },
        });
      }),
    [isActiveRun],
  );

  const playAudioFile = useCallback(
    (src: string, runId: number) =>
      new Promise<void>((resolve) => {
        if (!isActiveRun(runId) || !src) {
          resolve();
          return;
        }
        stopSpeech();
        cleanupAudio();
        const audio = new Audio(src);
        audio.playbackRate = speedRef.current;
        audioRef.current = audio;
        audio.onended = () => {
          if (audioRef.current === audio) audioRef.current = null;
          resolve();
        };
        audio.onerror = () => {
          if (audioRef.current === audio) audioRef.current = null;
          resolve();
        };
        void audio.play().catch(() => resolve());
      }),
    [cleanupAudio, isActiveRun],
  );

  const playShadowSentences = useCallback(
    async (text: string, runId: number) => {
      const sentences = splitSentences(text);
      for (const sentence of sentences) {
        if (!isActiveRun(runId)) return;
        setStatus("playing");
        await playTts(sentence, "male_candidate", runId);
        if (!isActiveRun(runId)) return;
        setStatus("waiting_shadow");
        await playPause(3, runId);
      }
    },
    [isActiveRun, playPause, playTts],
  );

  const shouldSkipModel = (item: ExamAudioItem) =>
    modeRef.current === "question_only" && item.type === "model_answer";

  const playItem = useCallback(
    async (item: ExamAudioItem, runId: number): Promise<"next" | "wait_reveal" | "done"> => {
      if (!isActiveRun(runId)) return "done";

      if (shouldSkipModel(item)) {
        setStatus("waiting_reveal");
        return "wait_reveal";
      }

      if (item.type === "pause") {
        await playPause(item.pauseSeconds ?? 1, runId);
        return isActiveRun(runId) ? "next" : "done";
      }

      if (item.type === "original_audio" && item.audioSrc) {
        setStatus("playing");
        await playAudioFile(item.audioSrc, runId);
        return isActiveRun(runId) ? "next" : "done";
      }

      if (!item.text) return "next";

      if (modeRef.current === "shadowing" && item.type === "model_answer") {
        setStatus("playing");
        await playShadowSentences(item.text, runId);
        return isActiveRun(runId) ? "next" : "done";
      }

      setStatus("playing");
      await playTts(item.text, voiceForItem(item), runId);
      return isActiveRun(runId) ? "next" : "done";
    },
    [isActiveRun, playAudioFile, playPause, playShadowSentences, playTts],
  );

  const runFrom = useCallback(
    async (fromIndex: number, runId: number) => {
      let i = fromIndex;
      while (i < items.length && isActiveRun(runId)) {
        goToIndex(i);
        const item = items[i];
        const result = await playItem(item, runId);

        if (!isActiveRun(runId)) break;
        if (result === "wait_reveal") return;
        if (result === "done") break;

        i += 1;
      }

      if (isActiveRun(runId) && i >= items.length) {
        markExamCompleted(examId);
        setStatus("idle");
        onComplete?.();
      }
    },
    [examId, goToIndex, isActiveRun, items, onComplete, playItem],
  );

  const play = useCallback(() => {
    if (status === "waiting_reveal" || status === "waiting_shadow") return;

    if (status === "paused") {
      const a = audioRef.current;
      if (a) {
        a.playbackRate = speedRef.current;
        void a.play();
        setStatus("playing");
        return;
      }
      resumeSpeech(voiceForItem(currentItem ?? items[0]), speed);
      setStatus("playing");
      return;
    }

    if (status === "playing") return;

    if (status === "idle") {
      const p = loadListeningProgress();
      saveListeningProgress({
        lastExamId: examId,
        sessionCount: p.sessionCount + 1,
        lastPlayedAt: new Date().toISOString(),
      });
    }

    const runId = beginRun();
    void runFrom(indexRef.current, runId);
  }, [beginRun, currentItem, examId, items, runFrom, speed, status]);

  const pause = useCallback(() => {
    if (status !== "playing" && status !== "waiting_shadow") return;
    clearPauseTimer();
    pauseSpeech();
    const a = audioRef.current;
    if (a) a.pause();
    setStatus("paused");
  }, [clearPauseTimer, status]);

  const revealAndContinue = useCallback(() => {
    const item = items[indexRef.current];
    if (!item || item.type !== "model_answer") return;
    const runId = beginRun();
    void (async () => {
      if (modeRef.current === "shadowing") {
        await playShadowSentences(item.text ?? "", runId);
      } else {
        await playTts(item.text ?? "", "male_candidate", runId);
      }
      if (!isActiveRun(runId)) return;
      const nextIdx = indexRef.current + 1;
      goToIndex(nextIdx);
      void runFrom(nextIdx, runId);
    })();
  }, [beginRun, goToIndex, isActiveRun, items, playShadowSentences, playTts, runFrom]);

  const next = useCallback(() => {
    const runId = beginRun();
    const nextIdx = Math.min(items.length - 1, indexRef.current + 1);
    goToIndex(nextIdx);
    void runFrom(nextIdx, runId);
  }, [beginRun, goToIndex, items.length, runFrom]);

  const previous = useCallback(() => {
    stop();
    const prevIdx = Math.max(0, indexRef.current - 1);
    goToIndex(prevIdx);
  }, [goToIndex, stop]);

  const restart = useCallback(() => {
    const runId = beginRun();
    goToIndex(0);
    void runFrom(0, runId);
  }, [beginRun, goToIndex, runFrom]);

  useEffect(() => {
    return () => {
      invalidateRun();
    };
  }, [invalidateRun]);

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
