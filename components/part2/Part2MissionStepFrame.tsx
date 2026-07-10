"use client";

import type { ReactNode } from "react";
import type { ExamSituation } from "@/lib/exams/types";
import { EXAM_LABELS } from "@/lib/exams/types";
import {
  PART2_MISSION_STEP_LABELS,
  part2MissionStepMeta,
} from "@/lib/part2Mastery/examSteps";
import Part2PaperNotesHint from "@/components/part2/Part2PaperNotesHint";

type Props = {
  scenario: ExamSituation;
  situationTotal: number;
  step: number;
  stepTitle: string;
  children: ReactNode;
  toolbar?: ReactNode;
  showPaperNotes?: boolean;
};

export default function Part2MissionStepFrame({
  scenario,
  situationTotal,
  step,
  stepTitle,
  children,
  toolbar,
  showPaperNotes = true,
}: Props) {
  const meta = part2MissionStepMeta(step);

  return (
    <>
      <nav className="part1-pipeline-strip part2-pipeline-strip" aria-label="Exam pipeline">
        {PART2_MISSION_STEP_LABELS.map((label, i) => (
          <span
            key={label}
            className={`part1-pipeline-chip${i === step ? " is-active" : ""}${i < step ? " is-done" : ""}`}
          >
            {label}
          </span>
        ))}
      </nav>

      <article className="part1-mission-card card card-essential">
        <div className="card-meta part1-mission-meta">
          <span className="exam-version-badge">{EXAM_LABELS[scenario.examVersion]}</span>
          <span className="card-num">
            Sit. {scenario.situationNumber}/{situationTotal}
          </span>
          <span className="category-badge part2-situation-badge">{scenario.title}</span>
          <span className="part1-step-technique">{meta.technique}</span>
        </div>

        <h2 className="question">{stepTitle}</h2>
        <p className="part1-step-hint">{meta.captainHint}</p>

        <div className="part1-step-panel">
          {children}
          {showPaperNotes ? (
            <Part2PaperNotesHint
              inline
              step={step}
              recommendedNotes={scenario.recommendedNotes}
            />
          ) : null}
          {toolbar}
        </div>
      </article>
    </>
  );
}
