"use client";

import { useState } from "react";
import ExamAudioPlayer from "@/components/ExamAudioPlayer";
import ExamVersionPicker from "@/components/ExamVersionPicker";
import Part2TimerBar from "@/components/Part2Trainer/Part2TimerBar";
import { getSituationsByExam } from "@/data/exams/part2Data";
import { examAudioUrl, examAudioLabel, SOUND_CHECK_TRACK } from "@/lib/exams/audio";
import { EXAM_LABELS, EXAM_VERSIONS, type ExamVersion } from "@/lib/exams/types";
import { setPart2ItemStatus, type Part2ProgressStore } from "@/lib/part2/progress";

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
};

function pickRandomVersion(): ExamVersion {
  return EXAM_VERSIONS[Math.floor(Math.random() * EXAM_VERSIONS.length)];
}

export default function FullSimulationMode({ progress, onProgressChange }: Props) {
  const [examVersion, setExamVersion] = useState<ExamVersion | "all">("all");
  const [activeVersion, setActiveVersion] = useState<ExamVersion | null>(null);
  const [situationIdx, setSituationIdx] = useState(0);
  const [step, setStep] = useState(-1);
  const [showAnswer, setShowAnswer] = useState(false);

  const situations = activeVersion ? getSituationsByExam(activeVersion) : [];
  const scenario = situations[situationIdx];
  const current = step >= 0 ? STEPS[step] : null;
  const simId = scenario ? `${scenario.id}-sim` : "sim-pending";

  const startSituation = () => {
    const version = examVersion !== "all" ? examVersion : pickRandomVersion();
    setActiveVersion(version);
    setSituationIdx(0);
    setStep(-2);
    setShowAnswer(false);
  };

  const next = () => {
    setShowAnswer(false);
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    }
  };

  const nextSituation = () => {
    if (situationIdx < situations.length - 1) {
      setSituationIdx((i) => i + 1);
      setStep(0);
      setShowAnswer(false);
    } else {
      setStep(-1);
    }
  };

  const finish = (status: "difficult" | "mastered") => {
    if (scenario) onProgressChange(setPart2ItemStatus(progress, simId, status));
    nextSituation();
  };

  if (step === -1) {
    return (
      <div className="part2-mode">
        <ExamVersionPicker value={examVersion} onChange={setExamVersion} />
        <div className="exam-pick-card">
          <h2>Simulação completa — Part 2</h2>
          <p className="sub">
            {examVersion !== "all"
              ? `${EXAM_LABELS[examVersion]} — áudio original da prova, 5 situações`
              : "Sorteia uma prova (23C–26C) com os MP3 originais de provas/"}
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
    return (
      <div className="part2-mode">
        <header className="part2-mode-head">
          <span className="badge">{EXAM_LABELS[activeVersion]} — Sound check</span>
        </header>
        <article className="card card-essential part2-card">
          <div className="card-top">
            <h2 className="question">TRACK 1 — Sound check</h2>
            <p className="part2-hint">
              Como na prova real: coloque o headset, ouça o sound check e confirme que o volume está ok.
            </p>
            <ExamAudioPlayer
              src={soundCheckUrl}
              label={examAudioLabel(activeVersion, SOUND_CHECK_TRACK)}
            />
          </div>
          <div className="card-body">
            <div className="study-toolbar">
              <button type="button" className="btn green btn-large" onClick={() => setStep(0)}>
                Volume ok — Situação 1 →
              </button>
            </div>
          </div>
        </article>
      </div>
    );
  }

  if (!scenario || step < 0 || !current) return null;

  const readbackAudio = examAudioUrl(scenario.examVersion, scenario.readback.audioTrack);
  const followUpAudio = examAudioUrl(scenario.examVersion, scenario.atcFollowUp.audioTrack);

  return (
    <div className="part2-mode">
      <header className="part2-mode-head">
        <span className="badge">
          {EXAM_LABELS[scenario.examVersion]} — Situação {scenario.situationNumber}/5
        </span>
        <span className="part2-counter">
          Passo {step + 1} / {STEPS.length}
        </span>
      </header>

      <div className="part2-sim-progress">
        {STEPS.map((s, i) => (
          <span key={s.id} className={`part2-sim-dot ${i <= step ? "active" : ""} ${i === step ? "current" : ""}`}>
            {s.id}
          </span>
        ))}
      </div>

      <article className="card card-essential part2-card">
        <div className="card-top">
          <h2 className="question">{current.title}</h2>
          {(current.type === "speak" || current.type === "question") && <Part2TimerBar />}
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
            <p className="part2-hint">Faça o readback em voz alta, depois revele o modelo.</p>
          )}
          {step === 2 && (
            <p className="part2-atc-message">{scenario.interaction.prompt}</p>
          )}
          {step === 3 && (
            <p className="part2-hint">Reporte: facility + ANAC 123 + problema + intenção + pedido.</p>
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
            <p className="part2-hint">
              Corrija o mal-entendido do ATC com {scenario.atcFollowUp.correctionType}.
            </p>
          )}
          {step === 6 && (
            <p className="part2-examiner-q">What did the controller say?</p>
          )}
          {step === 7 && (
            <p className="part2-hint">Responda em reported speech para o examinador.</p>
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

          {step === 1 && showAnswer && (
            <div className="part2-model-answer">
              <h3>Readback modelo</h3>
              <p>{scenario.readback.modelReadback}</p>
            </div>
          )}
          {(step === 3 || step === 5) && showAnswer && (
            <div className="part2-model-answer">
              <h3>Modelo</h3>
              <p>{step === 5 ? scenario.atcFollowUp.modelCorrection : scenario.interaction.modelReport}</p>
            </div>
          )}
          {step === 7 && showAnswer && (
            <div className="part2-model-answer">
              <h3>Reported speech</h3>
              <p>{scenario.reportedSpeech.modelAnswer}</p>
            </div>
          )}

          <div className="study-toolbar">
            {step < 8 && (
              <>
                {[1, 3, 5, 7].includes(step) && (
                  <button type="button" className="btn purple" onClick={() => setShowAnswer((s) => !s)}>
                    {showAnswer ? "Esconder" : "Mostrar resposta"}
                  </button>
                )}
                <button type="button" className="btn blue" onClick={next}>
                  Próximo passo →
                </button>
              </>
            )}
            {step === 8 && (
              <>
                <button type="button" className="btn green" onClick={() => finish("mastered")}>
                  Dominado — próxima situação
                </button>
                <button type="button" className="btn orange" onClick={() => finish("difficult")}>
                  Difícil — próxima situação
                </button>
              </>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
