import { describe, expect, it, beforeEach } from "vitest";
import {
  emitStartRecord,
  getCaptainDeltaRecordBridge,
  registerCaptainDeltaRecordBridge,
  resetCaptainDeltaRecordBridgeForTests,
} from "@/lib/captainDelta/lessonContext";

describe("Captain Delta record bridge", () => {
  beforeEach(() => {
    resetCaptainDeltaRecordBridgeForTests();
  });

  it("registers and unregisters by owner id only", () => {
    const bridgeA = {
      canRecord: () => true,
      startRecord: () => {},
      stopRecord: () => {},
      isRecording: () => false,
    };
    registerCaptainDeltaRecordBridge("owner-a", bridgeA);
    expect(getCaptainDeltaRecordBridge()).toBe(bridgeA);

    registerCaptainDeltaRecordBridge("owner-b", {
      canRecord: () => true,
      startRecord: () => {},
      stopRecord: () => {},
      isRecording: () => false,
    });
    expect(getCaptainDeltaRecordBridge()).not.toBe(bridgeA);

    registerCaptainDeltaRecordBridge("owner-a", null);
    expect(getCaptainDeltaRecordBridge()).not.toBeNull();

    registerCaptainDeltaRecordBridge("owner-b", null);
    expect(getCaptainDeltaRecordBridge()).toBeNull();
  });

  it("routes start record through the active bridge once", () => {
    let starts = 0;
    registerCaptainDeltaRecordBridge("owner-a", {
      canRecord: () => true,
      startRecord: () => {
        starts += 1;
      },
      stopRecord: () => {},
      isRecording: () => false,
    });

    emitStartRecord();
    expect(starts).toBe(1);
    expect(getCaptainDeltaRecordBridge()).not.toBeNull();
  });
});
