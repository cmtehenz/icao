"use client";

import { useEffect, useRef } from "react";
import type { VaultWord } from "@/lib/pronunciationVault";
import {
  emitLessonContext,
  emitStopCaptainVoice,
} from "@/lib/captainDelta/lessonContext";
import {
  pronunciationRecordBlockLabel,
  resolvePronunciationRecordBlockReason,
  type PronunciationRecordGate,
} from "@/lib/captainDelta/pronunciationRecordReason";
import {
  pronunciationRecorderUiSnapshot,
  type PronunciationRecorderUiState,
} from "@/lib/pronunciation/pronunciationRecordingController";
import { useCaptainRecordBridge } from "@/hooks/useCaptainRecordBridge";

type Options = {
  activeWord: VaultWord | null;
  micUi: PronunciationRecorderUiState;
  recordGate: () => PronunciationRecordGate;
  onStartRecord: () => void;
  onStopRecord: () => void;
  onListen: () => void;
};

/** Wire pronunciation controller mic state into Captain Delta record bridge (ADR-009). */
export function usePronunciationCaptainBridge(options: Options): PronunciationRecorderUiState {
  const { activeWord, micUi, recordGate, onStartRecord, onStopRecord, onListen } = options;
  const lastLessonEmitRef = useRef("");

  useEffect(() => {
    const recording = micUi.phase === "recording";
    const snapshot = pronunciationRecorderUiSnapshot(micUi, activeWord?.word, recording);
    if (lastLessonEmitRef.current === snapshot) return;
    lastLessonEmitRef.current = snapshot;
    emitLessonContext({
      mode: "pronunciation",
      pronunciationWord: activeWord?.word,
      recording,
      pronunciationRecorder: micUi,
    });
  }, [activeWord?.word, micUi]);

  useCaptainRecordBridge("pronunciation", {
    canRecord: () => {
      if (!micUi.canStart) return false;
      return resolvePronunciationRecordBlockReason(recordGate()) === null;
    },
    getRecordBlockReason: () => {
      if (!micUi.canStart) {
        if (micUi.phase === "starting") return "Starting microphone…";
        if (micUi.phase === "assessing") return "Assessment in progress.";
        if (micUi.phase === "recording") {
          return "Recording is in progress — use Stop & assess.";
        }
      }
      const reason = resolvePronunciationRecordBlockReason(recordGate());
      return reason ? pronunciationRecordBlockLabel(reason) : null;
    },
    startRecord: () => {
      if (!micUi.canStart) return;
      emitStopCaptainVoice();
      onStartRecord();
    },
    stopRecord: () => {
      if (!micUi.canStop) return;
      onStopRecord();
    },
    isRecording: () => micUi.phase === "recording",
    onSecondaryAction: (actionId) => {
      if (actionId === "slow_audio") onListen();
    },
  });

  return micUi;
}
