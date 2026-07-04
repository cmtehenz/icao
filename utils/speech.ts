/**
 * Exam listening audio — serialized pipeline for TTS + ATC MP3s.
 */

import {
  beginExamPlayback,
  getExamPlaybackGeneration,
  isContinuousPlaybackActive,
  pauseExamPlayback,
  playContinuousStream,
  queueExamMp3,
  queueExamTts,
  resumeExamPlayback,
  seekContinuousToItem,
  setExamPlaybackRate,
  setupMediaSession,
  stopExamPlayback,
} from "@/lib/fullExamListening/examAudioPipeline";
import type { ContinuousStream } from "@/lib/fullExamListening/continuousStream";
import {
  isAzureTtsAvailable,
  stopAzureSpeech,
  type AzureVoiceRole,
} from "@/lib/azure/azureTts";

export type VoiceType = AzureVoiceRole;
export type SpeechEngine = "azure" | "none";

export type SpeakOptions = {
  rate?: number;
  ticket?: number;
  onError?: (err: string) => void;
};

let lastError: string | null = null;

export function getLastSpeechError(): string | null {
  return lastError;
}

export function getActiveSpeechEngine(): SpeechEngine {
  return "azure";
}

export function stopSpeech(): void {
  stopExamPlayback();
  stopAzureSpeech();
}

export function pauseSpeech(): boolean {
  return pauseExamPlayback();
}

export function resumeSpeech(rate = 1): Promise<boolean> {
  return resumeExamPlayback(rate);
}

export async function speakText(
  text: string,
  voiceType: VoiceType,
  options: SpeakOptions = {},
): Promise<boolean> {
  const ticket = options.ticket ?? getExamPlaybackGeneration();
  if (!ticket) return false;

  lastError = null;
  const ok = await queueExamTts(text, voiceType, options.rate ?? 1, ticket, (err) => {
    lastError = err;
    options.onError?.(err);
  });
  if (!ok && !lastError) {
    lastError = "Falha ao reproduzir voz Azure.";
    options.onError?.(lastError);
  }
  return ok;
}

export async function playExamOriginalAudio(
  src: string,
  rate: number,
  ticket: number,
): Promise<boolean> {
  return queueExamMp3(src, rate, ticket);
}

export function beginSpeechSession(): number {
  stopAzureSpeech();
  return beginExamPlayback();
}

export function getExamAudioSession(): number {
  return getExamPlaybackGeneration();
}

export function isContinuousAudioActive(): boolean {
  return isContinuousPlaybackActive();
}

export function seekContinuousAudio(itemIndex: number): boolean {
  return seekContinuousToItem(itemIndex);
}

export function setContinuousPlaybackRate(rate: number): void {
  setExamPlaybackRate(rate);
}

export async function playExamContinuousStream(
  stream: ContinuousStream,
  rate: number,
  ticket: number,
  onItemIndex: (itemIndex: number) => void,
  startItemIndex = 0,
): Promise<boolean> {
  return playContinuousStream(stream, rate, ticket, onItemIndex, startItemIndex);
}

export function configureExamMediaSession(handlers: {
  title: string;
  artist?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
}): void {
  setupMediaSession(handlers);
}

export async function warmSpeechEngine(): Promise<SpeechEngine> {
  const ok = await isAzureTtsAvailable();
  return ok ? "azure" : "none";
}

export async function isAzureSpeechConfigured(): Promise<boolean> {
  return isAzureTtsAvailable();
}

export function prefetchSpeech(): void {}
export function loadPreferredVoices(): void {}
export function setPreferredVoice(): void {}
export function listAvailableVoices(): SpeechSynthesisVoice[] {
  return [];
}
