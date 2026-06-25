import type { EvaluateFeedback } from "@/lib/evaluate/types";
import {
  ICAO_CRITERION_LABELS,
  type IcaoCriterion,
  type IcaoLevel,
  type IcaoLevelRating,
} from "@/lib/evaluate/icaoLevel";

export type SimulationStepResult = {
  situationId: string;
  situationNumber: number;
  examVersion: string;
  step: number;
  stepLabel: string;
  feedback: EvaluateFeedback;
  evaluationId?: string;
};

export type AggregatedMispronunciation = {
  word: string;
  accuracyScore: number;
  errorLabel: string;
  contexts: string[];
};

export type AggregatedSimulationResult = {
  rating: IcaoLevelRating;
  stepResults: SimulationStepResult[];
  mispronunciations: AggregatedMispronunciation[];
  improvements: Array<{ text: string; context: string }>;
  missingKeywords: Array<{ keyword: string; context: string }>;
};

const CRITERIA: IcaoCriterion[] = [
  "pronunciation",
  "structure",
  "vocabulary",
  "fluency",
  "comprehension",
  "interactions",
];

function stepContext(r: SimulationStepResult): string {
  return `${r.examVersion} Sit. ${r.situationNumber} — ${r.stepLabel}`;
}

export function aggregateSimulationResults(results: SimulationStepResult[]): AggregatedSimulationResult {
  const ratings = results.map((r) => r.feedback.icaoLevel).filter((r): r is IcaoLevelRating => !!r);

  const criteria = {} as Record<IcaoCriterion, IcaoLevel>;
  for (const key of CRITERIA) {
    const levels = ratings.map((r) => r.criteria[key]);
    criteria[key] = (levels.length ? Math.min(...levels) : 1) as IcaoLevel;
  }

  const entries = Object.entries(criteria) as [IcaoCriterion, IcaoLevel][];
  const limiting = entries.reduce((min, cur) => (cur[1] < min[1] ? cur : min))[0];
  const overall = Math.min(...entries.map(([, level]) => level)) as IcaoLevel;

  const misMap = new Map<string, AggregatedMispronunciation>();
  for (const r of results) {
    const words = r.feedback.azurePronunciation?.mispronouncedWords ?? [];
    const ctx = stepContext(r);
    for (const w of words) {
      const existing = misMap.get(w.word.toLowerCase());
      if (!existing || w.accuracyScore < existing.accuracyScore) {
        misMap.set(w.word.toLowerCase(), {
          word: w.word,
          accuracyScore: w.accuracyScore,
          errorLabel: w.errorLabel,
          contexts: existing ? [...new Set([...existing.contexts, ctx])] : [ctx],
        });
      } else if (existing) {
        existing.contexts = [...new Set([...existing.contexts, ctx])];
      }
    }
  }

  const improvements: Array<{ text: string; context: string }> = [];
  const missingKeywords: Array<{ keyword: string; context: string }> = [];

  for (const r of results) {
    const ctx = stepContext(r);
    for (const text of r.feedback.improvements) {
      improvements.push({ text, context: ctx });
    }
    for (const keyword of r.feedback.missingKeywords) {
      missingKeywords.push({ keyword, context: ctx });
    }
  }

  return {
    rating: { overall, criteria, limiting, isEstimate: true },
    stepResults: results,
    mispronunciations: [...misMap.values()].sort((a, b) => a.accuracyScore - b.accuracyScore),
    improvements,
    missingKeywords,
  };
}

export function formatCriterionSummary(rating: IcaoLevelRating): string {
  return CRITERIA.map((k) => `${ICAO_CRITERION_LABELS[k]}: ${rating.criteria[k]}`).join(" · ");
}
