"use client";

import { useCallback, useMemo, useState } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { compareTranscriptToModel } from "@/lib/evaluate/compareAnswer";
import {
  ANCHOR_BUILD_PASS_SCORE,
  anchorBuildActivityKey,
  getAnchorBuildSteps,
  type AnchorBuildStep,
} from "@/lib/part1Mastery/anchorBuild";
import { markShadowPeelScored } from "@/lib/shadowPeelDedup";
import {
  tryRecordStudyActivity,
  studyActivityRejectReason,
} from "@/lib/studyActivityRecord";
import { speakText } from "@/lib/tts";
import type { Card } from "@/lib/types";

type Props = {
  card: Card;
  onProgress?: () => void;
};

export default function Part1AnchorBuildPanel({ card, onProgress }: Props) {
  const steps = useMemo(() => getAnchorBuildSteps(card), [card]);
  const speech = useSpeechRecognition("en-US");
  const [activeIndex, setActiveIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [activityNote, setActivityNote] = useState<string | null>(null);
  const [doneIndexes, setDoneIndexes] = useState<Set<number>>(() => new Set());

  const active = steps[activeIndex] ?? steps[0];
  const progress = doneIndexes.size;

  const markStepDone = useCallback(
    (step: AnchorBuildStep, heard: string, accuracy: number) => {
      const key = anchorBuildActivityKey(card.num, step.index);
      markShadowPeelScored(key);
      const counted = tryRecordStudyActivity("shadow", {
        accuracy,
        recognizedText: heard,
        peelBlockKey: key,
        cardNum: card.num,
      });
      if (!counted) {
        setActivityNote(
          studyActivityRejectReason("shadow", {
            accuracy,
            recognizedText: heard,
            peelBlockKey: key,
            cardNum: card.num,
          }),
        );
      } else {
        setActivityNote(null);
      }
      setDoneIndexes((prev) => new Set(prev).add(step.index));
      onProgress?.();
    },
    [card.num, onProgress],
  );

  const finishAttempt = (step: AnchorBuildStep) => {
    const heard = speech.transcript.trim();
    const accuracy = heard
      ? compareTranscriptToModel(heard, step.hint).overlapPercent
      : 0;
    setLastScore(accuracy);
    markStepDone(step, heard, Math.max(accuracy, ANCHOR_BUILD_PASS_SCORE));
    speech.clear();
    setShowHint(false);
    if (activeIndex < steps.length - 1) setActiveIndex(activeIndex + 1);
  };

  if (!active) return null;

  return (
    <section className="part1-anchor-build">
      <p className="part1-anchor-build-lead">
        Four anchor points — <strong>one at a time</strong>. Paraphrase is fine. You do not need
        the full script word-for-word.
      </p>
      <p className="part1-anchor-build-progress">
        {progress}/{steps.length} points spoken
      </p>

      <ol className="part1-anchor-build-steps">
        {steps.map((step) => {
          const done = doneIndexes.has(step.index);
          const isActive = step.index === activeIndex;
          return (
            <li
              key={step.index}
              className={`part1-anchor-build-step${done ? " is-done" : ""}${isActive ? " is-active" : ""}`}
            >
              <button
                type="button"
                className="part1-anchor-build-step-btn"
                onClick={() => {
                  setActiveIndex(step.index);
                  setShowHint(false);
                  setLastScore(null);
                  speech.clear();
                }}
              >
                <span className="part1-anchor-build-label">{step.label}</span>
                {done ? <span className="part1-anchor-build-check">✓</span> : null}
              </button>
            </li>
          );
        })}
      </ol>

      <article className="part1-anchor-build-card card">
        <p className="part1-anchor-build-connector">{active.connector}</p>
        <p className="part1-anchor-build-prompt">
          Speak about <strong>{active.label}</strong> in your own words. Start with the idea — not
          the full sentence.
        </p>
        <p className="part1-anchor-build-starter">
          Starter: <em>{active.starter}</em>
        </p>

        <div className="part1-anchor-build-actions">
          <button
            type="button"
            className="btn secondary btn-sm"
            onClick={() => speakText(active.hint)}
          >
            Listen to hint
          </button>
          <button
            type="button"
            className="btn secondary btn-sm"
            onClick={() => setShowHint((v) => !v)}
          >
            {showHint ? "Hide example sentence" : "Show example sentence"}
          </button>
        </div>

        {showHint ? <p className="part1-anchor-build-hint">{active.hint}</p> : null}

        <div className="part1-anchor-build-record">
          {!speech.listening ? (
            <button type="button" className="btn green" onClick={() => speech.start()}>
              ● Speak this point
            </button>
          ) : (
            <button type="button" className="btn orange" onClick={() => finishAttempt(active)}>
              Stop — next point
            </button>
          )}
          <button
            type="button"
            className="btn secondary btn-sm"
            onClick={() => {
              markStepDone(active, "", ANCHOR_BUILD_PASS_SCORE);
              setShowHint(false);
              if (activeIndex < steps.length - 1) setActiveIndex(activeIndex + 1);
            }}
          >
            I said it — continue
          </button>
        </div>

        {speech.transcript ? (
          <p className="part1-anchor-build-heard">
            <strong>Heard:</strong> {speech.transcript}
          </p>
        ) : null}
        {lastScore !== null ? (
          <p className="part1-anchor-build-score">Overlap: {lastScore}% — paraphrase counts.</p>
        ) : null}
        {activityNote ? <p className="sub">{activityNote}</p> : null}
        {speech.error ? <p className="voice-coach-warn">{speech.error}</p> : null}
      </article>
    </section>
  );
}
