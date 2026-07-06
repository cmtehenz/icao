import { describe, expect, it } from "vitest";
import {
  derivePronunciationRecorderUi,
  INITIAL_PRONUNCIATION_RECORDING_STATE,
  reducePronunciationRecording,
} from "@/lib/pronunciation/pronunciationRecordingController";
import { isCaptainMicPressed } from "@/lib/captainDelta/pronunciationRecorderState";

describe("derivePronunciationRecorderUi", () => {
  it("idle shows Mic off", () => {
    const ui = derivePronunciationRecorderUi(INITIAL_PRONUNCIATION_RECORDING_STATE);
    expect(ui.primaryLabel).toBe("🎤 Record");
    expect(ui.visualState).toBe("idle");
    expect(ui.micStatusLine).toBe("Mic off");
    expect(ui.primaryDisabled).toBe(false);
    expect(ui.isMicPressed).toBe(false);
  });

  it("starting shows Opening microphone", () => {
    const state = reducePronunciationRecording(INITIAL_PRONUNCIATION_RECORDING_STATE, {
      type: "start_requested",
      word: "route",
      referenceText: "route",
      practiceLevel: 1,
      phaseLabel: "Connecting to Azure Speech…",
    });
    const ui = derivePronunciationRecorderUi(state);
    expect(ui.primaryLabel).toBe("Starting mic…");
    expect(ui.visualState).toBe("starting");
    expect(ui.micStatusLine).toBe("Opening microphone");
    expect(ui.primaryDisabled).toBe(true);
    expect(ui.isMicPressed).toBe(false);
  });

  it("recording shows Mic live — speak now and aria-pressed true", () => {
    const state = reducePronunciationRecording(
      reducePronunciationRecording(INITIAL_PRONUNCIATION_RECORDING_STATE, {
        type: "start_requested",
        word: "route",
        referenceText: "route",
        practiceLevel: 1,
      }),
      { type: "recording_started", phaseLabel: "Recording — speak clearly…" },
    );
    const ui = derivePronunciationRecorderUi(state);
    expect(ui.primaryLabel).toBe("● Recording — Stop");
    expect(ui.visualState).toBe("listening");
    expect(ui.micStatusLine).toBe("Mic live — speak now");
    expect(ui.isMicPressed).toBe(true);
    expect(isCaptainMicPressed(ui.lifecycle)).toBe(true);
    expect(ui.canStop).toBe(true);
  });

  it("recording visual is never idle (red mic state)", () => {
    const state = reducePronunciationRecording(
      reducePronunciationRecording(INITIAL_PRONUNCIATION_RECORDING_STATE, {
        type: "start_requested",
        word: "route",
        referenceText: "route",
        practiceLevel: 1,
      }),
      { type: "recording_started" },
    );
    const ui = derivePronunciationRecorderUi(state);
    expect(ui.visualState).toBe("listening");
    expect(ui.visualState).not.toBe("idle");
    expect(ui.canStart).toBe(false);
  });

  it("assessing shows Evaluating pronunciation", () => {
    const state = reducePronunciationRecording(
      reducePronunciationRecording(INITIAL_PRONUNCIATION_RECORDING_STATE, {
        type: "start_requested",
        word: "route",
        referenceText: "route",
        practiceLevel: 1,
      }),
      { type: "assessing_started" },
    );
    const ui = derivePronunciationRecorderUi(state);
    expect(ui.primaryLabel).toBe("Assessing…");
    expect(ui.visualState).toBe("assessing");
    expect(ui.micStatusLine).toBe("Evaluating pronunciation");
    expect(ui.primaryDisabled).toBe(true);
    expect(ui.isMicPressed).toBe(false);
  });

  it("success shows Record next", () => {
    const ui = derivePronunciationRecorderUi(
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
      }),
    );
    expect(ui.primaryLabel).toBe("🎤 Record next");
    expect(ui.micStatusLine).toBe("Assessment complete");
    expect(ui.visualState).toBe("success");
  });

  it("error shows Try again status line", () => {
    const ui = derivePronunciationRecorderUi(
      reducePronunciationRecording(INITIAL_PRONUNCIATION_RECORDING_STATE, {
        type: "assessment_error",
        message: "Assessment unavailable.",
      }),
    );
    expect(ui.primaryLabel).toBe("🎤 Try again");
    expect(ui.visualState).toBe("error");
    expect(ui.micStatusLine).toBe("Mic error — try again");
    expect(ui.hasError).toBe(true);
  });
});
