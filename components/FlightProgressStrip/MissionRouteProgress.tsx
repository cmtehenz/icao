"use client";

import FlightProgressStrip from "./FlightProgressStrip";

/** Compact flight progress on mission leg routes — read-only, no Captain copy. */
export default function MissionRouteProgress() {
  return <FlightProgressStrip showCaptainCopy={false} compact />;
}
