"use client";

import { useRef } from "react";
import { useCaptainDelta } from "@/components/CaptainDelta/CaptainDeltaProvider";

const HOLD_MS = 450;

export default function CaptainDeltaFloatingAssistant() {
  const {
    open,
    setOpen,
    contextLabel,
    currentMessage,
    messages,
    voice,
    listening,
    startHoldToTalk,
    stopHoldToTalk,
    playBriefing,
  } = useCaptainDelta();

  const holdTimerRef = useRef<number | null>(null);
  const didHoldRef = useRef(false);

  const isPlaying = voice.state === "playing" || voice.state === "loading";
  const isPaused = voice.state === "paused";

  const clearHoldTimer = () => {
    if (holdTimerRef.current != null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    didHoldRef.current = false;
    clearHoldTimer();
    holdTimerRef.current = window.setTimeout(() => {
      didHoldRef.current = true;
      startHoldToTalk();
    }, HOLD_MS);
  };

  const onPointerUp = () => {
    clearHoldTimer();
    if (didHoldRef.current) {
      stopHoldToTalk();
      didHoldRef.current = false;
      return;
    }
    setOpen((o) => !o);
  };

  return (
    <>
      {open && (
        <aside className="cd-panel" aria-label="Captain Delta">
          <header className="cd-panel-head">
            <div>
              <strong>Captain Delta</strong>
              <span className="cd-context">{contextLabel}</span>
            </div>
            <button type="button" className="cd-close" onClick={() => setOpen(false)} aria-label="Close">
              ×
            </button>
          </header>

          {currentMessage && (
            <div className="cd-message cd-message-current">
              <p className="cd-message-text">{currentMessage.text}</p>
              <div className="cd-voice-controls">
                <button
                  type="button"
                  className="cd-voice-btn"
                  onClick={() => {
                    if (isPlaying && !isPaused) voice.pause();
                    else if (currentMessage.speechText) void voice.speak(currentMessage.speechText);
                    else voice.resume();
                  }}
                  disabled={voice.state === "loading"}
                  title={isPaused || voice.state === "idle" ? "Play" : "Pause"}
                >
                  {isPaused || voice.state === "idle" ? "▶ Play" : "⏸ Pause"}
                </button>
                <button
                  type="button"
                  className="cd-voice-btn"
                  onClick={() => void voice.replay()}
                  title="Replay"
                >
                  ↺ Replay
                </button>
                <button
                  type="button"
                  className={`cd-voice-btn ${voice.muted ? "active" : ""}`}
                  onClick={voice.toggleMute}
                  title="Mute"
                >
                  {voice.muted ? "Muted" : "Sound"}
                </button>
              </div>
            </div>
          )}

          <p className="cd-hint">Hold the button to ask Captain Delta a question.</p>

          {messages.length > 1 && (
            <ul className="cd-history">
              {messages.slice(1, 5).map((m) => (
                <li key={m.id}>
                  <span className="cd-history-kind">{m.kind}</span>
                  <span>{m.text.split("\n")[0]}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="cd-panel-actions">
            <button type="button" className="btn secondary btn-sm" onClick={playBriefing}>
              Today&apos;s briefing
            </button>
          </div>
        </aside>
      )}

      <button
        type="button"
        className={`cd-fab ${open ? "open" : ""} ${listening ? "listening" : ""}`}
        aria-label="Captain Delta"
        title="Tap to open · Hold to speak"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={() => {
          clearHoldTimer();
          if (listening) stopHoldToTalk();
        }}
        onPointerCancel={() => {
          clearHoldTimer();
          if (listening) stopHoldToTalk();
        }}
      >
        <span className="cd-fab-avatar" aria-hidden>
          👨‍✈️
        </span>
        <span className="cd-fab-label">Captain Delta</span>
        {listening && <span className="cd-fab-pulse" aria-hidden />}
      </button>
    </>
  );
}
