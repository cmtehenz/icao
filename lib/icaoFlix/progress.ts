export const ICAO_FLIX_PROGRESS_KEY = "icao_flix_progress_v1";
export const ICAO_FLIX_CHANGE_EVENT = "icao-flix-change";

export type IcaoFlixProgress = {
  watchedVideoIds: string[];
  lastWatchedAt: string | null;
};

const DEFAULT: IcaoFlixProgress = {
  watchedVideoIds: [],
  lastWatchedAt: null,
};

export function loadIcaoFlixProgress(): IcaoFlixProgress {
  if (typeof window === "undefined") return { ...DEFAULT };
  try {
    const raw = localStorage.getItem(ICAO_FLIX_PROGRESS_KEY);
    if (!raw) return { ...DEFAULT };
    const parsed = JSON.parse(raw) as Partial<IcaoFlixProgress>;
    return {
      watchedVideoIds: Array.isArray(parsed.watchedVideoIds) ? parsed.watchedVideoIds : [],
      lastWatchedAt: parsed.lastWatchedAt ?? null,
    };
  } catch {
    return { ...DEFAULT };
  }
}

export function saveIcaoFlixProgress(patch: Partial<IcaoFlixProgress>): IcaoFlixProgress {
  const next = { ...loadIcaoFlixProgress(), ...patch };
  if (typeof window !== "undefined") {
    localStorage.setItem(ICAO_FLIX_PROGRESS_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(ICAO_FLIX_CHANGE_EVENT));
  }
  return next;
}

export function isVideoWatched(videoId: string, progress = loadIcaoFlixProgress()): boolean {
  return progress.watchedVideoIds.includes(videoId);
}

export function markVideoWatched(videoId: string): IcaoFlixProgress {
  const current = loadIcaoFlixProgress();
  if (current.watchedVideoIds.includes(videoId)) return current;
  return saveIcaoFlixProgress({
    watchedVideoIds: [...current.watchedVideoIds, videoId],
    lastWatchedAt: new Date().toISOString(),
  });
}
