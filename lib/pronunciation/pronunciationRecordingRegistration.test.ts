import { describe, expect, it } from "vitest";
import { assertReferenceTextForRecording } from "@/lib/pronunciation/validateReferenceText";
import { PronunciationRecordingError } from "@/lib/pronunciation/PronunciationRecordingError";
import { missionCardStatusLine } from "@/lib/pronunciation/missionCardStatusLine";
import {
  derivePronunciationRecorderUi,
  INITIAL_PRONUNCIATION_RECORDING_STATE,
  reducePronunciationRecording,
} from "@/lib/pronunciation/pronunciationRecordingController";

describe("pronunciation recording architecture guards", () => {
  it("rejects empty referenceText", () => {
    expect(() =>
      assertReferenceTextForRecording("", {
        currentWord: "complete",
        missionId: "2026-07-06",
        practiceLevel: 1,
        sentenceUsed: "",
      }),
    ).toThrow(PronunciationRecordingError);
    try {
      assertReferenceTextForRecording("  ", {
        currentWord: "complete",
        missionId: null,
        practiceLevel: 1,
        sentenceUsed: "",
      });
    } catch (e) {
      expect(e).toBeInstanceOf(PronunciationRecordingError);
      expect((e as PronunciationRecordingError).message).toBe("Missing referenceText.");
    }
  });

  it("accepts non-empty referenceText", () => {
    expect(
      assertReferenceTextForRecording("Complete.", {
        currentWord: "complete",
        missionId: "daily",
        practiceLevel: 1,
        sentenceUsed: "Complete.",
      }),
    ).toBe("Complete.");
  });

  it("mission card status reflects controller phase only", () => {
    expect(missionCardStatusLine("idle")).toBe("Ready");
    expect(missionCardStatusLine("recording")).toBe("Recording");
    expect(missionCardStatusLine("assessing")).toBe("Assessing");
    expect(
      missionCardStatusLine(
        reducePronunciationRecording(INITIAL_PRONUNCIATION_RECORDING_STATE, {
          type: "assessment_success",
          assessment: {
            accuracyScore: 100,
            fluencyScore: 100,
            completenessScore: 100,
            recognizedText: "Complete.",
            words: [],
          },
          score: 100,
        }).phase,
      ),
    ).toBe("Complete");
  });

  it("recording phase mic is red, not idle green", () => {
    const ui = derivePronunciationRecorderUi(
      reducePronunciationRecording(INITIAL_PRONUNCIATION_RECORDING_STATE, {
        type: "recording_started",
      }),
    );
    expect(ui.visualState).toBe("listening");
    expect(ui.primaryLabel).toBe("● Recording");
  });
});
