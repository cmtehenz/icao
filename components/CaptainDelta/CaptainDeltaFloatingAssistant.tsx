"use client";

import { useRef } from "react";
import CaptainDeltaCoachingCard from "@/components/CaptainDelta/CaptainDeltaCoachingCard";
import { useCaptainDelta } from "@/components/CaptainDelta/CaptainDeltaProvider";

const HOLD_MS = 220;

export default function CaptainDeltaFloatingAssistant() {
  const {
    open,
    setOpen,
    currentMessage,
    avatarState,
    voice,
    lesson,
    pttActive,
    triggerPrimaryAction,
    triggerSecondaryAction,
    startPtt,
    stopPtt,
    quickQuestion,
  } = useCaptainDelta();

  const holdTimerRef = useRef<number | null>(null);
  const isHoldRef = useRef(false);
  const lastTapRef = useRef(0);

  const clearHoldTimer = () => {
    if (holdTimerRef.current != null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const onFabPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    isHoldRef.current = false;
    clearHoldTimer();
    holdTimerRef.current = window.setTimeout(() => {
      isHoldRef.current = true;
      startPtt();
    }, HOLD_MS);
  };

  const onFabPointerUp = () => {
    clearHoldTimer();
    if (isHoldRef.current) {
      stopPtt();
      isHoldRef.current = false;
      return;
    }

    const now = Date.now();
    if (now - lastTapRef.current < 350) {
      lastTapRef.current = 0;
      quickQuestion();
      return;
    }
    lastTapRef.current = now;
    setOpen(true);
  };

  const recording = pttActive || !!lesson.recording;

  return (
    <>
      {open && currentMessage && (
        <aside className="cd-panel" aria-label="Captain Delta coaching">
          <button
            type="button"
            className="cd-close"
            onClick={() => setOpen(false)}
            aria-label="Close coaching panel"
          >
            ×
          </button>
          <CaptainDeltaCoachingCard
            message={currentMessage}
            voice={voice}
            recording={recording}
            onPrimaryAction={triggerPrimaryAction}
            onSecondaryAction={triggerSecondaryAction}
          />
        </aside>
      )}

      <button
        type="button"
        className={`cd-fab cd-avatar-${avatarState} ${open ? "open" : ""} ${recording ? "recording" : ""}`}
        aria-label="Captain Delta"
        title="Hold: Push-to-Talk · Tap: coaching card · Double-tap: quick question"
        onPointerDown={onFabPointerDown}
        onPointerUp={onFabPointerUp}
        onPointerLeave={() => {
          clearHoldTimer();
          if (isHoldRef.current) {
            stopPtt();
            isHoldRef.current = false;
          }
        }}
        onPointerCancel={() => {
          clearHoldTimer();
          if (isHoldRef.current) {
            stopPtt();
            isHoldRef.current = false;
          }
        }}
      >
        <span className={`cd-fab-avatar cd-avatar-ring-${avatarState}`} aria-hidden>
          👨‍✈️
        </span>
      </button>
    </>
  );
}
