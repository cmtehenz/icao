import { PronunciationRecordingError } from "@/lib/pronunciation/PronunciationRecordingError";
import { traceRecordStep } from "@/lib/captainDelta/pronunciationRecordTrace";

export type RecordingStartContext = {
  currentWord: string;
  referenceText: string;
  missionId: string | null;
  practiceLevel: number;
  sentenceUsed: string;
};

export function logRecordingStartContext(ctx: RecordingStartContext): void {
  traceRecordStep("recordingStartContext", JSON.stringify(ctx));
}

export function assertReferenceTextForRecording(
  referenceText: string,
  ctx: Omit<RecordingStartContext, "referenceText"> & { referenceText?: string },
): string {
  const trimmed = referenceText.trim();
  logRecordingStartContext({
    ...ctx,
    referenceText: trimmed,
  });
  if (!trimmed) {
    throw new PronunciationRecordingError(
      "missing_reference_text",
      "Missing referenceText.",
    );
  }
  return trimmed;
}
