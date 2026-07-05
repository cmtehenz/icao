"use client";

import { useEffect } from "react";
import {
  CAPTAIN_DELTA_SECONDARY_ACTION,
  CAPTAIN_DELTA_START_RECORD,
  CAPTAIN_DELTA_STOP_RECORD,
  emitLessonContext,
  registerCaptainDeltaRecordBridge,
} from "@/lib/captainDelta/lessonContext";

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
    });
  }, [termLabel]);

  useEffect(() => {
    registerCaptainDeltaRecordBridge({
      canRecord: () => !!termLabel && azureConfigured && !speechSpeaking,
      startRecord: () => onStartRecord(),
      stopRecord: () => {
        if (azureRecording) onStopRecord();
      },
      isRecording: () => azureRecording,
    });
    return () => registerCaptainDeltaRecordBridge(null);
  }, [
    azureConfigured,
    azureRecording,
    onStartRecord,
    onStopRecord,
    speechSpeaking,
    termLabel,
  ]);

  useEffect(() => {
    const onStart = () => {
      if (termLabel && azureConfigured) onStartRecord();
    };
    const onStop = () => {
      if (azureRecording) onStopRecord();
    };
    const onSecondary = (e: Event) => {
      const id = (e as CustomEvent<{ actionId: string }>).detail?.actionId;
      if (id === "slow_audio") onListen();
    };
    window.addEventListener(CAPTAIN_DELTA_START_RECORD, onStart);
    window.addEventListener(CAPTAIN_DELTA_STOP_RECORD, onStop);
    window.addEventListener(CAPTAIN_DELTA_SECONDARY_ACTION, onSecondary);
    return () => {
      window.removeEventListener(CAPTAIN_DELTA_START_RECORD, onStart);
      window.removeEventListener(CAPTAIN_DELTA_STOP_RECORD, onStop);
      window.removeEventListener(CAPTAIN_DELTA_SECONDARY_ACTION, onSecondary);
    };
  }, [azureConfigured, azureRecording, onListen, onStartRecord, onStopRecord, termLabel]);
}
