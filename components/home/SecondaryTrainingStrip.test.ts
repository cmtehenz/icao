import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const stripSource = readFileSync(
  path.join(__dirname, "SecondaryTrainingStrip.tsx"),
  "utf-8",
);

describe("SecondaryTrainingStrip (ADR-010)", () => {
  it("links to Escutar Prova and ICAOFlix", () => {
    expect(stripSource).toMatch(/href: "\/escutar-prova"/);
    expect(stripSource).toMatch(/href: "\/icao-flix"/);
  });

  it("reads mission complete state for copy only", () => {
    expect(stripSource).toMatch(/isDailyMissionComplete/);
    expect(stripSource).not.toMatch(/getNextMissionAction/);
  });

  it("does not use primary CTA button classes", () => {
    expect(stripSource).not.toMatch(/academy-primary/);
    expect(stripSource).not.toMatch(/btn-large/);
  });
});
