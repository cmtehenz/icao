import { getPeelBlocks, type PeelBlock } from "@/lib/peelBlocks";
import type { Card } from "./types";

export type SimplePhrase = {
  label: string;
  text: string;
};

/** Short oral summary — one line per PEEL block (for the quick-phrases menu). */
export function getSimplePhrases(card: Card): SimplePhrase[] {
  return getPeelBlocks(card).map((b: PeelBlock) => ({ label: b.label, text: b.text }));
}

export function getSimplePhrasesText(card: Card): string {
  return getSimplePhrases(card)
    .map((p, i) => `${i + 1}. ${p.text}`)
    .join("\n\n");
}
