"use client";

import ExamOfflineControls from "@/components/FullExamListening/ExamOfflineControls";
import type { FullExamMeta } from "@/lib/fullExamListening/types";
import type { FullExamListeningProgress } from "@/lib/fullExamListening/progress";

type Props = {
  exams: FullExamMeta[];
  progress: FullExamListeningProgress;
  onSelect: (examId: FullExamMeta["id"], startIndex?: number) => void;
};

const PART_LABELS: Record<string, string> = {
  part1: "Part 1",
  part2: "Part 2",
  part3: "Part 3",
  part4: "Part 4",
};

export default function ExamSelectScreen({ exams, progress, onSelect }: Props) {
  return (
    <div className="fel-exam-grid">
      {exams.map((exam) => {
        const completed = progress.completedExams.includes(exam.id);
        const canContinue =
          progress.lastExamId === exam.id && progress.lastItemIndex > 0 && !completed;
        const parts = exam.partsIncluded.map((p) => PART_LABELS[p] ?? p).join(" · ");

        return (
          <article key={exam.id} className={`fel-exam-card ${completed ? "completed" : ""}`}>
            <div className="fel-exam-card-head">
              <div>
                <span className="fel-exam-badge">{exam.subtitle}</span>
                <h2>{exam.title}</h2>
                <p className="fel-exam-desc">{exam.description}</p>
              </div>
              {completed && <span className="fel-exam-done" aria-label="Completed">✓</span>}
            </div>

            <dl className="fel-exam-meta">
              <div>
                <dt>Duração</dt>
                <dd>~{exam.durationEstimateMin} min</dd>
              </div>
              <div>
                <dt>Partes</dt>
                <dd>{parts}</dd>
              </div>
            </dl>

            <div className="fel-exam-actions">
              <button
                type="button"
                className="btn primary fel-play-btn"
                onClick={() => onSelect(exam.id, 0)}
              >
                ▶ Ouvir prova
              </button>
              {canContinue && (
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => onSelect(exam.id, progress.lastItemIndex)}
                >
                  Continuar · item {progress.lastItemIndex + 1}
                </button>
              )}
            </div>

            <ExamOfflineControls examId={exam.id} />
          </article>
        );
      })}
    </div>
  );
}
