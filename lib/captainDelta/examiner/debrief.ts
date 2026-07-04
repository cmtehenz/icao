import type { SimulationReport } from "@/lib/simulado/types";
import type { SimuladoStepResult } from "@/lib/simulado/types";
import type { ExaminerDebrief, ExaminerExamRecord } from "@/lib/captainDelta/examiner/types";
import { ICAO_CRITERION_LABELS, type IcaoCriterion } from "@/lib/evaluate/icaoLevel";
import { toSpeechText } from "@/lib/captainDelta/voiceText";

const CRITERIA: IcaoCriterion[] = [
  "pronunciation",
  "structure",
  "vocabulary",
  "fluency",
  "comprehension",
  "interactions",
];

export function buildExaminerDebrief(
  report: SimulationReport,
  results: SimuladoStepResult[] = [],
): ExaminerDebrief {
  const partEntries = ([1, 2, 3, 4] as const)
    .map((p) => ({
      part: p,
      score: report.partScores[`part${p}` as keyof typeof report.partScores],
    }))
    .filter((e): e is { part: typeof e.part; score: number } => e.score != null);

  const sorted = [...partEntries].sort((a, b) => b.score - a.score);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  const scored = [...results].sort((a, b) => b.feedback.scores.overall - a.feedback.scores.overall);
  const bestResult = scored[0];
  const worstResult = scored[scored.length - 1];

  const wordsToPractice = [
    ...new Set(
      results.flatMap((r) => r.feedback.azurePronunciation?.weakWords ?? []).slice(0, 6),
    ),
  ].slice(0, 6);

  const weakestPartLabel = worst ? `Part ${worst.part}` : "Part 2";
  const tomorrowMission = [
    report.studyRecommendations[0] ?? `One full ${weakestPartLabel} scenario`,
    "Five minutes of pronunciation",
    report.studyRecommendations[1] ?? "Tell one real story in your next answer",
  ].slice(0, 3);

  const spokenParts = [
    "Good work today.",
    best ? `Your Part ${best.part} answers were organized and natural.` : "",
    worst ? `Your weakest area today was Part ${worst.part}, especially reported speech.` : "",
    `Tomorrow I recommend ${tomorrowMission[0]?.toLowerCase() ?? "continued practice"}.`,
  ].filter(Boolean);

  return {
    disclaimer: "This is a training estimate, not an official SDEA/ANAC score.",
    estimatedLevel: report.estimatedLevel,
    criteria: CRITERIA.map((key) => ({
      key,
      label: ICAO_CRITERION_LABELS[key],
      level: report.criterionLevels[key],
      score: report.scores[key],
    })),
    partScores: partEntries,
    strengths: report.strengths.slice(0, 5),
    weaknesses: report.weaknesses.slice(0, 6),
    bestAnswer: bestResult
      ? {
          label: bestResult.label,
          score: bestResult.feedback.scores.overall,
          transcript: bestResult.feedback.transcript,
        }
      : null,
    worstAnswer: worstResult
      ? {
          label: worstResult.label,
          score: worstResult.feedback.scores.overall,
          transcript: worstResult.feedback.transcript,
        }
      : null,
    hardestMoment: report.difficultItems[0] ?? null,
    wordsToPractice,
    tomorrowMission,
    spokenSummary: toSpeechText(spokenParts.join(" ")),
  };
}

export function buildExaminerExamRecord(
  report: SimulationReport,
  recordings: ExaminerExamRecord["recordings"],
  totalRecordSteps: number,
): ExaminerExamRecord {
  const partEntries = ([1, 2, 3, 4] as const)
    .map((p) => ({
      part: p,
      score: report.partScores[`part${p}` as keyof typeof report.partScores],
    }))
    .filter((e): e is { part: typeof e.part; score: number } => e.score != null);

  const sorted = [...partEntries].sort((a, b) => b.score - a.score);
  const avgResponseSec =
    recordings.length > 0
      ? Math.round(recordings.reduce((s, r) => s + r.durationSec, 0) / recordings.length)
      : null;

  return {
    reportId: report.id,
    date: report.date,
    mode: report.mode,
    examVersion: report.examVersion,
    estimatedLevel: report.estimatedLevel,
    strongestPart: sorted[0]?.part ?? null,
    weakestPart: sorted[sorted.length - 1]?.part ?? null,
    avgResponseSec,
    completionPct:
      totalRecordSteps > 0 ? Math.round((recordings.length / totalRecordSteps) * 100) : 100,
    recordings,
  };
}
