"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { buildFlightDebrief } from "@/lib/flightDebrief/buildFlightDebrief";
import { markFlightDebriefComplete, markFlightDebriefViewed } from "@/lib/flightDebrief/flightDebriefProgress";
import { recallConfidenceStars } from "@/lib/missionRecall/missionRecallScoring";

export default function FlightDebriefApp() {
  useEffect(() => {
    markFlightDebriefViewed();
  }, []);

  const debrief = useMemo(() => buildFlightDebrief(), []);

  const handleComplete = () => {
    markFlightDebriefComplete();
    window.location.href = "/";
  };

  return (
    <div className="wrap flight-debrief-page">
      <header className="flight-debrief-head">
        <p className="cda-hero-label">Captain Delta</p>
        <h1>Flight Debrief</h1>
        <p className="sub">{debrief.examLabel} · {debrief.readinessPercent}% readiness</p>
      </header>

      <section className="flight-debrief-section">
        <h2>Positive opening</h2>
        <p>{debrief.positiveOpening}</p>
      </section>

      <section className="flight-debrief-section">
        <h2>Today&apos;s legs</h2>
        <ul className="flight-debrief-legs">
          {debrief.legs.map((leg) => (
            <li key={leg.id} className={leg.complete ? "done" : ""}>
              <span>{leg.label}</span>
              <span>{leg.complete ? "✓" : "—"}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flight-debrief-section">
        <h2>Mission Recall</h2>
        <p>{debrief.recallResult}</p>
        {debrief.recallConfidenceStars > 0 && (
          <p className="mission-recall-stars" aria-hidden>
            {recallConfidenceStars({
              done: debrief.recallConfidenceStars,
              total: 5,
              complete: true,
              confidenceStars: debrief.recallConfidenceStars,
            })}
          </p>
        )}
      </section>

      <section className="flight-debrief-section">
        <h2>Strongest area</h2>
        <p>{debrief.strongestArea}</p>
      </section>

      <section className="flight-debrief-section">
        <h2>Weakest area</h2>
        <p>{debrief.weakestArea}</p>
      </section>

      <section className="flight-debrief-section flight-debrief-priority">
        <h2>One priority improvement</h2>
        <p>{debrief.priorityImprovement}</p>
      </section>

      {debrief.part1Conversation && (
        <section className="flight-debrief-section flight-debrief-hex">
          <h2>Part 1 conversation</h2>
          <ul className="flight-debrief-hex-metrics">
            <li>
              <span>Conversation quality</span>
              <strong>{debrief.part1Conversation.conversationQuality}%</strong>
            </li>
            <li>
              <span>Follow-up handling</span>
              <strong>{debrief.part1Conversation.followUpHandling}%</strong>
            </li>
            <li>
              <span>Naturalness</span>
              <strong>{debrief.part1Conversation.naturalness}%</strong>
            </li>
            <li>
              <span>Operational reasoning</span>
              <strong>{debrief.part1Conversation.operationalReasoning}%</strong>
            </li>
            <li>
              <span>Confidence</span>
              <strong>{debrief.part1Conversation.confidence}%</strong>
            </li>
          </ul>
        </section>
      )}

      <section className="flight-debrief-section">
        <h2>Next action</h2>
        <p>{debrief.nextAction}</p>
      </section>

      <section className="flight-debrief-section">
        <h2>Tomorrow&apos;s flight</h2>
        <p>{debrief.tomorrowFocus}</p>
      </section>

      <div className="flight-debrief-actions">
        <button type="button" className="btn purple btn-large" onClick={handleComplete}>
          Complete today&apos;s flight
        </button>
        <Link href="/" className="btn secondary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
