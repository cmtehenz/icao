"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionCtor = new () => SpeechRecognition;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const raw = reader.result as string;
      resolve(raw.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/** Push-to-talk input for Captain Delta — Web Speech with Azure STT fallback. */
export function useCaptainDeltaPtt(lang = "en-US") {
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);

  const finalRef = useRef("");
  const interimRef = useRef("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const resolveStopRef = useRef<((text: string) => void) | null>(null);
  const modeRef = useRef<"webspeech" | "mediarecorder" | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setSupported(!!getRecognitionCtor() || !!navigator.mediaDevices?.getUserMedia);
  }, []);

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }, []);

  const finishWithText = useCallback((text: string) => {
    setListening(false);
    setInterimText("");
    interimRef.current = "";
    const resolve = resolveStopRef.current;
    resolveStopRef.current = null;
    resolve?.(text.trim());
  }, []);

  const stopWebSpeech = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      finishWithText(finalRef.current);
      return;
    }
    recognition.stop();
  }, [finishWithText]);

  const stopMediaRecorder = useCallback(async () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      cleanupStream();
      finishWithText("");
      return;
    }

    await new Promise<void>((resolve) => {
      recorder.onstop = () => resolve();
      recorder.stop();
    });

    const mimeType = recorder.mimeType || "audio/webm";
    const blob = new Blob(chunksRef.current, { type: mimeType });
    cleanupStream();

    if (!blob.size) {
      finishWithText("");
      return;
    }

    try {
      const audioBase64 = await blobToBase64(blob);
      const res = await fetch("/api/stt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioBase64, mimeType }),
      });
      if (res.ok) {
        const data = (await res.json()) as { transcript?: string };
        finishWithText(data.transcript ?? "");
        return;
      }
      setError("Não consegui transcrever o áudio. Tente de novo.");
      finishWithText("");
    } catch {
      setError("Erro ao enviar áudio para transcrição.");
      finishWithText("");
    }
  }, [cleanupStream, finishWithText]);

  const startWebSpeech = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return false;

    finalRef.current = "";
    interimRef.current = "";
    setInterimText("");
    setError(null);
    modeRef.current = "webspeech";

    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalChunk = "";
      let interimChunk = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const chunk = event.results[i][0]?.transcript ?? "";
        if (event.results[i].isFinal) finalChunk += chunk;
        else interimChunk += chunk;
      }
      if (finalChunk) {
        finalRef.current = `${finalRef.current} ${finalChunk}`.trim();
      }
      interimRef.current = interimChunk;
      setInterimText([finalRef.current, interimChunk].filter(Boolean).join(" ").trim());
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "not-allowed") {
        setError("Permita o microfone nas configurações do navegador.");
        finishWithText("");
        return;
      }
      if (event.error !== "aborted") {
        setError(`Erro de microfone: ${event.error}`);
      }
    };

    recognition.onend = () => {
      const text = [finalRef.current, interimRef.current].filter(Boolean).join(" ").trim();
      finishWithText(text);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
      return true;
    } catch {
      recognitionRef.current = null;
      modeRef.current = null;
      return false;
    }
  }, [finishWithText, lang]);

  const startMediaRecorder = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) return false;

    setError(null);
    finalRef.current = "";
    interimRef.current = "";
    setInterimText("");
    modeRef.current = "mediarecorder";
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      recorder.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setListening(true);
      return true;
    } catch {
      setError("Permita o microfone para falar com o Captain Delta.");
      cleanupStream();
      modeRef.current = null;
      return false;
    }
  }, [cleanupStream]);

  const start = useCallback(async () => {
    setError(null);
    if (startWebSpeech()) return true;
    return startMediaRecorder();
  }, [startMediaRecorder, startWebSpeech]);

  const stop = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      resolveStopRef.current = resolve;
      if (modeRef.current === "mediarecorder") {
        void stopMediaRecorder();
        return;
      }
      stopWebSpeech();
    });
  }, [stopMediaRecorder, stopWebSpeech]);

  const clear = useCallback(() => {
    finalRef.current = "";
    interimRef.current = "";
    setInterimText("");
    setError(null);
  }, []);

  useEffect(() => () => cleanupStream(), [cleanupStream]);

  return {
    supported,
    listening,
    interimText,
    error,
    start,
    stop,
    clear,
  };
}
