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
  hints: string[];
};

const SECTION_CONNECTORS = ["First of all,", "Additionally,", "Finally,"];

function stripPeelPrefix(text: string): string {
  return text
    .replace(/^\d+\s*-\s*[A-Z]+:\s*/i, "")
    .replace(/^(First of all|Additionally|Finally|Also),?\s*/i, "")
    .trim();
}

function splitAnswerSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 15);
}

/** 2–3 paraphrase-friendly starters per anchor — avoids locking onto one script. */
export function getSectionHints(card: Card, index: number): string[] {
  const hints: string[] = [];
  const seen = new Set<string>();

  const add = (raw: string | undefined) => {
    if (!raw) return;
    const text = stripPeelPrefix(raw);
    const key = text.toLowerCase();
    if (text.length >= 12 && !seen.has(key)) {
      seen.add(key);
      hints.push(text);
    }
  };

  const step = card.level4Steps?.[index];
  if (step?.hints?.length) {
    for (const h of step.hints) add(h);
  }
  if (step?.sentence) add(step.sentence);
  if (card.ideas[index]) add(card.ideas[index]);

  const level4 = card.answerLevel4 ? splitAnswerSentences(card.answerLevel4) : [];
  if (level4[index]) add(level4[index]);

  const level5 = card.answerLevel5 ? splitAnswerSentences(card.answerLevel5) : [];
  // Level 5 often opens with a framing sentence — offset when lengths differ.
  const level5Index = level5.length === (card.level4Steps?.length ?? level5.length) ? index : index + 1;
  if (level5[level5Index]) add(level5[level5Index]);
  else if (level5[index]) add(level5[index]);

  if (hints.length < 2 && index === 0) add(card.opener);

  return hints.slice(0, 3);
}

function firstWords(text: string, count: number): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= count) return text.trim();
  return `${words.slice(0, count).join(" ")}…`;
}

export function getAnchorBuildSteps(card: Card): AnchorBuildStep[] {
  const steps = card.level4Steps ?? [];
  if (steps.length >= 4) {
    return steps.slice(0, 4).map((step, index) => {
      const hints = getSectionHints(card, index);
      return {
        index,
        label: step.label,
        connector:
          index === 0
            ? firstWords(card.opener, 5)
            : SECTION_CONNECTORS[index - 1] ?? "Also,",
        starter: firstWords(step.sentence, 6),
        hint: hints[0] ?? step.sentence,
        hints,
      };
    });
  }

  return (card.memoryLabels ?? []).slice(0, 4).map((label, index) => {
    const hints = getSectionHints(card, index);
    return {
      index,
      label,
      connector: index === 0 ? firstWords(card.opener, 5) : SECTION_CONNECTORS[index - 1] ?? "Also,",
      starter: firstWords(hints[0] ?? label, 6),
      hint: hints[0] ?? card.ideas[index] ?? card.opener,
      hints,
    };
  });
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
  hints: string[];
};

export function getStoryConnectSections(card: Card, keywords: string[]): StoryConnectSection[] {
  return getAnchorBuildSteps(card).map((step, index) => ({
    index,
    label: step.label,
    connector: step.connector,
    keywords: [...new Set([step.label, keywords[index]].filter(Boolean))],
    hint: step.hint,
    hints: step.hints,
  }));
}

export const STORY_FULL_CONNECTOR = "For example,";
export const STORY_CLOSE_CONNECTOR = "Overall,";
