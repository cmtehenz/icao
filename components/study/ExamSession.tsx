"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AnswerPanel from "@/components/study/AnswerPanel";
import KeywordsPanel from "@/components/study/KeywordsPanel";
import { PART1_BY_EXAM } from "@/data/exams/part1";
import { CARDS } from "@/lib/cards";
import { EXAM_LABELS, EXAM_VERSIONS, type ExamVersion } from "@/lib/exams/types";
import { getKeywords } from "@/lib/icaoStructure";
import { personalizeCard } from "@/lib/personalize";
import { loadConnectorSet } from "@/lib/connectors";
import type { PilotProfile } from "@/lib/profile";
import type { ProgressStore } from "@/lib/progress";
import { setCardStatus } from "@/lib/progress";
import { recordStudyActivity } from "@/lib/studyTime";
import { useTimer } from "@/hooks/useTimer";

const PREP_SECONDS = 5;
const ANSWER_SECONDS = 45;

type ExamPhase = "pick" | "version" | "prep" | "speak" | "review" | "done";

type Props = {
  profile: PilotProfile;
  examVersion: ExamVersion | "all";
  progress: ProgressStore;
  onProgressChange: (store: ProgressStore) => void;
  onExit: () => void;
};

function pickRandomVersion(): ExamVersion {
  return EXAM_VERSIONS[Math.floor(Math.random() * EXAM_VERSIONS.length)];
}

export default function ExamSession({
  profile,
  examVersion,
  progress,
  onProgressChange,
  onExit,
}: Props) {
  const [phase, setPhase] = useState<ExamPhase>("pick");
  const [selectedVersion, setSelectedVersion] = useState<ExamVersion | null>(null);
  const [questionSlot, setQuestionSlot] = useState(0);
  const [cardIdx, setCardIdx] = useState(0);
  const prep = useTimer(PREP_SECONDS);
  const speak = useTimer(ANSWER_SECONDS);

  const activeVersion = examVersion !== "all" ? examVersion : selectedVersion;

  const examCardNums = useMemo(() => {
    if (!activeVersion) return [];
    return [...PART1_BY_EXAM[activeVersion]];
  }, [activeVersion]);

  const resolveCardIndex = useCallback(
    (num: string) => CARDS.findIndex((c) => c.num === num),
    [],
  );

  const currentCardNum = examCardNums[questionSlot];

  const startExam = useCallback(() => {
    const version = examVersion !== "all" ? examVersion : pickRandomVersion();
    setSelectedVersion(version);
    setQuestionSlot(0);
    const idx = resolveCardIndex(PART1_BY_EXAM[version][0]);
    setCardIdx(idx);
    prep.reset();
    speak.reset();
    setPhase("prep");
    prep.start();
  }, [examVersion, prep, speak, resolveCardIndex]);

  const card = useMemo(() => {
    const connectorSet = loadConnectorSet();
    return personalizeCard(CARDS[cardIdx], profile, connectorSet);
  }, [cardIdx, profile]);

  const keywords = getKeywords(card);

  useEffect(() => {
    if (phase === "prep" && prep.finished) {
      speak.start();
      setPhase("speak");
    }
  }, [phase, prep.finished, speak]);

  useEffect(() => {
    if (phase === "speak" && speak.finished) {
      setPhase("review");
    }
  }, [phase, speak.finished]);

  const handleReview = (mastered: boolean) => {
    recordStudyActivity("simulate");
    const next = setCardStatus(progress, card.num, mastered ? "mastered" : "difficult");
    onProgressChange(next);

    const nextSlot = questionSlot + 1;
    if (nextSlot >= 3) {
      setPhase("done");
      prep.reset();
      speak.reset();
      return;
    }

    setQuestionSlot(nextSlot);
    const nextNum = examCardNums[nextSlot];
    setCardIdx(resolveCardIndex(nextNum));
    prep.reset();
    speak.reset();
    setPhase("prep");
    prep.start();
  };

  const restart = () => {
    setSelectedVersion(null);
    setQuestionSlot(0);
    setPhase("pick");
    prep.reset();
    speak.reset();
  };

  if (phase === "pick") {
    return (
      <div className="exam-session wrap">
        <header className="exam-session-head">
          <div>
            <span className="badge">Simulação Part 1</span>
            <h1>Prova real SDEA</h1>
            <p className="sub">
              {examVersion !== "all"
                ? `Versão fixa: ${EXAM_LABELS[examVersion]} — 3 perguntas em sequência`
                : "Sorteia uma das 4 provas (23C–26C) — 3 perguntas como na prova real"}
            </p>
          </div>
          <button type="button" className="btn secondary" onClick={onExit}>
            Voltar
          </button>
        </header>
        <div className="exam-pick-card">
          <p>Na prova real, o examinador faz exatamente 3 perguntas da versão sorteada.</p>
          <button type="button" className="btn green btn-large" onClick={startExam}>
            Iniciar simulação
          </button>
        </div>
      </div>
    );
  }

  if (phase === "done" && activeVersion) {
    return (
      <div className="exam-session wrap">
        <header className="exam-session-head">
          <div>
            <span className="badge">Concluído</span>
            <h1>{EXAM_LABELS[activeVersion]} — Part 1 completa</h1>
            <p className="sub">Você respondeu as 3 perguntas desta versão.</p>
          </div>
          <button type="button" className="btn secondary" onClick={onExit}>
            Voltar
          </button>
        </header>
        <div className="exam-pick-card">
          <button type="button" className="btn green btn-large" onClick={restart}>
            Nova simulação
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-session wrap">
      <header className="exam-session-head">
        <div>
          <span className="badge">
            {activeVersion ? EXAM_LABELS[activeVersion] : "Prova"} — Pergunta {questionSlot + 1}/3
          </span>
          <h1>Part 1 — Aviation Topics</h1>
          <p className="sub">5s para pensar · 45s para falar · depois revise</p>
        </div>
        <button type="button" className="btn secondary" onClick={onExit}>
          Sair
        </button>
      </header>

      <article className="card card-study">
        <div className="card-meta">
          <span className="card-num">#{card.num}</span>
          <span className={`exam-phase-pill phase-${phase}`}>
            {phase === "prep" && `Preparar ${PREP_SECONDS - prep.elapsed}s`}
            {phase === "speak" && `Falando ${ANSWER_SECONDS - speak.elapsed}s`}
            {phase === "review" && "Revisar"}
          </span>
        </div>

        <h2 className="question">{card.question}</h2>

        {phase === "prep" && (
          <div className="exam-phase-banner prep">
            <p>Pense nas keywords. A resposta começa em {PREP_SECONDS - prep.elapsed}s</p>
            <div className="progress-bar">
              <div className="progress-fill prep-fill" style={{ width: `${prep.progress}%` }} />
            </div>
          </div>
        )}

        {phase === "speak" && (
          <div className="exam-phase-banner speak">
            <p>Fale em voz alta agora — resposta oculta</p>
            <div className="timer-display">{speak.clock}</div>
            <div className="progress-bar">
              <div className="progress-fill speak-fill" style={{ width: `${speak.progress}%` }} />
            </div>
          </div>
        )}

        {phase === "review" && (
          <>
            <KeywordsPanel keywords={keywords} />
            <AnswerPanel card={card} show />
            <div className="review-actions">
              <button type="button" className="btn green btn-large" onClick={() => handleReview(true)}>
                ✓ Fui bem
              </button>
              <button type="button" className="btn orange btn-large" onClick={() => handleReview(false)}>
                Preciso revisar
              </button>
            </div>
          </>
        )}
      </article>
    </div>
  );
}
