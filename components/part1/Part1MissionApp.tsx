"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import MemoryFlow from "@/components/study/MemoryFlow";
import VoiceCoachPanel from "@/components/VoiceCoachPanel";
import Part1MasteryBanner from "@/components/part1/Part1MasteryBanner";
import Part1BriefResources from "@/components/part1/Part1BriefResources";
import Part1AnchorBuildPanel from "@/components/part1/Part1AnchorBuildPanel";
import Part1StoryConnectPanel from "@/components/part1/Part1StoryConnectPanel";
import { emitCaptainDeltaSuggestion } from "@/lib/captainDelta/events";
import { CARDS } from "@/lib/cards";
import { CATEGORIES } from "@/lib/categories";
import { getExamForCard } from "@/data/exams/part1";
import { EXAM_LABELS } from "@/lib/exams/types";
import { getKeywords } from "@/lib/icaoStructure";
import { getNextMissionAction } from "@/lib/dailyMission";
import {
  getOrCreatePart1DailyMission,
  part1CardAllPeelBlocksDoneToday,
  PART1_DAILY_MISSION_EVENT,
  tryMarkPart1ShadowComplete,
} from "@/lib/part1DailyMission";
import {
  markPart1AnchorDone,
  markPart1BriefSeen,
  markPart1KeywordsDone,
  PART1_MASTERY_PROGRESS_EVENT,
} from "@/lib/part1Mastery/progress";
import {
  isPart1PipelineStepComplete,
  part1PipelineStepMeta,
  resolvePart1PipelineStep,
  type Part1PipelineStepId,
} from "@/lib/part1Mastery/pipeline";
import { buildPart1MasterySummary } from "@/lib/part1Mastery/summary";
import { PART1_RESET_EVENT, resetPart1Today } from "@/lib/part1Mastery/reset";
import { DEFAULT_PROFILE, loadProfile } from "@/lib/profile";
import { loadConnectorSet, type ConnectorSetId } from "@/lib/connectors";
import { personalizeCard } from "@/lib/personalize";
import { useTrainingAssistance } from "@/lib/trainingProfile/useTrainingAssistance";

function cardByNum(num: string) {
  return CARDS.find((c) => c.num === num) ?? null;
}

export default function Part1MissionApp() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tick, setTick] = useState(0);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [connectorSet, setConnectorSet] = useState<ConnectorSetId>("level4");
  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    setProfile(loadProfile());
    setConnectorSet(loadConnectorSet());
  }, []);

  useEffect(() => {
    if (searchParams.get("reset") !== "1") return;
    const firstCard = resetPart1Today();
    refresh();
    router.replace(`/part1?card=${firstCard}`);
  }, [searchParams, router, refresh]);

  useEffect(() => {
    window.addEventListener(PART1_DAILY_MISSION_EVENT, refresh);
    window.addEventListener(PART1_MASTERY_PROGRESS_EVENT, refresh);
    window.addEventListener(PART1_RESET_EVENT, refresh);
    return () => {
      window.removeEventListener(PART1_DAILY_MISSION_EVENT, refresh);
      window.removeEventListener(PART1_MASTERY_PROGRESS_EVENT, refresh);
      window.removeEventListener(PART1_RESET_EVENT, refresh);
    };
  }, [refresh]);

  const mission = useMemo(() => {
    void tick;
    return getOrCreatePart1DailyMission();
  }, [tick]);

  const requestedCard = searchParams.get("card")?.padStart(2, "0") ?? null;
  const activeCardNum =
    requestedCard && mission.cards.some((c) => c.cardNum === requestedCard)
      ? requestedCard
      : mission.cards.find((c) => !c.coachDone || !c.shadowDone)?.cardNum ??
        mission.cards[0]?.cardNum ??
        "01";

  const sourceCard = cardByNum(activeCardNum);
  const card = useMemo(
    () => (sourceCard ? personalizeCard(sourceCard, profile, connectorSet) : null),
    [sourceCard, profile, connectorSet],
  );

  const forceShadow = searchParams.get("shadow") === "1";
  const forceCoach = searchParams.get("coach") === "1";

  const stepId: Part1PipelineStepId = useMemo(() => {
    void tick;
    if (!card) return "brief";
    return resolvePart1PipelineStep({
      cardNum: card.num,
      missionCard: mission.cards.find((c) => c.cardNum === card.num),
      forceShadow,
      forceCoach,
    });
  }, [card, mission.cards, forceShadow, forceCoach, tick]);

  const stepMeta = part1PipelineStepMeta(stepId);
  const { part1: part1Assist } = useTrainingAssistance();
  const mastery = useMemo(() => {
    void tick;
    return buildPart1MasterySummary();
  }, [tick]);

  const missionContinue = useMemo(() => {
    void tick;
    if (!card) return null;
    const idx = mission.cards.findIndex((c) => c.cardNum === card.num);
    if (idx >= 0 && idx < mission.cards.length - 1) {
      const nextCard = mission.cards[idx + 1]!.cardNum;
      return {
        href: `/part1?card=${nextCard}`,
        label: `Next question · #${nextCard}`,
      };
    }
    const next = getNextMissionAction();
    return {
      href: next?.href ?? "/",
      label: next ? `Ready — ${next.title}` : "Continue flight",
    };
  }, [card, mission.cards, tick]);

  useEffect(() => {
    if (!card || stepId === "complete") return;
    emitCaptainDeltaSuggestion({
      text: `${stepMeta.label} — ${stepMeta.captainHint}`,
      speechText: stepMeta.captainHint,
      kind: "coaching",
      primaryAction: { id: "ready", label: "🎤 Ready", primary: true },
      secondaryActions: [],
      eventId: `part1:${card.num}:${stepId}`,
      source: "part1-mission",
    });
  }, [card?.num, stepId, stepMeta.captainHint, stepMeta.label]);

  if (!card) {
    return (
      <div className="wrap part1-mission-wrap">
        <p className="sub">Part 1 card not found.</p>
        <Link href="/" className="btn secondary">
          Back to Home
        </Link>
      </div>
    );
  }

  const examVersion = getExamForCard(card.num);
  const keywords = getKeywords(card);
  const cardIndex = mission.cards.findIndex((c) => c.cardNum === card.num) + 1;
  const peelReady = part1CardAllPeelBlocksDoneToday(card.num);

  const part1CoachGuide = {
    basicAnswer: sourceCard!.answerLevel4 ?? sourceCard!.answer,
    elaborateAnswer: sourceCard!.answerLevel5 ?? sourceCard!.answer,
    exampleAnswer: sourceCard!.level4Example ?? sourceCard!.example,
    steps: sourceCard!.level4Steps,
    memoryLabels: sourceCard!.memoryLabels,
  };

  const advanceFromShadow = () => {
    tryMarkPart1ShadowComplete(card.num);
    refresh();
  };

  const restartToday = () => {
    const ok = window.confirm(
      "Restart today's Part 1? You will go back to Brief on question 1. Today's shadow and coach progress will reset.",
    );
    if (!ok) return;
    const firstCard = resetPart1Today();
    refresh();
    router.replace(`/part1?card=${firstCard}`);
  };

  return (
    <div className="part1-mission-page">
      <header className="part1-mission-head wrap">
        <p className="part1-mission-kicker">Captain Delta · TAKEOFF · Part 1</p>
        <h1>Oral exam mastery</h1>
        <p className="sub part1-mission-sub">
          Today · {EXAM_LABELS[mission.examVersion]} — question {cardIndex}/{mission.cards.length}{" "}
          · {mastery.examReady}/12 exam ready
        </p>
        <Part1MasteryBanner />
      </header>

      <div className="wrap part1-mission-body">
        <nav className="part1-pipeline-strip" aria-label="Study pipeline">
          {["brief", "anchor", "shadow", "keywords", "coach"].map((id) => {
            const pipelineId = id as Part1PipelineStepId;
            const active = stepId === pipelineId;
            const done = isPart1PipelineStepComplete(pipelineId, {
              cardNum: card.num,
              missionCard: mission.cards.find((c) => c.cardNum === card.num),
            });
            return (
              <span
                key={id}
                className={`part1-pipeline-chip${active ? " is-active" : ""}${done ? " is-done" : ""}`}
              >
                {part1PipelineStepMeta(id as Part1PipelineStepId).label}
              </span>
            );
          })}
        </nav>

        <article className="part1-mission-card card card-essential">
          <div className="card-meta part1-mission-meta">
            {examVersion && <span className="exam-version-badge">{EXAM_LABELS[examVersion]}</span>}
            <span className="card-num">#{card.num}</span>
            <span className="category-badge">{CATEGORIES[card.category]}</span>
            <span className="part1-step-technique">{stepMeta.technique}</span>
          </div>

          <h2 className="question">{card.question}</h2>
          <p className="part1-step-hint">{stepMeta.captainHint}</p>

          {stepId === "brief" && (
            <div className="part1-step-panel">
              <p className="sub">
                Picture a real operational situation. You will build the answer in steps — no
                memorizing the script.
              </p>
              <Part1BriefResources cardNum={card.num} />
              <button
                type="button"
                className="btn purple btn-large"
                onClick={() => {
                  markPart1BriefSeen(card.num);
                  refresh();
                }}
              >
                Continue — memory anchors
              </button>
            </div>
          )}

          {stepId === "anchor" && (
            <div className="part1-step-panel">
              <p className="part1-anchor-lead">
                Say these four ideas aloud in order. Use your own words — pegs, not paragraphs.
              </p>
              <MemoryFlow
                memory={card.memory}
                memoryLabels={card.memoryLabels}
                memoryIcons={card.memoryIcons}
                expanded
              />
              <button
                type="button"
                className="btn purple btn-large"
                onClick={() => {
                  markPart1AnchorDone(card.num);
                  refresh();
                }}
              >
                I said the anchors — PEEL shadow
              </button>
            </div>
          )}

          {stepId === "shadow" && (
            <div className="part1-step-panel">
              <Part1AnchorBuildPanel card={card} onProgress={refresh} />
              <button
                type="button"
                className="btn purple btn-large"
                disabled={!peelReady}
                onClick={advanceFromShadow}
              >
                {peelReady ? "Continue — connect your story" : "Speak all 4 anchor points first"}
              </button>
            </div>
          )}

          {stepId === "keywords" && (
            <div className="part1-step-panel">
              <Part1StoryConnectPanel
                card={card}
                keywords={keywords}
                onComplete={() => {
                  markPart1KeywordsDone(card.num);
                  refresh();
                }}
              />
            </div>
          )}

          {(stepId === "coach" || stepId === "complete") && (
            <div className="part1-step-panel">
              {stepId === "complete" ? (
                <div className="part1-step-complete-banner">
                  <p className="part1-complete-title">Question #{card.num} — leg complete</p>
                  <p className="sub">
                    You built this answer through retrieval, not memorization. Review Captain
                    Delta&apos;s debrief, then continue the flight.
                  </p>
                </div>
              ) : null}
              <VoiceCoachPanel
                embedded
                missionLegMode
                legComplete={stepId === "complete"}
                missionContinueHref={missionContinue?.href}
                missionContinueLabel={missionContinue?.label}
                question={card.question}
                modelAnswer={card.answer}
                evaluateType="part1"
                keywords={keywords}
                answerMode={
                  connectorSet === "level4" ? "level4" : connectorSet === "level5" ? "level5" : "peel"
                }
                cardNum={card.num}
                part1Guide={part1Assist.hideModelAnswers ? undefined : part1CoachGuide}
                coachShowKeywords={part1Assist.coachShowKeywords}
                coachBasicOpen={part1Assist.coachBasicOpen}
              />
              {stepId === "coach" ? (
                <p className="sub">
                  Record your full answer. Use the sentence skeleton above if you need it —
                  paraphrase is fine.
                </p>
              ) : null}
            </div>
          )}
        </article>

        <p className="part1-browse-link sub">
          <Link href="/part1?browse=1">Browse all 12 questions</Link> (review mode — not today&apos;s
          flight)
          {" · "}
          <button type="button" className="part1-restart-link" onClick={restartToday}>
            Restart today&apos;s Part 1
          </button>
        </p>
      </div>
    </div>
  );
}
