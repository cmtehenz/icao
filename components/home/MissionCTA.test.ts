import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ctaSource = readFileSync(path.join(__dirname, "MissionCTA.tsx"), "utf-8");

describe("MissionCTA shell (RFC-004 Phase 3)", () => {
  it("composes phase badge and plan strip with Ready CTA", () => {
    expect(ctaSource).toMatch(/PhaseBadge/);
    expect(ctaSource).toMatch(/MissionPlanStrip/);
    expect(ctaSource).toMatch(/Ready — Begin Flight/);
  });

  it("does not duplicate phase brief paragraphs", () => {
    expect(ctaSource).not.toMatch(/phaseBrief/);
  });
});
