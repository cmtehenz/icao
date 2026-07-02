import type { Card, Level4Step } from "./types";

export type StudyConnectorSlot = {
  slot: string;
  connectors: string[];
  hint: string;
};

/** Conectores simples recomendados no modo ICAO 4 — mesmo para todas as perguntas. */
export const LEVEL4_CONNECTOR_GUIDE: StudyConnectorSlot[] = [
  {
    slot: "1ª frase",
    connectors: ["(resposta direta)", "In my opinion,", "From my point of view,"],
    hint: "Responda a pergunta de forma direta. Conector opcional.",
  },
  {
    slot: "2ª frase",
    connectors: ["Also,", "Additionally,", "It also"],
    hint: "Segunda ideia — curta e clara.",
  },
  {
    slot: "3ª frase",
    connectors: ["It also", "Furthermore,", "Moreover,"],
    hint: "Terceira ideia ou detalhe importante.",
  },
  {
    slot: "4ª frase",
    connectors: ["As a result,", "Finally,", "Therefore,"],
    hint: "Fecha a resposta com o resultado ou conclusão.",
  },
  {
    slot: "Exemplo (+pontos)",
    connectors: ["For example,", "For instance,"],
    hint: "Vale pontos extras — use uma situação real de helicóptero.",
  },
];

function ideaBody(idea: string): string {
  const match = idea.match(/^[0-9]+\s*-\s*[^:]+:\s*(.+)$/i);
  return match ? match[1].trim() : idea.trim();
}

function stripOpenerLead(text: string): string {
  return text
    .replace(/^(In my opinion,?\s*|From my point of view,?\s*|To begin with,?\s*)/i, "")
    .trim();
}

/** Gera passos ICAO 4 a partir do PEEL quando o card ainda não tem level4Steps. */
export function inferLevel4Steps(card: Card): Level4Step[] {
  if (card.level4Steps?.length) return card.level4Steps;

  const labels = card.memoryLabels;
  const steps: Level4Step[] = [];

  if (labels.length >= 1) {
    steps.push({
      label: labels[0],
      sentence: stripOpenerLead(card.opener) || ideaBody(card.ideas[0] ?? ""),
    });
  }
  for (let i = 1; i < labels.length; i++) {
    const idea = card.ideas[i - 1] ?? card.ideas[i] ?? "";
    steps.push({
      label: labels[i],
      sentence: ideaBody(idea),
    });
  }

  return steps.filter((s) => s.sentence);
}

function defaultStudyPrompts(labels: string[]): string[] {
  if (labels.length === 4) {
    return [
      `1ª ideia → ${labels[0]}`,
      `2ª ideia → ${labels[1]}`,
      `3ª ideia → ${labels[2]}`,
      `Resultado → ${labels[3]}`,
    ];
  }
  if (labels.length === 3) {
    return [
      `Começo → ${labels[0]}`,
      `Meio → ${labels[1]}`,
      `Fechamento → ${labels[2]}`,
    ];
  }
  return labels.map((l, i) => `Passo ${i + 1} → ${l}`);
}

/** Dicas de estudo — usa studyTips do card ou gera a partir das keywords. */
export function getStudyTips(card: Card): string {
  if (card.studyTips) return card.studyTips;

  const labels = card.memoryLabels;
  const chain = labels.join(" → ");
  const prompts = defaultStudyPrompts(labels).map((p) => `• ${p}`).join("\n");

  return [
    `Palavras-chave para decorar: ${chain}`,
    "",
    "Siga a sequência do mapa mental — cada palavra vira uma frase curta:",
    "",
    prompts,
    "",
    "Use os conectores simples abaixo entre as frases. Com essas ideias você fala 40–60 segundos sem decorar texto inteiro.",
  ].join("\n");
}

/** Ícones padrão por quantidade de keywords quando o card não define memoryIcons. */
const FALLBACK_ICONS = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];

export function getMemoryIcons(card: Card): string[] {
  if (card.memoryIcons?.length) return card.memoryIcons;
  return card.memoryLabels.map((_, i) => FALLBACK_ICONS[i] ?? "•");
}

export function hasEasyStudyMode(card: Card): boolean {
  return Boolean(
    card.level4Steps?.length ||
      card.answerLevel4 ||
      card.memoryLabels.length >= 3,
  );
}
