import type { PronunciationRecordingPhase } from "@/lib/pronunciation/pronunciationRecordingController";

/** Mission card suffix after "Captain Recorder · Status:" */
export function missionCardStatusLine(phase: PronunciationRecordingPhase): string {
  switch (phase) {
    case "starting":
      return "Starting microphone…";
    case "recording":
      return "Recording";
    case "assessing":
      return "Assessing";
    case "success":
      return "Complete";
    case "error":
      return "Try again";
    default:
      return "Ready";
  }
}
