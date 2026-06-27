"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadSpeechSdk } from "@/lib/azure/loadSpeechSdk";
import type { AzurePronunciationResult, AzureWordScore } from "@/lib/azure/pronunciation";
import type { AzureSpeechTokenResponse } from "@/lib/azure/speechToken";
import { preferredRecorderMime } from "@/lib/recordings/platform";

const AZURE_VOICE = "en-US-JennyNeural";
const TOKEN_URL = "/api/speech-token";

type Segment = AzurePronunciationResult;

function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

function mergeSegments(segments: Segment[]): AzurePronunciationResult | null {
  if (!segments.length) return null;
  const words: AzureWordScore[] = [];
  for (const s of segments) words.push(...s.words);
  return {
    accuracyScore: avg(segments.map((s) => s.accuracyScore)),
    fluencyScore: avg(segments.map((s) => s.fluencyScore)),
    completenessScore: avg(segments.map((s) => s.completenessScore)),
    prosodyScore: avg(segments.map((s) => s.prosodyScore)),
    recognizedText: segments.map((s) => s.recognizedText).filter(Boolean).join(" "),
    words,
  };
}

function parseWordScores(json: {
  NBest?: Array<{
    Words?: Array<{
      Word: string;
      AccuracyScore?: number;
      PronunciationAssessment?: { AccuracyScore?: number; ErrorType?: string };
    }>;
  }>;
}): AzureWordScore[] {
  const words = json.NBest?.[0]?.Words ?? [];
  return words.map((w) => {
    const pa = w.PronunciationAssessment;
    return {
      word: w.Word,
      accuracyScore: Math.round(pa?.AccuracyScore ?? w.AccuracyScore ?? 0),
      errorType: pa?.ErrorType ?? "None",
    };
  });
}

async function fetchToken(): Promise<AzureSpeechTokenResponse> {
  const res = await fetch(TOKEN_URL);
  return res.json();
}

export function useAzureSpeech() {
  const [configured, setConfigured] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AzurePronunciationResult | null>(null);

  const synthesizerRef = useRef<{ close: () => void } | null>(null);
  const recognizerRef = useRef<{ close: () => void } | null>(null);
  const segmentsRef = useRef<Segment[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    fetchToken()
      .then((d) => setConfigured(!!d.configured))
      .catch(() => setConfigured(false));
  }, []);

  const stopMicCapture = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const recorder = recorderRef.current;
      if (!recorder || recorder.state === "inactive") {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        resolve(null);
        return;
      }
      recorder.onstop = () => {
        const mimeType = recorder.mimeType || "audio/webm";
        const blob =
          chunksRef.current.length > 0 ? new Blob(chunksRef.current, { type: mimeType }) : null;
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        recorderRef.current = null;
        chunksRef.current = [];
        resolve(blob && blob.size > 0 ? blob : null);
      };
      recorder.stop();
    });
  }, []);

  const startMicCapture = useCallback(async () => {
    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) return;
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
    } catch {
      /* optional mic backup */
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    synthesizerRef.current?.close();
    synthesizerRef.current = null;
    setSpeaking(false);
  }, []);

  const speak = useCallback(
    async (text: string): Promise<void> => {
      setError(null);
      stopSpeaking();

      const tokenData = await fetchToken();
      if (!tokenData.configured || !tokenData.token || !tokenData.region) {
        throw new Error("Azure Speech não configurado.");
      }

      const sdk = await loadSpeechSdk();
      const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(
        tokenData.token,
        tokenData.region,
      );
      speechConfig.speechSynthesisVoiceName = AZURE_VOICE;
      const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

      return new Promise((resolve, reject) => {
        synthesizerRef.current = synthesizer;
        setSpeaking(true);
        synthesizer.speakTextAsync(
          text,
          () => {
            synthesizer.close();
            synthesizerRef.current = null;
            setSpeaking(false);
            resolve();
          },
          (err) => {
            synthesizer.close();
            synthesizerRef.current = null;
            setSpeaking(false);
            setError(err);
            reject(new Error(err));
          },
        );
      });
    },
    [stopSpeaking],
  );

  const stopRecording = useCallback((): Promise<AzurePronunciationResult | null> => {
    return new Promise((resolve) => {
      const rec = recognizerRef.current as {
        stopContinuousRecognitionAsync?: (ok?: () => void, err?: (e: string) => void) => void;
        close: () => void;
      } | null;

      const finish = async () => {
        setRecording(false);
        const merged = mergeSegments(segmentsRef.current);
        setResult(merged);
        await stopMicCapture();
        resolve(merged);
      };

      if (!rec) {
        void finish();
        return;
      }

      const done = () => {
        rec.close();
        recognizerRef.current = null;
        void finish();
      };
      rec.stopContinuousRecognitionAsync?.(done, done);
    });
  }, [stopMicCapture]);

  const startRecording = useCallback(
    async (referenceText: string) => {
      setError(null);
      setResult(null);
      segmentsRef.current = [];
      await stopRecording();
      await stopMicCapture();
      await startMicCapture();

      const tokenData = await fetchToken();
      if (!tokenData.configured || !tokenData.token || !tokenData.region) {
        setError("Azure Speech não configurado. Adicione AZURE_SPEECH_KEY e AZURE_SPEECH_REGION.");
        return;
      }

      try {
        const sdk = await loadSpeechSdk();
        const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(
          tokenData.token,
          tokenData.region,
        );
        speechConfig.speechRecognitionLanguage = "en-US";
        const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
        const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

        const pronunciationConfig = new sdk.PronunciationAssessmentConfig(
          referenceText.slice(0, 500),
          sdk.PronunciationAssessmentGradingSystem.HundredMark,
          sdk.PronunciationAssessmentGranularity.Phoneme,
          true,
        );
        pronunciationConfig.enableProsodyAssessment = true;
        pronunciationConfig.applyTo(recognizer);

        recognizer.recognized = (_, e) => {
          if (e.result.reason !== sdk.ResultReason.RecognizedSpeech) return;
          const pa = sdk.PronunciationAssessmentResult.fromResult(e.result);
          const jsonRaw = e.result.properties.getProperty(
            sdk.PropertyId.SpeechServiceResponse_JsonResult,
          );
          let words: AzureWordScore[] = [];
          try {
            words = parseWordScores(JSON.parse(jsonRaw));
          } catch {
            /* ignore */
          }
          segmentsRef.current.push({
            accuracyScore: Math.round(pa.accuracyScore),
            fluencyScore: Math.round(pa.fluencyScore),
            completenessScore: Math.round(pa.completenessScore),
            prosodyScore: Math.round(pa.prosodyScore ?? 0),
            recognizedText: e.result.text,
            words,
          });
        };

        recognizer.canceled = (_, e) => {
          if (e.reason === sdk.CancellationReason.Error) {
            setError(e.errorDetails || "Erro no reconhecimento Azure.");
          }
          setRecording(false);
          void stopMicCapture();
          recognizer.close();
          recognizerRef.current = null;
        };

        recognizerRef.current = recognizer;
        setRecording(true);
        recognizer.startContinuousRecognitionAsync(
          () => {},
          (err) => {
            setError(err);
            setRecording(false);
            void stopMicCapture();
            recognizer.close();
            recognizerRef.current = null;
          },
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro ao iniciar gravação.");
        setRecording(false);
        await stopMicCapture();
      }
    },
    [startMicCapture, stopMicCapture, stopRecording],
  );

  const clear = useCallback(() => {
    void stopRecording();
    stopSpeaking();
    setResult(null);
    setError(null);
    segmentsRef.current = [];
  }, [stopRecording, stopSpeaking]);

  return {
    configured,
    speaking,
    recording,
    error,
    result,
    speak,
    stopSpeaking,
    startRecording,
    stopRecording,
    clear,
  };
}
