import { formatIdea } from "./utils";
import type { Card } from "./types";

export type SimplePhrase = {
  label: string;
  text: string;
};

function ideaText(idea: string): string {
  const parsed = formatIdea(idea);
  return parsed ? parsed.rest.trim() : idea.trim();
}

/** Four short phrases to answer orally: opener, two ideas, closing (idea 3 + conclusion). */
export function getSimplePhrases(card: Card): SimplePhrase[] {
  const closing = [card.ideas[2] ? ideaText(card.ideas[2]) : "", card.conclusion.trim()]
    .filter(Boolean)
    .join(" ");

  return [
    { label: "Abertura", text: card.opener.trim() },
    { label: "Ponto 1", text: ideaText(card.ideas[0] ?? "") },
    { label: "Ponto 2", text: ideaText(card.ideas[1] ?? "") },
    { label: "Fechamento", text: closing },
  ].filter((p) => p.text);
}

export function getSimplePhrasesText(card: Card): string {
  return getSimplePhrases(card)
    .map((p, i) => `${i + 1}. ${p.text}`)
    .join("\n\n");
}
