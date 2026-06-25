"use client";

import { useMemo, useState } from "react";
import ExamVersionPicker from "@/components/ExamVersionPicker";
import VoiceCoachPanel from "@/components/VoiceCoachPanel";
import ProgressBadge from "@/components/study/ProgressBadge";
import { ALL_EXAM_SITUATIONS, getSituationsByExam } from "@/data/exams/part2Data";
import type { ExamVersion } from "@/lib/exams/types";
import {
  getPart2ItemProgress,
  setPart2ItemStatus,
  type Part2ProgressStore,
} from "@/lib/part2/progress";
import type { CardProgressStatus } from "@/lib/progress";

type Props = {
  progress: Part2ProgressStore;
  onProgressChange: (store: Part2ProgressStore) => void;
};

export default function InteractionMode({ progress, onProgressChange }: Props) {
  const [examVersion, setExamVersion] = useState<ExamVersion | "all">("all");
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const scenarios = useMemo(() => {
    if (examVersion === "all") return ALL_EXAM_SITUATIONS;
    return getSituationsByExam(examVersion);
  }, [examVersion]);

  const scenario = scenarios[index];
  const itemProgress = getPart2ItemProgress(progress, `${scenario.id}-int`);

  const go = (delta: number) => {
    setIndex((i) => (i + delta + scenarios.length) % scenarios.length);
    setShowAnswer(false);
  };

  const mark = (status: "difficult" | "mastered") => {
    onProgressChange(setPart2ItemStatus(progress, `${scenario.id}-int`, status));
  };

  return (
    <div className="part2-mode">
      <ExamVersionPicker
        value={examVersion}
        onChange={(v) => {
          setExamVersion(v);
          setIndex(0);
          setShowAnswer(false);
        }}
      />

      <header className="part2-mode-head">
        <span className="badge">Interaction — {scenario.examVersion} Sit. {scenario.situationNumber}</span>
        <ProgressBadge status={itemProgress.status as CardProgressStatus} />
        <span className="part2-counter">
          {index + 1} / {scenarios.length}
        </span>
      </header>

      <article className="card card-essential part2-card">
        <div className="card-top">
          <h2 className="question">{scenario.title}</h2>
          <div className="part2-meta-row">
            <span className="part2-tag">Callsign: ANAC 123</span>
            <span className={`part2-tag urgency-${scenario.interaction.urgency.toLowerCase()}`}>
              {scenario.interaction.urgency}
            </span>
          </div>
          <p className="part2-situation">{scenario.context}</p>
          <p className="part2-atc-message part2-interaction-prompt">{scenario.interaction.prompt}</p>
        </div>
        <div className="card-body">
          <p className="part2-hint">
            Ligue para o ATC: facility + ANAC 123 + urgência (se necessário) + problema + intenção + pedido.
          </p>

          <VoiceCoachPanel
            question={scenario.interaction.prompt}
            modelAnswer={scenario.interaction.modelReport}
            evaluateType="part2-interaction"
          />

          <div className="study-toolbar">
            <button type="button" className="btn purple btn-large" onClick={() => setShowAnswer((s) => !s)}>
              {showAnswer ? "Esconder" : "Mostrar resposta"}
            </button>
            <button type="button" className="btn secondary" onClick={() => go(1)}>
              Próximo →
            </button>
          </div>

          {showAnswer && (
            <>
              <div className="part2-model-answer">
                <h3>Seu reporte (modelo)</h3>
                <p>{scenario.interaction.modelReport}</p>
              </div>
              <div className="part2-model-answer">
                <h3>Correção ao ATC ({scenario.atcFollowUp.correctionType})</h3>
                <p className="part2-atc-message">{scenario.atcFollowUp.atcMessage}</p>
                <p>{scenario.atcFollowUp.modelCorrection}</p>
              </div>
            </>
          )}

          <div className="study-toolbar study-toolbar-secondary">
            <button type="button" className="btn orange" onClick={() => mark("difficult")}>
              Difícil
            </button>
            <button type="button" className="btn green" onClick={() => mark("mastered")}>
              Dominado
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
