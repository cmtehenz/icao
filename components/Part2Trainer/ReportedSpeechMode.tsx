"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ExamAudioPlayer from "@/components/ExamAudioPlayer";
import ExamVersionPicker from "@/components/ExamVersionPicker";
import Part2NotesLayout from "@/components/Part2Trainer/Part2NotesLayout";
import Part2NotesReviewButton from "@/components/Part2Trainer/Part2NotesReviewButton";
import Part2ReportedShadowPanel from "@/components/Part2Trainer/Part2ReportedShadowPanel";
import PronunciationWarmupBanner from "@/components/study/PronunciationWarmupBanner";
import VoiceCoachPanel from "@/components/VoiceCoachPanel";
import VoicePracticePanel from "@/components/study/VoicePracticePanel";
import StudyCardToolbar from "@/components/study/StudyCardToolbar";
import ProgressBadge from "@/components/study/ProgressBadge";
import CardStatusActions from "@/components/study/CardStatusActions";
import { usePart2StudentNotes } from "@/hooks/usePart2StudentNotes";
import { usePart2WarmupGate } from "@/hooks/usePart2WarmupGate";
import { examAudioUrl } from "@/lib/exams/audio";
import type { ExamVersion } from "@/lib/exams/types";
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

export default function ReportedSpeechMode({
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
  const scenarios = useMemo(
    () => scenariosForExamVersion(examVersion),
    [examVersion],
  );

  useEffect(() => {
    const next = resolvePart2ScenarioNav(scenarioIdFromUrl);
    setExamVersion(next.examVersion);
    setIndex(next.index);
    setShowModel(false);
  }, [scenarioIdFromUrl]);

  const scenario = scenarios[index] ?? scenarios[0];
  const { studentNotes, setStudentNotes } = usePart2StudentNotes(scenario?.id ?? "");
  if (!scenario) return null;

  const itemProgress = getPart2ItemProgress(progress, `${scenario.id}-rep`);

  const go = (delta: number) => {
    setIndex((i) => (i + delta + scenarios.length) % scenarios.length);
    setShowModel(false);
  };

  const mark = (status: "difficult" | "mastered") => {
    onProgressChange(setPart2ItemStatus(progress, `${scenario.id}-rep`, status));
  };

  const audioSrc = examAudioUrl(scenario.examVersion, scenario.atcFollowUp.audioTrack);
  const practiceOpen = openShadow || openPractice;
  const practiceTab = openShadow ? "shadow" : "coach";

  return (
    <div className="part2-mode">
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
        <span className="badge">Reported Speech — {scenario.examVersion} Sit. {scenario.situationNumber}</span>
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
          <p className="part2-examiner-q">What did the controller say?</p>
          <ExamAudioPlayer src={audioSrc} label="Ouvir resposta do ATC" />
        </div>
        <div className="card-body">
          <div className="part2-template-chip">
            <strong>Template:</strong> The controller instructed me to... / asked me to confirm if... /
            informed me that...
          </div>
          <p className="part2-hint">
            Ouça o ATC e responda em reported speech o que o controller disse.
          </p>

          <button
            type="button"
            className="btn secondary btn-sm part2-show-model-btn"
            onClick={() => setShowModel((v) => !v)}
          >
            {showModel ? "Esconder modelo" : "Mostrar resposta modelo"}
          </button>
          {showModel && (
            <div className="part2-model-answer part2-model-answer-primary">
              <h3>Resposta modelo (ICAO 5)</h3>
              <p>{scenario.reportedSpeech.modelAnswer}</p>
            </div>
          )}

          <PronunciationWarmupBanner />

          <VoicePracticePanel
            initialOpen={practiceOpen}
            defaultTab={practiceTab}
            shadow={
              <Part2ReportedShadowPanel
                embedded
                audioSrc={audioSrc}
                audioLabel="Resposta ATC"
                modelReported={scenario.reportedSpeech.modelAnswer}
                context={scenario.title}
                situationId={scenario.id}
                initialOpen
                recordingBlocked={blocked}
                recordingBlockedMessage={message}
              />
            }
            coach={
              <VoiceCoachPanel
                embedded
                question="What did the controller say?"
                modelAnswer={scenario.reportedSpeech.modelAnswer}
                evaluateType="part2-reported"
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
