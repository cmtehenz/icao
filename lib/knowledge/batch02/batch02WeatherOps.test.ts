import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { findForbiddenPhrases } from "@/lib/knowledge/forbiddenPhrases";

const BATCH_DIR = path.join(process.cwd(), "knowledge/drafts/batch-02");
const EXPECTED = [
  "windshear-on-final",
  "microburst-on-final",
  "severe-turbulence",
  "moderate-turbulence",
  "thunderstorm-avoidance",
  "icing-conditions",
  "weather-deviation",
  "weather-deterioration",
  "low-visibility-operations",
  "runway-incursion",
  "runway-excursion",
  "runway-overrun",
  "fod-on-runway",
  "debris-on-taxiway",
  "wreckage-on-runway",
  "drone-near-airport",
  "hot-air-balloon-traffic",
  "confirm-runway-in-sight",
  "number-one-for-landing",
  "priority-landing",
];

const REQUIRED_SECTIONS = [
  "## Meaning",
  "## Operational Meaning",
  "## When Used",
  "## Who Uses It",
  "## Real ATC Phraseology",
  "## Real Pilot Readbacks",
  "## Common ICAO Speaking Questions",
  "## Common Brazilian Mistakes",
  "## Pronunciation Coaching",
  "## Captain Teaching Notes",
  "## Memory Trick",
  "## Related Concepts",
  "## References",
];

describe("Knowledge Factory batch-02 weather & operations", () => {
  it("has exactly twenty premium draft files", () => {
    const files = readdirSync(BATCH_DIR).filter((f) => f.endsWith(".md"));
    expect(files).toHaveLength(20);
    for (const slug of EXPECTED) {
      expect(existsSync(path.join(BATCH_DIR, `${slug}.md`))).toBe(true);
    }
  });

  it("each draft includes required sections and minimum examples", () => {
    for (const slug of EXPECTED) {
      const content = readFileSync(path.join(BATCH_DIR, `${slug}.md`), "utf8");
      for (const section of REQUIRED_SECTIONS) {
        expect(content).toContain(section);
      }
      const atcLines = content.split("## Real ATC Phraseology")[1]?.split("## Real Pilot Readbacks")[0] ?? "";
      const pilotLines = content.split("## Real Pilot Readbacks")[1]?.split("## Common ICAO Speaking Questions")[0] ?? "";
      expect(atcLines.split("\n").filter((l) => l.startsWith("- ")).length).toBeGreaterThanOrEqual(5);
      expect(pilotLines.split("\n").filter((l) => l.startsWith("- ")).length).toBeGreaterThanOrEqual(5);
    }
  });

  it("drafts contain no forbidden lesson meta-phrases", () => {
    for (const slug of EXPECTED) {
      const content = readFileSync(path.join(BATCH_DIR, `${slug}.md`), "utf8");
      const hits = findForbiddenPhrases({ body: content });
      expect(hits).toEqual([]);
    }
  });

  it("manifest lists twenty concepts with ids 0041–0060", () => {
    const manifest = JSON.parse(readFileSync(path.join(BATCH_DIR, "manifest.json"), "utf8"));
    expect(manifest.conceptCount).toBe(20);
    expect(manifest.concepts).toHaveLength(20);
    expect(manifest.concepts[0].id).toBe("0041");
    expect(manifest.concepts[19].id).toBe("0060");
  });
});
