"use client";

import { useEffect, useRef, useState } from "react";
import type { ExamAudioItem, FullExamId, ListeningMode } from "@/lib/fullExamListening/types";
import type { FullExamMeta } from "@/lib/fullExamListening/types";
import { toggleDifficultItem, isItemDifficult } from "@/lib/fullExamListening/progress";
import { getExamOfflineStatus } from "@/lib/fullExamListening/offlinePack";
import { useFullExamPlayer } from "@/hooks/useFullExamPlayer";
import { getLastSpeechError, warmSpeechEngine, type SpeechEngine } from "@/utils/speech";

const SPEEDS = [0.75, 1, 1.25] as const;

const MODE_LABELS: Record<ListeningMode, { title: string; desc: string }> = {
  full: { title: "Full Listening", desc: "Examiner + ATC + model answers" },
  question_only: { title: "Question Only", desc: "Pause before model answers" },
  shadowing: { title: "Shadowing", desc: "Repeat after each sentence" },
};

const PART_LABELS: Record<ExamAudioItem["part"], string> = {
  part1: "Part 1 — Aviation Topics",
  part2: "Part 2 — Pilot Interaction",
  part3: "Part 3 — Picture Description",
  part4: "Part 4 — Picture Questions",
};

type Props = {
  exam: FullExamMeta;
  mode: ListeningMode;
  startIndex: number;
  onBack: () => void;
  onModeChange: (mode: ListeningMode) => void;
};

function speakerLabel(item: ExamAudioItem | null): string {
  if (!item) return "";
  if (item.type === "original_audio") return "Original ATC";
  if (item.speaker === "male_candidate") return "Candidato modelo (Guy)";
  if (item.speaker === "female_examiner") return "Examinadora (Jenny)";
  return "Instruction";
}

export default function ExamPlayer({ exam, mode, startIndex, onBack, onModeChange }: Props) {
  const player = useFullExamPlayer({
    examId: exam.id as FullExamId,
    mode,
    startIndex,
  });

  const { stop, ...controls } = player;

  const modeInitialized = useRef(false);

  useEffect(() => {
    if (!modeInitialized.current) {
      modeInitialized.current = true;
      return;
    }
    stop();
  }, [mode, stop]);

  const {
    items,
    currentItem,
    currentIndex,
    status,
    progressPct,
    speed,
    setSpeed,
    showTranscript,
    setShowTranscript,
    playbackError,
    play,
    pause,
    next,
    previous,
    restart,
    revealAndContinue,
  } = controls;

  const isPlaying = status === "playing";
  const isPaused = status === "paused";
  const waitingReveal = status === "waiting_reveal";
  const waitingShadow = status === "waiting_shadow";

  const difficult = currentItem ? isItemDifficult(currentItem.id) : false;
  const [speechEngine, setSpeechEngine] = useState<SpeechEngine>("none");
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [offlineReady, setOfflineReady] = useState(() => getExamOfflineStatus(exam.id).ready);

  useEffect(() => {
    setOfflineReady(getExamOfflineStatus(exam.id).ready);
  }, [exam.id]);

  useEffect(() => {
    void warmSpeechEngine().then((engine) => {
      setSpeechEngine(engine);
      if (engine === "none" && !getExamOfflineStatus(exam.id).ready) {
        setSpeechError(
          "Azure Speech indisponível — baixe a prova para offline (com internet) ou faça login para TTS ao vivo.",
        );
      }
    });
  }, [exam.id]);

  useEffect(() => {
    const err = getLastSpeechError();
    if (err) setSpeechError(err);
  }, [status, currentIndex]);

  return (
    <div className="fel-player">
      <div className="fel-player-top">
        <button type="button" className="btn ghost fel-back-btn" onClick={onBack}>
          ← Provas
        </button>
        <div className="fel-now-playing">
          <span className="fel-now-label">Now playing</span>
          <strong>
            {exam.title}
            {offlineReady && (
              <span className="fel-player-offline-badge" title="Pacote Azure + ATC neste aparelho">
                Offline
              </span>
            )}
          </strong>
          <span className="fel-version">{exam.subtitle}</span>
        </div>
      </div>

      {speechError && (
        <div className="fel-azure-error" role="alert">
          {speechError}
        </div>
      )}

      {playbackError && status === "error" && (
        <div className="fel-azure-error" role="alert">
          {playbackError}
        </div>
      )}

      <div className="fel-mode-tabs" role="tablist" aria-label="Listening mode">
        {(Object.keys(MODE_LABELS) as ListeningMode[]).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            className={`fel-mode-tab ${mode === m ? "active" : ""}`}
            onClick={() => onModeChange(m)}
          >
            <strong>{MODE_LABELS[m].title}</strong>
            <span>{MODE_LABELS[m].desc}</span>
          </button>
        ))}
      </div>

      <div className="fel-visual">
        <div className={`fel-wave ${isPlaying ? "active" : ""}`} aria-hidden>
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.08}s` }} />
          ))}
        </div>
        <p className="fel-part-indicator">
          {currentItem ? PART_LABELS[currentItem.part] : "—"}
        </p>
        <p className="fel-item-label">{currentItem?.label ?? "Ready"}</p>
        <p className="fel-speaker">{speakerLabel(currentItem)}</p>
        {speechEngine === "azure" && (
          <p className="fel-engine-badge">Azure Neural · Jenny (F) · Guy (M)</p>
        )}
      </div>

      <div className="fel-progress-wrap">
        <div className="fel-progress-bar" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
          <div className="fel-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <span className="fel-progress-text">
          {currentIndex + 1} / {items.length} · {progressPct}%
        </span>
      </div>

      {waitingReveal && (
        <div className="fel-reveal-banner">
          <p>Pause — answer out loud, then reveal the model answer.</p>
          <button type="button" className="btn primary" onClick={revealAndContinue}>
            Show model answer
          </button>
        </div>
      )}

      {waitingShadow && (
        <div className="fel-reveal-banner shadow">
          <p>Repeat the sentence aloud…</p>
        </div>
      )}

      <div className="fel-controls">
        <button type="button" className="fel-ctrl" onClick={restart} title="Restart" aria-label="Restart">
          ↺
        </button>
        <button type="button" className="fel-ctrl" onClick={previous} title="Previous" aria-label="Previous">
          ⏮
        </button>
        {isPlaying ? (
          <button type="button" className="fel-ctrl fel-ctrl-main" onClick={pause} aria-label="Pause">
            ⏸
          </button>
        ) : (
          <button
            type="button"
            className="fel-ctrl fel-ctrl-main"
            onClick={play}
            disabled={waitingReveal}
            aria-label="Play"
          >
            ▶
          </button>
        )}
        <button type="button" className="fel-ctrl" onClick={stop} title="Stop" aria-label="Stop">
          ⏹
        </button>
        <button type="button" className="fel-ctrl" onClick={next} title="Next" aria-label="Next">
          ⏭
        </button>
      </div>

      <div className="fel-speed-row">
        <span>Speed</span>
        <div className="fel-speed-btns">
          {SPEEDS.map((s) => (
            <button
              key={s}
              type="button"
              className={`fel-speed-btn ${speed === s ? "active" : ""}`}
              onClick={() => setSpeed(s)}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      <div className="fel-transcript-head">
        <strong>Transcript</strong>
        <button
          type="button"
          className="btn ghost small"
          onClick={() => setShowTranscript((v) => !v)}
        >
          {showTranscript ? "Hide" : "Show"}
        </button>
        {currentItem && (
          <button
            type="button"
            className={`btn ghost small ${difficult ? "fel-difficult-on" : ""}`}
            onClick={() => toggleDifficultItem(currentItem.id)}
          >
            {difficult ? "★ Difficult" : "☆ Mark difficult"}
          </button>
        )}
      </div>

      {showTranscript && (
        <div className="fel-transcript">
          {currentItem?.type === "original_audio" ? (
            <p className="fel-transcript-audio">🔊 Original ATC recording</p>
          ) : (
            <p>{currentItem?.text ?? (isPaused ? "Paused" : "Press play to start the exam simulation.")}</p>
          )}
        </div>
      )}
    </div>
  );
}
