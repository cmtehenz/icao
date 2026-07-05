import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const layoutSource = readFileSync(
  path.join(process.cwd(), "components/layout/MissionFocusLayout.tsx"),
  "utf-8",
);
const appShellSource = readFileSync(
  path.join(process.cwd(), "components/AppShell.tsx"),
  "utf-8",
);

describe("MissionFocusLayout", () => {
  it("composes top bar and flight progress strip without mission engine imports", () => {
    expect(layoutSource).toMatch(/MissionFocusTopBar/);
    expect(layoutSource).toMatch(/FlightProgressStrip/);
    expect(layoutSource).toMatch(/AIPresenceIndicator/);
    expect(layoutSource).not.toMatch(/buildDailyFlightMission/);
    expect(layoutSource).not.toMatch(/getNextMissionAction/);
  });
});

describe("AppShell mission focus", () => {
  it("uses MissionFocusLayout for mission experience", () => {
    expect(appShellSource).toMatch(/MissionFocusLayout/);
    expect(appShellSource).toMatch(/isMissionFocusRoute/);
  });
});
