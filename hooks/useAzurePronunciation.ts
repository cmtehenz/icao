"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadSpeechSdk } from "@/lib/azure/loadSpeechSdk";
import type { AzurePronunciationResult, AzureWordScore } from "@/lib/azure/pronunciation";
import { azureReferenceText, isScriptedAssessment } from "@/lib/azure/pronunciation";
import type { EvaluateType } from "@/lib/evaluate/types";

type Segment = AzurePronunciationResult;

export type AzureStopResult = {
  assessment: AzurePronunciationResult | null;
  audioBlob: Blob | null;
};

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

function preferredRecorderMime(): string {
  if (typeof MediaRecorder === "undefined") return "audio/webm";
  if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) return "audio/webm;codecs=opus";
  if (MediaRecorder.isTypeSupported("audio/webm")) return "audio/webm";
  if (MediaRecorder.isTypeSupported("audio/mp4")) return "audio/mp4";
  return "audio/webm";
}

export function useAzurePronunciation() {
  const [configured, setConfigured] = useState(false);
  const [assessing, setAssessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AzurePronunciationResult | null>(null);
  const recognizerRef = useRef<{ close: () => void } | null>(null);
  const segmentsRef = useRef<Segment[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    fetch("/api/azure-speech-token")
      .then((r) => r.json())
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
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.start(1000);
      recorderRef.current = recorder;
    } catch {
      /* mic capture optional — Azure may still work */
    }
  }, []);

  const stop = useCallback((): Promise<AzureStopResult> => {
    return new Promise((resolve) => {
      const rec = recognizerRef.current as {
        stopContinuousRecognitionAsync?: (ok?: () => void, err?: (e: string) => void) => void;
        close: () => void;
      } | null;

      const finish = async () => {
        setAssessing(false);
        const merged = mergeSegments(segmentsRef.current);
        setResult(merged);
        const audioBlob = await stopMicCapture();
        resolve({ assessment: merged, audioBlob });
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

  const start = useCallback(
    async (modelAnswer: string, evaluateType: EvaluateType) => {
      setError(null);
      setResult(null);
      segmentsRef.current = [];
      await stopMicCapture();

      let tokenData: { configured?: boolean; token?: string; region?: string; error?: string };
      try {
        const res = await fetch("/api/azure-speech-token");
        tokenData = await res.json();
      } catch {
        setError("Não foi possível conectar ao Azure.");
        return;
      }

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

        const reference = azureReferenceText(modelAnswer, evaluateType);

        const pronunciationConfig = new sdk.PronunciationAssessmentConfig(
          reference,
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
            /* ignore parse errors */
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
          setAssessing(false);
          void stopMicCapture();
          recognizer.close();
          recognizerRef.current = null;
        };

        recognizerRef.current = recognizer;
        setAssessing(true);
        await startMicCapture();

        recognizer.startContinuousRecognitionAsync(
          () => {},
          (err) => {
            setError(err);
            setAssessing(false);
            void stopMicCapture();
            recognizer.close();
            recognizerRef.current = null;
          },
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro ao iniciar Azure Speech.");
        setAssessing(false);
        await stopMicCapture();
      }
    },
    [startMicCapture, stopMicCapture],
  );

  const clear = useCallback(() => {
    void stop();
    setResult(null);
    setError(null);
    segmentsRef.current = [];
  }, [stop]);

  return { configured, assessing, error, result, start, stop, clear };
}
