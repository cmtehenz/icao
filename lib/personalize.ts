import { applyConnectorSet, type ConnectorSetId } from "./connectors";
import type { Card } from "./types";
import { applyProfile, type PilotProfile } from "./profile";
import { wordCount } from "./utils";

export function personalizeCard(
  card: Card,
  profile: PilotProfile,
  connectorSet: ConnectorSetId = "level4",
): Card {
  const withProfile: Card = {
    ...card,
    opener: applyProfile(card.opener, profile),
    ideas: card.ideas.map((i) => applyProfile(i, profile)),
    example: applyProfile(card.example, profile),
    conclusion: applyProfile(card.conclusion, profile),
    answer: applyProfile(card.answer, profile),
    vocab: card.vocab.map((v) => applyProfile(v, profile)),
  };

  const seed = Number.parseInt(card.num, 10) || 0;
  const withConnectors = applyConnectorSet(withProfile, connectorSet, seed);
  return {
    ...withConnectors,
    targetWords: wordCount(withConnectors.answer),
  };
}
