"use client";

import { useEffect } from "react";
import {
  CAPTAIN_DELTA_SECONDARY_ACTION,
  CAPTAIN_DELTA_START_RECORD,
  CAPTAIN_DELTA_STOP_RECORD,
  emitLessonContext,
  registerCaptainDeltaRecordBridge,
} from "@/lib/captainDelta/lessonContext";
import type { PracticeLevel, VaultWord } from "@/lib/pronunciationVault";

type Options = {
  activeWord: VaultWord | null;
  practiceLevel: PracticeLevel;
  azureAssessing: boolean;
  speechSpeaking: boolean;
  azureConfigured: boolean;
  onStartRecord: () => void;
  onStopRecord: () => void;
  onListen: () => void;
};

/** Wire pronunciation mic into Captain Delta record bridge (ADR-009). */
export function usePronunciationCaptainBridge(options: Options): void {
  const {
    activeWord,
    practiceLevel,
    azureAssessing,
    speechSpeaking,
    azureConfigured,
    onStartRecord,
    onStopRecord,
    onListen,
  } = options;

  const recording = azureAssessing;

  useEffect(() => {
    if (!activeWord) return;
    emitLessonContext({
      mode: "pronunciation",
      pronunciationWord: activeWord.word,
    });
  }, [activeWord, practiceLevel]);

  useEffect(() => {
    registerCaptainDeltaRecordBridge({
      canRecord: () => !!activeWord && azureConfigured && !speechSpeaking,
      startRecord: () => onStartRecord(),
      stopRecord: () => {
        if (azureAssessing) onStopRecord();
      },
      isRecording: () => recording,
    });
    return () => registerCaptainDeltaRecordBridge(null);
  }, [
    activeWord,
    azureAssessing,
    azureConfigured,
    onStartRecord,
    onStopRecord,
    recording,
    speechSpeaking,
  ]);

  useEffect(() => {
    const onStart = () => {
      if (activeWord && azureConfigured) onStartRecord();
    };
    const onStop = () => {
      if (azureAssessing) onStopRecord();
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
  }, [activeWord, azureAssessing, azureConfigured, onListen, onStartRecord, onStopRecord]);
}
