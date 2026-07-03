import type { EvaluateScores, EvaluateType } from "./types";

export type IcaoLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type IcaoCriterion =
  | "pronunciation"
  | "structure"
  | "vocabulary"
  | "fluency"
  | "comprehension"
  | "interactions";

export type IcaoLevelRating = {
  overall: IcaoLevel;
  criteria: Record<IcaoCriterion, IcaoLevel>;
  limiting: IcaoCriterion;
  /** Estimativa para treino — não substitui avaliação oficial SDEA/ANAC */
  isEstimate: true;
};

export const ICAO_LEVEL_LABELS: Record<IcaoLevel, { title: string; short: string }> = {
  6: { title: "Expert", short: "Especialista" },
  5: { title: "Extended", short: "Avançado" },
  4: { title: "Operational", short: "Operacional" },
  3: { title: "Pre-operational", short: "Pré-operacional" },
  2: { title: "Elementary", short: "Elementar" },
  1: { title: "Pre-elementary", short: "Pré-elementar" },
};

export const ICAO_CRITERION_LABELS: Record<IcaoCriterion, string> = {
  pronunciation: "Pronúncia",
  structure: "Estrutura (gramática)",
  vocabulary: "Vocabulário",
  fluency: "Fluência",
  comprehension: "Compreensão",
  interactions: "Interação",
};

/** Converte score 0–100 em nível ICAO (1–6) — calibrado para treino, não oficial */
export function scoreToIcaoLevel(score: number): IcaoLevel {
  const s = Math.max(0, Math.min(100, score));
  if (s >= 88) return 6;
  if (s >= 78) return 5;
  if (s >= 62) return 4;
  if (s >= 45) return 3;
  if (s >= 28) return 2;
  return 1;
}

type AzureScores = {
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
};

/**
 * Na prova real ICAO o nível final = o MENOR dos 6 critérios.
 * Aqui estimamos cada critério a partir dos scores do app + Azure (quando houver).
 */
export function estimateIcaoLevel(
  scores: EvaluateScores,
  type: EvaluateType,
  azure?: AzureScores,
): IcaoLevelRating {
  const pronunciation = scoreToIcaoLevel(azure?.accuracyScore ?? scores.pronunciation);
  const structure = scoreToIcaoLevel(scores.structure);
  const vocabulary = scoreToIcaoLevel(scores.content);
  const fluency = scoreToIcaoLevel(
    azure ? azure.fluencyScore * 0.7 + (azure.completenessScore ?? scores.content) * 0.3 : scores.overall,
  );
  const comprehension = scoreToIcaoLevel(scores.content * 0.85 + scores.structure * 0.15);
  const interactions = scoreToIcaoLevel(
    type.startsWith("part2")
      ? scores.phraseology
      : type.startsWith("part3")
        ? scores.phraseology * 0.5 + scores.content * 0.5
        : scores.structure * 0.5 + scores.content * 0.5,
  );

  const criteria: Record<IcaoCriterion, IcaoLevel> = {
    pronunciation,
    structure,
    vocabulary,
    fluency,
    comprehension,
    interactions,
  };

  const entries = Object.entries(criteria) as [IcaoCriterion, IcaoLevel][];
  const limiting = entries.reduce((min, cur) => (cur[1] < min[1] ? cur : min))[0];

  const overall = Math.min(...entries.map(([, level]) => level)) as IcaoLevel;

  return { overall, criteria, limiting, isEstimate: true };
}
