"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AnswerPanel from "@/components/study/AnswerPanel";
import KeywordsPanel from "@/components/study/KeywordsPanel";
import { CARDS } from "@/lib/cards";
import { getKeywords } from "@/lib/icaoStructure";
import { personalizeCard } from "@/lib/personalize";
import { loadConnectorSet } from "@/lib/connectors";
import type { PilotProfile } from "@/lib/profile";
import type { ProgressStore } from "@/lib/progress";
import { setCardStatus } from "@/lib/progress";
import { useTimer } from "@/hooks/useTimer";
import type { CardFilter } from "@/components/study/FilterBar";

const PREP_SECONDS = 5;
const ANSWER_SECONDS = 45;

type ExamPhase = "pick" | "prep" | "speak" | "review";

type Props = {
  profile: PilotProfile;
  filter: CardFilter;
  favorites: string[];
  coreNums: readonly string[];
  progress: ProgressStore;
  onProgressChange: (store: ProgressStore) => void;
  onExit: () => void;
};

function pickRandomIndex(poolIndices: number[]): number {
  return poolIndices[Math.floor(Math.random() * poolIndices.length)];
}

export default function ExamSession({
  profile,
  filter,
  favorites,
  coreNums,
  progress,
  onProgressChange,
  onExit,
}: Props) {
  const [phase, setPhase] = useState<ExamPhase>("pick");
  const [cardIdx, setCardIdx] = useState(0);
  const prep = useTimer(PREP_SECONDS);
  const speak = useTimer(ANSWER_SECONDS);

  const poolIndices = useMemo(() => {
    return CARDS.map((c, i) => ({ c, i }))
      .filter(({ c }) => {
        if (filter === "favorites") return favorites.includes(c.num);
        if (filter === "core") return coreNums.includes(c.num);
        return true;
      })
      .map(({ i }) => i);
  }, [filter, favorites, coreNums]);

  const pickRandom = useCallback(() => {
    if (!poolIndices.length) return;
    const idx = pickRandomIndex(poolIndices);
    setCardIdx(idx);
    prep.reset();
    speak.reset();
    setPhase("prep");
    prep.start();
  }, [poolIndices, prep, speak]);

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
    const next = setCardStatus(progress, card.num, mastered ? "mastered" : "difficult");
    onProgressChange(next);
    setPhase("pick");
    prep.reset();
    speak.reset();
  };

  if (!poolIndices.length) {
    return (
      <>
      <div className="exam-session wrap">
          <p>No questions in this filter. Add favorites or switch filter.</p>
          <button type="button" className="btn secondary" onClick={onExit}>
            Back
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="exam-session wrap">
        <header className="exam-session-head">
          <div>
            <span className="badge">Exam Mode</span>
            <h1>ICAO Delta — Oral Exam</h1>
            <p className="sub">5s to think · 45s to speak · then review with keywords</p>
          </div>
          <button type="button" className="btn secondary" onClick={onExit}>
            Exit
          </button>
        </header>

        {phase === "pick" && (
          <div className="exam-pick-card">
            <p>Ready for a random question from your current filter?</p>
            <button type="button" className="btn green btn-large" onClick={pickRandom}>
              Start random question
            </button>
          </div>
        )}

        {phase !== "pick" && (
          <article className="card card-study">
            <div className="card-meta">
              <span className="card-num">#{card.num}</span>
              <span className={`exam-phase-pill phase-${phase}`}>
                {phase === "prep" && `Prepare ${PREP_SECONDS - prep.elapsed}s`}
                {phase === "speak" && `Speaking ${ANSWER_SECONDS - speak.elapsed}s`}
                {phase === "review" && "Review"}
              </span>
            </div>

            <h2 className="question">{card.question}</h2>

            {phase === "prep" && (
              <div className="exam-phase-banner prep">
                <p>Think about your keywords. Answer starts in {PREP_SECONDS - prep.elapsed}s</p>
                <div className="progress-bar">
                  <div className="progress-fill prep-fill" style={{ width: `${prep.progress}%` }} />
                </div>
              </div>
            )}

            {phase === "speak" && (
              <div className="exam-phase-banner speak">
                <p>Speak out loud now — no answer shown</p>
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
                    ✓ I got it
                  </button>
                  <button type="button" className="btn orange btn-large" onClick={() => handleReview(false)}>
                    Need review
                  </button>
                  <button type="button" className="btn secondary" onClick={pickRandom}>
                    Next random
                  </button>
                </div>
              </>
            )}
          </article>
        )}
      </div>
    </>
  );
}
