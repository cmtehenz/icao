import { beforeEach, describe, expect, it, vi } from "vitest";

vi.stubGlobal("window", {
  dispatchEvent: vi.fn(),
});

const storage: Record<string, string> = {};

vi.stubGlobal("localStorage", {
  getItem: (key: string) => storage[key] ?? null,
  setItem: (key: string, value: string) => {
    storage[key] = value;
  },
  removeItem: (key: string) => {
    delete storage[key];
  },
  clear: () => {
    for (const key of Object.keys(storage)) delete storage[key];
  },
});

vi.mock("@/lib/studyTime", () => ({
  todayKey: () => "2026-07-05",
}));

vi.mock("@/lib/missionRecall/buildMissionRecall", () => ({
  buildMissionRecallItems: () => [
    { id: "a", stage: "pronunciation", prompt: "p1", sourceRef: "pronunciation:a" },
    { id: "b", stage: "vocabulary", prompt: "p2", sourceRef: "vocabulary:b" },
    { id: "c", stage: "part1", prompt: "p3", sourceRef: "part1:1" },
  ],
}));

vi.mock("@/lib/missionRecall/events", () => ({
  emitMissionRecallComplete: vi.fn(),
  emitMissionRecallProgress: vi.fn(),
}));

import {
  getCurrentRecallItem,
  getOrCreateMissionRecallState,
  isMissionRecallComplete,
  markRecallItemAnswered,
  missionRecallProgress,
} from "@/lib/missionRecall/missionRecallProgress";

describe("missionRecallProgress", () => {
  beforeEach(() => {
    for (const key of Object.keys(storage)) delete storage[key];
    vi.clearAllMocks();
  });

  it("tracks completion across items", () => {
    const state = getOrCreateMissionRecallState();
    expect(state.itemIds).toHaveLength(3);
    markRecallItemAnswered("a");
    markRecallItemAnswered("b");
    expect(isMissionRecallComplete()).toBe(false);
    markRecallItemAnswered("c");
    expect(isMissionRecallComplete()).toBe(true);
    expect(missionRecallProgress().confidenceStars).toBeGreaterThan(0);
  });

  it("resumes incomplete state", () => {
    markRecallItemAnswered("a");
    const current = getCurrentRecallItem();
    expect(current?.id).toBe("b");
    const progress = missionRecallProgress();
    expect(progress.done).toBe(1);
    expect(progress.total).toBe(3);
    expect(progress.complete).toBe(false);
  });

  it("stores transcript when answered with speech", () => {
    markRecallItemAnswered("a", { transcript: "Alpha, Bravo, Charlie", method: "speech" });
    const raw = storage["icao_mission_recall_v1"];
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!) as { answers?: Record<string, { transcript?: string }> };
    expect(parsed.answers?.a?.transcript).toBe("Alpha, Bravo, Charlie");
  });

  it("manual fallback completes without transcript", () => {
    markRecallItemAnswered("a", { method: "manual" });
    markRecallItemAnswered("b", { method: "manual" });
    markRecallItemAnswered("c", { method: "manual" });
    expect(isMissionRecallComplete()).toBe(true);
    const raw = JSON.parse(storage["icao_mission_recall_v1"]!) as {
      answers?: Record<string, { method?: string; transcript?: string }>;
    };
    expect(raw.answers?.a?.method).toBe("manual");
    expect(raw.answers?.a?.transcript).toBeUndefined();
  });
});
