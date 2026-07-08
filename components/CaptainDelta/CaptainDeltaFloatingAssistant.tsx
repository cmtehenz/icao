"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import CaptainDeltaCoachingCard from "@/components/CaptainDelta/CaptainDeltaCoachingCard";
import CaptainStandbyCard from "@/components/aiPresence/CaptainStandbyCard";
import { useAIPresence } from "@/components/aiPresence/AIPresenceProvider";
import { captainStandbyCopy } from "@/lib/aiPresence/conversationPresence";
import { useCaptainDelta } from "@/components/CaptainDelta/CaptainDeltaProvider";

const HOLD_MS = 180;

export default function CaptainDeltaFloatingAssistant() {
  const {
    open,
    setOpen,
    currentMessage,
    avatarState,
    voice,
    voiceStatusLabel,
    pronunciationMicUi,
    pronunciationRecordingActive,
    pttActive,
    pttInterim,
    pttError,
    triggerPrimaryAction,
    triggerSecondaryAction,
    startPtt,
    stopPtt,
  } = useCaptainDelta();

  const pathname = usePathname();
  const inWordMission = pathname?.startsWith("/word-mission") ?? false;

  const presence = useAIPresence();
  const standbyCopy = captainStandbyCopy(presence.phase);

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

  const recording = pttActive || pronunciationRecordingActive;
  const showStandby = open && !currentMessage && !inWordMission;

  return (
    <>
      {open && (!inWordMission || !!currentMessage) && (
        <aside className="cd-panel" aria-label="Captain Delta coaching">
          <button
            type="button"
            className="cd-close"
            onClick={() => setOpen(false)}
            aria-label="Close coaching panel"
          >
            ×
          </button>
          {currentMessage ? (
            <CaptainDeltaCoachingCard
              message={currentMessage}
              voice={voice}
              voiceStatusLabel={voiceStatusLabel}
              recording={recording}
              pronunciationRecorder={pronunciationMicUi}
              pttInterim={pttInterim}
              pttError={pttError}
              onPrimaryAction={triggerPrimaryAction}
              onSecondaryAction={triggerSecondaryAction}
            />
          ) : (
            <CaptainStandbyCard copy={standbyCopy} onDismiss={() => setOpen(false)} />
          )}
        </aside>
      )}

      {pttActive && !open && pttInterim && (
        <div className="cd-ptt-live" aria-live="polite">
          {pttInterim}
        </div>
      )}

      {showStandby && (
        <div className="cd-standby-fab-hint" aria-hidden>
          <span className="cd-standby-pulse" />
        </div>
      )}

      <button
        type="button"
        className={`cd-fab cd-avatar-${avatarState} ${open ? "open" : ""} ${recording ? "recording" : ""} ${presence.hexActive ? "cd-fab-standby" : ""}`}
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
