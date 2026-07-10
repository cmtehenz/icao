import type { Card } from "@/lib/types";
import { hasShadowPeelScoredToday } from "@/lib/shadowPeelDedup";

/** Mission shadow uses 4 anchor sentences — paraphrase-friendly (Flight Manual §06). */
export const ANCHOR_BUILD_PASS_SCORE = 55;

export type AnchorBuildStep = {
  index: number;
  label: string;
  connector: string;
  starter: string;
  hint: string;
};

const SECTION_CONNECTORS = ["First of all,", "Additionally,", "Finally,"];

function firstWords(text: string, count: number): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= count) return text.trim();
  return `${words.slice(0, count).join(" ")}…`;
}

export function getAnchorBuildSteps(card: Card): AnchorBuildStep[] {
  const steps = card.level4Steps ?? [];
  if (steps.length >= 4) {
    return steps.slice(0, 4).map((step, index) => ({
      index,
      label: step.label,
      connector:
        index === 0
          ? firstWords(card.opener, 5)
          : SECTION_CONNECTORS[index - 1] ?? "Also,",
      starter: firstWords(step.sentence, 6),
      hint: step.sentence,
    }));
  }

  return (card.memoryLabels ?? []).slice(0, 4).map((label, index) => ({
    index,
    label,
    connector: index === 0 ? firstWords(card.opener, 5) : SECTION_CONNECTORS[index - 1] ?? "Also,",
    starter: label,
    hint: card.ideas[index] ?? card.opener,
  }));
}

export function anchorBuildActivityKey(cardNum: string, index: number): string {
  return `${cardNum.padStart(2, "0")}:build-${index}`;
}

export function part1AnchorBuildProgress(
  cardNum: string,
  card: Card,
): { done: number; total: number } {
  const steps = getAnchorBuildSteps(card);
  const done = steps.filter((_, index) =>
    hasShadowPeelScoredToday(anchorBuildActivityKey(cardNum, index)),
  ).length;
  return { done, total: steps.length };
}

export function part1AnchorBuildComplete(cardNum: string, card: Card): boolean {
  const { done, total } = part1AnchorBuildProgress(cardNum, card);
  return total > 0 && done >= total;
}

export type StoryConnectSection = {
  index: number;
  label: string;
  connector: string;
  keywords: string[];
  hint: string;
};

export function getStoryConnectSections(card: Card, keywords: string[]): StoryConnectSection[] {
  return getAnchorBuildSteps(card).map((step, index) => ({
    index,
    label: step.label,
    connector: step.connector,
    keywords: [step.label, keywords[index] ?? ""].filter(Boolean),
    hint: step.hint,
  }));
}

export const STORY_FULL_CONNECTOR = "For example,";
export const STORY_CLOSE_CONNECTOR = "Overall,";
