"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ExamVersionPicker from "@/components/ExamVersionPicker";
import Part2InteractionQueue from "@/components/Part2Trainer/Part2InteractionQueue";
import Part2InteractionShadowPanel from "@/components/Part2Trainer/Part2InteractionShadowPanel";
import Part2NotesLayout from "@/components/Part2Trainer/Part2NotesLayout";
import Part2NotesReviewButton from "@/components/Part2Trainer/Part2NotesReviewButton";
import PronunciationWarmupBanner from "@/components/study/PronunciationWarmupBanner";
import VoiceCoachPanel from "@/components/VoiceCoachPanel";
import VoicePracticePanel from "@/components/study/VoicePracticePanel";
import StudyCardToolbar from "@/components/study/StudyCardToolbar";
import { usePart2StudentNotes } from "@/hooks/usePart2StudentNotes";
import { usePart2WarmupGate } from "@/hooks/usePart2WarmupGate";
import ProgressBadge from "@/components/study/ProgressBadge";
import CardStatusActions from "@/components/study/CardStatusActions";
import type { ExamVersion } from "@/lib/exams/types";
import { findScenarioIndex } from "@/lib/part2ReadbackQueue";
import {
  remapIndexAfterExamChange,
  resolvePart2ScenarioNav,
  scenariosForExamVersion,
} from "@/lib/part2ScenarioNav";
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
  openPractice?: boolean;
  scenarioId?: string | null;
};

export default function InteractionMode({
  progress,
  onProgressChange,
  openShadow = false,
  openPractice = false,
  scenarioId: scenarioIdProp = null,
}: Props) {
  const searchParams = useSearchParams();
  const scenarioIdFromUrl = scenarioIdProp ?? searchParams.get("scenario");
  const navFromUrl = useMemo(
    () => resolvePart2ScenarioNav(scenarioIdFromUrl),
    [scenarioIdFromUrl],
  );

  const { blocked, message } = usePart2WarmupGate();
  const [examVersion, setExamVersion] = useState<ExamVersion | "all">(navFromUrl.examVersion);
  const [index, setIndex] = useState(navFromUrl.index);
  const [showModel, setShowModel] = useState(false);

  const scenarios = useMemo(() => scenariosForExamVersion(examVersion), [examVersion]);

  const scenario = scenarios[index] ?? scenarios[0];
  const { studentNotes, setStudentNotes } = usePart2StudentNotes(scenario?.id ?? "");
  if (!scenario) return null;
  const itemProgress = getPart2ItemProgress(progress, `${scenario.id}-int`);

  const selectScenario = useCallback(
    (scenarioId: string) => {
      const nextIndex = findScenarioIndex(scenarios, scenarioId);
      if (nextIndex >= 0) {
        setIndex(nextIndex);
        setShowModel(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [scenarios],
  );

  const go = (delta: number) => {
    setIndex((i) => (i + delta + scenarios.length) % scenarios.length);
    setShowModel(false);
  };

  const mark = (status: "difficult" | "mastered") => {
    onProgressChange(setPart2ItemStatus(progress, `${scenario.id}-int`, status));
  };

  useEffect(() => {
    if (scenarioIdFromUrl) {
      const next = resolvePart2ScenarioNav(scenarioIdFromUrl);
      setExamVersion(next.examVersion);
      setIndex(next.index);
      setShowModel(false);
      return;
    }
    if (!openShadow) return;
    const queue = getOrCreateInteractionQueue(progress, scenarios);
    const { currentId } = interactionQueueProgress(queue);
    if (currentId) selectScenario(currentId);
  }, [scenarioIdFromUrl, openShadow, progress, scenarios, selectScenario]);

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
          const currentId = scenarios[index]?.id ?? null;
          setExamVersion(v);
          setIndex(remapIndexAfterExamChange(currentId, v));
          setShowModel(false);
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

      <Part2NotesLayout notes={studentNotes} onNotesChange={setStudentNotes}>
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
          <p className="part2-interaction-task">{scenario.interaction.prompt}</p>
        </div>
        <div className="card-body">
          <p className="part2-hint">
            Ligue para o ATC: facility + ANAC 123 + urgência (se necessário) + problema + intenção + pedido.{" "}
            <Link href="/word-mission">Treinar callsign →</Link>
          </p>

          <button
            type="button"
            className="btn secondary btn-sm part2-show-model-btn"
            onClick={() => setShowModel((v) => !v)}
          >
            {showModel ? "Esconder modelo" : "Mostrar reporte modelo"}
          </button>
          {showModel && (
            <>
              <div className="part2-model-answer part2-model-answer-primary">
                <h3>Reporte modelo (ICAO 5)</h3>
                <p>{scenario.interaction.modelReport}</p>
              </div>
              <div className="part2-model-answer">
                <h3>Correção ao ATC ({scenario.atcFollowUp.correctionType})</h3>
                <p>{scenario.atcFollowUp.modelCorrection}</p>
              </div>
            </>
          )}

          <PronunciationWarmupBanner />

          <VoicePracticePanel
            initialOpen={openShadow || openPractice}
            defaultTab="shadow"
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

          <div className="study-toolbar study-toolbar-split">
            <Part2NotesReviewButton
              studentNotes={studentNotes}
              recommendedNotes={scenario.recommendedNotes}
              situationTitle={scenario.title}
            />
            <StudyCardToolbar onPrevious={() => go(-1)} onNext={() => go(1)} />
          </div>
        </div>
      </article>
      </Part2NotesLayout>
    </div>
  );
}
