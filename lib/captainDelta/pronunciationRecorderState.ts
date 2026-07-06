/** @deprecated Import from @/lib/pronunciation/pronunciationRecordingController */
export {
  derivePronunciationRecorderUi as derivePronunciationRecorderUiState,
  type PronunciationRecorderUiState,
  type PronunciationRecorderVisualState,
} from "@/lib/pronunciation/pronunciationRecordingController";

import type { RecognizerLifecycle } from "@/lib/azure/recognizerLifecycle";

/** @deprecated Use isMicPressed from PronunciationRecorderUiState */
export function isCaptainMicPressed(lifecycle: RecognizerLifecycle): boolean {
  return lifecycle === "listening";
}
