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
  const shadowQueueRef = useRef<string[]>([]);
  const shadowIdxRef = useRef(0);
  const cancelledRef = useRef(false);

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

  const cleanupAudio = useCallback(() => {
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.onended = null;
      a.onerror = null;
    }
    audioRef.current = null;
  }, []);

  const goToIndex = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    indexRef.current = clamped;
    setCurrentIndex(clamped);
    saveListeningProgress({ lastExamId: examId, lastItemIndex: clamped });
  }, [examId, items.length]);

  const stop = useCallback(() => {
    cancelledRef.current = true;
    stopSpeech();
    cleanupAudio();
    shadowQueueRef.current = [];
    setStatus("idle");
  }, [cleanupAudio]);

  const playPause = useCallback(async (seconds: number) => {
    return new Promise<void>((resolve) => {
      if (cancelledRef.current) {
        resolve();
        return;
      }
      setTimeout(() => resolve(), seconds * 1000 / speedRef.current);
    });
  }, []);

  const playTts = useCallback(
    (text: string, voice: VoiceType) =>
      new Promise<void>((resolve) => {
        if (cancelledRef.current) {
          resolve();
          return;
        }
        speakText(text, voice, {
          rate: speedRef.current * 0.95,
          onEnd: () => resolve(),
        });
      }),
    [],
  );

  const playAudioFile = useCallback(
    (src: string) =>
      new Promise<void>((resolve) => {
        if (cancelledRef.current || !src) {
          resolve();
          return;
        }
        cleanupAudio();
        const audio = new Audio(src);
        audio.playbackRate = speedRef.current;
        audioRef.current = audio;
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
        void audio.play().catch(() => resolve());
      }),
    [cleanupAudio],
  );

  const playShadowSentences = useCallback(
    async (text: string) => {
      const sentences = splitSentences(text);
      for (const sentence of sentences) {
        if (cancelledRef.current) return;
        setStatus("playing");
        await playTts(sentence, "male_candidate");
        if (cancelledRef.current) return;
        setStatus("waiting_shadow");
        await playPause(3);
      }
    },
    [playPause, playTts],
  );

  const shouldSkipModel = (item: ExamAudioItem) =>
    modeRef.current === "question_only" && item.type === "model_answer";

  const playItem = useCallback(
    async (item: ExamAudioItem): Promise<"next" | "wait_reveal" | "done"> => {
      if (cancelledRef.current) return "done";

      if (shouldSkipModel(item)) {
        setStatus("waiting_reveal");
        return "wait_reveal";
      }

      if (item.type === "pause") {
        await playPause(item.pauseSeconds ?? 1);
        return "next";
      }

      if (item.type === "original_audio" && item.audioSrc) {
        setStatus("playing");
        await playAudioFile(item.audioSrc);
        return "next";
      }

      if (!item.text) return "next";

      if (modeRef.current === "shadowing" && item.type === "model_answer") {
        setStatus("playing");
        await playShadowSentences(item.text);
        return "next";
      }

      setStatus("playing");
      await playTts(item.text, voiceForItem(item));
      return "next";
    },
    [playAudioFile, playPause, playShadowSentences, playTts],
  );

  const runFrom = useCallback(
    async (fromIndex: number) => {
      cancelledRef.current = false;

      let i = fromIndex;
      while (i < items.length && !cancelledRef.current) {
        goToIndex(i);
        const item = items[i];
        const result = await playItem(item);

        if (result === "wait_reveal") return;
        if (result === "done") break;

        if (autoPlay || i < fromIndex) {
          i += 1;
        } else {
          i += 1;
        }
      }

      if (!cancelledRef.current && i >= items.length) {
        markExamCompleted(examId);
        setStatus("idle");
        onComplete?.();
      }
    },
    [autoPlay, examId, goToIndex, items, onComplete, playItem],
  );

  const play = useCallback(() => {
    if (status === "waiting_reveal" || status === "waiting_shadow") return;
    if (status === "paused") {
      cancelledRef.current = false;
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
    if (status === "idle") {
      const p = loadListeningProgress();
      saveListeningProgress({
        lastExamId: examId,
        sessionCount: p.sessionCount + 1,
        lastPlayedAt: new Date().toISOString(),
      });
    }
    void runFrom(indexRef.current);
  }, [currentItem, examId, items, runFrom, speed, status]);

  const pause = useCallback(() => {
    cancelledRef.current = true;
    pauseSpeech();
    const a = audioRef.current;
    if (a) a.pause();
    setStatus("paused");
  }, []);

  const revealAndContinue = useCallback(() => {
    const item = items[indexRef.current];
    if (!item || item.type !== "model_answer") return;
    cancelledRef.current = false;
    setStatus("playing");
    void (async () => {
      if (modeRef.current === "shadowing") {
        await playShadowSentences(item.text ?? "");
      } else {
        await playTts(item.text ?? "", "male_candidate");
      }
      if (cancelledRef.current) return;
      const next = indexRef.current + 1;
      goToIndex(next);
      void runFrom(next);
    })();
  }, [goToIndex, items, playShadowSentences, playTts, runFrom]);

  const next = useCallback(() => {
    stop();
    const nextIdx = Math.min(items.length - 1, indexRef.current + 1);
    goToIndex(nextIdx);
    void runFrom(nextIdx);
  }, [goToIndex, items.length, runFrom, stop]);

  const previous = useCallback(() => {
    stop();
    const prevIdx = Math.max(0, indexRef.current - 1);
    goToIndex(prevIdx);
  }, [goToIndex, stop]);

  const restart = useCallback(() => {
    stop();
    goToIndex(0);
    void runFrom(0);
  }, [goToIndex, runFrom, stop]);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      stopSpeech();
      cleanupAudio();
    };
  }, [cleanupAudio]);

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
