"use client";

import type { CaptainDeltaMessage } from "@/lib/captainDelta/types";
import type { useCaptainDeltaVoice } from "@/hooks/useCaptainDeltaVoice";

type Voice = ReturnType<typeof useCaptainDeltaVoice>;

type Props = {
  message: CaptainDeltaMessage;
  voice: Voice;
  onPrimaryAction: () => void;
  onSecondaryAction: (actionId: string) => void;
  recording?: boolean;
};

export default function CaptainDeltaCoachingCard({
  message,
  voice,
  onPrimaryAction,
  onSecondaryAction,
  recording = false,
}: Props) {
  const isPlaying = voice.state === "playing" || voice.state === "loading";
  const isPaused = voice.state === "paused";

  return (
    <article className="cd-coach-card">
      <header className="cd-coach-card-head">
        <span className="cd-coach-card-badge">👨‍✈️ Captain Delta</span>
      </header>

      <div className="cd-coach-card-body">
        {message.text.split("\n").map((line) => (
          <p key={`${message.id}-${line}`} className="cd-coach-line">
            {line}
          </p>
        ))}
        {message.missionExpression && (
          <p className="cd-coach-mission-expr">{message.missionExpression}</p>
        )}
      </div>

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

      <button
        type="button"
        className={`cd-primary-mic ${recording ? "recording" : ""}`}
        onClick={onPrimaryAction}
      >
        {recording ? "⏹ Stop" : message.primaryAction.label}
      </button>

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
