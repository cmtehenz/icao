import fs from "fs";
import { KEYWORDS_BY_NUM } from "./keywords-data.mjs";

const path = new URL("../cards.json", import.meta.url);
const cards = JSON.parse(fs.readFileSync(path, "utf8"));

function titleCase(str) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

function fallbackKeywords(card) {
  const fromLabels = card.memoryLabels.map((l) => titleCase(l.toLowerCase()));
  const merged = [...fromLabels];
  for (const v of card.vocab.slice(0, 3)) {
    if (merged.length >= 6) break;
    const t = titleCase(v);
    if (!merged.some((k) => k.toLowerCase() === t.toLowerCase())) merged.push(t);
  }
  return merged.slice(0, 6);
}

for (const card of cards) {
  const curated = KEYWORDS_BY_NUM[card.num];
  card.keywords = curated?.length >= 4 ? curated.slice(0, 6) : fallbackKeywords(card);
}

fs.writeFileSync(path, JSON.stringify(cards, null, 2) + "\n");
console.log("Keywords added to", cards.length, "cards");
