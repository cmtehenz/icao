"use client";

import { useCaptainDeltaVisual } from "@/components/CaptainDelta/Visual/CaptainDeltaVisualProvider";

export default function CaptainDeltaVisualMission() {
  const visual = useCaptainDeltaVisual();
  const terms = visual?.missionTerms;

  if (!terms?.length) return null;

  return (
    <div className="cdv-mission" aria-live="polite">
      <span className="cdv-mission-label">Today&apos;s Mission</span>
      <ul className="cdv-mission-terms">
        {terms.map((term) => (
          <li key={term}>{term}</li>
        ))}
      </ul>
    </div>
  );
}
