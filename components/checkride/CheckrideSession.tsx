"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { emitCaptainDeltaSuggestion } from "@/lib/captainDelta/events";
import { CHECKRIDE_STEPS, checkrideProgressLabel } from "@/lib/trainingProfile/checkride";
import {
  completeCheckride,
  skipCheckrideToFoundation,
} from "@/lib/trainingProfile/store";
import { phaseBrief, phaseLabel, type CheckrideProbeResult } from "@/lib/trainingProfile/types";

type RecPhase = "idle" | "recording" | "assessing" | "done" | "error";

async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary);
}

export default function CheckrideSession() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<RecPhase>("idle");
  const [notice, setNotice] = useState<string | null>(null);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [resultPhase, setResultPhase] = useState<string | null>(null);
  const [resultBrief, setResultBrief] = useState<string | null>(null);
  const probesRef = useRef<CheckrideProbeResult[]>([]);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const step = CHECKRIDE_STEPS[stepIndex];
  const total = CHECKRIDE_STEPS.length;

  useEffect(() => {
    emitCaptainDeltaSuggestion({
      text: "Checkride — speak clearly. I am measuring pronunciation, rhythm, and how you handle a short operational answer. Ready when you are.",
      speechText:
        "Checkride. Speak clearly. I am measuring pronunciation, rhythm, and a short operational answer. Ready when you are.",
      kind: "briefing",
      primaryAction: { id: "ready", label: "🎤 Ready", primary: true },
      secondaryActions: [],
      eventId: "checkride:intro",
      source: "checkride",
    });
  }, []);

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    mediaRef.current = null;
  }, []);

  useEffect(() => () => cleanupStream(), [cleanupStream]);

  const advance = useCallback(
    (probe: CheckrideProbeResult) => {
      probesRef.current = [...probesRef.current.filter((p) => p.id !== probe.id), probe];
      const next = stepIndex + 1;
      if (next >= total) {
        const profile = completeCheckride(probesRef.current);
        setResultPhase(phaseLabel(profile.phase));
        setResultBrief(phaseBrief(profile.phase));
        setFinished(true);
        emitCaptainDeltaSuggestion({
          text: `Checkride complete. Your training phase is ${phaseLabel(profile.phase)}. ${phaseBrief(profile.phase)}`,
          speechText: `Checkride complete. Your phase is ${phaseLabel(profile.phase)}. ${phaseBrief(profile.phase)}`,
          kind: "debrief",
          primaryAction: { id: "ready", label: "Ready — Begin Flight", primary: true },
          secondaryActions: [],
          eventId: "checkride:complete",
          source: "checkride",
        });
        return;
      }
      setStepIndex(next);
      setPhase("idle");
      setLastScore(null);
      setNotice(null);
      const nextStep = CHECKRIDE_STEPS[next]!;
      emitCaptainDeltaSuggestion({
        text: `${nextStep.prompt}\n\n${nextStep.kind === "oral" ? nextStep.prompt : nextStep.reference}`,
        speechText:
          nextStep.kind === "oral"
            ? nextStep.prompt
            : `${nextStep.prompt} ${nextStep.reference}`,
        kind: "coaching",
        primaryAction: { id: "repeat_after_me", label: "🎤 Record", primary: true },
        secondaryActions: [],
        eventId: `checkride:${nextStep.id}`,
        source: "checkride",
      });
    },
    [stepIndex, total],
  );

  const startRecording = async () => {
    setNotice(null);
    setLastScore(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRef.current = recorder;
      recorder.start();
      setPhase("recording");
    } catch {
      setPhase("error");
      setNotice("Microphone permission needed. Allow the mic and try again.");
    }
  };

  const stopAndAssess = async () => {
    const recorder = mediaRef.current;
    const current = step;
    if (!recorder || !current || recorder.state === "inactive") return;

    setPhase("assessing");
    await new Promise<void>((resolve) => {
      recorder.onstop = () => resolve();
      recorder.stop();
    });
    cleanupStream();

    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    if (blob.size < 500) {
      setPhase("error");
      setNotice("Recording too short — try again.");
      return;
    }

    try {
      const audioBase64 = await blobToBase64(blob);
      const res = await fetch("/api/pronunciation-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioBase64,
          referenceText: current.reference,
        }),
      });

      if (!res.ok) {
        // Still count as attempt so checkride can finish without Azure
        advance({
          id: current.id,
          kind: current.kind,
          reference: current.reference,
          accuracyScore: current.kind === "oral" ? 60 : null,
          fluencyScore: null,
          attempted: true,
        });
        setNotice("Assessment unavailable — attempt saved. Continuing.");
        return;
      }

      const data = (await res.json()) as {
        accuracyScore?: number;
        fluencyScore?: number;
      };
      const accuracy = typeof data.accuracyScore === "number" ? data.accuracyScore : null;
      const fluency = typeof data.fluencyScore === "number" ? data.fluencyScore : null;
      setLastScore(accuracy);
      setPhase("done");
      window.setTimeout(() => {
        advance({
          id: current.id,
          kind: current.kind,
          reference: current.reference,
          accuracyScore: accuracy ?? (current.kind === "oral" ? 60 : 50),
          fluencyScore: fluency,
          attempted: true,
        });
      }, 700);
    } catch {
      advance({
        id: current.id,
        kind: current.kind,
        reference: current.reference,
        accuracyScore: 50,
        fluencyScore: null,
        attempted: true,
      });
    }
  };

  const onSkip = () => {
    const profile = skipCheckrideToFoundation();
    setResultPhase(phaseLabel(profile.phase));
    setResultBrief(phaseBrief(profile.phase));
    setFinished(true);
    emitCaptainDeltaSuggestion({
      text: "Understood. We start in Foundation — clear speech first, then build up. Ready when you are.",
      speechText:
        "Understood. We start in Foundation. Clear speech first, then build up. Ready when you are.",
      kind: "briefing",
      primaryAction: { id: "ready", label: "Ready — Begin Flight", primary: true },
      secondaryActions: [],
      eventId: "checkride:skipped",
      source: "checkride",
    });
  };

  if (finished) {
    return (
      <section className="checkride-panel checkride-result academy-surface" aria-live="polite">
        <p className="checkride-badge">Captain Delta · Checkride</p>
        <h1>Your training phase</h1>
        <p className="checkride-phase">{resultPhase}</p>
        <p className="sub">{resultBrief}</p>
        <button
          type="button"
          className="btn academy-primary btn-large"
          onClick={() => router.push("/")}
        >
          Ready — Begin Flight
        </button>
      </section>
    );
  }

  if (!step) return null;

  return (
    <section className="checkride-panel academy-surface" aria-label="Speaking checkride">
      <header className="checkride-head">
        <p className="checkride-badge">Captain Delta · Checkride</p>
        <p className="checkride-progress">{checkrideProgressLabel(stepIndex, total)}</p>
        <div className="checkride-meter" aria-hidden>
          <span style={{ width: `${((stepIndex + 1) / total) * 100}%` }} />
        </div>
      </header>

      <div className="checkride-body">
        <p className="checkride-kind">
          {step.kind === "word" && "Word clarity"}
          {step.kind === "readback" && "Readback"}
          {step.kind === "oral" && "Operational answer"}
        </p>
        <p className="checkride-prompt">{step.prompt}</p>
        {step.kind !== "oral" ? (
          <p className="checkride-target">{step.reference}</p>
        ) : (
          <p className="checkride-oral-hint">Speak naturally — one or two clear sentences.</p>
        )}

        {lastScore != null && (
          <p className="checkride-score" role="status">
            Clarity ~{Math.round(lastScore)}%
          </p>
        )}
        {notice && (
          <p className="checkride-notice" role="alert">
            {notice}
          </p>
        )}
      </div>

      <footer className="checkride-actions">
        {phase === "recording" ? (
          <button type="button" className="btn academy-danger btn-large" onClick={() => void stopAndAssess()}>
            Stop &amp; assess
          </button>
        ) : (
          <button
            type="button"
            className="btn academy-primary btn-large"
            onClick={() => void startRecording()}
            disabled={phase === "assessing"}
          >
            {phase === "assessing" ? "Assessing…" : "Record"}
          </button>
        )}
        <button type="button" className="btn secondary" onClick={onSkip}>
          Skip — start Foundation
        </button>
      </footer>
    </section>
  );
}
