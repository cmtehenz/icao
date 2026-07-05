import { describe, expect, it } from "vitest";
import {
  mergeDailyMissionBundles,
  mergeFlightDebriefState,
  mergeMissionRecallState,
  type DailyMissionBundle,
} from "@/lib/dailyMissionSync";
import type { FlightDebriefState } from "@/lib/flightDebrief/flightDebriefTypes";
import type { MissionRecallState } from "@/lib/missionRecall/missionRecallTypes";

function emptyBundle(date: string): DailyMissionBundle {
  return {
    date,
    pronunciation: null,
    part1: null,
    part2: null,
    vocab: null,
    recall: null,
    debrief: null,
    complete: false,
  };
}

describe("dailyMissionSync recall/debrief", () => {
  it("mergeMissionRecallState unions answers and transcripts", () => {
    const local: MissionRecallState = {
      date: "2026-07-05",
      itemIds: ["a", "b"],
      answeredIds: ["a"],
      answers: {
        a: {
          itemId: "a",
          transcript: "alpha bravo",
          answeredAt: "2026-07-05T10:00:00Z",
          method: "speech",
          answered: true,
        },
      },
      complete: false,
      confidenceStars: 0,
    };
    const remote: MissionRecallState = {
      date: "2026-07-05",
      itemIds: ["a", "b"],
      answeredIds: ["b"],
      answers: {
        b: {
          itemId: "b",
          transcript: "taxi clearance",
          answeredAt: "2026-07-05T11:00:00Z",
          method: "manual",
          answered: true,
        },
      },
      complete: false,
      confidenceStars: 0,
    };

    const merged = mergeMissionRecallState(local, remote)!;
    expect(merged.answeredIds).toEqual(expect.arrayContaining(["a", "b"]));
    expect(merged.answers?.a?.transcript).toBe("alpha bravo");
    expect(merged.answers?.b?.method).toBe("manual");
  });

  it("mergeFlightDebriefState keeps completion from either device", () => {
    const a: FlightDebriefState = { date: "2026-07-05", viewed: true, complete: false };
    const b: FlightDebriefState = {
      date: "2026-07-05",
      viewed: false,
      complete: true,
      completedAt: "2026-07-05T12:00:00Z",
    };
    const merged = mergeFlightDebriefState(a, b)!;
    expect(merged.complete).toBe(true);
    expect(merged.viewed).toBe(true);
  });

  it("mergeDailyMissionBundles includes recall and debrief", () => {
    const local = emptyBundle("2026-07-05");
    local.recall = {
      date: "2026-07-05",
      itemIds: ["a"],
      answeredIds: ["a"],
      complete: true,
      confidenceStars: 4,
    };
    const remote = emptyBundle("2026-07-05");
    remote.debrief = { date: "2026-07-05", viewed: true, complete: true };

    const merged = mergeDailyMissionBundles(local, remote);
    expect(merged.recall?.complete).toBe(true);
    expect(merged.debrief?.complete).toBe(true);
  });
});
