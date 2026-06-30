"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ExamAudioPlayer from "@/components/ExamAudioPlayer";
import ExamVersionPicker from "@/components/ExamVersionPicker";
import Part2ReadbackQueue from "@/components/Part2Trainer/Part2ReadbackQueue";
import Part2ReadbackShadowPanel from "@/components/Part2Trainer/Part2ReadbackShadowPanel";
import PronunciationWarmupBanner from "@/components/study/PronunciationWarmupBanner";
import VoiceCoachPanel from "@/components/VoiceCoachPanel";
import VoicePracticePanel from "@/components/study/VoicePracticePanel";
import { usePart2WarmupGate } from "@/hooks/usePart2WarmupGate";
import ProgressBadge from "@/components/study/ProgressBadge";
import { ALL_EXAM_SITUATIONS, getSituationsByExam } from "@/data/exams/part2Data";
import { examAudioUrl, examAudioLabel } from "@/lib/exams/audio";
import type { ExamVersion } from "@/lib/exams/types";
import { findScenarioIndex, getOrCreateReadbackQueue, readbackQueueProgress } from "@/lib/part2ReadbackQueue";
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

export default function ReadbackMode({ progress, onProgressChange, openShadow = false }: Props) {
  const { blocked, message } = usePart2WarmupGate();
  const [examVersion, setExamVersion] = useState<ExamVersion | "all">("all");
  const [index, setIndex] = useState(0);

  const scenarios = useMemo(() => {
    if (examVersion === "all") return ALL_EXAM_SITUATIONS;
    return getSituationsByExam(examVersion);
  }, [examVersion]);

  const [showAnswer, setShowAnswer] = useState(false);
  const scenario = scenarios[index];
  const itemProgress = getPart2ItemProgress(progress, `${scenario.id}-rb`);

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
    onProgressChange(setPart2ItemStatus(progress, `${scenario.id}-rb`, status));
  };

  const audioSrc = examAudioUrl(scenario.examVersion, scenario.readback.audioTrack);

  useEffect(() => {
    if (!openShadow) return;
    const queue = getOrCreateReadbackQueue(progress, scenarios);
    const { currentId } = readbackQueueProgress(queue);
    if (currentId) selectScenario(currentId);
  }, [openShadow, progress, scenarios, selectScenario]);

  return (
    <div className="part2-mode">
      <Part2ReadbackQueue
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

          <PronunciationWarmupBanner />

          <VoicePracticePanel
            initialOpen={openShadow}
            shadow={
              <Part2ReadbackShadowPanel
                embedded
                audioSrc={audioSrc}
                audioLabel={examAudioLabel(scenario.examVersion, scenario.readback.audioTrack)}
                modelReadback={scenario.readback.modelReadback}
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
                question={scenario.context}
                modelAnswer={scenario.readback.modelReadback}
                evaluateType="part2-readback"
                situationId={scenario.id}
                modelAudioUrl={audioSrc}
                recordingBlocked={blocked}
                recordingBlockedMessage={message}
              />
            }
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
