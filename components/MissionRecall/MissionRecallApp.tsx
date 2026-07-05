"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRecallSpeech } from "@/hooks/useRecallSpeech";
import { emitMissionRecallStart } from "@/lib/missionRecall/events";
import {
  getCurrentRecallItem,
  getMissionRecallItems,
  getRecallAnswer,
  markRecallItemAnswered,
  missionRecallProgress,
} from "@/lib/missionRecall/missionRecallProgress";
import {
  recallConfidenceLabel,
  recallConfidenceStars,
  shortRecallFeedback,
} from "@/lib/missionRecall/missionRecallScoring";
import type { MissionRecallItem } from "@/lib/missionRecall/missionRecallTypes";

const STAGE_LABEL: Record<MissionRecallItem["stage"], string> = {
  pronunciation: "Pronunciation Recall",
  vocabulary: "Vocabulary Recall",
  part1: "Part 1 Recall",
  part2: "Part 2 Recall",
  surprise: "Surprise Question",
};

export default function MissionRecallApp() {
  const [tick, setTick] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [lastTranscript, setLastTranscript] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const speech = useRecallSpeech();

  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    if (!started) {
      setStarted(true);
      emitMissionRecallStart();
    }
  }, [started]);

  const items = useMemo(() => getMissionRecallItems(), [tick]);
  const current = useMemo(() => getCurrentRecallItem(), [tick]);
  const progress = useMemo(() => missionRecallProgress(), [tick]);

  useEffect(() => {
    setLastTranscript(null);
  }, [current?.id]);

  const finishItem = (options?: { transcript?: string; method?: "speech" | "manual" }) => {
    if (!current) return;
    setFeedback(shortRecallFeedback());
    markRecallItemAnswered(current.id, options);
    setLastTranscript(options?.transcript ?? null);
    refresh();
    window.setTimeout(() => setFeedback(null), 1200);
  };

  const handleManualAnswered = () => finishItem({ method: "manual" });

  const handleRecordToggle = async () => {
    if (speech.transcribing) return;
    if (speech.recording) {
      const transcript = await speech.stopRecording();
      if (transcript) {
        finishItem({ transcript, method: "speech" });
      }
      return;
    }
    setLastTranscript(null);
    await speech.startRecording();
  };

  const savedTranscript = current ? getRecallAnswer(current.id) : undefined;

  if (progress.complete) {
    return (
      <div className="wrap mission-recall-page">
        <header className="mission-recall-head">
          <h1>Mission Recall</h1>
          <p className="sub">Recall confidence</p>
        </header>
        <section className="mission-recall-complete" aria-label="Recall confidence">
          <p className="mission-recall-stars" aria-hidden>
            {recallConfidenceStars(progress)}
          </p>
          <p>{recallConfidenceLabel(progress.confidenceStars)}</p>
          <Link href="/" className="btn purple">
            Back to Home
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="wrap mission-recall-page">
      <header className="mission-recall-head">
        <h1>Mission Recall</h1>
        <p className="sub">
          {progress.done}/{progress.total} · fast pace · answer from memory
        </p>
      </header>

      {current ? (
        <article className="mission-recall-card">
          <span className="mission-recall-stage">{STAGE_LABEL[current.stage]}</span>
          <p className="mission-recall-prompt">{current.prompt}</p>
          {feedback && <p className="mission-recall-feedback">Captain Delta: {feedback}</p>}
          {(lastTranscript || savedTranscript) && (
            <p className="mission-recall-transcript sub">
              Your answer: {lastTranscript ?? savedTranscript}
            </p>
          )}
          <div className="mission-recall-actions">
            {speech.supported && (
              <button
                type="button"
                className={`btn ${speech.recording ? "secondary" : "purple"}`}
                onClick={() => void handleRecordToggle()}
                disabled={speech.transcribing}
              >
                {speech.transcribing
                  ? "Transcribing…"
                  : speech.recording
                    ? "Stop & save"
                    : "Record answer"}
              </button>
            )}
            <button type="button" className="btn secondary" onClick={handleManualAnswered}>
              Mark as answered
            </button>
          </div>
          {speech.error && <p className="mission-recall-error">{speech.error}</p>}
          <p className="mission-recall-hint sub">
            Speak your answer when possible. No model answers — recall only.
          </p>
        </article>
      ) : (
        <p>No recall items for today.</p>
      )}

      <details className="mission-recall-outline">
        <summary>Today&apos;s recall outline ({items.length})</summary>
        <ol>
          {items.map((item) => (
            <li key={item.id}>{STAGE_LABEL[item.stage]}</li>
          ))}
        </ol>
      </details>
    </div>
  );
}
