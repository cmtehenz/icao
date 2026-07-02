/**
 * Single audio output for Escutar Prova — one clip at a time (TTS blobs + MP3 URLs).
 */

import { synthesizeAzureSpeech, type AzureVoiceRole } from "@/lib/azure/azureTts";

let session = 0;
let audioEl: HTMLAudioElement | null = null;
let blobUrl: string | null = null;
let pausedTime = 0;
let pausedTicket = 0;
let isPaused = false;
let pendingResolve: (() => void) | null = null;
let synthChain: Promise<unknown> = Promise.resolve();

function getAudio(): HTMLAudioElement {
  if (!audioEl) audioEl = new Audio();
  return audioEl;
}

function revokeBlob(): void {
  if (blobUrl) {
    URL.revokeObjectURL(blobUrl);
    blobUrl = null;
  }
}

function resolvePending(): void {
  const resolve = pendingResolve;
  pendingResolve = null;
  resolve?.();
}

function hardStopElement(): void {
  resolvePending();
  const el = audioEl;
  if (!el) return;
  el.pause();
  el.onended = null;
  el.onerror = null;
  el.removeAttribute("src");
  try {
    el.load();
  } catch {
    /* ignore */
  }
  revokeBlob();
}

/** Invalidate in-flight playback and stop the speaker immediately. */
export function stopExamAudio(): void {
  session += 1;
  isPaused = false;
  pausedTime = 0;
  pausedTicket = 0;
  hardStopElement();
}

export function getExamAudioSession(): number {
  return session;
}

export function beginExamAudioSession(): number {
  stopExamAudio();
  return session;
}

export function pauseExamAudio(): boolean {
  const el = audioEl;
  if (!el || el.paused || !el.src) return isPaused;
  pausedTime = el.currentTime;
  pausedTicket = session;
  isPaused = true;
  el.pause();
  return true;
}

export function resumeExamAudio(rate = 1, onEnd?: () => void): boolean {
  if (!isPaused || pausedTicket !== session) return false;
  const el = getAudio();
  const ticket = session;
  isPaused = false;
  el.playbackRate = rate;
  el.currentTime = pausedTime;

  const finish = (played: boolean) => {
    if (pendingResolve === abort) pendingResolve = null;
    if (session !== ticket) return;
    hardStopElement();
    if (played) onEnd?.();
  };

  const abort = () => finish(false);
  pendingResolve = abort;

  const onDone = () => finish(true);
  el.onended = onDone;
  el.onerror = onDone;
  void el.play().catch(() => finish(false));
  return true;
}

function playOnElement(src: string, rate: number, ticket: number): Promise<boolean> {
  if (ticket !== session) return Promise.resolve(false);

  hardStopElement();
  if (ticket !== session) return Promise.resolve(false);

  const el = getAudio();
  el.playbackRate = rate;
  el.src = src;

  return new Promise((resolve) => {
    let settled = false;
    const settle = (played: boolean) => {
      if (settled) return;
      settled = true;
      if (pendingResolve === abort) pendingResolve = null;
      resolve(played && ticket === session);
    };

    const abort = () => settle(false);
    pendingResolve = abort;

    const onDone = () => {
      if (ticket !== session) {
        settle(false);
        return;
      }
      hardStopElement();
      settle(true);
    };

    el.onended = onDone;
    el.onerror = onDone;

    if (ticket !== session) {
      settle(false);
      return;
    }
    void el.play().catch(() => settle(false));
  });
}

export async function playExamMp3(src: string, rate: number, ticket: number): Promise<boolean> {
  if (!src || ticket !== session) return false;
  isPaused = false;
  return playOnElement(src, rate, ticket);
}

export async function playExamAzureTts(
  text: string,
  role: AzureVoiceRole,
  rate: number,
  ticket: number,
  onError?: (msg: string) => void,
): Promise<boolean> {
  const trimmed = text.trim();
  if (!trimmed || ticket !== session) return false;

  isPaused = false;
  const synthTicket = session;

  const blob = (await (synthChain = synthChain.then(async () => {
    if (synthTicket !== session || ticket !== session) return null;
    return synthesizeAzureSpeech(trimmed, role);
  }))) as Blob | null;

  if (synthTicket !== session || ticket !== session) return false;

  if (!blob) {
    onError?.("Falha ao sintetizar voz Azure.");
    return false;
  }

  blobUrl = URL.createObjectURL(blob);
  return playOnElement(blobUrl, rate, ticket);
}
