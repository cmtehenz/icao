"use client";

import { useEffect } from "react";
import type { EvaluateType } from "@/lib/evaluate/types";
import { emitLessonContext } from "@/lib/captainDelta/lessonContext";
import { useCaptainRecordBridge } from "@/hooks/useCaptainRecordBridge";

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

  useCaptainRecordBridge("coach", {
    canRecord: () => !recordingBlocked && !loading && !recording,
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
    onSecondaryAction: (actionId) => {
      if (actionId === "show_keywords") onShowKeywords?.();
      if (actionId === "show_hint") onShowHint?.();
      if (actionId === "show_model") onShowModel?.();
      if (actionId === "compare_attempts") onTryAgain?.();
      if (actionId === "try_again") onTryAgain?.();
    },
  });
}
