"use client";

import { useCallback, useEffect, useState } from "react";
import {
  buildWeeklyFlightDebrief,
  markWeeklyDebriefShown,
  shouldShowWeeklyDebrief,
} from "@/lib/captainDelta/memory/weeklyDebrief";
import { CAPTAIN_DELTA_MEMORY_EVENT } from "@/lib/captainDelta/memory/store";

export default function CaptainDeltaWeeklyDebriefPanel() {
  const [open, setOpen] = useState(false);
  const [debrief, setDebrief] = useState(() => buildWeeklyFlightDebrief());

  const refresh = useCallback(() => {
    setDebrief(buildWeeklyFlightDebrief());
    if (shouldShowWeeklyDebrief()) setOpen(true);
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(CAPTAIN_DELTA_MEMORY_EVENT, refresh);
    return () => window.removeEventListener(CAPTAIN_DELTA_MEMORY_EVENT, refresh);
  }, [refresh]);

  if (!open) return null;

  return (
    <section className="cdm-weekly-debrief" aria-label="Weekly flight debrief">
      <header>
        <span className="cdm-debrief-icon">✈</span>
        <h2>Weekly Flight Debrief</h2>
        <button
          type="button"
          className="cdm-debrief-close"
          onClick={() => {
            markWeeklyDebriefShown();
            setOpen(false);
          }}
          aria-label="Close debrief"
        >
          ×
        </button>
      </header>

      <div className="cdm-debrief-grid">
        <div>
          <strong>{debrief.questionsAnswered}</strong>
          <span>questions answered</span>
        </div>
        <div>
          <strong>{debrief.speakingMinutes} min</strong>
          <span>speaking time</span>
        </div>
        <div>
          <strong>{debrief.mostImproved}</strong>
          <span>most improved</span>
        </div>
        <div>
          <strong>{debrief.needsAttention}</strong>
          <span>needs attention</span>
        </div>
      </div>

      {debrief.bestAnswer ? (
        <p className="cdm-debrief-best">
          Best answer: <strong>{debrief.bestAnswer.label}</strong> ({debrief.bestAnswer.score}/100)
        </p>
      ) : null}

      <p className="cdm-debrief-icao">
        Estimated ICAO {debrief.estimatedIcaoFrom.toFixed(1)} → {debrief.estimatedIcaoTo.toFixed(1)}
        {debrief.confidenceDelta != null && (
          <span> · Confidence {debrief.confidenceDelta > 0 ? "+" : ""}{debrief.confidenceDelta}%</span>
        )}
      </p>

      <div className="cdm-debrief-mission">
        <strong>Mission next week</strong>
        <ul>
          {debrief.missionNextWeek.map((m) => (
            <li key={m}>• {m}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
