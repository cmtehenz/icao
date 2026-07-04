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
  const [speaking, setSpeaking] = useState(false);
  const [ready, setReady] = useState(false);

  const markDone = useCallback(() => {
    setReady(true);
    onDone?.();
  }, [onDone]);

  const play = useCallback(async () => {
    setSpeaking(true);
    try {
      await speakText(text, "female_examiner");
    } catch {
      /* TTS failed — user can still continue */
    } finally {
      setSpeaking(false);
      markDone();
    }
  }, [text, markDone]);

  useEffect(() => {
    spokeRef.current = false;
    setReady(false);
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
            {speaking
              ? "Examinadora falando…"
              : ready
                ? "Pronto — toque Próximo ou grave sua resposta."
                : "Aguarde o áudio da examinadora…"}
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
      <div className="sim-examiner-actions">
        <button
          type="button"
          className="btn green btn-sm"
          onClick={() => {
            stopSpeech();
            markDone();
          }}
        >
          Continuar →
        </button>
        <button
          type="button"
          className="btn secondary btn-sm"
          onClick={() => {
            stopSpeech();
            spokeRef.current = true;
            void play();
          }}
        >
          Repetir áudio
        </button>
      </div>
    </div>
  );
}
