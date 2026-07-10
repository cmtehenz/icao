import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/studyTime", () => ({
  todayKey: () => "2026-07-10",
}));

vi.mock("@/lib/dailyExamRotation", () => ({
  getTodayExamVersion: () => "23C",
}));

import {
  clearPart2MissionSession,
  loadPart2MissionSession,
  savePart2MissionSession,
} from "@/lib/part2MissionSession";

describe("part2MissionSession", () => {
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

  it("saves and loads today's session", () => {
    savePart2MissionSession({
      examVersion: "23C",
      activeVersion: "23C",
      situationIdx: 1,
      step: 4,
      recordings: {},
      stepResults: [],
      showNotesReview: false,
      showResults: false,
    });

    const loaded = loadPart2MissionSession();
    expect(loaded?.situationIdx).toBe(1);
    expect(loaded?.step).toBe(4);
    expect(loaded?.examVersion).toBe("23C");
  });

  it("clears session", () => {
    savePart2MissionSession({
      examVersion: "23C",
      activeVersion: "23C",
      situationIdx: 0,
      step: 0,
      recordings: {},
      stepResults: [],
      showNotesReview: false,
      showResults: false,
    });
    clearPart2MissionSession();
    expect(loadPart2MissionSession()).toBeNull();
  });

  it("rejects stale date", () => {
    savePart2MissionSession({
      date: "2026-07-09",
      examVersion: "23C",
      activeVersion: "23C",
      situationIdx: 0,
      step: 2,
      recordings: {},
      stepResults: [],
      showNotesReview: false,
      showResults: false,
    });
    expect(loadPart2MissionSession()).toBeNull();
  });
});
