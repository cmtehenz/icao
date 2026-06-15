import type { Card } from "./types";
import { applyProfile, type PilotProfile } from "./profile";
import { wordCount } from "./utils";

export function personalizeCard(card: Card, profile: PilotProfile): Card {
  const answer = applyProfile(card.answer, profile);
  return {
    ...card,
    opener: applyProfile(card.opener, profile),
    ideas: card.ideas.map((i) => applyProfile(i, profile)),
    example: applyProfile(card.example, profile),
    conclusion: applyProfile(card.conclusion, profile),
    answer,
    vocab: card.vocab.map((v) => applyProfile(v, profile)),
    targetWords: wordCount(answer),
  };
}
