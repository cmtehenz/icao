import { describe, expect, it, vi } from "vitest";
import {
  bumpCaptainVoiceGeneration,
  createCaptainVoiceGenerationState,
  detachHtmlAudio,
  isCaptainVoiceGenerationCurrent,
} from "@/lib/captainDelta/voicePlayback";

describe("Captain voice playback helpers", () => {
  it("detachHtmlAudio pauses and clears src", () => {
    const pause = vi.fn();
    const load = vi.fn();
    const removeAttribute = vi.fn();
    const audio = {
      pause,
      load,
      removeAttribute,
      currentTime: 5,
      onended: () => {},
      onplay: () => {},
      onpause: () => {},
      onerror: () => {},
    } as unknown as HTMLAudioElement;

    detachHtmlAudio(audio);
    expect(pause).toHaveBeenCalled();
    expect(removeAttribute).toHaveBeenCalledWith("src");
    expect(load).toHaveBeenCalled();
    expect(audio.currentTime).toBe(0);
  });

  it("stop generation bump is idempotent for state tracking", () => {
    const state = createCaptainVoiceGenerationState();
    const first = bumpCaptainVoiceGeneration(state);
    const second = bumpCaptainVoiceGeneration(state);
    expect(first).toBe(1);
    expect(second).toBe(2);
    expect(isCaptainVoiceGenerationCurrent(1, state)).toBe(false);
    expect(isCaptainVoiceGenerationCurrent(2, state)).toBe(true);
  });

  it("only latest generation is current after route-style cancel", () => {
    const state = createCaptainVoiceGenerationState();
    const routeA = bumpCaptainVoiceGeneration(state);
    bumpCaptainVoiceGeneration(state);
    expect(isCaptainVoiceGenerationCurrent(routeA, state)).toBe(false);
    expect(isCaptainVoiceGenerationCurrent(state.generation, state)).toBe(true);
  });
});
