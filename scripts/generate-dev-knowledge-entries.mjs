#!/usr/bin/env node
/** Bundle knowledge/premium lessons for client-side dev Word Mission mode. */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const PREMIUM_DIR = path.join(process.cwd(), "knowledge/premium");
const MANIFEST_PATH = path.join(PREMIUM_DIR, "manifest.json");
const OUT = path.join(process.cwd(), "lib/knowledge/devKnowledge/batch01Entries.ts");

function section(md, ...names) {
  for (const name of names) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`## [^\\n]*${escaped}[^\\n]*\\n([\\s\\S]*?)(?=\\n## |$)`);
    const m = md.match(re);
    if (m) return m[1].trim();
  }
  return "";
}

function lines(text) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => /^(- |\d+\.\s)/.test(l))
    .map((l) => l.replace(/^(- |\d+\.\s*)/, "").trim());
}

function firstParagraph(text) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)[0] ?? "";
}

function proseParagraphs(text) {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("-") && !/^\*\*/.test(line));
}

/** Full instructor prose — no artificial truncation. */
function fullProse(text) {
  if (!text.trim()) return "";
  const paras = proseParagraphs(text);
  return paras.length ? paras.join("\n\n") : text.trim();
}

function extractSayItCoach(md) {
  const block = section(md, "Pronunciation Coaching");
  if (!block) return "";
  const practice = block.match(
    /(?:Then practice|Now practice)[^\n]*\n+([^\n]+)/i,
  );
  if (practice?.[1]) return practice[1].trim();
  const together = block.match(
    /(?:Together|Now together|Now naturally):\s*\n+([^\n]+)/i,
  );
  if (together?.[1]) return together[1].trim();
  return "";
}

/** Keep pronunciation example transmission aligned with the step readback. */
function alignPronunciationExample(block, sayPhrase) {
  if (!block?.trim() || !sayPhrase) return block;
  return block.replace(
    /(Then inside a complete transmission:)\s*\n+[^\n]+/i,
    `$1\n\n${sayPhrase}`,
  );
}

function extractIcaoAnswer(md) {
  const block = section(
    md,
    "Common ICAO Speaking Question",
    "Common ICAO Speaking Questions",
  );
  if (!block) return "";
  const labeled = block.match(
    /\*\*Good ICAO Level 4 Answer\*\*\s*\n+([\s\S]*?)(?=\n## |\n\*\*|$)/,
  );
  if (labeled?.[1]) {
    return labeled[1].trim().split(/\n+/).find((line) => line.trim())?.trim() ?? "";
  }
  const blockLines = block.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  return blockLines.find((line) => line.length > 40 && !line.endsWith("?")) ?? "";
}

function category(md) {
  const m = md.match(/\*\*Category:\*\*\s*(.+)/);
  return m ? m[1].trim() : "ATC Phraseology";
}

const REFERENCE_PATTERNS = [
  { pattern: /skybrary/i, href: "https://skybrary.aero" },
  {
    pattern: /icao doc 4444|pans-atm/i,
    href: "https://www.icao.int/publications/pages/doc-4444.aspx",
  },
  {
    pattern: /annex 10/i,
    href: "https://www.icao.int/publications/pages/publication.aspx?docnum=101",
  },
  { pattern: /7110\.65/i, href: "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/" },
  {
    pattern: /aeronautical information manual|\baim\b/i,
    href: "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/",
  },
  {
    pattern: /pilot\/controller glossary/i,
    href: "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/",
  },
  {
    pattern: /pilot's handbook/i,
    href: "https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/phak/",
  },
];

function referenceHref(label) {
  for (const { pattern, href } of REFERENCE_PATTERNS) {
    if (pattern.test(label)) return href;
  }
  return undefined;
}

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
const concepts = manifest.concepts.filter((c) => c.status === "complete");

const entries = concepts.map((c) => {
  const md = readFileSync(path.join(PREMIUM_DIR, `${c.slug}.md`), "utf8");
  const atc = lines(section(md, "Real ATC Phraseology"));
  const pilot = lines(section(md, "Professional Pilot Readbacks", "Real Pilot Readbacks"));
  const questionBlock = section(md, "Common ICAO Speaking Question", "Common ICAO Speaking Questions");
  const question = firstParagraph(questionBlock).replace(/\?$/, "") + "?";
  const icaoAnswer = extractIcaoAnswer(md);
  const refLabels = lines(section(md, "References"));

  return {
    catalogId: c.id,
    id: c.id,
    displayTerm: c.concept,
    term: c.concept.toLowerCase(),
    slug: c.slug.replace(/^\d{4}-/, ""),
    category: category(md),
    meaningEn: firstParagraph(section(md, "Meaning")),
    meaningPt: fullProse(section(md, "Portuguese Meaning")),
    whenUsed: firstParagraph(section(md, "Operational Meaning")),
    example: atc[0] ?? `${c.concept}.`,
    sayPhrase: pilot[0] ?? atc[0] ?? c.concept,
    icaoQuestion: question || `When would a pilot use "${c.concept.toLowerCase()}"?`,
    icaoSpeakText: icaoAnswer || pilot[1] || pilot[0] || atc[0] || c.concept,
    missionBrief: fullProse(section(md, "Mission Brief")),
    captainTeaching: fullProse(section(md, "Captain Delta Teaching")),
    operationalContext: fullProse(section(md, "Real Operational Context")),
    sayItCoach: extractSayItCoach(md),
    icaoModelAnswer: extractIcaoAnswer(md),
    memoryTrick: fullProse(section(md, "Memory Trick")),
    operationalMeaning: fullProse(section(md, "Operational Meaning")),
    whyAtcUsesIt: lines(section(md, "Why ATC Uses It")),
    atcPhraseology: atc,
    pilotReadbacks: pilot,
    brazilianMistakes: section(md, "Common Brazilian Mistakes"),
    pronunciationCoaching: alignPronunciationExample(section(md, "Pronunciation Coaching"), pilot[0]),
    relatedConcepts: lines(section(md, "Related Concepts")),
    references: refLabels.map((label) => ({ label, href: referenceHref(label) })),
  };
});

const body = `/** Auto-generated from knowledge/premium — run: node scripts/generate-dev-knowledge-entries.mjs */
import type { DevKnowledgeEntry } from "@/lib/knowledge/devKnowledge/types";

export const BATCH01_DEV_ENTRIES: DevKnowledgeEntry[] = ${JSON.stringify(entries, null, 2)};
`;

writeFileSync(OUT, body, "utf8");
console.log(`Generated ${entries.length} premium Word Mission entries → ${OUT}`);
