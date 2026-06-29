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

/** Short oral summary — one line per PEEL block (for the quick-phrases menu). */
export function getSimplePhrases(card: Card): SimplePhrase[] {
  return [
    { label: "Abertura", text: card.opener.trim() },
    { label: "Ideia 1", text: ideaText(card.ideas[0] ?? "") },
    { label: "Ideia 2", text: ideaText(card.ideas[1] ?? "") },
    { label: "Ideia 3", text: ideaText(card.ideas[2] ?? "") },
    { label: "Exemplo", text: card.example.trim() },
    { label: "Conclusão", text: card.conclusion.trim() },
  ].filter((p) => p.text);
}

export function getSimplePhrasesText(card: Card): string {
  return getSimplePhrases(card)
    .map((p, i) => `${i + 1}. ${p.text}`)
    .join("\n\n");
}
