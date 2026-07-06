import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  emitStartRecord,
  emitStopRecord,
  registerCaptainDeltaRecordBridge,
  resetCaptainDeltaRecordBridgeForTests,
} from "@/lib/captainDelta/lessonContext";

describe("pronunciation record bridge runtime", () => {
  beforeEach(() => {
    resetCaptainDeltaRecordBridgeForTests();
  });

  it("Captain and mission card share the same start handler", () => {
    const startRecord = vi.fn();
    registerCaptainDeltaRecordBridge("pronunciation-test", {
      canRecord: () => true,
      startRecord,
      stopRecord: () => {},
      isRecording: () => false,
    });

    emitStartRecord();
    emitStartRecord();

    expect(startRecord).toHaveBeenCalledTimes(2);
  });

  it("record click never silently no-ops when blocked", () => {
    const startRecord = vi.fn();
    registerCaptainDeltaRecordBridge("pronunciation-test", {
      canRecord: () => true,
      getRecordBlockReason: () => "Azure Speech is not configured.",
      startRecord,
      stopRecord: () => {},
      isRecording: () => false,
    });

    const started = emitStartRecord();
    expect(started).toBe(true);
    expect(startRecord).toHaveBeenCalledTimes(1);
  });

  it("clears stale bridge owner on unregister", () => {
    const startRecord = vi.fn();
    registerCaptainDeltaRecordBridge("owner-a", {
      canRecord: () => true,
      startRecord: () => {},
      stopRecord: () => {},
      isRecording: () => false,
    });
    registerCaptainDeltaRecordBridge("owner-a", null);
    registerCaptainDeltaRecordBridge("owner-b", {
      canRecord: () => true,
      startRecord,
      stopRecord: () => {},
      isRecording: () => false,
    });

    expect(emitStartRecord()).toBe(true);
    expect(startRecord).toHaveBeenCalledTimes(1);
  });

  it("does not stop unless lifecycle is listening", () => {
    const stopRecord = vi.fn();
    registerCaptainDeltaRecordBridge("pronunciation-test", {
      canRecord: () => false,
      startRecord: () => {},
      stopRecord,
      isRecording: () => false,
    });

    emitStopRecord();
    expect(stopRecord).not.toHaveBeenCalled();
  });

  it("stop fires only when isRecording", () => {
    const stopRecord = vi.fn();
    registerCaptainDeltaRecordBridge("pronunciation-test", {
      canRecord: () => false,
      startRecord: () => {},
      stopRecord,
      isRecording: () => true,
    });

    emitStopRecord();
    expect(stopRecord).toHaveBeenCalledTimes(1);
  });
});
