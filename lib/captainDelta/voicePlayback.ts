/** Detach and silence an HTMLAudioElement — safe to call repeatedly. */
export function detachHtmlAudio(audio: HTMLAudioElement | null | undefined): void {
  if (!audio) return;
  audio.onended = null;
  audio.onplay = null;
  audio.onpause = null;
  audio.onerror = null;
  try {
    audio.pause();
  } catch {
    /* ignore */
  }
  audio.currentTime = 0;
  audio.removeAttribute("src");
  try {
    audio.load();
  } catch {
    /* ignore */
  }
}

export type CaptainVoiceGenerationState = {
  generation: number;
};

export function createCaptainVoiceGenerationState(): CaptainVoiceGenerationState {
  return { generation: 0 };
}

/** Bump generation and return the new live token. Idempotent callers may invoke multiple times. */
export function bumpCaptainVoiceGeneration(
  state: CaptainVoiceGenerationState,
): number {
  state.generation += 1;
  return state.generation;
}

export function isCaptainVoiceGenerationCurrent(
  requestGeneration: number,
  state: CaptainVoiceGenerationState,
): boolean {
  return requestGeneration === state.generation;
}
