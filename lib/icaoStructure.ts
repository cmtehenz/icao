import { formatIdea } from "./utils";
import type { Card } from "./types";

export type IcaoStructureBlock = {
  step: number;
  label: string;
  hint: string;
  example: string;
  color: "blue" | "orange" | "purple" | "green";
};

export const ICAO_FORMULA = {
  title: "ICAO 4 Formula",
  steps: ["Answer", "Reason", "Example", "Conclusion"],
  templates: [
    { step: "Answer", phrase: "In my opinion..." },
    { step: "Reason", phrase: "One of the main reasons is..." },
    { step: "Example", phrase: "For example..." },
    { step: "Conclusion", phrase: "As a result..." },
  ],
} as const;

export const RESPONSE_TARGET_SECONDS = "30–45 seconds";

function stripLead(text: string, patterns: RegExp[]): string {
  let out = text.trim();
  for (const p of patterns) {
    out = out.replace(p, "").trim();
  }
  return out;
}

function ideaBody(idea: string): string {
  const parsed = formatIdea(idea);
  if (!parsed) return idea.trim();
  return stripLead(parsed.rest, [
    /^First of all,?\s*/i,
    /^Additionally,?\s*/i,
    /^Finally,?\s*/i,
    /^First,?\s*/i,
    /^Second,?\s*/i,
  ]);
}

function simplifyMain(opener: string): string {
  return stripLead(opener, [
    /^In my opinion,?\s*/i,
    /^From my point of view,?\s*/i,
    /^To begin with,?\s*/i,
    /^First of all,?\s*/i,
    /^To get started,?\s*/i,
  ]);
}

function simplifyConclusion(conclusion: string): string {
  const stripped = stripLead(conclusion, [/^Overall,?\s*/i, /^In conclusion,?\s*/i]);
  if (/^(Therefore|As a result|Thus|So),?\s/i.test(stripped)) return stripped;
  return `As a result, ${stripped.charAt(0).toLowerCase()}${stripped.slice(1)}`;
}

function simplifyExample(example: string): string {
  const body = stripLead(example, [/^For example,?\s*/i]);
  return body.match(/^for example/i) ? body : `For example, ${body.charAt(0).toLowerCase()}${body.slice(1)}`;
}

export function getKeywords(card: Card): string[] {
  if (card.keywords?.length) return card.keywords;
  return card.memoryLabels.slice(0, 5);
}

/** Build Level 4 structure examples from card content — short, natural sentences. */
export function getIcaoStructure(card: Card): IcaoStructureBlock[] {
  const reasonParts = [ideaBody(card.ideas[0] ?? ""), ideaBody(card.ideas[1] ?? "")]
    .filter(Boolean)
    .join(" ");

  return [
    {
      step: 1,
      label: "Main Idea",
      hint: "Answer the question directly",
      example: simplifyMain(card.opener),
      color: "blue",
    },
    {
      step: 2,
      label: "Reason",
      hint: "Explain why",
      example: reasonParts || ideaBody(card.ideas[0] ?? card.opener),
      color: "orange",
    },
    {
      step: 3,
      label: "Example",
      hint: "Give a practical example",
      example: simplifyExample(card.example),
      color: "purple",
    },
    {
      step: 4,
      label: "Conclusion",
      hint: "Finish the answer naturally",
      example: simplifyConclusion(card.conclusion),
      color: "green",
    },
  ];
}

export function estimateStructureWords(card: Card): number {
  return getIcaoStructure(card)
    .map((b) => b.example)
    .join(" ")
    .split(/\s+/).filter(Boolean).length;
}
