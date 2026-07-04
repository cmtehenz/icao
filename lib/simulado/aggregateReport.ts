import type { SimulationReport, SimuladoPart, SimuladoSessionConfig, SimuladoStepResult } from "@/lib/simulado/types";
import {
  ICAO_CRITERION_LABELS,
  type IcaoCriterion,
  type IcaoLevel,
  scoreToIcaoLevel,
} from "@/lib/evaluate/icaoLevel";
import { modeLabel } from "@/lib/simulado/buildSteps";
import { SIMULADO_ACTIVE_PARTS } from "@/lib/simulado/config";

const CRITERIA: IcaoCriterion[] = [
  "pronunciation",
  "structure",
  "vocabulary",
  "fluency",
  "comprehension",
  "interactions",
];

function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

function partScore(results: SimuladoStepResult[], part: SimuladoPart): number | undefined {
  const items = results.filter((r) => r.part === part);
  if (!items.length) return undefined;
  return avg(items.map((r) => r.feedback.scores.overall));
}

function criterionScores(results: SimuladoStepResult[]): Record<IcaoCriterion, number> {
  const pron = results.map((r) => r.feedback.azurePronunciation?.accuracyScore ?? r.feedback.scores.pronunciation);
  const fluency = results.map((r) => r.feedback.azurePronunciation?.fluencyScore ?? r.feedback.scores.overall);
  return {
    pronunciation: avg(pron),
    structure: avg(results.map((r) => r.feedback.scores.structure)),
    vocabulary: avg(results.map((r) => r.feedback.scores.content)),
    fluency: avg(fluency),
    comprehension: avg(results.map((r) => r.feedback.scores.content * 0.7 + r.feedback.scores.structure * 0.3)),
    interactions: avg(results.map((r) => r.feedback.scores.phraseology * 0.6 + r.feedback.scores.overall * 0.4)),
  };
}

function criterionLevels(scores: Record<IcaoCriterion, number>): Record<IcaoCriterion, IcaoLevel> {
  const out = {} as Record<IcaoCriterion, IcaoLevel>;
  for (const k of CRITERIA) out[k] = scoreToIcaoLevel(scores[k]);
  return out;
}

function buildRecommendations(
  weaknesses: string[],
  weakestPart: SimuladoPart | null,
): string[] {
  const recs: string[] = [];
  if (weakestPart === 2 || weaknesses.some((w) => /readback|reported|ATC/i.test(w))) {
    recs.push("Practice Part 2 vocabulary and reported speech templates.");
  }
  if (weakestPart === 1 || weaknesses.some((w) => /connector|structure|short/i.test(w))) {
    recs.push("Review aviation connectors and PEEL structure for Part 1.");
  }
  if (weakestPart === 4 || weaknesses.some((w) => /picture|description|position/i.test(w))) {
    recs.push("Practice picture description: topic, scenario, position, weather, hypothesis.");
  }
  if (weakestPart === 3) recs.push("Train unexpected situation reports with clear organization.");
  if (weaknesses.some((w) => /pronunciation|pronúncia/i.test(w))) {
    recs.push("Train pronunciation of weak words in the pronunciation vault.");
  }
  if (!recs.length) recs.push("Repeat this simulation to build consistency.");
  return [...new Set(recs)];
}

function partsIncludedForConfig(config: SimuladoSessionConfig): SimuladoPart[] {
  if (config.mode === "custom" && config.customParts?.length) {
    return config.customParts.filter((p) => SIMULADO_ACTIVE_PARTS.includes(p));
  }
  if (config.mode === "full") return [...SIMULADO_ACTIVE_PARTS];
  if (config.mode === "part1") return [1];
  if (config.mode === "part2") return [2];
  if (config.mode === "part3") return [3];
  if (config.mode === "part4") return [4];
  return [1];
}

export function buildSimulationReport(
  config: SimuladoSessionConfig,
  results: SimuladoStepResult[],
): SimulationReport {
  const scores = criterionScores(results);
  const criterionLevelsMap = criterionLevels(scores);
  const levels = Object.values(criterionLevelsMap);
  const estimatedLevel = Math.min(...levels) as 3 | 4 | 5 | 6;

  const partScores = {
    part1: partScore(results, 1),
    part2: partScore(results, 2),
    part3: partScore(results, 3),
    part4: partScore(results, 4),
  };

  const partEntries = ([1, 2, 3, 4] as SimuladoPart[])
    .map((p) => ({ part: p, score: partScores[`part${p}` as keyof typeof partScores] }))
    .filter((e): e is { part: SimuladoPart; score: number } => e.score != null);

  const weakestPart = partEntries.length
    ? partEntries.reduce((min, cur) => (cur.score < min.score ? cur : min)).part
    : null;
  const strongestPart = partEntries.length
    ? partEntries.reduce((max, cur) => (cur.score > max.score ? cur : max)).part
    : null;

  const strengths = [
    ...new Set(results.flatMap((r) => r.feedback.strengths).filter(Boolean)),
  ].slice(0, 6);
  const weaknesses = [
    ...new Set(results.flatMap((r) => r.feedback.improvements).filter(Boolean)),
  ].slice(0, 8);

  const difficultItems = results
    .filter((r) => r.feedback.scores.overall < 62)
    .map((r) => `${r.label} (${r.part})`);

  const transcript = results.map((r) => ({
    stepId: r.stepId,
    part: r.part,
    label: r.label,
    question: r.question,
    transcript: r.feedback.transcript,
    modelAnswer: r.modelAnswer,
  }));

  if (!strengths.length) strengths.push("Completed the simulation — good training discipline.");

  return {
    id: `sim-${Date.now()}`,
    date: new Date().toISOString(),
    examVersion: config.examVersion,
    mode: config.mode,
    partsIncluded: partsIncludedForConfig(config),
    estimatedLevel: Math.max(3, Math.min(6, estimatedLevel)) as 3 | 4 | 5 | 6,
    scores,
    partScores,
    strengths,
    weaknesses,
    studyRecommendations: buildRecommendations(weaknesses, weakestPart),
    difficultItems,
    transcript,
    criterionLevels: criterionLevelsMap,
  };
}

export function formatCriterionScores(report: SimulationReport): string {
  return CRITERIA.map((k) => `${ICAO_CRITERION_LABELS[k]}: ${report.criterionLevels[k]}`).join(" · ");
}

export function suggestedNextPractice(report: SimulationReport): string {
  const weakest = Object.entries(report.partScores)
    .filter(([, v]) => v != null)
    .sort(([, a], [, b]) => (a ?? 0) - (b ?? 0))[0];
  if (!weakest) return `Repeat ${modeLabel(report.mode)}`;
  const part = weakest[0].replace("part", "Part ");
  return `Focus on ${part} — weakest area in this simulation`;
}
