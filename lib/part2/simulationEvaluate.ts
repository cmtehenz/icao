import type { ExamSituation } from "@/lib/exams/types";
import type { EvaluateType } from "@/lib/evaluate/types";

export const SIMULATION_SPEAK_STEPS = [1, 3, 5, 7] as const;
export type SimulationSpeakStep = (typeof SIMULATION_SPEAK_STEPS)[number];

export function isSimulationSpeakStep(step: number): step is SimulationSpeakStep {
  return (SIMULATION_SPEAK_STEPS as readonly number[]).includes(step);
}

export type SpeakStepConfig = {
  evaluateType: EvaluateType;
  question: string;
  modelAnswer: string;
  label: string;
};

export function getSpeakStepConfig(scenario: ExamSituation, step: SimulationSpeakStep): SpeakStepConfig {
  switch (step) {
    case 1:
      return {
        evaluateType: "part2-readback",
        question: scenario.context,
        modelAnswer: scenario.readback.modelReadback,
        label: "Readback",
      };
    case 3:
      return {
        evaluateType: "part2-interaction",
        question: scenario.interaction.prompt,
        modelAnswer: scenario.interaction.modelReport,
        label: "Reporte do problema",
      };
    case 5:
      return {
        evaluateType: "part2-interaction",
        question: scenario.atcFollowUp.atcMessage,
        modelAnswer: scenario.atcFollowUp.modelCorrection,
        label: `${scenario.atcFollowUp.correctionType}`,
      };
    case 7:
      return {
        evaluateType: "part2-reported",
        question: "What did the controller say?",
        modelAnswer: scenario.reportedSpeech.modelAnswer,
        label: "Reported speech",
      };
  }
}

export function simulationRecordingKey(situationId: string, step: number): string {
  return `${situationId}-${step}`;
}
