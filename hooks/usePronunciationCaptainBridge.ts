"use client";

import { useEffect } from "react";
import type { PracticeLevel, VaultWord } from "@/lib/pronunciationVault";
import { useCaptainRecordBridge } from "@/hooks/useCaptainRecordBridge";

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
    azureAssessing,
    speechSpeaking,
    azureConfigured,
    onStartRecord,
    onStopRecord,
    onListen,
  } = options;

  useCaptainRecordBridge("pronunciation", {
    canRecord: () => !!activeWord && azureConfigured && !speechSpeaking && !azureAssessing,
    startRecord: () => onStartRecord(),
    stopRecord: () => {
      if (azureAssessing) onStopRecord();
    },
    isRecording: () => azureAssessing,
    onSecondaryAction: (actionId) => {
      if (actionId === "slow_audio") onListen();
    },
  });
}
