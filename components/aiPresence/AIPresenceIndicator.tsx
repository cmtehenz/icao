"use client";

import { useAIPresence } from "@/components/aiPresence/AIPresenceProvider";

export default function AIPresenceIndicator() {
  const presence = useAIPresence();
  const isExaminer = presence.actor === "examiner";

  return (
    <div
      className={`ai-presence-indicator ${isExaminer ? "ai-presence-examiner" : "ai-presence-captain"}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="ai-presence-icon" aria-hidden>
        {isExaminer ? "🎙" : "🟣"}
      </span>
      <span className="ai-presence-copy">
        <strong>{isExaminer ? "ICAO Examiner" : "Captain Delta"}</strong>
        <span>{presence.statusLine}</span>
        {presence.subLine && <small>{presence.subLine}</small>}
      </span>
    </div>
  );
}
