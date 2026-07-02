/**
 * Exam listening audio — Azure speaker for TTS, shared bus for ATC MP3s.
 */

import { getExamAudioSession, playExamMp3, stopExamAudio } from "@/lib/fullExamListening/examAudioBus";
import {
  isAzureTtsAvailable,
  speakAzureText,
  stopAzureSpeech,
  type AzureVoiceRole,
} from "@/lib/azure/azureTts";

export type VoiceType = AzureVoiceRole;
export type SpeechEngine = "azure" | "none";

export type SpeakOptions = {
  rate?: number;
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
  stopExamAudio();
  stopAzureSpeech();
}

export function pauseSpeech(): boolean {
  return false;
}

export function resumeSpeech(): void {}

export async function speakText(
  text: string,
  voiceType: VoiceType,
  options: SpeakOptions = {},
): Promise<boolean> {
  lastError = null;
  return speakAzureText(text, voiceType, options.rate ?? 1, (err) => {
    lastError = err;
    options.onError?.(err);
  });
}

export async function playExamOriginalAudio(
  src: string,
  rate: number,
  ticket: number,
): Promise<boolean> {
  return playExamMp3(src, rate, ticket);
}

export function beginSpeechSession(): number {
  stopExamAudio();
  stopAzureSpeech();
  return getExamAudioSession();
}

export { getExamAudioSession };

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
