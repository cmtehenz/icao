import { describe, expect, it } from "vitest";
import { isMissionFocusHome, isMissionFocusRoute } from "@/lib/missionFocusRoutes";

describe("missionFocusRoutes", () => {
  it("includes home and mission routes", () => {
    expect(isMissionFocusRoute("/")).toBe(true);
    expect(isMissionFocusRoute("/pronunciation")).toBe(true);
    expect(isMissionFocusRoute("/vocabulario")).toBe(true);
    expect(isMissionFocusRoute("/part1")).toBe(true);
    expect(isMissionFocusRoute("/part2")).toBe(true);
    expect(isMissionFocusRoute("/mission-recall")).toBe(true);
    expect(isMissionFocusRoute("/flight-debrief")).toBe(true);
    expect(isMissionFocusRoute("/simulado")).toBe(true);
  });

  it("excludes legacy and admin routes", () => {
    expect(isMissionFocusRoute("/conta")).toBe(false);
    expect(isMissionFocusRoute("/escutar-prova")).toBe(false);
    expect(isMissionFocusRoute("/structure")).toBe(false);
    expect(isMissionFocusRoute("/login")).toBe(false);
  });

  it("detects mission focus home", () => {
    expect(isMissionFocusHome("/")).toBe(true);
    expect(isMissionFocusHome("/part1")).toBe(false);
  });
});
