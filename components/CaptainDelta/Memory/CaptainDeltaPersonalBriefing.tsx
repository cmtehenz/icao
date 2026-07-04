"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { buildPersonalBriefing, briefingToSpeech } from "@/lib/captainDelta/memory/briefing";
import { emitCaptainDeltaSuggestion } from "@/lib/captainDelta/events";
import { getNextMissionAction } from "@/lib/dailyMission";

export default function CaptainDeltaPersonalBriefing() {
  const { user } = useAuth();
  const [spoken, setSpoken] = useState(false);
  const firstName = user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "piloto";
  const briefing = useMemo(() => buildPersonalBriefing(firstName), [firstName]);
  const next = getNextMissionAction();

  const hearBriefing = useCallback(() => {
    setSpoken(true);
    emitCaptainDeltaSuggestion({
      text: [
        briefing.greeting,
        `Exam in ${briefing.examDays} days.`,
        briefing.yesterdayLine,
        briefing.improvementNote,
        briefing.aviationPersonal,
        `Focus: ${briefing.focusItems.join(", ")}.`,
        briefing.reminder,
      ]
        .filter(Boolean)
        .join("\n"),
      speechText: briefingToSpeech(briefing),
      kind: "briefing",
      primaryAction: {
        id: "ready",
        label: "🎤 Start Training",
        primary: true,
      },
      secondaryActions: [],
    });
  }, [briefing]);

  if (!user) return null;

  return (
    <section className="cdm-briefing" aria-label="Captain Delta personal briefing">
      <header className="cdm-briefing-head">
        <span className="cdm-briefing-badge">👨‍✈️ Captain Delta</span>
        <h2>{briefing.greeting}</h2>
      </header>

      <p className="cdm-briefing-exam">
        Your ICAO exam is in <strong>{briefing.examDays} days</strong>.
      </p>

      {briefing.yesterdayLine ? <p className="cdm-briefing-yesterday">{briefing.yesterdayLine}</p> : null}
      {briefing.improvementNote ? (
        <p className="cdm-briefing-improve">{briefing.improvementNote}</p>
      ) : null}
      {briefing.aviationPersonal ? (
        <p className="cdm-briefing-aviation">{briefing.aviationPersonal}</p>
      ) : null}

      <div className="cdm-briefing-focus">
        <span className="cdm-briefing-focus-label">Today we&apos;ll focus on</span>
        <ul>
          {briefing.focusItems.map((item) => (
            <li key={item}>✔ {item}</li>
          ))}
        </ul>
      </div>

      <div className="cdm-briefing-mission">
        <strong>{briefing.mission.title}</strong>
        <ul>
          {briefing.mission.expressions.map((expr) => (
            <li key={expr}>• {expr}</li>
          ))}
        </ul>
        <p className="cdm-briefing-challenge">{briefing.mission.challenge}</p>
      </div>

      {briefing.reminder ? <p className="cdm-briefing-reminder">{briefing.reminder}</p> : null}

      <p className="cdm-briefing-time">
        Estimated training: <strong>{briefing.estimatedMinutes} minutes</strong>
      </p>

      <div className="cdm-briefing-actions">
        <Link href={next?.href ?? "/part1"} className="btn purple btn-large">
          🎤 Start Training
        </Link>
        <button type="button" className="btn secondary" onClick={hearBriefing} disabled={spoken}>
          {spoken ? "Captain is speaking…" : "🔊 Hear briefing"}
        </button>
      </div>
    </section>
  );
}
