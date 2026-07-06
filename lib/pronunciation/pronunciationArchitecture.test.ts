import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  emitStartRecord,
  registerCaptainDeltaRecordBridge,
  resetCaptainDeltaRecordBridgeForTests,
} from "@/lib/captainDelta/lessonContext";

describe("pronunciation architecture — no bridge recording control", () => {
  beforeEach(() => {
    resetCaptainDeltaRecordBridgeForTests();
  });

  it("emitStartRecord does nothing when no bridge is registered", () => {
    expect(emitStartRecord()).toBe(false);
  });

  it("vocabulary bridge is separate from pronunciation controller", () => {
    const startRecord = vi.fn();
    registerCaptainDeltaRecordBridge("vocabulary-test", {
      canRecord: () => true,
      startRecord,
      stopRecord: () => {},
      isRecording: () => false,
    });
    emitStartRecord();
    expect(startRecord).toHaveBeenCalledTimes(1);
  });
});

describe("pronunciation architecture — Azure entry", () => {
  it("recording controller lives in lesson session, not browse shell", () => {
    const lesson = readFileSync(
      join(process.cwd(), "components/Part2Trainer/PronunciationLessonSession.tsx"),
      "utf8",
    );
    const mode = readFileSync(
      join(process.cwd(), "components/Part2Trainer/PronunciationWordsMode.tsx"),
      "utf8",
    );
    expect(lesson).toMatch(/usePronunciationRecordingController/);
    expect(mode).not.toMatch(/usePronunciationRecordingController/);
  });
});
