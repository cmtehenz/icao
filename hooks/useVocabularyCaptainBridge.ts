"use client";

import { useEffect } from "react";
import { emitLessonContext } from "@/lib/captainDelta/lessonContext";
import { useCaptainRecordBridge } from "@/hooks/useCaptainRecordBridge";

type Options = {
  termLabel: string | null;
  azureRecording: boolean;
  speechSpeaking: boolean;
  azureConfigured: boolean;
  onStartRecord: () => void;
  onStopRecord: () => void;
  onListen: () => void;
};

/** Wire vocabulary mic into Captain Delta record bridge (ADR-009). */
export function useVocabularyCaptainBridge(options: Options): void {
  const {
    termLabel,
    azureRecording,
    speechSpeaking,
    azureConfigured,
    onStartRecord,
    onStopRecord,
    onListen,
  } = options;

  useEffect(() => {
    if (!termLabel) return;
    emitLessonContext({
      mode: "coach",
      pronunciationWord: termLabel,
      question: termLabel,
    });
  }, [termLabel]);

  useCaptainRecordBridge("vocabulary", {
    canRecord: () => !!termLabel && azureConfigured && !speechSpeaking && !azureRecording,
    startRecord: () => onStartRecord(),
    stopRecord: () => {
      if (azureRecording) onStopRecord();
    },
    isRecording: () => azureRecording,
    onSecondaryAction: (actionId) => {
      if (actionId === "slow_audio") onListen();
    },
  });
}
