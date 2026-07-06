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
