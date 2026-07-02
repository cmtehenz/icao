/**
 * Exam listening TTS — Azure Neural via single shared audio bus (no overlapping).
 */

import {
  beginExamAudioSession,
  pauseExamAudio,
  playExamAzureTts,
  playExamMp3,
  resumeExamAudio,
  stopExamAudio,
} from "@/lib/fullExamListening/examAudioBus";
import { isAzureTtsAvailable, type AzureVoiceRole } from "@/lib/azure/azureTts";

export type VoiceType = AzureVoiceRole;
export type SpeechEngine = "azure" | "none";

export type SpeakOptions = {
  rate?: number;
  ticket?: number;
  onEnd?: () => void;
  onError?: (err: string) => void;
};

let activeTicket = 0;
let lastError: string | null = null;

export function getLastSpeechError(): string | null {
  return lastError;
}

export function getActiveSpeechEngine(): SpeechEngine {
  return activeTicket > 0 ? "azure" : "none";
}

export function isSpeechActive(): boolean {
  return activeTicket > 0;
}

export function stopSpeech(): void {
  stopExamAudio();
  activeTicket = 0;
}

export function pauseSpeech(): boolean {
  return pauseExamAudio();
}

export function resumeSpeech(_type: VoiceType = "female_examiner", rate = 1, onEnd?: () => void): void {
  resumeExamAudio(rate, onEnd);
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
  const ticket = options.ticket ?? activeTicket;
  if (!ticket) {
    options.onError?.("Sessão de áudio inválida.");
    options.onEnd?.();
    return false;
  }

  activeTicket = ticket;
  lastError = null;

  void playExamAzureTts(trimmed, voiceType, rate, ticket, (err) => {
    lastError = err;
    options.onError?.(err);
  }).finally(() => {
    if (activeTicket === ticket) activeTicket = 0;
    options.onEnd?.();
  });

  return true;
}

/** Play original exam MP3 on the same bus (used by the exam player hook). */
export function playExamOriginalAudio(
  src: string,
  rate: number,
  ticket: number,
  onEnd?: () => void,
): void {
  void playExamMp3(src, rate, ticket).finally(() => onEnd?.());
}

export function beginSpeechSession(): number {
  const ticket = beginExamAudioSession();
  activeTicket = ticket;
  return ticket;
}

export function prefetchSpeech(): void {}

export async function warmSpeechEngine(): Promise<SpeechEngine> {
  const ok = await isAzureTtsAvailable();
  return ok ? "azure" : "none";
}

export async function isAzureSpeechConfigured(): Promise<boolean> {
  return isAzureTtsAvailable();
}

export function loadPreferredVoices(): void {}
export function setPreferredVoice(): void {}
export function listAvailableVoices(): SpeechSynthesisVoice[] {
  return [];
}
