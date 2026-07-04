/**
 * Escutar Prova — one clip at a time (Azure MP3 blobs + ATC MP3 URLs).
 * Serialized queue guarantees the next clip never starts before onended.
 * Prefers offline pack (cached Azure neural MP3s + ATC) when available.
 */

import { synthesizeExamMp3, type AzureVoiceRole } from "@/lib/azure/azureTts";
import {
  segmentIndexAtTime,
  type ContinuousStream,
  type StreamSegment,
} from "@/lib/fullExamListening/continuousStream";
import {
  getCachedAtcBlob,
  getCachedTtsBlob,
  putCachedAtcFromResponse,
  putCachedTtsBlob,
} from "@/lib/fullExamListening/offlinePack";

let generation = 0;
let audioEl: HTMLAudioElement | null = null;
let activeBlobUrl: string | null = null;
let playChain: Promise<unknown> = Promise.resolve();
let isPaused = false;
let pausedTime = 0;
let pausedTicket = 0;
let activePlayResolve: ((played: boolean) => void) | null = null;

/** Continuous stream (iOS lock-screen safe). */
let continuousActive = false;
let continuousSegments: StreamSegment[] = [];
let continuousOnItemIndex: ((itemIndex: number) => void) | null = null;
let continuousLastSeg = -1;
let continuousTimeHandler: (() => void) | null = null;

function getAudio(): HTMLAudioElement {
  if (!audioEl) {
    audioEl = new Audio();
    audioEl.preload = "auto";
    audioEl.setAttribute("playsinline", "true");
    audioEl.setAttribute("webkit-playsinline", "true");
    // Helps iOS treat this as media playback (lock screen / Control Center).
    audioEl.setAttribute("x-webkit-airplay", "allow");
  }
  return audioEl;
}

function clearContinuousTracking(): void {
  continuousActive = false;
  continuousSegments = [];
  continuousOnItemIndex = null;
  continuousLastSeg = -1;
  const el = audioEl;
  if (el && continuousTimeHandler) {
    el.removeEventListener("timeupdate", continuousTimeHandler);
  }
  continuousTimeHandler = null;
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
  clearContinuousTracking();
  stopElementNow();
  clearMediaSession();
}

export function isContinuousPlaybackActive(): boolean {
  return continuousActive;
}

export function setExamPlaybackRate(rate: number): void {
  const el = audioEl;
  if (!el) return;
  el.playbackRate = rate;
}

export function seekContinuousToItem(itemIndex: number): boolean {
  if (!continuousActive || !audioEl) return false;
  const seg =
    continuousSegments.find((s) => s.itemIndex === itemIndex) ??
    continuousSegments.find((s) => s.itemIndex >= itemIndex);
  if (!seg) return false;
  audioEl.currentTime = seg.start;
  continuousLastSeg = continuousSegments.indexOf(seg);
  continuousOnItemIndex?.(seg.itemIndex);
  return true;
}

function clearMediaSession(): void {
  if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
  try {
    navigator.mediaSession.playbackState = "none";
    navigator.mediaSession.metadata = null;
  } catch {
    /* ignore */
  }
}

export function setupMediaSession(handlers: {
  title: string;
  artist?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
}): void {
  if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: handlers.title,
      artist: handlers.artist ?? "ICAO Delta",
      album: "Escutar Prova",
    });
    const bind = (action: MediaSessionAction, fn?: () => void) => {
      try {
        navigator.mediaSession.setActionHandler(action, fn ? () => fn() : null);
      } catch {
        /* unsupported action */
      }
    };
    bind("play", handlers.onPlay);
    bind("pause", handlers.onPause);
    bind("previoustrack", handlers.onPrevious);
    bind("nexttrack", handlers.onNext);
  } catch {
    /* ignore */
  }
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
  if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
    try {
      navigator.mediaSession.playbackState = "paused";
    } catch {
      /* ignore */
    }
  }
  return true;
}

export function resumeExamPlayback(rate = 1): Promise<boolean> {
  if (!isPaused || pausedTicket !== generation) return Promise.resolve(false);
  const el = getAudio();
  const ticket = generation;
  isPaused = false;
  el.playbackRate = rate;
  // Continuous stream: keep currentTime (already paused mid-stream).
  if (!continuousActive) {
    el.currentTime = pausedTime;
  }

  return new Promise((resolve) => {
    let settled = false;
    const settle = (played: boolean) => {
      if (settled) return;
      settled = true;
      activePlayResolve = null;
      resolve(played && ticket === generation);
    };

    // Continuous mode keeps its own onended; resume only unpauses.
    if (continuousActive) {
      if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
        try {
          navigator.mediaSession.playbackState = "playing";
        } catch {
          /* ignore */
        }
      }
      void el.play().then(() => settle(true)).catch(() => settle(false));
      return;
    }

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

/**
 * Play a pre-built continuous exam MP3 (survives iPhone screen lock).
 * Resolves when the whole stream ends or playback is stopped/fails.
 */
export function playContinuousStream(
  stream: ContinuousStream,
  rate: number,
  ticket: number,
  onItemIndex: (itemIndex: number) => void,
  startItemIndex = 0,
): Promise<boolean> {
  return enqueue(async () => {
    if (ticket !== generation) return false;

    clearContinuousTracking();
    stopElementNow();
    if (ticket !== generation) return false;

    continuousActive = true;
    continuousSegments = stream.segments;
    continuousOnItemIndex = onItemIndex;
    continuousLastSeg = -1;

    const url = URL.createObjectURL(stream.blob);
    activeBlobUrl = url;
    const el = getAudio();
    el.playbackRate = rate;

    const startSeg =
      continuousSegments.find((s) => s.itemIndex === startItemIndex) ??
      continuousSegments.find((s) => s.itemIndex >= startItemIndex) ??
      continuousSegments[0];

    continuousTimeHandler = () => {
      if (ticket !== generation || !continuousActive) return;
      const segIdx = segmentIndexAtTime(continuousSegments, el.currentTime);
      if (segIdx !== continuousLastSeg) {
        continuousLastSeg = segIdx;
        const seg = continuousSegments[segIdx];
        if (seg) onItemIndex(seg.itemIndex);
      }
      if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
        try {
          navigator.mediaSession.playbackState = el.paused ? "paused" : "playing";
        } catch {
          /* ignore */
        }
      }
    };
    el.addEventListener("timeupdate", continuousTimeHandler);

    return new Promise((resolve) => {
      let settled = false;
      const settle = (played: boolean) => {
        if (settled) return;
        settled = true;
        activePlayResolve = null;
        if (continuousTimeHandler) {
          el.removeEventListener("timeupdate", continuousTimeHandler);
          continuousTimeHandler = null;
        }
        if (ticket === generation) {
          continuousActive = false;
        }
        resolve(played && ticket === generation);
      };

      activePlayResolve = settle;

      el.onended = () => {
        if (ticket !== generation) {
          settle(false);
          return;
        }
        el.onended = null;
        el.onerror = null;
        el.pause();
        revokeActiveBlob();
        settle(true);
      };
      el.onerror = () => settle(false);
      el.src = url;

      void waitUntilReady(el, ticket).then((ready) => {
        if (!ready || ticket !== generation) {
          settle(false);
          return;
        }
        if (startSeg) {
          el.currentTime = startSeg.start;
          continuousLastSeg = continuousSegments.indexOf(startSeg);
          onItemIndex(startSeg.itemIndex);
        }
        isPaused = false;
        void el.play().catch(() => settle(false));
      });
    });
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
  return enqueue(async () => {
    if (!src || ticket !== generation) return false;

    const cached = await getCachedAtcBlob(src);
    if (cached && ticket === generation) {
      const url = URL.createObjectURL(cached);
      const played = await playSource(url, rate, ticket, true);
      if (!played && ticket === generation) URL.revokeObjectURL(url);
      return played;
    }

    if (ticket !== generation) return false;

    try {
      const res = await fetch(src, { credentials: "same-origin" });
      if (!res.ok || ticket !== generation) return false;
      void putCachedAtcFromResponse(src, res.clone());
      const blob = await res.blob();
      if (ticket !== generation) return false;
      const url = URL.createObjectURL(blob);
      const played = await playSource(url, rate, ticket, true);
      if (!played && ticket === generation) URL.revokeObjectURL(url);
      return played;
    } catch {
      return playSource(src, rate, ticket, false);
    }
  });
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

    let blob = await getCachedTtsBlob(role, trimmed);
    if (!blob && ticket === generation) {
      blob = await synthesizeExamMp3(trimmed, role);
      if (blob) void putCachedTtsBlob(role, trimmed, blob);
    }

    if (!blob || ticket !== generation) {
      if (ticket === generation) {
        onError?.(
          navigator.onLine === false
            ? "Áudio offline não encontrado. Baixe a prova com internet antes."
            : "Falha ao sintetizar voz Azure.",
        );
      }
      return false;
    }

    const url = URL.createObjectURL(blob);
    const played = await playSource(url, rate, ticket, true);
    if (!played && ticket === generation) URL.revokeObjectURL(url);
    return played;
  });
}
