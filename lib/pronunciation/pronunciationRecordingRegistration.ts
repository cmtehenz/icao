import type { PronunciationRecorderUiState } from "@/lib/pronunciation/pronunciationRecordingController";

/** Direct Captain → controller handles. No lessonContext / bridge recording control. */
export type PronunciationRecordingHandles = {
  start: () => void | Promise<void>;
  stop: () => void | Promise<void>;
  listen: () => void | Promise<void>;
  playSlow: () => void | Promise<void>;
  replay: () => void | Promise<void>;
  canStart: () => boolean;
  canStop: () => boolean;
  isRecording: () => boolean;
  getBlockReason: () => string | null;
  openYouGlish?: () => void;
};

export type PronunciationRecordingRegistration = {
  handles: PronunciationRecordingHandles;
  micUi: PronunciationRecorderUiState;
};
