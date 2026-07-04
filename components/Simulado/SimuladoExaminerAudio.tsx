"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { speakText, stopSpeech } from "@/services/azureSpeech";

type Props = {
  text: string;
  onDone?: () => void;
  autoPlay?: boolean;
};

export default function SimuladoExaminerAudio({ text, onDone, autoPlay = true }: Props) {
  const spokeRef = useRef(false);
  const [speaking, setSpeaking] = useState(autoPlay);

  const play = useCallback(async () => {
    setSpeaking(true);
    try {
      await speakText(text, "female_examiner");
      onDone?.();
    } finally {
      setSpeaking(false);
    }
  }, [text, onDone]);

  useEffect(() => {
    spokeRef.current = false;
    stopSpeech();
    setSpeaking(false);
  }, [text]);

  useEffect(() => {
    if (!autoPlay || spokeRef.current) return;
    spokeRef.current = true;
    void play();
  }, [autoPlay, play]);

  return (
    <div className="sim-examiner-audio" aria-live="polite">
      <div className="sim-examiner-bubble sim-examiner-audio-only">
        <span className="sim-examiner-avatar" aria-hidden>
          👩‍✈️
        </span>
        <div className="sim-examiner-audio-body">
          <p className="sim-examiner-status">
            {speaking ? "Examinadora falando…" : "Pronto — responda quando quiser."}
          </p>
          {speaking && (
            <div className="sim-examiner-wave" aria-hidden>
              <span />
              <span />
              <span />
            </div>
          )}
          <span className="sr-only">{text}</span>
        </div>
      </div>
      <button
        type="button"
        className="btn secondary btn-sm"
        onClick={() => {
          stopSpeech();
          void play();
        }}
      >
        Repetir áudio
      </button>
    </div>
  );
}
