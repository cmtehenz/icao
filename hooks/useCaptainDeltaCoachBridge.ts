"use client";

import { useEffect } from "react";
import type { EvaluateType } from "@/lib/evaluate/types";
import {
  emitLessonContext,
  registerCaptainDeltaRecordBridge,
  CAPTAIN_DELTA_SECONDARY_ACTION,
  CAPTAIN_DELTA_START_RECORD,
  CAPTAIN_DELTA_STOP_RECORD,
} from "@/lib/captainDelta/lessonContext";

type Part2Kind = "readback" | "interaction" | "reported" | "picture";

function part2KindFromType(type: EvaluateType): Part2Kind | undefined {
  if (type === "part2-readback") return "readback";
  if (type === "part2-interaction") return "interaction";
  if (type === "part2-reported") return "reported";
  return undefined;
}

type Options = {
  question: string;
  modelAnswer: string;
  evaluateType: EvaluateType;
  keywords?: string[];
  questionLabel?: string;
  recordingBlocked?: boolean;
  loading?: boolean;
  hasFeedback?: boolean;
  canCompareAttempts?: boolean;
  azureAssessing: boolean;
  speechListening: boolean;
  onStartAzure: () => void;
  onStopAzure: () => void;
  onSpeechToggle: () => void;
  onTryAgain?: () => void;
  onShowKeywords?: () => void;
  onShowHint?: () => void;
  onShowModel?: () => void;
  azureConfigured: boolean;
};

/** Wire Voice Coach into Captain Delta lesson memory and PTT bridge. */
export function useCaptainDeltaCoachBridge(options: Options): void {
  const {
    question,
    modelAnswer,
    evaluateType,
    keywords = [],
    questionLabel,
    recordingBlocked = false,
    loading = false,
    hasFeedback = false,
    canCompareAttempts = false,
    azureAssessing,
    speechListening,
    onStartAzure,
    onStopAzure,
    onSpeechToggle,
    onTryAgain,
    onShowKeywords,
    onShowHint,
    onShowModel,
    azureConfigured,
  } = options;

  const recording = azureAssessing || speechListening;
  const part2Kind = part2KindFromType(evaluateType);

  useEffect(() => {
    emitLessonContext({
      mode: hasFeedback ? "debrief" : "coach",
      question,
      questionLabel,
      modelAnswer,
      keywords,
      part2Kind,
      hasFeedback,
      hasModelAnswer: !!modelAnswer,
      canCompareAttempts,
      recording,
    });
  }, [
    question,
    questionLabel,
    modelAnswer,
    keywords,
    part2Kind,
    hasFeedback,
    canCompareAttempts,
    recording,
  ]);

  useEffect(() => {
    registerCaptainDeltaRecordBridge({
      canRecord: () => !recordingBlocked && !loading,
      startRecord: () => {
        if (hasFeedback && onTryAgain) {
          onTryAgain();
          return;
        }
        if (azureConfigured) onStartAzure();
        else onSpeechToggle();
      },
      stopRecord: () => {
        if (azureConfigured && azureAssessing) onStopAzure();
        else if (speechListening) onSpeechToggle();
      },
      isRecording: () => recording,
    });
    return () => registerCaptainDeltaRecordBridge(null);
  }, [
    recordingBlocked,
    loading,
    hasFeedback,
    onTryAgain,
    azureConfigured,
    onStartAzure,
    onStopAzure,
    onSpeechToggle,
    azureAssessing,
    speechListening,
    recording,
  ]);

  useEffect(() => {
    const onStart = () => {
      if (hasFeedback && onTryAgain) {
        onTryAgain();
        return;
      }
      if (azureConfigured) onStartAzure();
      else onSpeechToggle();
    };
    const onStop = () => {
      if (azureConfigured && azureAssessing) onStopAzure();
      else if (speechListening) onSpeechToggle();
    };
    const onSecondary = (e: Event) => {
      const id = (e as CustomEvent<{ actionId: string }>).detail?.actionId;
      if (id === "show_keywords") onShowKeywords?.();
      if (id === "show_hint") onShowHint?.();
      if (id === "show_model") onShowModel?.();
      if (id === "compare_attempts") onTryAgain?.();
      if (id === "try_again") onTryAgain?.();
    };
    window.addEventListener(CAPTAIN_DELTA_START_RECORD, onStart);
    window.addEventListener(CAPTAIN_DELTA_STOP_RECORD, onStop);
    window.addEventListener(CAPTAIN_DELTA_SECONDARY_ACTION, onSecondary);
    return () => {
      window.removeEventListener(CAPTAIN_DELTA_START_RECORD, onStart);
      window.removeEventListener(CAPTAIN_DELTA_STOP_RECORD, onStop);
      window.removeEventListener(CAPTAIN_DELTA_SECONDARY_ACTION, onSecondary);
    };
  }, [
    hasFeedback,
    onTryAgain,
    azureConfigured,
    onStartAzure,
    onStopAzure,
    onSpeechToggle,
    azureAssessing,
    speechListening,
    onShowKeywords,
    onShowHint,
    onShowModel,
  ]);
}
