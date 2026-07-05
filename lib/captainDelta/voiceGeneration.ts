/** Guards async Captain TTS so stale promises cannot play after a newer speak/stop. */
export function shouldAbortCaptainSpeak(
  requestGeneration: number,
  liveGeneration: number,
): boolean {
  return requestGeneration !== liveGeneration;
}
