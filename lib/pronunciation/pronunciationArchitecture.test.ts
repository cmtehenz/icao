import { beforeEach, describe, expect, it, vi } from "vitest";

describe("pronunciation architecture — no bridge recording control", () => {
  beforeEach(async () => {
    const { resetCaptainDeltaRecordBridgeForTests } = await import(
      "@/lib/captainDelta/lessonContext"
    );
    resetCaptainDeltaRecordBridgeForTests();
  });

  it("emitStartRecord does nothing when no bridge is registered", async () => {
    const { emitStartRecord } = await import("@/lib/captainDelta/lessonContext");
    expect(emitStartRecord()).toBe(false);
  });

  it("vocabulary bridge is separate from pronunciation controller", async () => {
    const { emitStartRecord, registerCaptainDeltaRecordBridge } = await import(
      "@/lib/captainDelta/lessonContext"
    );
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

describe("pronunciation architecture — Word Mission owns recording", () => {
  it("Word Mission session mounts the pronunciation recording controller", async () => {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const session = readFileSync(
      join(process.cwd(), "components/WordMission/WordMissionSession.tsx"),
      "utf8",
    );
    expect(session).toMatch(/usePronunciationRecordingController/);
    expect(session).not.toMatch(/useVocabularyCaptainBridge/);
    expect(session).not.toMatch(/PronunciationRecorder/);
  });
});
