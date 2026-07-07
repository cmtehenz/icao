import type { ExamTrainingPhase } from "@/lib/captainDelta/infinity/flight/types";

/** Exam preparation timeline — strategy shifts automatically. */
export function getExamTrainingPhase(daysUntilExam: number): ExamTrainingPhase {
  if (daysUntilExam <= 2) return "confidence";
  if (daysUntilExam <= 7) return "exam";
  if (daysUntilExam <= 15) return "simulation";
  return "teaching";
}

export function examPhaseCoachingNote(phase: ExamTrainingPhase): string | null {
  switch (phase) {
    case "teaching":
      return null;
    case "simulation":
      return "We're in simulation phase — answer like a real radio call, short and operational.";
    case "exam":
      return "Exam mode — examiner pace. One idea, then stop.";
    case "confidence":
      return "Two days out — trust your training. Slow, clear, calm voice.";
  }
}

export function examPhaseIncreasesRealism(phase: ExamTrainingPhase): boolean {
  return phase === "simulation" || phase === "exam";
}
