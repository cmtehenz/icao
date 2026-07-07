import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/dailyMission", () => ({
  getDailyMissionSummary: vi.fn(() => ({
    examLabel: "23C",
    complete: false,
    wordMission: { complete: false },
    part1: { complete: false },
    part2: { complete: false },
    recall: { complete: false },
    simulate: { complete: false },
    debrief: { complete: false },
    simulateRequired: false,
  })),
  getNextMissionAction: vi.fn(() => ({
    href: "/word-mission",
    title: "Word Mission · 23C",
    hint: "0/20 terms today",
  })),
}));

vi.mock("@/lib/studyTime", () => ({
  todayKey: () => "2026-07-06",
  loadStudyPlanMode: vi.fn(() => "standard"),
  STUDY_DAILY_GOAL_MINUTES: 25,
  STUDY_INTENSE_DAY_MINUTES: 45,
}));

vi.mock("@/lib/flightProgress/buildFlightProgress", () => ({
  buildFlightProgress: vi.fn(() => ({
    currentPhase: { aviationLabel: "ENGINE START", missionLabel: "Word Mission" },
    currentPhaseId: "wordMission",
  })),
}));

vi.mock("@/lib/captainDelta/examDate", () => ({
  daysUntilExam: vi.fn(() => 42),
}));

vi.mock("@/lib/captainDelta/voiceText", () => ({
  greetingForHour: vi.fn(() => "Good afternoon"),
  toSpeechText: vi.fn((t: string) => t),
}));

import { buildActiveMissionTermLine, buildTodayBriefing } from "@/lib/captainDelta/briefing";

describe("buildActiveMissionTermLine", () => {
  it("opens pronunciation sorties with meaning brief", () => {
    const line = buildActiveMissionTermLine("heading", "pronunciation");
    expect(line.text).toMatch(/direction|degrees|proa/i);
    const flyDirect = buildActiveMissionTermLine("fly direct", "pronunciation");
    expect(flyDirect.text).toMatch(/waypoint|straight/i);
  });
});

describe("buildTodayBriefing", () => {
  it("home surface keeps greeting and sortie summary", () => {
    const home = buildTodayBriefing("Alex", "2026-07-05", { surface: "home" });
    expect(home.text).toContain("Good afternoon, Alex.");
    expect(home.text).toMatch(/Today's sortie:/);
    expect(home.text).toMatch(/Estimated flight time/);
    expect(home.text).toMatch(/Ready\?/);
  });

  it("full surface lists training blocks for proactive Captain Delta", () => {
    const full = buildTodayBriefing("Alex", "2026-07-05", { surface: "full" });
    expect(full.text).toContain("Alex");
    expect(full.text).toMatch(/Today's training includes/);
    expect(full.text).toMatch(/Estimated flight time/);
    expect(full.text).toMatch(/Ready\?/);
  });
});
