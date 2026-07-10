"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { buildPart1MasterySummary } from "@/lib/part1Mastery/summary";
import { PART1_COACH_HISTORY_EVENT } from "@/lib/part1CoachHistory";
import { PEEL_BLOCK_HISTORY_EVENT } from "@/lib/peelBlockHistory";

/** 12-question SDEA mastery tracker — exam-ready = all PEEL blocks + coach pass. */
export default function Part1MasteryBanner() {
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    window.addEventListener(PART1_COACH_HISTORY_EVENT, refresh);
    window.addEventListener(PEEL_BLOCK_HISTORY_EVENT, refresh);
    return () => {
      window.removeEventListener(PART1_COACH_HISTORY_EVENT, refresh);
      window.removeEventListener(PEEL_BLOCK_HISTORY_EVENT, refresh);
    };
  }, [refresh]);

  const summary = useMemo(() => {
    void tick;
    return buildPart1MasterySummary();
  }, [tick]);

  return (
    <section className="part1-mastery-banner" aria-label="Part 1 exam mastery">
      <p className="part1-mastery-kicker">Part 1 mastery · 12 exam questions</p>
      <p className="part1-mastery-count">
        <strong>{summary.examReady}</strong>/{summary.total} exam ready
      </p>
      <p className="part1-mastery-method sub">
        Method: Brief → Memory anchors → Build anchors → Connect story → Solo coach. Retrieval,
        not memorization.
      </p>
    </section>
  );
}
