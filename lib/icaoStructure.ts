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

/** Resposta oral curta — 4 passos, conectores simples (nota ICAO 4). */
export function buildIcaoLevel4Answer(card: Card): string {
  const main = simplifyMain(card.opener);
  const idea1 = ideaBody(card.ideas[0] ?? "");
  const idea2 = ideaBody(card.ideas[1] ?? "");
  const ex = simplifyExample(card.example);
  const endRaw = stripLead(card.conclusion, [/^Overall,?\s*/i, /^In conclusion,?\s*/i]);
  const conclusion = `Overall, ${endRaw.charAt(0).toLowerCase()}${endRaw.slice(1)}`;

  const parts: string[] = [main];
  if (idea1) {
    parts.push(`First, ${idea1.charAt(0).toLowerCase()}${idea1.slice(1)}`);
  }
  if (idea2) {
    parts.push(`Also, ${idea2.charAt(0).toLowerCase()}${idea2.slice(1)}`);
  }
  parts.push(ex);
  parts.push(conclusion);
  return parts.filter(Boolean).join(" ");
}

/** Card PEEL simplificado para exibição no modo ICAO 4 (2 ideias, sem jargão). */
export function toLevel4Card<T extends Card>(card: T): T {
  if (card.answerLevel4) {
    const ideas = card.level4Steps?.length
      ? card.level4Steps.map(
          (step, i) => `${i + 1} - ${step.label.toUpperCase()}: ${step.sentence}`,
        )
      : card.ideas.slice(0, 2);
    return {
      ...card,
      answer: card.answerLevel4,
      ideas,
    };
  }

  const main = simplifyMain(card.opener);
  const idea1 = ideaBody(card.ideas[0] ?? "");
  const idea2 = ideaBody(card.ideas[1] ?? "");
  const ex = simplifyExample(card.example);
  const endRaw = stripLead(card.conclusion, [/^Overall,?\s*/i, /^In conclusion,?\s*/i]);
  const conclusion = `Overall, ${endRaw.charAt(0).toLowerCase()}${endRaw.slice(1)}`;

  const ideas: string[] = [];
  if (idea1) {
    ideas.push(`1 - SITUATION: First, ${idea1.charAt(0).toLowerCase()}${idea1.slice(1)}`);
  }
  if (idea2) {
    ideas.push(`2 - ACTION: Also, ${idea2.charAt(0).toLowerCase()}${idea2.slice(1)}`);
  }

  const answer = buildIcaoLevel4Answer(card);

  return {
    ...card,
    opener: main,
    ideas: ideas.length ? ideas : card.ideas.slice(0, 2),
    example: ex,
    conclusion,
    answer,
  };
}

/** Resposta narrativa mais longa para modo ICAO 5. */
export function toLevel5Card<T extends Card>(card: T): T {
  if (!card.answerLevel5) return card;
  return {
    ...card,
    answer: card.answerLevel5,
  };
}
