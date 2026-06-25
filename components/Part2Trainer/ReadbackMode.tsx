"use client";

import { useMemo, useState } from "react";
import ExamAudioPlayer from "@/components/ExamAudioPlayer";
import ExamVersionPicker from "@/components/ExamVersionPicker";
import VoiceCoachPanel from "@/components/VoiceCoachPanel";
import ProgressBadge from "@/components/study/ProgressBadge";
import { ALL_EXAM_SITUATIONS, getSituationsByExam } from "@/data/exams/part2Data";
import { examAudioUrl, examAudioLabel } from "@/lib/exams/audio";
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

export default function ReadbackMode({ progress, onProgressChange }: Props) {
  const [examVersion, setExamVersion] = useState<ExamVersion | "all">("all");
  const [index, setIndex] = useState(0);

  const scenarios = useMemo(() => {
    if (examVersion === "all") return ALL_EXAM_SITUATIONS;
    return getSituationsByExam(examVersion);
  }, [examVersion]);

  const [showAnswer, setShowAnswer] = useState(false);
  const scenario = scenarios[index];
  const itemProgress = getPart2ItemProgress(progress, `${scenario.id}-rb`);

  const go = (delta: number) => {
    setIndex((i) => (i + delta + scenarios.length) % scenarios.length);
    setShowAnswer(false);
  };

  const mark = (status: "difficult" | "mastered") => {
    onProgressChange(setPart2ItemStatus(progress, `${scenario.id}-rb`, status));
  };

  const audioSrc = examAudioUrl(scenario.examVersion, scenario.readback.audioTrack);

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
        <span className="badge">Readback — {scenario.examVersion} Sit. {scenario.situationNumber}</span>
        <ProgressBadge status={itemProgress.status as CardProgressStatus} />
        <span className="part2-counter">
          {index + 1} / {scenarios.length}
        </span>
      </header>

      <article className="card card-essential part2-card">
        <div className="card-top">
          <h2 className="question">{scenario.title}</h2>
          <p className="part2-situation">{scenario.context}</p>
          <p className="part2-prompt-label">{scenario.readback.atcFacility}</p>
          <ExamAudioPlayer
        src={audioSrc}
        label={examAudioLabel(scenario.examVersion, scenario.readback.audioTrack)}
      />
          <p className="part2-atc-message">{scenario.readback.atcMessage}</p>
        </div>
        <div className="card-body">
          <p className="part2-hint">Repita o readback em voz alta. Você pode pedir &quot;say again&quot; uma vez na prova.</p>

          <VoiceCoachPanel
            question={scenario.context}
            modelAnswer={scenario.readback.modelReadback}
            evaluateType="part2-readback"
          />

          <div className="study-toolbar">
            <button type="button" className="btn purple btn-large" onClick={() => setShowAnswer((s) => !s)}>
              {showAnswer ? "Esconder" : "Mostrar readback"}
            </button>
            <button type="button" className="btn secondary" onClick={() => go(1)}>
              Próximo →
            </button>
          </div>

          {showAnswer && (
            <div className="part2-model-answer">
              <h3>Readback modelo</h3>
              <p>{scenario.readback.modelReadback}</p>
            </div>
          )}

          <div className="study-toolbar study-toolbar-secondary">
            <button type="button" className="btn orange" onClick={() => mark("difficult")}>
              Difícil
            </button>
            <button type="button" className="btn green" onClick={() => mark("mastered")}>
              Dominado
            </button>
            <button type="button" className="btn secondary" onClick={() => go(-1)}>
              ← Anterior
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
