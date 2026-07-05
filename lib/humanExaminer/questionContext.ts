import { CARDS } from "@/lib/cards";
import type { Card } from "@/lib/types";
import type { QuestionContext } from "@/lib/humanExaminer/types";
import { difficultyFromCard } from "@/lib/humanExaminer/difficulty";

const DOMAIN_BY_CATEGORY: Record<string, string> = {
  helicopter: "Helicopter Operations",
  aviation: "General Aviation",
  human_factors: "Human Factors & CRM",
  weather: "Weather & Environment",
  safety: "Safety Management",
};

function operationalTopic(card: Card): string {
  const firstIdea = card.ideas[0]?.replace(/^\d+\s*-\s*[^:]+:\s*/i, "").trim();
  if (firstIdea) return firstIdea.slice(0, 80);
  return card.memoryLabels.join(" · ") || card.category;
}

function buildSuggestedFollowUps(card: Card): string[] {
  const kw = card.keywords ?? card.memoryLabels;
  const base = [
    "Could you explain that in more detail?",
    "Can you give an example from your experience?",
    "Why is that important for flight safety?",
    "How would you brief the crew about this?",
    "What is the biggest risk if we ignore this?",
  ];
  if (kw.length > 0) {
    base.unshift(`How does ${kw[0]} affect your decision making?`);
  }
  if (card.category === "helicopter") {
    base.push("How is this different in helicopters compared to fixed-wing?");
  }
  return base.slice(0, 8);
}

export function buildQuestionContext(card: Card): QuestionContext {
  const keywords = card.keywords ?? card.memoryLabels ?? [];
  return {
    cardNum: card.num,
    question: card.question,
    knowledgeDomain: DOMAIN_BY_CATEGORY[card.category] ?? "Aviation Operations",
    operationalTopic: operationalTopic(card),
    keywords,
    suggestedFollowUps: buildSuggestedFollowUps(card),
    difficulty: difficultyFromCard(card),
    captainNotes: `PEEL memory: ${card.memory}. Target operational reasoning, not memorized script.`,
    graphRefs: card.memoryLabels.map((l) => `peel:${card.num}:${l}`),
  };
}

export function getQuestionContext(cardNum: string): QuestionContext | null {
  const card = CARDS.find((c) => c.num === cardNum);
  if (!card) return null;
  return buildQuestionContext(card);
}
