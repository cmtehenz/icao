import type { Card } from "./types";
import { formatIdea } from "./utils";

export type PeelBlockId =
  | "opener"
  | "idea1"
  | "idea2"
  | "idea3"
  | "example"
  | "conclusion";

export type PeelBlockColor = "blue" | "orange" | "purple" | "green";

export type PeelBlock = {
  id: PeelBlockId;
  label: string;
  text: string;
  color: PeelBlockColor;
};

function ideaText(idea: string): string {
  const parsed = formatIdea(idea);
  return parsed ? parsed.rest.trim() : idea.trim();
}

/** Six spoken PEEL blocks for shadowing and oral practice. */
export function getPeelBlocks(card: Card): PeelBlock[] {
  const blocks: PeelBlock[] = [
    { id: "opener", label: "Abertura", text: card.opener.trim(), color: "blue" },
    { id: "idea1", label: "Ideia 1", text: ideaText(card.ideas[0] ?? ""), color: "orange" },
    { id: "idea2", label: "Ideia 2", text: ideaText(card.ideas[1] ?? ""), color: "orange" },
    { id: "idea3", label: "Ideia 3", text: ideaText(card.ideas[2] ?? ""), color: "orange" },
    { id: "example", label: "Exemplo", text: card.example.trim(), color: "purple" },
    { id: "conclusion", label: "Conclusão", text: card.conclusion.trim(), color: "green" },
  ];
  return blocks.filter((b) => b.text);
}
