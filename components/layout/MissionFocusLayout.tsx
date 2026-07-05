"use client";

import { usePathname } from "next/navigation";
import FlightProgressStrip from "@/components/FlightProgressStrip";
import { isMissionFocusHome } from "@/lib/missionFocusRoutes";
import MissionFocusTopBar from "@/components/layout/MissionFocusTopBar";
import AIPresenceIndicator from "@/components/aiPresence/AIPresenceIndicator";

/** Focused mission shell — top bar + progress strip + page content. No business logic. */
export default function MissionFocusLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = isMissionFocusHome(pathname);

  return (
    <div className="mission-focus-layout">
      <MissionFocusTopBar showFlightCta={!isHome} />
      <div className="mission-focus-presence wrap">
        {!isHome && <AIPresenceIndicator />}
      </div>
      <div className={`mission-focus-strip wrap ${isHome ? "mission-focus-strip-home" : ""}`}>
        <FlightProgressStrip embedded={isHome} compact={!isHome} />
      </div>
      <main className="mission-focus-main">{children}</main>
    </div>
  );
}
