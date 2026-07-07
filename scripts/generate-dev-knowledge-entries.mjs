#!/usr/bin/env node
/** Bundle batch-01 premium markdown (0001–0010) for client-side dev knowledge mode. */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const BATCH_DIR = path.join(process.cwd(), "knowledge/drafts/batch-01");
const OUT = path.join(process.cwd(), "lib/knowledge/devKnowledge/batch01Entries.ts");

const CONCEPTS = [
  { catalogId: "0001", id: "dev-0001", term: "fly direct", slug: "fly-direct" },
  { catalogId: "0002", id: "dev-0002", term: "hold short", slug: "hold-short" },
  { catalogId: "0003", id: "dev-0003", term: "line up and wait", slug: "line-up-and-wait" },
  { catalogId: "0004", id: "dev-0004", term: "cleared for takeoff", slug: "cleared-for-takeoff" },
  { catalogId: "0005", id: "dev-0005", term: "cleared to land", slug: "cleared-to-land" },
  { catalogId: "0006", id: "dev-0006", term: "continue approach", slug: "continue-approach" },
  { catalogId: "0007", id: "dev-0007", term: "go around", slug: "go-around" },
  { catalogId: "0008", id: "dev-0008", term: "missed approach", slug: "missed-approach" },
  { catalogId: "0009", id: "dev-0009", term: "visual approach", slug: "visual-approach" },
  { catalogId: "0010", id: "dev-0010", term: "radar vectors", slug: "radar-vectors" },
];

function section(md, name) {
  const re = new RegExp(`## ${name}\\s+\\n([\\s\\S]*?)(?=\\n## |$)`);
  const m = md.match(re);
  return m ? m[1].trim() : "";
}

function bullets(text) {
  return text
    .split("\n")
    .filter((l) => l.startsWith("- "))
    .map((l) => l.slice(2).trim());
}

function meaningEn(text) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("*Portuguese"))
    .join(" ")
    .trim();
}

function portuguese(text) {
  const m = text.match(/\*Portuguese:\s*(.+?)\*/);
  return m ? m[1].trim() : "";
}

function category(md) {
  const m = md.match(/\*\*Category:\*\*\s*(.+)/);
  return m ? m[1].trim() : "ATC Phraseology";
}

const entries = CONCEPTS.map((c) => {
  const md = readFileSync(path.join(BATCH_DIR, `${c.slug}.md`), "utf8");
  const meaningBlock = section(md, "Meaning");
  const atc = bullets(section(md, "Real ATC Phraseology"));
  const pilot = bullets(section(md, "Real Pilot Readbacks"));
  const questions = bullets(section(md, "Common ICAO Speaking Questions"));

  return {
    ...c,
    category: category(md),
    meaningEn: meaningEn(meaningBlock),
    meaningPt: portuguese(meaningBlock),
    whenUsed: section(md, "Operational Meaning"),
    example: atc[0] ?? `${c.term}.`,
    sayPhrase: pilot[0] ?? atc[0] ?? c.term,
    icaoQuestion: questions[0] ?? `When would a pilot use "${c.term}"?`,
    icaoSpeakText: pilot[1] ?? pilot[0] ?? atc[0] ?? c.term,
  };
});

const body = `/** Auto-generated from knowledge/drafts/batch-01 — run: node scripts/generate-dev-knowledge-entries.mjs */
import type { DevKnowledgeEntry } from "@/lib/knowledge/devKnowledge/types";

export const BATCH01_DEV_ENTRIES: DevKnowledgeEntry[] = ${JSON.stringify(entries, null, 2)};
`;

writeFileSync(OUT, body, "utf8");
console.log(`Wrote ${entries.length} dev knowledge entries to ${OUT}`);
