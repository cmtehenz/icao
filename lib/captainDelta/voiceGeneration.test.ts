import { describe, expect, it } from "vitest";
import { shouldAbortCaptainSpeak } from "@/lib/captainDelta/voiceGeneration";

describe("Captain voice generation", () => {
  it("stale TTS promise is aborted when a newer speak starts", () => {
    expect(shouldAbortCaptainSpeak(1, 2)).toBe(true);
    expect(shouldAbortCaptainSpeak(2, 2)).toBe(false);
  });

  it("generation mismatch blocks playback after stop", () => {
    expect(shouldAbortCaptainSpeak(4, 5)).toBe(true);
    expect(shouldAbortCaptainSpeak(5, 5)).toBe(false);
  });
});
