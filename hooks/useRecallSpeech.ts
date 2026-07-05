"use client";

import { useCallback, useRef, useState } from "react";
import { preferredRecorderMime } from "@/lib/recordings/platform";
import { transcribeAudio } from "@/services/azureSpeech";

/** Simple mic capture + Azure STT for Mission Recall (no pronunciation scoring). */
export function useRecallSpeech() {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const cleanup = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    recorderRef.current = null;
    chunksRef.current = [];
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);
    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("Microphone not available in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = preferredRecorderMime();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.start(1000);
      recorderRef.current = recorder;
      setRecording(true);
    } catch {
      setError("Could not access microphone.");
      cleanup();
    }
  }, [cleanup]);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      cleanup();
      setRecording(false);
      return null;
    }

    const blob = await new Promise<Blob | null>((resolve) => {
      recorder.onstop = () => {
        const mimeType = recorder.mimeType || "audio/mp4";
        const data =
          chunksRef.current.length > 0 ? new Blob(chunksRef.current, { type: mimeType }) : null;
        cleanup();
        resolve(data && data.size > 0 ? data : null);
      };
      recorder.stop();
    });

    setRecording(false);
    if (!blob) return null;

    setTranscribing(true);
    try {
      const transcript = await transcribeAudio(blob);
      return transcript.trim() || null;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Transcription failed.");
      return null;
    } finally {
      setTranscribing(false);
    }
  }, [cleanup]);

  const clearError = useCallback(() => setError(null), []);

  return {
    recording,
    transcribing,
    error,
    startRecording,
    stopRecording,
    clearError,
    supported:
      typeof window !== "undefined" &&
      typeof MediaRecorder !== "undefined" &&
      !!navigator.mediaDevices?.getUserMedia,
  };
}
