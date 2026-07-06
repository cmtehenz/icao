import { describe, expect, it } from "vitest";
import { shouldAbortCaptainSpeak } from "@/lib/captainDelta/voiceGeneration";
import {
  bumpCaptainVoiceGeneration,
  createCaptainVoiceGenerationState,
  detachHtmlAudio,
  isCaptainVoiceGenerationCurrent,
} from "@/lib/captainDelta/voicePlayback";

/** Mirrors cancelPlayback generation bump on route pathname change. */
function cancelRouteVoice(state: ReturnType<typeof createCaptainVoiceGenerationState>) {
  return bumpCaptainVoiceGeneration(state);
}

/** Mirrors deliverMessage pre-speak cancel before setting the card. */
function cancelBeforeDeliver(state: ReturnType<typeof createCaptainVoiceGenerationState>) {
  return bumpCaptainVoiceGeneration(state);
}

/** Mirrors speak() entry cancelPlayback before starting TTS. */
function cancelBeforeSpeak(state: ReturnType<typeof createCaptainVoiceGenerationState>) {
  return bumpCaptainVoiceGeneration(state);
}

describe("Captain route-change voice cancellation", () => {
  it("route change stops current voice — in-flight generation becomes stale", () => {
    const state = createCaptainVoiceGenerationState();
    const inflight = bumpCaptainVoiceGeneration(state);
    cancelRouteVoice(state);
    expect(shouldAbortCaptainSpeak(inflight, state.generation)).toBe(true);
  });

  it("stale TTS promise cannot play after route change", async () => {
    const state = createCaptainVoiceGenerationState();
    const requestGen = bumpCaptainVoiceGeneration(state);

    cancelRouteVoice(state);

    const azureReturned = Promise.resolve(new Blob(["audio"]));
    const blob = await azureReturned;
    expect(blob).toBeTruthy();
    expect(shouldAbortCaptainSpeak(requestGen, state.generation)).toBe(true);
  });

  it("new route voice starts only after cancellation — latest generation is current", () => {
    const state = createCaptainVoiceGenerationState();
    const oldRoute = bumpCaptainVoiceGeneration(state);

    cancelRouteVoice(state);
    cancelBeforeDeliver(state);
    const newSpeak = cancelBeforeSpeak(state);

    expect(isCaptainVoiceGenerationCurrent(oldRoute, state)).toBe(false);
    expect(isCaptainVoiceGenerationCurrent(newSpeak, state)).toBe(true);
    expect(shouldAbortCaptainSpeak(newSpeak, state.generation)).toBe(false);
  });

  it("only latest generation can play", () => {
    const state = createCaptainVoiceGenerationState();
    const first = bumpCaptainVoiceGeneration(state);
    const second = bumpCaptainVoiceGeneration(state);
    const third = bumpCaptainVoiceGeneration(state);

    expect(isCaptainVoiceGenerationCurrent(first, state)).toBe(false);
    expect(isCaptainVoiceGenerationCurrent(second, state)).toBe(false);
    expect(isCaptainVoiceGenerationCurrent(third, state)).toBe(true);
  });

  it("stop/cancel is idempotent — repeated detach and generation bumps are safe", () => {
    const state = createCaptainVoiceGenerationState();
    const pause = () => {};
    const audio = {
      pause,
      load: () => {},
      removeAttribute: () => {},
      currentTime: 0,
      onended: null,
      onplay: null,
      onpause: null,
      onerror: null,
    } as unknown as HTMLAudioElement;

    detachHtmlAudio(audio);
    detachHtmlAudio(audio);
    detachHtmlAudio(null);

    bumpCaptainVoiceGeneration(state);
    bumpCaptainVoiceGeneration(state);
    bumpCaptainVoiceGeneration(state);

    expect(state.generation).toBe(3);
  });
});
