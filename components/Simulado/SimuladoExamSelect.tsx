"use client";

import { SIMULADO_EXAMS } from "@/data/exams";
import type { SimuladoExamId } from "@/data/exams";

type Props = {
  onSelect: (examId: SimuladoExamId) => void;
};

export default function SimuladoExamSelect({ onSelect }: Props) {
  return (
    <div className="sim-exam-select">
      <h2>Escolha a prova</h2>
      <div className="sim-exam-grid">
        {SIMULADO_EXAMS.map((exam) => (
          <button
            key={exam.id}
            type="button"
            className="sim-exam-card"
            onClick={() => onSelect(exam.id)}
          >
            <strong>{exam.title}</strong>
            <span>
              Part 1: {exam.part1.length} questões · Part 2: {exam.part2.length} situações
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
