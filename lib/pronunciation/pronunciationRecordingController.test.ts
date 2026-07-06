import { describe, expect, it } from "vitest";
import { mergeLessonContext } from "@/lib/captainDelta/lessonContext";
import { DEFAULT_LESSON_CONTEXT } from "@/lib/captainDelta/types";
import {
  canStartPronunciationRecording,
  canStopPronunciationRecording,
  derivePronunciationRecorderUi,
  INITIAL_PRONUNCIATION_RECORDING_STATE,
  isPronunciationRecordingActive,
  pronunciationRecorderUiSnapshot,
  reducePronunciationRecording,
  sameStringList,
} from "@/lib/pronunciation/pronunciationRecordingController";

const assessment = {
  accuracyScore: 100,
  fluencyScore: 100,
  completenessScore: 100,
  recognizedText: "Complete.",
  words: [],
};

describe("PronunciationRecordingController", () => {
  it("idle renders green Record / Mic off", () => {
    const ui = derivePronunciationRecorderUi(INITIAL_PRONUNCIATION_RECORDING_STATE);
    expect(ui.visualState).toBe("idle");
    expect(ui.primaryLabel).toBe("🎤 Record");
    expect(ui.micStatusLine).toBe("Mic off");
    expect(ui.isMicPressed).toBe(false);
  });

  it("click Record -> starting immediately", () => {
    const next = reducePronunciationRecording(INITIAL_PRONUNCIATION_RECORDING_STATE, {
      type: "start_requested",
      word: "complete",
      referenceText: "Complete.",
      practiceLevel: 1,
    });
    const ui = derivePronunciationRecorderUi(next);
    expect(next.phase).toBe("starting");
    expect(ui.visualState).toBe("starting");
    expect(ui.primaryLabel).toBe("Starting microphone…");
    expect(ui.primaryDisabled).toBe(true);
    expect(canStartPronunciationRecording(next)).toBe(false);
  });

  it("recognizer started -> recording red", () => {
    const starting = reducePronunciationRecording(INITIAL_PRONUNCIATION_RECORDING_STATE, {
      type: "start_requested",
      word: "complete",
      referenceText: "Complete.",
      practiceLevel: 1,
    });
    const recording = reducePronunciationRecording(starting, {
      type: "recording_started",
    });
    const ui = derivePronunciationRecorderUi(recording);
    expect(recording.phase).toBe("recording");
    expect(ui.visualState).toBe("listening");
    expect(ui.primaryLabel).toBe("● Recording");
    expect(ui.visualState).not.toBe("idle");
  });

  it("recording has aria-pressed true", () => {
    const recording = reducePronunciationRecording(
      reducePronunciationRecording(INITIAL_PRONUNCIATION_RECORDING_STATE, {
        type: "start_requested",
        word: "complete",
        referenceText: "Complete.",
        practiceLevel: 1,
      }),
      { type: "recording_started" },
    );
    expect(derivePronunciationRecorderUi(recording).isMicPressed).toBe(true);
  });

  it("second start while starting is blocked", () => {
    const starting = reducePronunciationRecording(INITIAL_PRONUNCIATION_RECORDING_STATE, {
      type: "start_requested",
      word: "complete",
      referenceText: "Complete.",
      practiceLevel: 1,
    });
    expect(canStartPronunciationRecording(starting)).toBe(false);
    expect(isPronunciationRecordingActive(starting.phase)).toBe(true);
  });

  it("Stop only works in recording", () => {
    expect(
      canStopPronunciationRecording(
        reducePronunciationRecording(INITIAL_PRONUNCIATION_RECORDING_STATE, {
          type: "start_requested",
          word: "x",
          referenceText: "x",
          practiceLevel: 1,
        }),
      ),
    ).toBe(false);
    const recording = reducePronunciationRecording(
      reducePronunciationRecording(INITIAL_PRONUNCIATION_RECORDING_STATE, {
        type: "start_requested",
        word: "complete",
        referenceText: "Complete.",
        practiceLevel: 1,
      }),
      { type: "recording_started" },
    );
    expect(canStopPronunciationRecording(recording)).toBe(true);
  });

  it("valid segment 100 produces success state and score", () => {
    const success = reducePronunciationRecording(
      reducePronunciationRecording(
        reducePronunciationRecording(INITIAL_PRONUNCIATION_RECORDING_STATE, {
          type: "start_requested",
          word: "complete",
          referenceText: "Complete.",
          practiceLevel: 1,
        }),
        { type: "recording_started" },
      ),
      { type: "assessing_started" },
    );
    const done = reducePronunciationRecording(success, {
      type: "assessment_success",
      assessment,
      score: 100,
    });
    expect(done.phase).toBe("success");
    expect(done.score).toBe(100);
    const ui = derivePronunciationRecorderUi(done);
    expect(ui.primaryLabel).toBe("🎤 Record next");
    expect(ui.micStatusLine).toBe("Assessment complete");
  });

  it("error produces amber Try again", () => {
    const err = reducePronunciationRecording(INITIAL_PRONUNCIATION_RECORDING_STATE, {
      type: "assessment_error",
      message: "Assessment unavailable.",
    });
    const ui = derivePronunciationRecorderUi(err);
    expect(err.phase).toBe("error");
    expect(ui.visualState).toBe("error");
    expect(ui.primaryLabel).toBe("🎤 Try again");
    expect(ui.micStatusLine).toBe("Mic error — try again");
  });

  it("active recording blocks word change via isPronunciationRecordingActive", () => {
    const recording = reducePronunciationRecording(
      reducePronunciationRecording(INITIAL_PRONUNCIATION_RECORDING_STATE, {
        type: "start_requested",
        word: "complete",
        referenceText: "Complete.",
        practiceLevel: 1,
      }),
      { type: "recording_started" },
    );
    expect(isPronunciationRecordingActive(recording.phase)).toBe(true);
  });

  it("assessing is active and not idle visual", () => {
    const assessing = reducePronunciationRecording(
      reducePronunciationRecording(INITIAL_PRONUNCIATION_RECORDING_STATE, {
        type: "start_requested",
        word: "complete",
        referenceText: "Complete.",
        practiceLevel: 1,
      }),
      { type: "assessing_started" },
    );
    const ui = derivePronunciationRecorderUi(assessing);
    expect(ui.visualState).toBe("assessing");
    expect(ui.visualState).not.toBe("idle");
    expect(isPronunciationRecordingActive(assessing.phase)).toBe(true);
  });

  it("pronunciationRecorderUiSnapshot is stable for same micUi", () => {
    const ui = derivePronunciationRecorderUi(INITIAL_PRONUNCIATION_RECORDING_STATE);
    const a = pronunciationRecorderUiSnapshot(ui, "complete", false);
    const b = pronunciationRecorderUiSnapshot(ui, "complete", false);
    expect(a).toBe(b);
  });

  it("sameStringList detects equal lists", () => {
    expect(sameStringList(["a", "b"], ["a", "b"])).toBe(true);
    expect(sameStringList(["a"], ["b"])).toBe(false);
  });

  it("lessonContext merge still supports optional pronunciationRecorder UI payload", () => {
    const micUi = derivePronunciationRecorderUi(
      reducePronunciationRecording(INITIAL_PRONUNCIATION_RECORDING_STATE, {
        type: "recording_started",
      }),
    );
    const merged = mergeLessonContext(DEFAULT_LESSON_CONTEXT, {
      mode: "pronunciation",
      pronunciationWord: "complete",
      recording: true,
      pronunciationRecorder: micUi,
    });
    expect(merged.pronunciationRecorder?.visualState).toBe("listening");
    expect(merged.pronunciationRecorder?.primaryLabel).toBe("● Recording");
  });
});
