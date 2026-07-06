"use client";

import type { CaptainDeltaMessage } from "@/lib/captainDelta/types";
import type { PronunciationRecorderUiState } from "@/lib/captainDelta/pronunciationRecorderState";
import { emitPronRecordDebug } from "@/lib/captainDelta/recordRuntimeDebug";
import type { useCaptainDeltaVoice } from "@/hooks/useCaptainDeltaVoice";
import {
  CAPTAIN_VOICE_TEXT_MODE_LABEL,
  isCaptainDeltaVoiceEnabled,
} from "@/lib/captainDelta/voiceConfig";

type Voice = ReturnType<typeof useCaptainDeltaVoice>;

type Props = {
  message: CaptainDeltaMessage;
  voice: Voice;
  voiceStatusLabel?: string | null;
  onPrimaryAction: () => void;
  onSecondaryAction: (actionId: string) => void;
  recording?: boolean;
  pronunciationRecorder?: PronunciationRecorderUiState | null;
  pttInterim?: string;
  pttError?: string | null;
};

export default function CaptainDeltaCoachingCard({
  message,
  voice,
  voiceStatusLabel,
  onPrimaryAction,
  onSecondaryAction,
  recording = false,
  pronunciationRecorder = null,
  pttInterim,
  pttError,
}: Props) {
  const isPlaying = voice.state === "playing" || voice.state === "loading";
  const isPaused = voice.state === "paused";
  const voiceConfigured = isCaptainDeltaVoiceEnabled();
  const statusLine =
    voiceStatusLabel ??
    (voiceConfigured && voice.state === "error" && voice.lastError
      ? CAPTAIN_VOICE_TEXT_MODE_LABEL
      : !voiceConfigured
        ? CAPTAIN_VOICE_TEXT_MODE_LABEL
        : null);

  const captainMicLabel =
    pronunciationRecorder?.primaryLabel ??
    (recording
      ? "● Recording"
      : message.primaryAction.id === "repeat_after_me" ||
          message.primaryAction.id === "try_again"
        ? "🎤 Record"
        : message.primaryAction.label);
  const captainMicDisabled = pronunciationRecorder?.primaryDisabled ?? false;
  const captainMicVisual =
    pronunciationRecorder?.visualState ??
    (recording ? "listening" : "idle");
  const captainMicRecording = captainMicVisual === "listening" || recording;
  const showMicSpinner =
    captainMicVisual === "starting" || captainMicVisual === "assessing";
  const showMicLive = captainMicVisual === "listening";

  return (
    <article className="cd-coach-card">
      <header className="cd-coach-card-head">
        <span className="cd-coach-card-badge">👨‍✈️ Captain Delta</span>
      </header>

      {statusLine && (
        <p className="cd-voice-notice" role="status">
          {statusLine}
        </p>
      )}

      <div className="cd-coach-card-body">
        {message.text.split("\n").map((line) => (
          <p key={`${message.id}-${line}`} className="cd-coach-line">
            {line}
          </p>
        ))}
      </div>

      {recording && pttInterim && (
        <p className="cd-ptt-interim">{pttInterim}</p>
      )}
      {pttError && <p className="cd-ptt-error">{pttError}</p>}

      {voiceConfigured && (
        <div className="cd-voice-controls" aria-label="Voice controls">
          <button
            type="button"
            className="cd-voice-btn"
            onClick={() => {
              if (isPlaying && !isPaused) voice.pause();
              else if (message.speechText) void voice.speak(message.speechText);
              else voice.resume();
            }}
            disabled={voice.state === "loading"}
          >
            {isPaused || voice.state === "idle" ? "▶ Play" : "⏸ Pause"}
          </button>
          <button type="button" className="cd-voice-btn" onClick={() => void voice.replay()}>
            ↺ Replay
          </button>
          <button
            type="button"
            className={`cd-voice-btn ${voice.muted ? "active" : ""}`}
            onClick={voice.toggleMute}
          >
            {voice.muted ? "🔇 Muted" : "🔊 Mute"}
          </button>
        </div>
      )}

      <div className="cd-primary-mic-wrap">
        <button
          type="button"
          className={`cd-primary-mic cd-primary-mic--${captainMicVisual}${captainMicRecording ? " recording" : ""}`}
          data-record-source="captain-card"
          data-mic-state={captainMicVisual}
          aria-pressed={pronunciationRecorder ? pronunciationRecorder.isMicPressed : recording}
          aria-describedby={pronunciationRecorder ? "cd-mic-status-line" : undefined}
          disabled={captainMicDisabled}
          onPointerDown={() =>
            emitPronRecordDebug({ source: "captain-primary", phase: "pointerdown" })
          }
          onMouseDown={() =>
            emitPronRecordDebug({ source: "captain-primary", phase: "mousedown" })
          }
          onClick={() => {
            if (captainMicDisabled) return;
            emitPronRecordDebug({ source: "captain-primary", phase: "click" });
            onPrimaryAction();
          }}
        >
          {showMicLive && <span className="cd-mic-live" aria-hidden />}
          {showMicSpinner && <span className="cd-mic-spinner" aria-hidden />}
          <span className="cd-mic-label">{captainMicLabel}</span>
        </button>
        {pronunciationRecorder && (
          <p
            id="cd-mic-status-line"
            className={`cd-mic-status-line cd-mic-status-line--${captainMicVisual}`}
          >
            {pronunciationRecorder.micStatusLine}
          </p>
        )}
      </div>

      {message.secondaryActions.length > 0 && (
        <div className="cd-secondary-actions">
          {message.secondaryActions.map((action) => (
            <button
              key={action.id}
              type="button"
              className="cd-secondary-btn"
              onClick={() => onSecondaryAction(action.id)}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
