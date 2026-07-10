import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  ICAO_FLIX_PROGRESS_KEY,
  loadIcaoFlixProgress,
  markVideoWatched,
  isVideoWatched,
  saveIcaoFlixProgress,
} from "@/lib/icaoFlix/progress";

describe("icaoFlix progress", () => {
  beforeEach(() => {
    vi.stubGlobal("window", {
      dispatchEvent: vi.fn(),
      localStorage: {
        store: {} as Record<string, string>,
        getItem(key: string) {
          return this.store[key] ?? null;
        },
        setItem(key: string, value: string) {
          this.store[key] = value;
        },
        removeItem(key: string) {
          delete this.store[key];
        },
        clear() {
          this.store = {};
        },
      },
    });
    vi.stubGlobal("localStorage", window.localStorage);
  });

  it("starts with empty watched list", () => {
    expect(loadIcaoFlixProgress().watchedVideoIds).toEqual([]);
  });

  it("marks a video as watched once", () => {
    markVideoWatched("brief-01-preflighting-your-passengers");
    expect(isVideoWatched("brief-01-preflighting-your-passengers")).toBe(true);
    expect(loadIcaoFlixProgress().watchedVideoIds).toHaveLength(1);
  });

  it("does not duplicate watched ids", () => {
    markVideoWatched("video-a");
    markVideoWatched("video-a");
    expect(loadIcaoFlixProgress().watchedVideoIds).toEqual(["video-a"]);
  });

  it("persists to localStorage", () => {
    saveIcaoFlixProgress({ watchedVideoIds: ["x"], lastWatchedAt: "2026-01-01T00:00:00.000Z" });
    const raw = localStorage.getItem(ICAO_FLIX_PROGRESS_KEY);
    expect(raw).toContain('"x"');
    expect(loadIcaoFlixProgress().watchedVideoIds).toEqual(["x"]);
  });

  it("dispatches change event on save", () => {
    markVideoWatched("video-b");
    expect(window.dispatchEvent).toHaveBeenCalled();
  });
});
