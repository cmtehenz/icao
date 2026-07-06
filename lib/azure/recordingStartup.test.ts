import { describe, expect, it, vi } from "vitest";
import {
  MIC_START_FAILED,
  RECORDING_PHASE_LABELS,
  RECORD_STARTUP_TIMEOUTS,
  recordingPhaseLabel,
  StartupTimeoutError,
  withStartupTimeout,
} from "@/lib/azure/recordingStartup";

describe("recording startup UX", () => {
  it("exposes phase labels for each startup state", () => {
    expect(RECORDING_PHASE_LABELS.preparing).toBe("Preparing microphone…");
    expect(RECORDING_PHASE_LABELS.permission).toBe(
      "Requesting microphone permission…",
    );
    expect(RECORDING_PHASE_LABELS.connecting).toBe("Connecting to Azure Speech…");
    expect(RECORDING_PHASE_LABELS.recording).toBe("Recording — speak clearly…");
    expect(RECORDING_PHASE_LABELS.assessing).toBe(
      "Assessing your pronunciation…",
    );
  });

  it("returns null label for idle phase", () => {
    expect(recordingPhaseLabel("idle")).toBeNull();
    expect(recordingPhaseLabel("preparing")).toBe(
      RECORDING_PHASE_LABELS.preparing,
    );
  });

  it("uses 2s idle/acquire and 10s getUserMedia timeouts", () => {
    expect(RECORD_STARTUP_TIMEOUTS.waitIdle).toBe(2000);
    expect(RECORD_STARTUP_TIMEOUTS.acquire).toBe(2000);
    expect(RECORD_STARTUP_TIMEOUTS.getUserMedia).toBe(10000);
  });

  it("withStartupTimeout rejects with stage name", async () => {
    vi.useFakeTimers();
    const pending = withStartupTimeout(
      new Promise<string>(() => {}),
      50,
      "acquireSession",
    );
    const assertion = expect(pending).rejects.toBeInstanceOf(StartupTimeoutError);
    await vi.advanceTimersByTimeAsync(50);
    await assertion;
    vi.useRealTimers();
  });

  it("withStartupTimeout resolves before deadline", async () => {
    await expect(
      withStartupTimeout(Promise.resolve("ok"), 100, "getUserMedia"),
    ).resolves.toBe("ok");
  });

  it("exposes mic start failure copy", () => {
    expect(MIC_START_FAILED).toBe("Microphone did not start. Please try again.");
  });
});
