/**
 * Exam listening TTS — Azure Neural only (Jenny examiner, Guy candidate).
 */

import {
  isAzureTtsAvailable,
  pauseAzureSpeech,
  resumeAzureSpeech,
  speakAzureText,
  stopAzureSpeech,
  type AzureVoiceRole,
} from "@/lib/azure/azureTts";

export type VoiceType = AzureVoiceRole;
export type SpeechEngine = "azure" | "none";

export type SpeakOptions = {
  rate?: number;
  onEnd?: () => void;
  onError?: (err: string) => void;
};

let speaking = false;
let paused = false;
let pendingOnEnd: (() => void) | undefined;
let lastError: string | null = null;

export function getLastSpeechError(): string | null {
  return lastError;
}

export function getActiveSpeechEngine(): SpeechEngine {
  return speaking ? "azure" : "none";
}

export function isSpeechActive(): boolean {
  return speaking;
}

export function stopSpeech(): void {
  stopAzureSpeech();
  speaking = false;
  paused = false;
  pendingOnEnd = undefined;
}

export function pauseSpeech(): void {
  if (pauseAzureSpeech()) {
    paused = true;
    speaking = false;
  }
}

export function resumeSpeech(type: VoiceType = "female_examiner", rate = 1, onEnd?: () => void): void {
  if (!paused) return;
  paused = false;
  speaking = true;
  const done = onEnd ?? pendingOnEnd;
  resumeAzureSpeech(done, (err) => {
    lastError = err;
    speaking = false;
    pendingOnEnd = undefined;
    done?.();
  });
}

export function speakText(text: string, voiceType: VoiceType, options: SpeakOptions = {}): boolean {
  const trimmed = text.trim();
  if (!trimmed) {
    options.onEnd?.();
    return false;
  }

  if (typeof window === "undefined") {
    options.onError?.("TTS indisponível no servidor.");
    options.onEnd?.();
    return false;
  }

  const rate = options.rate ?? 1;
  pendingOnEnd = options.onEnd;
  speaking = true;
  paused = false;
  lastError = null;

  void speakAzureText(
    trimmed,
    voiceType,
    rate,
    () => {
      speaking = false;
      pendingOnEnd = undefined;
      options.onEnd?.();
    },
    (err) => {
      lastError = err;
      speaking = false;
      pendingOnEnd = undefined;
      options.onError?.(err);
      options.onEnd?.();
    },
  );

  return true;
}

export function prefetchSpeech(): void {
  /* Azure streams directly — no browser prefetch needed */
}

export async function warmSpeechEngine(): Promise<SpeechEngine> {
  const ok = await isAzureTtsAvailable();
  return ok ? "azure" : "none";
}

export async function isAzureSpeechConfigured(): Promise<boolean> {
  return isAzureTtsAvailable();
}

// Legacy no-ops — browser voices not used in exam listening
export function loadPreferredVoices(): void {}
export function setPreferredVoice(): void {}
export function listAvailableVoices(): SpeechSynthesisVoice[] {
  return [];
}
