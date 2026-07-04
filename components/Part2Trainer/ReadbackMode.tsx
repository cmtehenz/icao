"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ExamAudioPlayer from "@/components/ExamAudioPlayer";
import ExamVersionPicker from "@/components/ExamVersionPicker";
import Part2ReadbackQueue from "@/components/Part2Trainer/Part2ReadbackQueue";
import Part2ReadbackShadowPanel from "@/components/Part2Trainer/Part2ReadbackShadowPanel";
import PronunciationWarmupBanner from "@/components/study/PronunciationWarmupBanner";
import VoiceCoachPanel from "@/components/VoiceCoachPanel";
import VoicePracticePanel from "@/components/study/VoicePracticePanel";
import StudyCardToolbar from "@/components/study/StudyCardToolbar";
import { usePart2WarmupGate } from "@/hooks/usePart2WarmupGate";
import ProgressBadge from "@/components/study/ProgressBadge";
import CardStatusActions from "@/components/study/CardStatusActions";
import { examAudioUrl } from "@/lib/exams/audio";
import type { ExamVersion } from "@/lib/exams/types";
import { findScenarioIndex, getOrCreateReadbackQueue, readbackQueueProgress } from "@/lib/part2ReadbackQueue";
import {
  remapIndexAfterExamChange,
  resolvePart2ScenarioNav,
  scenariosForExamVersion,
} from "@/lib/part2ScenarioNav";
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

export default function ReadbackMode({
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

  const scenarios = useMemo(() => scenariosForExamVersion(examVersion), [examVersion]);

  const scenario = scenarios[index] ?? scenarios[0];
  if (!scenario) return null;
  const itemProgress = getPart2ItemProgress(progress, `${scenario.id}-rb`);

  const selectScenario = useCallback(
    (scenarioId: string) => {
      const nextIndex = findScenarioIndex(scenarios, scenarioId);
      if (nextIndex >= 0) {
        setIndex(nextIndex);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [scenarios],
  );

  const go = (delta: number) => {
    setIndex((i) => (i + delta + scenarios.length) % scenarios.length);
  };

  const mark = (status: "difficult" | "mastered") => {
    onProgressChange(setPart2ItemStatus(progress, `${scenario.id}-rb`, status));
  };

  const audioSrc = examAudioUrl(scenario.examVersion, scenario.readback.audioTrack);

  useEffect(() => {
    if (scenarioIdFromUrl) {
      const next = resolvePart2ScenarioNav(scenarioIdFromUrl);
      setExamVersion(next.examVersion);
      setIndex(next.index);
      return;
    }
    if (!openShadow) return;
    const queue = getOrCreateReadbackQueue(progress, scenarios);
    const { currentId } = readbackQueueProgress(queue);
    if (currentId) selectScenario(currentId);
  }, [scenarioIdFromUrl, openShadow, progress, scenarios, selectScenario]);

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
          const currentId = scenarios[index]?.id ?? null;
          setExamVersion(v);
          setIndex(remapIndexAfterExamChange(currentId, v));
        }}
      />

      <header className="part2-mode-head">
        <span className="badge">Readback — {scenario.examVersion} Sit. {scenario.situationNumber}</span>
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
          <p className="part2-situation">{scenario.context}</p>
          <p className="part2-prompt-label">{scenario.readback.atcFacility}</p>
          <ExamAudioPlayer src={audioSrc} label="Ouvir clearance ATC" />
        </div>
        <div className="card-body">
          <p className="part2-hint">
            Ouça a clearance e faça o readback em voz alta. Você pode pedir &quot;say again&quot; uma vez na
            prova.
          </p>

          <div className="part2-model-answer part2-model-answer-primary">
            <h3>Readback modelo (ICAO 5)</h3>
            <p>{scenario.readback.modelReadback}</p>
          </div>

          <PronunciationWarmupBanner />

          <VoicePracticePanel
            initialOpen={openShadow || openPractice}
            defaultTab="shadow"
            shadow={
              <Part2ReadbackShadowPanel
                embedded
                audioSrc={audioSrc}
                audioLabel="Clearance ATC"
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
                recordingBlocked={blocked}
                recordingBlockedMessage={message}
              />
            }
          />

          <StudyCardToolbar onPrevious={() => go(-1)} onNext={() => go(1)} />
        </div>
      </article>
    </div>
  );
}
