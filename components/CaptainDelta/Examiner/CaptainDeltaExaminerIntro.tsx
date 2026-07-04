"use client";

import { useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useCaptainDeltaExaminer } from "@/components/CaptainDelta/Examiner/CaptainDeltaExaminerProvider";
import { emitCaptainDeltaSuggestion } from "@/lib/captainDelta/events";
import { roleSwitchScript } from "@/lib/captainDelta/examiner/prompts";
import { toSpeechText } from "@/lib/captainDelta/voiceText";
import { modeLabel } from "@/lib/simulado/buildSteps";
import type { SimulationMode, SimuladoPart } from "@/lib/simulado/types";

type Props = {
  mode: SimulationMode;
  customParts?: SimuladoPart[];
  examVersion: string;
  onStart: () => void;
  onBack: () => void;
};

export default function CaptainDeltaExaminerIntro({
  mode,
  customParts,
  examVersion,
  onStart,
  onBack,
}: Props) {
  const { user } = useAuth();
  const examiner = useCaptainDeltaExaminer();
  const firstName = user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "pilot";

  const handleStart = useCallback(() => {
    examiner?.enterExaminerMode();
    const script = roleSwitchScript(firstName);
    emitCaptainDeltaSuggestion({
      text: script,
      speechText: toSpeechText(script),
      kind: "briefing",
      primaryAction: { id: "start_exam", label: "🎤 Start Exam", primary: true },
      secondaryActions: [],
    });
    onStart();
  }, [examiner, firstName, onStart]);

  return (
    <section className="cde-intro" aria-label="Examiner mode briefing">
      <span className="cde-intro-badge">👨‍✈️ Captain Delta · Examiner Mode</span>
      <h2>{firstName}, mock exam briefing</h2>
      <p className="cde-intro-mode">
        {modeLabel(mode, customParts)} · Prova {examVersion}
      </p>

      <blockquote className="cde-intro-script">
        {roleSwitchScript(firstName)}
      </blockquote>

      <ul className="cde-intro-rules">
        <li>No hints during the exam</li>
        <li>No corrections during the exam</li>
        <li>Neutral examiner language only</li>
        <li>Full debrief after the exam</li>
      </ul>

      <p className="cde-intro-question">Do you have any questions before we begin?</p>

      <div className="cde-intro-actions">
        <button type="button" className="btn purple btn-large" onClick={handleStart}>
          🎤 Start Exam
        </button>
        <button type="button" className="btn secondary" onClick={onBack}>
          ← Back
        </button>
      </div>
    </section>
  );
}
