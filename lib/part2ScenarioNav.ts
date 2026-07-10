import { ALL_EXAM_SITUATIONS, getSituationsByExam } from "@/data/exams/part2Data";
import type { ExamSituation, ExamVersion } from "@/lib/exams/types";

export function findScenarioIndex(scenarios: ExamSituation[], scenarioId: string): number {
  return scenarios.findIndex((s) => s.id === scenarioId);
}

export type Part2ScenarioNav = {
  examVersion: ExamVersion | "all";
  index: number;
  scenarioId: string | null;
};

export function resolvePart2ScenarioNav(scenarioId: string | null): Part2ScenarioNav {
  if (!scenarioId) {
    return { examVersion: "all", index: 0, scenarioId: null };
  }

  const scenario = ALL_EXAM_SITUATIONS.find((s) => s.id === scenarioId);
  if (!scenario) {
    return { examVersion: "all", index: 0, scenarioId };
  }

  const list = getSituationsByExam(scenario.examVersion);
  const index = findScenarioIndex(list, scenarioId);
  return {
    examVersion: scenario.examVersion,
    index: index >= 0 ? index : 0,
    scenarioId,
  };
}

export function scenariosForExamVersion(examVersion: ExamVersion | "all") {
  if (examVersion === "all") return ALL_EXAM_SITUATIONS;
  return getSituationsByExam(examVersion);
}

/** Keep index on the same scenario when switching exam filter. */
export function remapIndexAfterExamChange(
  prevScenarioId: string | null,
  nextExamVersion: ExamVersion | "all",
): number {
  if (!prevScenarioId) return 0;
  const list = scenariosForExamVersion(nextExamVersion);
  const idx = findScenarioIndex(list, prevScenarioId);
  return idx >= 0 ? idx : 0;
}
