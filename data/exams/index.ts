import { EXAM1 } from "./exam1";
import { EXAM2 } from "./exam2";
import { EXAM3 } from "./exam3";
import { EXAM4 } from "./exam4";
import type { ExamVersion } from "@/lib/exams/types";

export const SIMULADO_EXAMS = [EXAM1, EXAM2, EXAM3, EXAM4] as const;

export type SimuladoExamId = (typeof SIMULADO_EXAMS)[number]["id"];

export function getSimuladoExam(id: SimuladoExamId) {
  return SIMULADO_EXAMS.find((e) => e.id === id) ?? EXAM1;
}

export function examIdFromVersion(version: ExamVersion): SimuladoExamId {
  const map: Record<ExamVersion, SimuladoExamId> = {
    "23C": "exam1",
    "24C": "exam2",
    "25C": "exam3",
    "26C": "exam4",
  };
  return map[version];
}

export { EXAM1, EXAM2, EXAM3, EXAM4 };
