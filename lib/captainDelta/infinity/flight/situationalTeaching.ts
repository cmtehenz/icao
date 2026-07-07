import { buildFlightScenario } from "@/lib/captainDelta/infinity/flight/scenarioEngine";
import type { OperationContext } from "@/lib/captainDelta/infinity/mentorProfile";
import type { ExamTrainingPhase } from "@/lib/captainDelta/infinity/flight/types";
import { examPhaseIncreasesRealism } from "@/lib/captainDelta/infinity/flight/examPhase";

export function buildSituationalExercise(
  word: string,
  callsign: string,
  operationContext: OperationContext = "helicopter",
  examPhase: ExamTrainingPhase = "teaching",
): string {
  const scenario = buildFlightScenario(word, callsign, operationContext);
  if (!scenario) {
    return `Say ${word} like a calm radio call — short and operational.`;
  }

  const realism = examPhaseIncreasesRealism(examPhase)
    ? " Tower may speak faster in the exam — stay with the key words."
    : "";

  return [
    scenario.situation,
    `Tower: "${scenario.towerOrRadioLine}"`,
    scenario.studentPrompt,
    realism,
    "Now repeat the line in your own steady voice.",
  ]
    .filter(Boolean)
    .join(" ");
}

export function buildStudentDecisionPrompt(word: string): string {
  return `Quick check — what would you say to Tower if this situation involved "${word}"?`;
}
