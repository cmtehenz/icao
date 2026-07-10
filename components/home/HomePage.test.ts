import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const homePageSource = readFileSync(path.join(__dirname, "HomePage.tsx"), "utf-8");

describe("HomePage composition (ADR-010)", () => {
  it("does not import FlightAcademyDashboard", () => {
    expect(homePageSource).not.toMatch(/FlightAcademyDashboard/);
  });

  it("does not import buildDailyFlightMission", () => {
    expect(homePageSource).not.toMatch(/buildDailyFlightMission/);
  });

  it("does not call getNextMissionAction", () => {
    expect(homePageSource).not.toMatch(/getNextMissionAction/);
  });

  it("does not call getDailyMissionSummary", () => {
    expect(homePageSource).not.toMatch(/getDailyMissionSummary/);
  });

  it("composes flight deck without duplicate mission planner", () => {
    expect(homePageSource).toMatch(/CaptainBriefing/);
    expect(homePageSource).toMatch(/MissionCTA/);
    expect(homePageSource).toMatch(/SecondaryTrainingStrip/);
    expect(homePageSource).toMatch(/home-flight-deck/);
    expect(homePageSource).not.toMatch(/DailyMissionPanel/);
  });
});
