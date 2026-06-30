"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import ExamVersionPicker from "@/components/ExamVersionPicker";
import Part2InteractionQueue from "@/components/Part2Trainer/Part2InteractionQueue";
import Part2InteractionShadowPanel from "@/components/Part2Trainer/Part2InteractionShadowPanel";
import PronunciationWarmupBanner from "@/components/study/PronunciationWarmupBanner";
import VoiceCoachPanel from "@/components/VoiceCoachPanel";
import VoicePracticePanel from "@/components/study/VoicePracticePanel";
import StudyCardToolbar from "@/components/study/StudyCardToolbar";
import { usePart2WarmupGate } from "@/hooks/usePart2WarmupGate";
import ProgressBadge from "@/components/study/ProgressBadge";
import CardStatusActions from "@/components/study/CardStatusActions";
import { ALL_EXAM_SITUATIONS, getSituationsByExam } from "@/data/exams/part2Data";
import type { ExamVersion } from "@/lib/exams/types";
import { findScenarioIndex } from "@/lib/part2ReadbackQueue";
import {
  getOrCreateInteractionQueue,
  interactionQueueProgress,
} from "@/lib/part2InteractionQueue";
import {
  getPart2ItemProgress,
  setPart2ItemStatus,
  type Part2ProgressStore,
} from "@/lib/part2/progress";
import type { CardProgressStatus } from "@/lib/progress";

type Props = {
  progress: Part2ProgressStore;
  onProgressChange: (store: Part2ProgressStore) => void;
  openShadow?: boolean;
};

export default function InteractionMode({ progress, onProgressChange, openShadow = false }: Props) {
  const { blocked, message } = usePart2WarmupGate();
  const [examVersion, setExamVersion] = useState<ExamVersion | "all">("all");
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const scenarios = useMemo(() => {
    if (examVersion === "all") return ALL_EXAM_SITUATIONS;
    return getSituationsByExam(examVersion);
  }, [examVersion]);

  const scenario = scenarios[index];
  const itemProgress = getPart2ItemProgress(progress, `${scenario.id}-int`);

  const selectScenario = useCallback(
    (scenarioId: string) => {
      const nextIndex = findScenarioIndex(scenarios, scenarioId);
      if (nextIndex >= 0) {
        setIndex(nextIndex);
        setShowAnswer(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [scenarios],
  );

  const go = (delta: number) => {
    setIndex((i) => (i + delta + scenarios.length) % scenarios.length);
    setShowAnswer(false);
  };

  const mark = (status: "difficult" | "mastered") => {
    onProgressChange(setPart2ItemStatus(progress, `${scenario.id}-int`, status));
  };

  useEffect(() => {
    if (!openShadow) return;
    const queue = getOrCreateInteractionQueue(progress, scenarios);
    const { currentId } = interactionQueueProgress(queue);
    if (currentId) selectScenario(currentId);
  }, [openShadow, progress, scenarios, selectScenario]);

  return (
    <div className="part2-mode">
      <Part2InteractionQueue
        scenarios={scenarios}
        progress={progress}
        currentScenarioId={scenario.id}
        onSelectScenario={selectScenario}
      />

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
        <CardStatusActions
          onDifficult={() => mark("difficult")}
          onMastered={() => mark("mastered")}
          masteredLabel="Marcar como dominado"
        />
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
            Ligue para o ATC: facility + ANAC 123 + urgência (se necessário) + problema + intenção + pedido.{" "}
            <Link href="/pronunciation?callsign=1">Treinar callsign →</Link>
          </p>

          <PronunciationWarmupBanner />

          <VoicePracticePanel
            initialOpen={openShadow}
            shadow={
              <Part2InteractionShadowPanel
                embedded
                prompt={scenario.interaction.prompt}
                modelReport={scenario.interaction.modelReport}
                context={scenario.context}
                situationId={scenario.id}
                initialOpen
                recordingBlocked={blocked}
                recordingBlockedMessage={message}
              />
            }
            coach={
              <VoiceCoachPanel
                embedded
                question={scenario.interaction.prompt}
                modelAnswer={scenario.interaction.modelReport}
                evaluateType="part2-interaction"
                situationId={scenario.id}
                recordingBlocked={blocked}
                recordingBlockedMessage={message}
              />
            }
          />

          <StudyCardToolbar onPrevious={() => go(-1)} onNext={() => go(1)}>
            <button type="button" className="btn purple btn-large" onClick={() => setShowAnswer((s) => !s)}>
              {showAnswer ? "Esconder resposta" : "Mostrar resposta"}
            </button>
          </StudyCardToolbar>

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

        </div>
      </article>
    </div>
  );
}
