"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ExamAudioPlayer from "@/components/ExamAudioPlayer";
import ExamVersionPicker from "@/components/ExamVersionPicker";
import Part2ReportedShadowPanel from "@/components/Part2Trainer/Part2ReportedShadowPanel";
import PronunciationWarmupBanner from "@/components/study/PronunciationWarmupBanner";
import VoiceCoachPanel from "@/components/VoiceCoachPanel";
import VoicePracticePanel from "@/components/study/VoicePracticePanel";
import StudyCardToolbar from "@/components/study/StudyCardToolbar";
import ProgressBadge from "@/components/study/ProgressBadge";
import CardStatusActions from "@/components/study/CardStatusActions";
import { usePart2WarmupGate } from "@/hooks/usePart2WarmupGate";
import { ALL_EXAM_SITUATIONS, getSituationsByExam } from "@/data/exams/part2Data";
import { examAudioUrl, examAudioLabel } from "@/lib/exams/audio";
import type { ExamVersion } from "@/lib/exams/types";
import { findScenarioIndex } from "@/lib/part2ReadbackQueue";
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

export default function ReportedSpeechMode({ progress, onProgressChange, openShadow = false }: Props) {
  const searchParams = useSearchParams();
  const { blocked, message } = usePart2WarmupGate();
  const [examVersion, setExamVersion] = useState<ExamVersion | "all">("all");
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const scenarios = useMemo(() => {
    if (examVersion === "all") return ALL_EXAM_SITUATIONS;
    return getSituationsByExam(examVersion);
  }, [examVersion]);

  const scenario = scenarios[index];
  const itemProgress = getPart2ItemProgress(progress, `${scenario.id}-rep`);

  useEffect(() => {
    const scenarioId = searchParams.get("scenario");
    if (!scenarioId) return;
    const nextIndex = findScenarioIndex(scenarios, scenarioId);
    if (nextIndex >= 0) {
      setIndex(nextIndex);
      setShowAnswer(false);
    }
  }, [searchParams, scenarios]);

  const go = (delta: number) => {
    setIndex((i) => (i + delta + scenarios.length) % scenarios.length);
    setShowAnswer(false);
  };

  const mark = (status: "difficult" | "mastered") => {
    onProgressChange(setPart2ItemStatus(progress, `${scenario.id}-rep`, status));
  };

  const audioSrc = examAudioUrl(scenario.examVersion, scenario.atcFollowUp.audioTrack);

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

      <article className="card card-essential part2-card">
        <div className="card-top">
          <h2 className="question">{scenario.title}</h2>
          <p className="part2-examiner-q">What did the controller say?</p>
          <ExamAudioPlayer
            src={audioSrc}
            label={examAudioLabel(scenario.examVersion, scenario.atcFollowUp.audioTrack)}
          />
          <p className="part2-atc-message">{scenario.atcFollowUp.atcMessage}</p>
        </div>
        <div className="card-body">
          <div className="part2-template-chip">
            <strong>Template:</strong> The controller instructed me to... / asked me to confirm if... / said that...
          </div>
          <p className="part2-hint">
            Depois do seu reporte, o examinador pergunta o que o controller disse. Use reported speech.
          </p>

          <PronunciationWarmupBanner />

          <VoicePracticePanel
            initialOpen={openShadow}
            shadow={
              <Part2ReportedShadowPanel
                embedded
                audioSrc={audioSrc}
                audioLabel={examAudioLabel(scenario.examVersion, scenario.atcFollowUp.audioTrack)}
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
                modelAudioUrl={audioSrc}
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
            <div className="part2-model-answer">
              <h3>Resposta modelo</h3>
              <p>{scenario.reportedSpeech.modelAnswer}</p>
              <h3>Correção ({scenario.atcFollowUp.correctionType})</h3>
              <p>{scenario.atcFollowUp.modelCorrection}</p>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
