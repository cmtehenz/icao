import { describe, expect, it, beforeEach, vi } from "vitest";
import { resetPart1Today } from "@/lib/part1Mastery/reset";
import { todayKey } from "@/lib/studyTime";

const storage = new Map<string, string>();

vi.stubGlobal("localStorage", {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
});

vi.stubGlobal("window", {
  dispatchEvent: vi.fn(),
});

vi.mock("@/lib/dailyExamRotation", () => ({
  getTodayPart1CardNums: () => ["01", "02", "03"],
  getTodayExamVersion: () => "23C",
}));

vi.mock("@/lib/dailyMissionLog", () => ({
  syncDailyMissionLog: vi.fn(),
}));

describe("resetPart1Today", () => {
  beforeEach(() => {
    storage.clear();
    storage.set(
      "icao_part1_daily_mission_v2",
      JSON.stringify({
        date: todayKey(),
        examVersion: "23C",
        cards: [
          { cardNum: "01", shadowDone: true, coachDone: true },
          { cardNum: "02", shadowDone: false, coachDone: false },
          { cardNum: "03", shadowDone: false, coachDone: false },
        ],
      }),
    );
    storage.set(
      "icao_part1_mastery_card_v1",
      JSON.stringify({
        "01": { briefSeen: true, anchorDone: true, keywordsDone: true },
      }),
    );
  });

  it("returns first card and clears today's pipeline progress", () => {
    expect(resetPart1Today()).toBe("01");

    const mission = JSON.parse(storage.get("icao_part1_daily_mission_v2")!);
    expect(mission.cards.every((c: { shadowDone: boolean; coachDone: boolean }) => !c.shadowDone && !c.coachDone)).toBe(true);

    const study = JSON.parse(storage.get("icao_part1_mastery_card_v1")!);
    expect(study["01"]).toBeUndefined();
  });
});
