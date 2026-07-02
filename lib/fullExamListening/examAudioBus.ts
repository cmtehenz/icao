/**
 * MP3 playback bus for Escutar Prova (ATC originals). TTS uses Azure speaker directly.
 */

let session = 0;
let audioEl: HTMLAudioElement | null = null;
let pendingResolve: (() => void) | null = null;

function getAudio(): HTMLAudioElement {
  if (!audioEl) {
    audioEl = new Audio();
    audioEl.preload = "auto";
  }
  return audioEl;
}

function firePendingAbort(): void {
  const abort = pendingResolve;
  pendingResolve = null;
  abort?.();
}

function hardStopElement(): void {
  firePendingAbort();
  const el = audioEl;
  if (!el) return;
  el.pause();
  el.onended = null;
  el.onerror = null;
  el.removeAttribute("src");
}

export function stopExamAudio(): void {
  session += 1;
  hardStopElement();
}

export function getExamAudioSession(): number {
  return session;
}

export function beginExamAudioSession(): number {
  stopExamAudio();
  return session;
}

function waitUntilReady(el: HTMLAudioElement, ticket: number): Promise<boolean> {
  if (ticket !== session) return Promise.resolve(false);
  if (el.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) return Promise.resolve(true);

  return new Promise((resolve) => {
    const timeout = window.setTimeout(() => finish(false), 12000);
    const finish = (ok: boolean) => {
      window.clearTimeout(timeout);
      el.removeEventListener("canplaythrough", onReady);
      el.removeEventListener("error", onFail);
      resolve(ok && ticket === session);
    };
    const onReady = () => finish(true);
    const onFail = () => finish(false);
    el.addEventListener("canplaythrough", onReady, { once: true });
    el.addEventListener("error", onFail, { once: true });
  });
}

function playOnElement(src: string, rate: number, ticket: number): Promise<boolean> {
  if (!src || ticket !== session) return Promise.resolve(false);

  hardStopElement();
  if (ticket !== session) return Promise.resolve(false);

  const el = getAudio();
  el.playbackRate = rate;

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
      pendingResolve = null;
      el.onended = null;
      el.onerror = null;
      el.pause();
      settle(true);
    };

    el.onended = onDone;
    el.onerror = () => settle(false);
    el.src = src;

    void waitUntilReady(el, ticket).then((ready) => {
      if (!ready || ticket !== session) {
        settle(false);
        return;
      }
      void el.play().catch(() => settle(false));
    });
  });
}

export async function playExamMp3(src: string, rate: number, ticket: number): Promise<boolean> {
  if (!src || ticket !== session) return false;
  return playOnElement(src, rate, ticket);
}
