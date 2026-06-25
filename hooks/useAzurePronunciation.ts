"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadSpeechSdk } from "@/lib/azure/loadSpeechSdk";
import type { AzurePronunciationResult, AzureWordScore } from "@/lib/azure/pronunciation";
import { azureReferenceText, isScriptedAssessment } from "@/lib/azure/pronunciation";
import type { EvaluateType } from "@/lib/evaluate/types";

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

export function useAzurePronunciation() {
  const [configured, setConfigured] = useState(false);
  const [assessing, setAssessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AzurePronunciationResult | null>(null);
  const recognizerRef = useRef<{ close: () => void } | null>(null);
  const segmentsRef = useRef<Segment[]>([]);

  useEffect(() => {
    fetch("/api/azure-speech-token")
      .then((r) => r.json())
      .then((d) => setConfigured(!!d.configured))
      .catch(() => setConfigured(false));
  }, []);

  const stop = useCallback((): Promise<AzurePronunciationResult | null> => {
    return new Promise((resolve) => {
      const rec = recognizerRef.current as {
        stopContinuousRecognitionAsync?: (ok?: () => void, err?: (e: string) => void) => void;
        close: () => void;
      } | null;

      if (!rec) {
        const merged = mergeSegments(segmentsRef.current);
        setResult(merged);
        setAssessing(false);
        resolve(merged);
        return;
      }

      const finish = () => {
        setAssessing(false);
        const merged = mergeSegments(segmentsRef.current);
        setResult(merged);
        rec.close();
        recognizerRef.current = null;
        resolve(merged);
      };

      rec.stopContinuousRecognitionAsync?.(finish, finish);
    });
  }, []);

  const start = useCallback(
    async (modelAnswer: string, evaluateType: EvaluateType) => {
      setError(null);
      setResult(null);
      segmentsRef.current = [];

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

        const scripted = isScriptedAssessment(evaluateType);
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
          recognizer.close();
          recognizerRef.current = null;
        };

        recognizerRef.current = recognizer;
        setAssessing(true);

        recognizer.startContinuousRecognitionAsync(
          () => {},
          (err) => {
            setError(err);
            setAssessing(false);
            recognizer.close();
            recognizerRef.current = null;
          },
        );

        if (!scripted) {
          // Unscripted mode hint stored via no reference text
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro ao iniciar Azure Speech.");
        setAssessing(false);
      }
    },
    [],
  );

  const clear = useCallback(() => {
    stop();
    setResult(null);
    setError(null);
    segmentsRef.current = [];
  }, [stop]);

  return { configured, assessing, error, result, start, stop, clear };
}
