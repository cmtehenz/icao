import { describe, expect, it } from "vitest";
import {
  acquireRecordingSession,
  forceReleaseRecordingSession,
  isRecordingMutexHeld,
  releaseRecordingSession,
} from "@/lib/azure/recognizerSession";
import {
  isPronunciationRecordButtonDisabled,
  pronunciationRecordBlockLabel,
  resolvePronunciationRecordBlockReason,
  resolvePronunciationRecordDisableReason,
} from "@/lib/captainDelta/pronunciationRecordReason";

describe("pronunciation record gate", () => {
  const ready = {
    activeWord: true,
    azureConfigured: true,
    lifecycle: "idle" as const,
    assessingPending: false,
    listenPlaying: false,
    captainSpeaking: false,
    recognizerBusy: false,
    browserSupported: true,
  };

  it("allows record when gate is ready", () => {
    expect(isPronunciationRecordButtonDisabled(ready)).toBe(false);
    expect(resolvePronunciationRecordBlockReason(ready)).toBeNull();
  });

  it("exposes block reason for missing active word without disabling button", () => {
    const reason = resolvePronunciationRecordBlockReason({
      ...ready,
      activeWord: false,
    });
    expect(reason).toBe("no_active_word");
    expect(isPronunciationRecordButtonDisabled({ ...ready, activeWord: false })).toBe(false);
    expect(pronunciationRecordBlockLabel(reason!)).toContain("Select a word");
  });

  it("exposes block reason when already recording without disabling Record button", () => {
    const busy = { ...ready, lifecycle: "listening" as const };
    expect(resolvePronunciationRecordBlockReason(busy)).toBe("already_recording");
    expect(isPronunciationRecordButtonDisabled(busy)).toBe(false);
  });

  it("blocks start while lifecycle is starting", () => {
    const starting = { ...ready, lifecycle: "starting" as const };
    expect(resolvePronunciationRecordBlockReason(starting)).toBe("already_recording");
  });

  it("exposes block reason when listen is playing without disabling button", () => {
    const listening = { ...ready, listenPlaying: true };
    expect(resolvePronunciationRecordBlockReason(listening)).toBe("listen_playing");
    expect(isPronunciationRecordButtonDisabled(listening)).toBe(false);
  });

  it("recognizer_busy shows notice text but does not disable the Record button", () => {
    const busyGate = { ...ready, recognizerBusy: true };
    expect(resolvePronunciationRecordBlockReason(busyGate)).toBe("recognizer_busy");
    expect(resolvePronunciationRecordDisableReason(busyGate)).toBeNull();
    expect(isPronunciationRecordButtonDisabled(busyGate)).toBe(false);
    expect(pronunciationRecordBlockLabel("recognizer_busy")).toBe(
      "Microphone is busy. Try again.",
    );
  });

  it("does not block record when azure is not yet probed", () => {
    const gate = { ...ready, azureConfigured: false };
    expect(resolvePronunciationRecordBlockReason(gate)).toBeNull();
    expect(isPronunciationRecordButtonDisabled(gate)).toBe(false);
  });

  it("stale mutex does not permanently disable Record", () => {
    const busyGate = { ...ready, recognizerBusy: true };
    expect(isPronunciationRecordButtonDisabled(busyGate)).toBe(false);
  });

  it("clicking Record clears stale mutex and allows start", async () => {
    const first = await acquireRecordingSession("stale-pronunciation");
    expect(first.acquired).toBe(true);
    expect(isRecordingMutexHeld()).toBe(true);

    forceReleaseRecordingSession();
    expect(isRecordingMutexHeld()).toBe(false);

    const afterRelease = { ...ready, recognizerBusy: false };
    expect(resolvePronunciationRecordBlockReason(afterRelease)).toBeNull();

    releaseRecordingSession("stale-pronunciation");
  });
});
