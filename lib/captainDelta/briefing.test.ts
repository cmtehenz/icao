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

import { buildTodayBriefing } from "@/lib/captainDelta/briefing";

describe("buildTodayBriefing", () => {
  it("home surface omits phase and countdown lines covered by the flight deck UI", () => {
    const home = buildTodayBriefing("Alex", "2026-07-05", { surface: "home" });
    expect(home.text).toContain("Good afternoon, Alex.");
    expect(home.text).toContain("Today we train 23C.");
    expect(home.text).not.toContain("Your ICAO exam is in");
    expect(home.text).not.toContain("Flight phase:");
    expect(home.text).not.toContain("We begin with");
    expect(home.text).not.toContain("Estimated training:");
  });

  it("full surface keeps instructor briefing detail for proactive Captain Delta", () => {
    const full = buildTodayBriefing("Alex", "2026-07-05", { surface: "full" });
    expect(full.text).toContain("Your ICAO exam is in 42 days.");
    expect(full.text).toContain("Flight phase:");
    expect(full.text).toContain("We begin with");
    expect(full.text).toContain("Estimated training:");
  });
});
