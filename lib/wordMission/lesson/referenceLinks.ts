import type { DevKnowledgeReference } from "@/lib/knowledge/devKnowledge/types";

const REFERENCE_PATTERNS: Array<{ pattern: RegExp; href: string }> = [
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

export function referenceHref(label: string): string | undefined {
  for (const { pattern, href } of REFERENCE_PATTERNS) {
    if (pattern.test(label)) return href;
  }
  return undefined;
}

export function referencesFromLabels(labels: string[]): DevKnowledgeReference[] {
  return labels.map((label) => ({
    label,
    href: referenceHref(label),
  }));
}
