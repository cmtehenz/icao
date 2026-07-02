/**
 * Escutar Prova — one clip at a time (Azure MP3 blobs + ATC MP3 URLs).
 * Serialized queue guarantees the next clip never starts before onended.
 */

import { synthesizeExamMp3, type AzureVoiceRole } from "@/lib/azure/azureTts";

let generation = 0;
let audioEl: HTMLAudioElement | null = null;
let activeBlobUrl: string | null = null;
let playChain: Promise<unknown> = Promise.resolve();
let isPaused = false;
let pausedTime = 0;
let pausedTicket = 0;
let activePlayResolve: ((played: boolean) => void) | null = null;

function getAudio(): HTMLAudioElement {
  if (!audioEl) {
    audioEl = new Audio();
    audioEl.preload = "auto";
  }
  return audioEl;
}

function revokeActiveBlob(): void {
  if (activeBlobUrl) {
    URL.revokeObjectURL(activeBlobUrl);
    activeBlobUrl = null;
  }
}

function resolveActivePlay(played: boolean): void {
  const resolve = activePlayResolve;
  activePlayResolve = null;
  resolve?.(played);
}

function stopElementNow(): void {
  resolveActivePlay(false);
  const el = audioEl;
  if (!el) return;
  el.pause();
  el.onended = null;
  el.onerror = null;
  el.removeAttribute("src");
  revokeActiveBlob();
}

/** Cancel playback and invalidate queued work. */
export function stopExamPlayback(): void {
  generation += 1;
  isPaused = false;
  pausedTime = 0;
  pausedTicket = 0;
  stopElementNow();
}

export function getExamPlaybackGeneration(): number {
  return generation;
}

/** Start a new exam listening session; returns the active generation ticket. */
export function beginExamPlayback(): number {
  stopExamPlayback();
  return generation;
}

export function pauseExamPlayback(): boolean {
  const el = audioEl;
  if (!el || el.paused || !el.src) return isPaused;
  pausedTime = el.currentTime;
  pausedTicket = generation;
  isPaused = true;
  el.pause();
  return true;
}

export function resumeExamPlayback(rate = 1): Promise<boolean> {
  if (!isPaused || pausedTicket !== generation) return Promise.resolve(false);
  const el = getAudio();
  const ticket = generation;
  isPaused = false;
  el.playbackRate = rate;
  el.currentTime = pausedTime;

  return new Promise((resolve) => {
    let settled = false;
    const settle = (played: boolean) => {
      if (settled) return;
      settled = true;
      activePlayResolve = null;
      resolve(played && ticket === generation);
    };

    activePlayResolve = settle;

    const onDone = () => {
      if (ticket !== generation) {
        settle(false);
        return;
      }
      el.onended = null;
      el.onerror = null;
      el.pause();
      if (activeBlobUrl) revokeActiveBlob();
      settle(true);
    };

    el.onended = onDone;
    el.onerror = () => settle(false);
    void el.play().catch(() => settle(false));
  });
}

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = playChain.then(task, task);
  playChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function waitUntilReady(el: HTMLAudioElement, ticket: number): Promise<boolean> {
  if (ticket !== generation) return Promise.resolve(false);
  if (el.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) return Promise.resolve(true);

  return new Promise((resolve) => {
    const timeout = window.setTimeout(() => done(false), 15000);
    const done = (ok: boolean) => {
      window.clearTimeout(timeout);
      el.removeEventListener("canplaythrough", onReady);
      el.removeEventListener("error", onFail);
      resolve(ok && ticket === generation);
    };
    const onReady = () => done(true);
    const onFail = () => done(false);
    el.addEventListener("canplaythrough", onReady, { once: true });
    el.addEventListener("error", onFail, { once: true });
  });
}

function playSource(src: string, rate: number, ticket: number, isBlob: boolean): Promise<boolean> {
  if (!src || ticket !== generation) return Promise.resolve(false);

  isPaused = false;
  stopElementNow();
  if (ticket !== generation) return Promise.resolve(false);

  const el = getAudio();
  el.playbackRate = rate;
  if (isBlob) activeBlobUrl = src;

  return new Promise((resolve) => {
    let settled = false;
    const settle = (played: boolean) => {
      if (settled) return;
      settled = true;
      if (activePlayResolve === settle) activePlayResolve = null;
      resolve(played && ticket === generation);
    };

    activePlayResolve = settle;

    const onDone = () => {
      if (ticket !== generation) {
        settle(false);
        return;
      }
      el.onended = null;
      el.onerror = null;
      el.pause();
      if (isBlob) revokeActiveBlob();
      settle(true);
    };

    el.onended = onDone;
    el.onerror = () => settle(false);
    el.src = src;

    void waitUntilReady(el, ticket).then((ready) => {
      if (!ready || ticket !== generation) {
        settle(false);
        return;
      }
      void el.play().catch(() => settle(false));
    });
  });
}

export function queueExamMp3(src: string, rate: number, ticket: number): Promise<boolean> {
  return enqueue(() => playSource(src, rate, ticket, false));
}

export function queueExamTts(
  text: string,
  role: AzureVoiceRole,
  rate: number,
  ticket: number,
  onError?: (msg: string) => void,
): Promise<boolean> {
  return enqueue(async () => {
    const trimmed = text.trim();
    if (!trimmed || ticket !== generation) return false;

    const blob = await synthesizeExamMp3(trimmed, role);
    if (!blob || ticket !== generation) {
      if (ticket === generation) onError?.("Falha ao sintetizar voz Azure.");
      return false;
    }

    const url = URL.createObjectURL(blob);
    const played = await playSource(url, rate, ticket, true);
    if (!played && ticket === generation) URL.revokeObjectURL(url);
    return played;
  });
}
