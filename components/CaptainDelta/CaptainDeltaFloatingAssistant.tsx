"use client";

import { useRef } from "react";
import CaptainDeltaCoachingCard from "@/components/CaptainDelta/CaptainDeltaCoachingCard";
import { useCaptainDelta } from "@/components/CaptainDelta/CaptainDeltaProvider";

const HOLD_MS = 180;

export default function CaptainDeltaFloatingAssistant() {
  const {
    open,
    setOpen,
    currentMessage,
    avatarState,
    voice,
    lesson,
    pttActive,
    pttInterim,
    pttError,
    triggerPrimaryAction,
    triggerSecondaryAction,
    startPtt,
    stopPtt,
  } = useCaptainDelta();

  const holdTimerRef = useRef<number | null>(null);
  const isHoldRef = useRef(false);

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
      void startPtt();
    }, HOLD_MS);
  };

  const onFabPointerUp = () => {
    clearHoldTimer();
    if (isHoldRef.current || pttActive) {
      isHoldRef.current = false;
      void stopPtt();
      setOpen(true);
      return;
    }
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
            pttInterim={pttInterim}
            pttError={pttError}
            onPrimaryAction={triggerPrimaryAction}
            onSecondaryAction={triggerSecondaryAction}
          />
        </aside>
      )}

      {pttActive && !open && pttInterim && (
        <div className="cd-ptt-live" aria-live="polite">
          {pttInterim}
        </div>
      )}

      <button
        type="button"
        className={`cd-fab cd-avatar-${avatarState} ${open ? "open" : ""} ${recording ? "recording" : ""}`}
        aria-label="Captain Delta — segure para falar"
        title="Segure para falar · Toque para abrir o card"
        onPointerDown={onFabPointerDown}
        onPointerUp={onFabPointerUp}
        onPointerLeave={() => {
          clearHoldTimer();
          if (isHoldRef.current || pttActive) {
            isHoldRef.current = false;
            void stopPtt();
          }
        }}
        onPointerCancel={() => {
          clearHoldTimer();
          if (isHoldRef.current || pttActive) {
            isHoldRef.current = false;
            void stopPtt();
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
