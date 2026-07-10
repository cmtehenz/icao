"use client";

import { useMemo, useState, useEffect, type ReactNode } from "react";
import ExamAudioPlayer from "@/components/ExamAudioPlayer";
import ExamVersionPicker from "@/components/ExamVersionPicker";
import Part2SimulationRecord from "@/components/Part2Trainer/Part2SimulationRecord";
import Part2NotesLayout from "@/components/Part2Trainer/Part2NotesLayout";
import Part2MissionStepFrame from "@/components/part2/Part2MissionStepFrame";
import Part2PaperSelfCheck from "@/components/part2/Part2PaperSelfCheck";
import RecommendedNotesReview from "@/components/Part2Trainer/RecommendedNotesReview";
import SimulationResultsPanel from "@/components/Part2Trainer/SimulationResultsPanel";
import { getSituationsByExam } from "@/data/exams/part2Data";
import { examAudioUrl, examAudioLabel, SOUND_CHECK_TRACK } from "@/lib/exams/audio";
import { EXAM_LABELS, EXAM_VERSIONS, type ExamVersion } from "@/lib/exams/types";
import type { EvaluateFeedback } from "@/lib/evaluate/types";
import {
  aggregateSimulationResults,
  type SimulationStepResult,
} from "@/lib/part2/aggregateSimulation";
import { setPart2ItemStatus, type Part2ProgressStore } from "@/lib/part2/progress";
import { syncDailyMissionLog } from "@/lib/dailyMissionLog";
import { getOrCreatePart2DailyMission, markPart2SimulationDailyComplete } from "@/lib/part2DailyMission";
import {
  clearPart2MissionSession,
  loadPart2MissionSession,
  savePart2MissionSession,
} from "@/lib/part2MissionSession";
import { emitCaptainDeltaDebrief } from "@/lib/captainDelta/events";
import { recordStudyActivity, SIMULATE_PART2_UNITS } from "@/lib/studyTime";
import {
  getSpeakStepConfig,
  isSimulationSpeakStep,
  simulationRecordingKey,
} from "@/lib/part2/simulationEvaluate";
import { saveEvaluationRecord } from "@/lib/evaluate/saveEvaluation";

const STEPS = [
  { id: 1, title: "Ouvir clearance ATC", type: "listen" as const },
  { id: 2, title: "Seu readback", type: "speak" as const },
  { id: 3, title: "Situação anormal", type: "situation" as const },
  { id: 4, title: "Reportar problema", type: "speak" as const },
  { id: 5, title: "Resposta do ATC", type: "listen" as const },
  { id: 6, title: "AFFIRM ou NEGATIVE", type: "speak" as const },
  { id: 7, title: "What did the controller say?", type: "question" as const },
  { id: 8, title: "Reported speech", type: "speak" as const },
  { id: 9, title: "Revisão", type: "review" as const },
];

type Props = {
  progress: Part2ProgressStore;
  onProgressChange: (store: Part2ProgressStore) => void;
  forcedExamVersion?: ExamVersion;
  /** Today's flight — full exam, paper notes, no on-screen scratchpad. */
  missionMode?: boolean;
  missionContinueHref?: string;
  missionContinueLabel?: string;
};

function pickRandomVersion(): ExamVersion {
  return EXAM_VERSIONS[Math.floor(Math.random() * EXAM_VERSIONS.length)];
}

export default function FullSimulationMode({
  progress,
  onProgressChange,
  forcedExamVersion,
  missionMode = false,
  missionContinueHref,
  missionContinueLabel,
}: Props) {
  const [examVersion, setExamVersion] = useState<ExamVersion | "all">(forcedExamVersion ?? "all");
  const [activeVersion, setActiveVersion] = useState<ExamVersion | null>(null);
  const [situationIdx, setSituationIdx] = useState(0);
  const [step, setStep] = useState(-1);
  const [recordings, setRecordings] = useState<Record<string, EvaluateFeedback>>({});
  const [stepResults, setStepResults] = useState<SimulationStepResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [studentNotes, setStudentNotes] = useState("");
  const [showNotesReview, setShowNotesReview] = useState(false);
  const [sessionReady, setSessionReady] = useState(!missionMode);

  const situations = activeVersion ? getSituationsByExam(activeVersion) : [];
  const scenario = situations[situationIdx];
  const current = step >= 0 ? STEPS[step] : null;
  const simId = scenario ? `${scenario.id}-sim` : "sim-pending";
  const recordingKey = scenario && isSimulationSpeakStep(step) ? simulationRecordingKey(scenario.id, step) : null;
  const currentRecording = recordingKey ? recordings[recordingKey] : null;
  const speakConfig =
    scenario && isSimulationSpeakStep(step) ? getSpeakStepConfig(scenario, step) : null;

  const aggregated = useMemo(
    () => (stepResults.length ? aggregateSimulationResults(stepResults) : null),
    [stepResults],
  );

  useEffect(() => {
    if (forcedExamVersion) setExamVersion(forcedExamVersion);
  }, [forcedExamVersion]);

  useEffect(() => {
    if (!missionMode || !forcedExamVersion) {
      setSessionReady(true);
      return;
    }

    const mission = getOrCreatePart2DailyMission();
    const session = loadPart2MissionSession();
    if (
      session &&
      session.examVersion === forcedExamVersion &&
      !mission.simulationDone &&
      session.step >= -2
    ) {
      setActiveVersion(session.activeVersion);
      setSituationIdx(session.situationIdx);
      setStep(session.step);
      setRecordings(session.recordings);
      setStepResults(session.stepResults);
      setShowNotesReview(session.showNotesReview);
      setShowResults(session.showResults);
      setExamVersion(session.examVersion);
    }
    setSessionReady(true);
  }, [missionMode, forcedExamVersion]);

  useEffect(() => {
    if (!missionMode || !forcedExamVersion || !sessionReady) return;

    if (getOrCreatePart2DailyMission().simulationDone) {
      clearPart2MissionSession();
      return;
    }

    if (!activeVersion || step < -2) {
      clearPart2MissionSession();
      return;
    }

    savePart2MissionSession({
      examVersion: forcedExamVersion,
      activeVersion,
      situationIdx,
      step,
      recordings,
      stepResults,
      showNotesReview,
      showResults,
    });
  }, [
    missionMode,
    forcedExamVersion,
    sessionReady,
    activeVersion,
    situationIdx,
    step,
    recordings,
    stepResults,
    showNotesReview,
    showResults,
  ]);

  const resetSimulation = () => {
    if (missionMode) clearPart2MissionSession();
    setActiveVersion(null);
    setSituationIdx(0);
    setStep(-1);
    setRecordings({});
    setStepResults([]);
    setShowResults(false);
    setStudentNotes("");
    setShowNotesReview(false);
  };

  const startSituation = () => {
    const version =
      forcedExamVersion ?? (examVersion !== "all" ? examVersion : pickRandomVersion());
    setActiveVersion(version);
    setSituationIdx(0);
    setStep(-2);
    setRecordings({});
    setStepResults([]);
    setShowResults(false);
    setStudentNotes("");
    setShowNotesReview(false);
  };

  const saveRecording = async (feedback: EvaluateFeedback, audioBlob: Blob | null) => {
    if (!recordingKey || !scenario || !speakConfig) return;
    setRecordings((prev) => ({ ...prev, [recordingKey]: feedback }));

    const saved = await saveEvaluationRecord({
      type: speakConfig.evaluateType,
      question: speakConfig.question,
      transcript: feedback.transcript,
      scores: feedback.scores,
      icaoLevel: feedback.icaoLevel?.overall,
      icaoCriteria: feedback.icaoLevel?.criteria,
      summary: `[Simulação ${scenario.examVersion} Sit.${scenario.situationNumber}] ${feedback.summary}`,
      audioBlob,
    });

    const entry: SimulationStepResult = {
      situationId: scenario.id,
      situationNumber: scenario.situationNumber,
      examVersion: scenario.examVersion,
      step,
      stepLabel: speakConfig.label,
      feedback,
      evaluationId: saved?.id,
    };

    setStepResults((prev) => {
      const idx = prev.findIndex((r) => r.situationId === scenario.id && r.step === step);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = entry;
        return next;
      }
      return [...prev, entry];
    });
  };

  const clearRecording = () => {
    if (!recordingKey || !scenario) return;
    setRecordings((prev) => {
      const next = { ...prev };
      delete next[recordingKey];
      return next;
    });
    setStepResults((prev) => prev.filter((r) => !(r.situationId === scenario.id && r.step === step)));
  };

  const canAdvance = !isSimulationSpeakStep(step) || !!currentRecording;

  const next = () => {
    if (!canAdvance) return;
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    }
  };

  const advanceAfterSituation = () => {
    setShowNotesReview(false);
    setStudentNotes("");

    if (situationIdx < situations.length - 1) {
      setSituationIdx((i) => i + 1);
      setStep(0);
      return;
    }

    const finalResult = aggregateSimulationResults(stepResults);
    if (scenario) {
      const status = finalResult.rating.overall >= 4 ? ("mastered" as const) : ("difficult" as const);
      onProgressChange(setPart2ItemStatus(progress, simId, status));
    }
    if (activeVersion && missionMode) {
      markPart2SimulationDailyComplete(activeVersion);
    }
    emitCaptainDeltaDebrief({});
    recordStudyActivity("simulate", SIMULATE_PART2_UNITS);
    syncDailyMissionLog();
    setShowResults(true);
  };

  const finishSituation = () => {
    if (scenario?.recommendedNotes) {
      setShowNotesReview(true);
      return;
    }
    advanceAfterSituation();
  };

  const renderStepBody = () => {
    if (!scenario || !current) return null;

    const readbackAudio = examAudioUrl(scenario.examVersion, scenario.readback.audioTrack);
    const followUpAudio = examAudioUrl(scenario.examVersion, scenario.atcFollowUp.audioTrack);

    return (
      <>
        {step === 0 && (
          <>
            <p className="part2-situation">{scenario.context}</p>
            <ExamAudioPlayer
              src={readbackAudio}
              label={examAudioLabel(scenario.examVersion, scenario.readback.audioTrack)}
            />
            {missionMode ? null : (
              <p className="part2-atc-message">{scenario.readback.atcMessage}</p>
            )}
          </>
        )}
        {step === 1 && (
          <>
            {speakConfig && (
              <Part2SimulationRecord
                key={recordingKey!}
                question={speakConfig.question}
                modelAnswer={speakConfig.modelAnswer}
                modelTitle="Readback modelo (ICAO 5)"
                evaluateType={speakConfig.evaluateType}
                stepLabel={current.title}
                completed={currentRecording}
                onComplete={saveRecording}
                onRetry={clearRecording}
              />
            )}
          </>
        )}
        {step === 2 && <p className="part2-atc-message">{scenario.interaction.prompt}</p>}
        {step === 3 && (
          <>
            {speakConfig && (
              <Part2SimulationRecord
                key={recordingKey!}
                question={speakConfig.question}
                modelAnswer={speakConfig.modelAnswer}
                modelTitle="Reporte modelo (ICAO 5)"
                evaluateType={speakConfig.evaluateType}
                stepLabel={current.title}
                completed={currentRecording}
                onComplete={saveRecording}
                onRetry={clearRecording}
              />
            )}
          </>
        )}
        {step === 4 && (
          <>
            <ExamAudioPlayer
              src={followUpAudio}
              label={examAudioLabel(scenario.examVersion, scenario.atcFollowUp.audioTrack)}
            />
            {missionMode ? null : (
              <p className="part2-atc-message">{scenario.atcFollowUp.atcMessage}</p>
            )}
          </>
        )}
        {step === 5 && (
          <>
            {speakConfig && (
              <Part2SimulationRecord
                key={recordingKey!}
                question={speakConfig.question}
                modelAnswer={speakConfig.modelAnswer}
                modelTitle={`${scenario.atcFollowUp.correctionType} modelo (ICAO 5)`}
                evaluateType={speakConfig.evaluateType}
                stepLabel={current.title}
                completed={currentRecording}
                onComplete={saveRecording}
                onRetry={clearRecording}
              />
            )}
          </>
        )}
        {step === 6 && <p className="part2-examiner-q">What did the controller say?</p>}
        {step === 7 && (
          <>
            {speakConfig && (
              <Part2SimulationRecord
                key={recordingKey!}
                question={speakConfig.question}
                modelAnswer={speakConfig.modelAnswer}
                modelTitle="Reported speech modelo (ICAO 5)"
                evaluateType={speakConfig.evaluateType}
                stepLabel={current.title}
                completed={currentRecording}
                onComplete={saveRecording}
                onRetry={clearRecording}
              />
            )}
          </>
        )}
        {step === 8 && (
          <div className="part2-sim-review">
            <div className="part2-model-answer">
              <h3>Readback</h3>
              <p>{scenario.readback.modelReadback}</p>
            </div>
            <div className="part2-model-answer">
              <h3>Reporte</h3>
              <p>{scenario.interaction.modelReport}</p>
            </div>
            <div className="part2-model-answer">
              <h3>Correção ({scenario.atcFollowUp.correctionType})</h3>
              <p>{scenario.atcFollowUp.modelCorrection}</p>
            </div>
            <div className="part2-model-answer">
              <h3>Reported speech</h3>
              <p>{scenario.reportedSpeech.modelAnswer}</p>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderStepToolbar = () => (
    <div className="study-toolbar">
      {step < 8 && (
        <>
          {!canAdvance && isSimulationSpeakStep(step) && (
            <p className="part2-sim-advance-hint">Grave e envie sua resposta com Azure para continuar.</p>
          )}
          <button
            type="button"
            className={missionMode ? "btn purple btn-large" : "btn blue"}
            onClick={next}
            disabled={!canAdvance}
          >
            {missionMode ? "Continue →" : "Próximo passo →"}
          </button>
        </>
      )}
      {step === 8 && (
        <button type="button" className="btn purple btn-large" onClick={finishSituation}>
          {situationIdx < situations.length - 1
            ? `Situation ${scenario?.situationNumber} complete — next →`
            : missionMode
              ? "Finish today's exam →"
              : "Finalizar simulação e ver nota ICAO →"}
        </button>
      )}
    </div>
  );

  const wrapWithNotes = (content: ReactNode) =>
    missionMode ? (
      content
    ) : (
      <Part2NotesLayout notes={studentNotes} onNotesChange={setStudentNotes}>
        {content}
      </Part2NotesLayout>
    );

  if (showResults && aggregated && activeVersion) {
    return (
      <div className={missionMode ? "part2-mission-results" : "part2-mode"}>
        <SimulationResultsPanel
          result={aggregated}
          examVersion={activeVersion}
          onRestart={resetSimulation}
          missionContinueHref={missionMode ? missionContinueHref : undefined}
          missionContinueLabel={missionMode ? missionContinueLabel : undefined}
        />
      </div>
    );
  }

  if (missionMode && !sessionReady) {
    return <p className="sub part2-mission-loading">Retomando sua prova…</p>;
  }

  if (step === -1) {
    if (missionMode) {
      return (
        <article className="part1-mission-card card card-essential">
          <div className="card-meta part1-mission-meta">
            {forcedExamVersion && (
              <span className="exam-version-badge">{EXAM_LABELS[forcedExamVersion]}</span>
            )}
            <span className="part1-step-technique">Full exam</span>
          </div>
          <h2 className="question">Ready for today&apos;s Part 2?</h2>
          <p className="part1-step-hint">
            Five situations with original exam audio. Have paper and pen ready — Captain Delta will
            suggest codes; you write offline like the real SDEA.
          </p>
          <div className="part1-step-panel">
            <button type="button" className="btn purple btn-large" onClick={startSituation}>
              Start sound check →
            </button>
          </div>
        </article>
      );
    }

    return (
      <div className="part2-mode">
        {!forcedExamVersion && (
          <ExamVersionPicker value={examVersion} onChange={setExamVersion} />
        )}
        <div className="exam-pick-card">
          <h2>Simulação completa — Part 2</h2>
          <p className="sub">
            {examVersion !== "all"
              ? `${EXAM_LABELS[examVersion as ExamVersion]} — áudio original, 5 situações, avaliação Azure`
              : "Sorteia uma prova (23C–26C). Grave cada resposta com Azure; no final você vê o nível ICAO (2–6) e todos os erros."}
          </p>
          <p className="part2-hint">
            Durante a simulação, use o painel <strong>ICAO Quick Notes</strong> abaixo do cenário
            para anotar códigos enquanto ouve o ATC.
          </p>
          <button type="button" className="btn green btn-large" onClick={startSituation}>
            Iniciar simulação
          </button>
        </div>
      </div>
    );
  }

  if (step === -2 && activeVersion) {
    const soundCheckUrl = examAudioUrl(activeVersion, SOUND_CHECK_TRACK);
    const soundCard = (
      <article className={missionMode ? "part1-mission-card card card-essential" : "card card-essential part2-card"}>
        {missionMode ? (
          <>
            <div className="card-meta part1-mission-meta">
              <span className="exam-version-badge">{EXAM_LABELS[activeVersion]}</span>
              <span className="part1-step-technique">Sound check</span>
            </div>
            <h2 className="question">Track 1 — Sound check</h2>
            <p className="part1-step-hint">
              Like the real exam: headset on, confirm volume, paper and pen ready.
            </p>
          </>
        ) : (
          <div className="card-top">
            <h2 className="question">TRACK 1 — Sound check</h2>
            <p className="part2-hint">
              Como na prova real: coloque o headset, ouça o sound check e confirme que o volume está ok.
            </p>
          </div>
        )}
        <div className={missionMode ? "part1-step-panel" : "card-body"}>
          <ExamAudioPlayer
            src={soundCheckUrl}
            label={examAudioLabel(activeVersion, SOUND_CHECK_TRACK)}
          />
          <div className="study-toolbar">
            <button
              type="button"
              className={missionMode ? "btn purple btn-large" : "btn green btn-large"}
              onClick={() => setStep(0)}
            >
              Volume ok — Situation 1 →
            </button>
          </div>
        </div>
      </article>
    );

    return missionMode ? soundCard : <div className="part2-mode">{wrapWithNotes(soundCard)}</div>;
  }

  if (!scenario || step < 0 || !current) return null;

  if (missionMode) {
    return (
      <>
        <Part2MissionStepFrame
          scenario={scenario}
          situationTotal={situations.length}
          step={step}
          stepTitle={current.title}
          showPaperNotes={step <= 5 || step === 7}
          toolbar={renderStepToolbar()}
        >
          {renderStepBody()}
        </Part2MissionStepFrame>

        {scenario.recommendedNotes && (
          <Part2PaperSelfCheck
            open={showNotesReview}
            recommendedNotes={scenario.recommendedNotes}
            situationTitle={scenario.title}
            onContinue={advanceAfterSituation}
          />
        )}
      </>
    );
  }

  const readbackAudio = examAudioUrl(scenario.examVersion, scenario.readback.audioTrack);
  const followUpAudio = examAudioUrl(scenario.examVersion, scenario.atcFollowUp.audioTrack);
  const recordingsDone = stepResults.length;
  const recordingsTotal = situations.length * 4;

  return (
    <div className="part2-mode">
      <header className="part2-mode-head">
        <span className="badge">
          {EXAM_LABELS[scenario.examVersion]} — Situação {scenario.situationNumber}/5
        </span>
        <span className="part2-counter">
          Passo {step + 1} / {STEPS.length} · {recordingsDone}/{recordingsTotal} gravações
        </span>
      </header>

      <div className="part2-sim-progress">
        {STEPS.map((s, i) => (
          <span key={s.id} className={`part2-sim-dot ${i <= step ? "active" : ""} ${i === step ? "current" : ""}`}>
            {s.id}
          </span>
        ))}
      </div>

      {wrapWithNotes(
      <article className="card card-essential part2-card part2-sim-main">
        <div className="card-top">
          <h2 className="question">{current.title}</h2>
        </div>
        <div className="card-body">
          {step === 0 && (
            <>
              <p className="part2-situation">{scenario.context}</p>
              <ExamAudioPlayer
                src={readbackAudio}
                label={examAudioLabel(scenario.examVersion, scenario.readback.audioTrack)}
              />
              <p className="part2-atc-message">{scenario.readback.atcMessage}</p>
            </>
          )}
          {step === 1 && (
            <>
              <p className="part2-hint">Faça o readback em voz alta — grave com Azure antes de avançar.</p>
              {speakConfig && (
                <Part2SimulationRecord
                  key={recordingKey!}
                  question={speakConfig.question}
                  modelAnswer={speakConfig.modelAnswer}
                  modelTitle="Readback modelo (ICAO 5)"
                  evaluateType={speakConfig.evaluateType}
                  stepLabel={current.title}
                  completed={currentRecording}
                  onComplete={saveRecording}
                  onRetry={clearRecording}
                />
              )}
            </>
          )}
          {step === 2 && (
            <p className="part2-atc-message">{scenario.interaction.prompt}</p>
          )}
          {step === 3 && (
            <>
              <p className="part2-hint">Reporte: facility + ANAC 123 + problema + intenção + pedido.</p>
              {speakConfig && (
                <Part2SimulationRecord
                  key={recordingKey!}
                  question={speakConfig.question}
                  modelAnswer={speakConfig.modelAnswer}
                  modelTitle="Reporte modelo (ICAO 5)"
                  evaluateType={speakConfig.evaluateType}
                  stepLabel={current.title}
                  completed={currentRecording}
                  onComplete={saveRecording}
                  onRetry={clearRecording}
                />
              )}
            </>
          )}
          {step === 4 && (
            <>
              <ExamAudioPlayer
                src={followUpAudio}
                label={examAudioLabel(scenario.examVersion, scenario.atcFollowUp.audioTrack)}
              />
              <p className="part2-atc-message">{scenario.atcFollowUp.atcMessage}</p>
            </>
          )}
          {step === 5 && (
            <>
              <p className="part2-hint">
                Corrija o mal-entendido do ATC com {scenario.atcFollowUp.correctionType}.
              </p>
              {speakConfig && (
                <Part2SimulationRecord
                  key={recordingKey!}
                  question={speakConfig.question}
                  modelAnswer={speakConfig.modelAnswer}
                  modelTitle={`${scenario.atcFollowUp.correctionType} modelo (ICAO 5)`}
                  evaluateType={speakConfig.evaluateType}
                  stepLabel={current.title}
                  completed={currentRecording}
                  onComplete={saveRecording}
                  onRetry={clearRecording}
                />
              )}
            </>
          )}
          {step === 6 && (
            <p className="part2-examiner-q">What did the controller say?</p>
          )}
          {step === 7 && (
            <>
              <p className="part2-hint">Responda em reported speech para o examinador.</p>
              {speakConfig && (
                <Part2SimulationRecord
                  key={recordingKey!}
                  question={speakConfig.question}
                  modelAnswer={speakConfig.modelAnswer}
                  modelTitle="Reported speech modelo (ICAO 5)"
                  evaluateType={speakConfig.evaluateType}
                  stepLabel={current.title}
                  completed={currentRecording}
                  onComplete={saveRecording}
                  onRetry={clearRecording}
                />
              )}
            </>
          )}
          {step === 8 && (
            <div className="part2-sim-review">
              <p className="part2-hint">Revise os modelos desta situação antes de seguir.</p>
              <div className="part2-model-answer">
                <h3>Readback</h3>
                <p>{scenario.readback.modelReadback}</p>
              </div>
              <div className="part2-model-answer">
                <h3>Reporte</h3>
                <p>{scenario.interaction.modelReport}</p>
              </div>
              <div className="part2-model-answer">
                <h3>Correção ({scenario.atcFollowUp.correctionType})</h3>
                <p>{scenario.atcFollowUp.modelCorrection}</p>
              </div>
              <div className="part2-model-answer">
                <h3>Reported speech</h3>
                <p>{scenario.reportedSpeech.modelAnswer}</p>
              </div>
            </div>
          )}

          {renderStepToolbar()}
        </div>
      </article>,
      )}

      {scenario.recommendedNotes && (
        <RecommendedNotesReview
          open={showNotesReview}
          studentNotes={studentNotes}
          recommendedNotes={scenario.recommendedNotes}
          situationTitle={scenario.title}
          onContinue={advanceAfterSituation}
        />
      )}
    </div>
  );
}
