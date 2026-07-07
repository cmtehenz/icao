import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { findForbiddenPhrases } from "@/lib/knowledge/forbiddenPhrases";

const BATCH_DIR = path.join(process.cwd(), "knowledge/drafts/batch-01");
const EXPECTED = [
  "engine-failure",
  "engine-flameout",
  "loss-of-power",
  "loss-of-thrust",
  "bird-strike",
  "fire-on-board",
  "smoke-in-the-cabin",
  "fumes-in-the-cabin",
  "emergency-landing",
  "precautionary-landing",
  "low-fuel",
  "fuel-starvation",
  "fuel-dumping",
  "hydraulic-failure",
  "electrical-failure",
  "gps-inoperative",
  "landing-gear-malfunction",
  "cabin-depressurization",
  "pilot-incapacitation",
  "mayday-distress-call",
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

describe("Knowledge Factory batch-01 emergencies", () => {
  it("has all twenty emergency premium draft files", () => {
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

  it("manifest lists batch-01 concepts including emergencies", () => {
    const manifest = JSON.parse(readFileSync(path.join(BATCH_DIR, "manifest.json"), "utf8"));
    expect(manifest.conceptCount).toBeGreaterThanOrEqual(20);
    expect(manifest.concepts.length).toBeGreaterThanOrEqual(20);
    for (const slug of EXPECTED) {
      expect(manifest.concepts.some((c: { slug: string }) => c.slug === slug)).toBe(true);
    }
  });
});
