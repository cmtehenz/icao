/**
 * Build cards.json with only the PEEL question set (11 unique cards).
 * Order matches the user's exam list (item 6 was a duplicate of item 3).
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cards = JSON.parse(readFileSync(join(root, "cards.json"), "utf8"));

/** Source card nums in PEEL order */
const PEEL_SOURCE_NUMS = [
  "31", // 1. In your opinion, what makes a briefing effective?
  "32", // 2. What was the most difficult situation...
  "33", // 3. What advice did your instructor give you before your first check ride?
  "03", // 4. Why do pilots need to take medical exams?
  "34", // 5. What will communications between pilots and ATC be like in ten years?
  "35", // 7. Why is the use of ICAO phraseology important?
  "11", // 8. How did you become interested in aviation?
  "36", // 9. When should a pilot perform a missed approach procedure?
  "37", // 10. How does a flight simulator help a pilot train for emergencies?
  "43", // 11. What were the best pieces of advice your instructor gave you?
  "38", // 12. How do you think Brazilian aviation will change in the near future?
];

const peelCards = PEEL_SOURCE_NUMS.map((srcNum, i) => {
  const card = cards.find((c) => c.num === srcNum);
  if (!card) throw new Error(`Missing card ${srcNum}`);
  const num = String(i + 1).padStart(2, "0");
  return {
    ...card,
    num,
    answer: [
      card.opener,
      ...card.ideas,
      card.example,
      card.conclusion,
    ].join(" "),
    targetWords: card.answer.split(/\s+/).filter(Boolean).length,
  };
});

writeFileSync(join(root, "cards.json"), `${JSON.stringify(peelCards, null, 2)}\n`);
console.log(`PEEL bank: ${peelCards.length} cards written`);
