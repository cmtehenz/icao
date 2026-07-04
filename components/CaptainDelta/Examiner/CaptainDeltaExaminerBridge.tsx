"use client";

import { useEffect, useRef } from "react";
import { emitCaptainDeltaSuggestion } from "@/lib/captainDelta/events";
import { CAPTAIN_DELTA_EXAM_STEP, CAPTAIN_DELTA_EXAM_FINISHED } from "@/lib/captainDelta/examiner/events";
import { partTransitionScript } from "@/lib/captainDelta/examiner/prompts";
import type { SimuladoPart, SimuladoStep } from "@/lib/simulado/types";
import { toSpeechText } from "@/lib/captainDelta/voiceText";

/** Speaks neutral part transitions during examiner mode — no coaching. */
export default function CaptainDeltaExaminerBridge() {
  const lastPartRef = useRef<SimuladoPart | null>(null);

  useEffect(() => {
    const onStep = (e: Event) => {
      const detail = (e as CustomEvent<{ step: SimuladoStep; examinerMode: boolean }>).detail;
      if (!detail?.examinerMode) return;

      const { step } = detail;
      if (step.kind === "instruction" && step.part !== lastPartRef.current) {
        lastPartRef.current = step.part;
        const text = partTransitionScript(step.part);
        emitCaptainDeltaSuggestion({
          text,
          speechText: toSpeechText(text),
          kind: "briefing",
          primaryAction: { id: "ready", label: "Continue", primary: true },
          secondaryActions: [],
        });
      }
    };

    window.addEventListener(CAPTAIN_DELTA_EXAM_STEP, onStep);
    return () => window.removeEventListener(CAPTAIN_DELTA_EXAM_STEP, onStep);
  }, []);

  useEffect(() => {
    const onFinished = () => {
      lastPartRef.current = null;
    };
    window.addEventListener(CAPTAIN_DELTA_EXAM_FINISHED, onFinished);
    return () => window.removeEventListener(CAPTAIN_DELTA_EXAM_FINISHED, onFinished);
  }, []);

  return null;
}
