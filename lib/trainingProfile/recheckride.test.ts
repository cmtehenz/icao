import { describe, expect, it, vi } from "vitest";
import type { TrendSummary } from "@/lib/scoreHistory";
import {
  isReadinessPlateau,
  maybeScheduleRecheckrideFromPlateau,
  recheckrideDaysForPhase,
} from "@/lib/trainingProfile/recheckride";
import type { StudentTrainingProfile } from "@/lib/trainingProfile/types";

const profile: StudentTrainingProfile = {
  version: 1,
  checkrideStatus: "completed",
  phase: "operational",
  completedAt: "2026-06-01T00:00:00.000Z",
  skippedAt: null,
  estimatedScore: 70,
  weakAreas: [],
  focusSounds: [],
  probeResults: [],
  nextCheckrideAt: "2026-08-01T00:00:00.000Z",
};

function flatTrend(area: TrendSummary["area"]): TrendSummary {
  return {
    area,
    label: area,
    series: [],
    recentAvg: 72,
    priorAvg: 71,
    delta: 1,
    direction: "flat",
  };
}

describe("recheckrideDaysForPhase", () => {
  it("schedules sooner in Foundation, longer in Exam", () => {
    expect(recheckrideDaysForPhase("foundation")).toBe(14);
    expect(recheckrideDaysForPhase("operational")).toBe(21);
    expect(recheckrideDaysForPhase("exam")).toBe(28);
  });
});

describe("isReadinessPlateau", () => {
  it("detects flat speaking trends in two areas", () => {
    expect(
      isReadinessPlateau([flatTrend("part1"), flatTrend("pronunciation"), flatTrend("simulado")]),
    ).toBe(true);
  });

  it("ignores plateau when only one area is flat", () => {
    expect(isReadinessPlateau([flatTrend("part1")])).toBe(false);
  });
});

describe("maybeScheduleRecheckrideFromPlateau", () => {
  it("pulls next checkride forward when plateau detected", () => {
    const save = vi.fn();
    vi.stubGlobal("localStorage", {
      setItem: save,
      getItem: () => JSON.stringify(profile),
    });
    vi.stubGlobal("window", { dispatchEvent: vi.fn() });

    const next = maybeScheduleRecheckrideFromPlateau(
      profile,
      [flatTrend("part1"), flatTrend("vocabulary")],
      Date.parse("2026-07-01T00:00:00.000Z"),
    );

    expect(next).not.toBeNull();
    expect(next!.nextCheckrideAt).toBe("2026-07-01T00:00:00.000Z");
    expect(save).toHaveBeenCalled();
  });
});
