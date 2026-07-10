"use client";

import AcademyHomeWidgets from "@/components/home/AcademyHomeWidgets";
import CaptainBriefing from "@/components/home/CaptainBriefing";
import HomeTrainingInsights from "@/components/home/HomeTrainingInsights";
import MissionCTA from "@/components/home/MissionCTA";
import SecondaryTrainingStrip from "@/components/home/SecondaryTrainingStrip";

/** Home composition only — no business logic (ADR-010). Flight progress strip lives in MissionFocusLayout. */
export default function HomePage() {
  return (
    <div className="wrap home-flight-deck">
      <section className="home-flight-primary" aria-label="Flight briefing and departure">
        <CaptainBriefing />
        <MissionCTA />
      </section>

      <SecondaryTrainingStrip />

      <details className="home-flight-records">
        <summary>Records &amp; insights</summary>
        <HomeTrainingInsights />
        <AcademyHomeWidgets />
      </details>
    </div>
  );
}
