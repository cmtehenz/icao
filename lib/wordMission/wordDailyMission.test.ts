import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  getOrCreateWordDailyMission,
  markWordMissionTermComplete,
  wordDailyMissionProgress,
  WORD_DAILY_MISSION_TERM_COUNT,
} from "@/lib/wordMission/wordDailyMission";

describe("word daily mission persistence", () => {
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
      },
    });
    vi.stubGlobal("localStorage", window.localStorage);
  });

  it("keeps completedIds when vocab progress changes after mission creation", () => {
    const mission = getOrCreateWordDailyMission();
    expect(mission.termIds).toHaveLength(WORD_DAILY_MISSION_TERM_COUNT);

    const first = mission.termIds[0]!;
    markWordMissionTermComplete(first);

    const reloaded = getOrCreateWordDailyMission();
    expect(reloaded.termIds).toEqual(mission.termIds);
    expect(wordDailyMissionProgress(reloaded).done).toBe(1);
  });

  it("marks multiple terms complete without resetting the counter", () => {
    const mission = getOrCreateWordDailyMission();
    for (const id of mission.termIds.slice(0, 2)) {
      markWordMissionTermComplete(id);
    }
    const progress = wordDailyMissionProgress(getOrCreateWordDailyMission());
    expect(progress.done).toBe(2);
    expect(progress.total).toBe(WORD_DAILY_MISSION_TERM_COUNT);
  });
});
