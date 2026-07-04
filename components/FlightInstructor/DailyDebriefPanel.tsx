"use client";

import { useMemo } from "react";
import { buildLocalDailyDebrief } from "@/lib/flightInstructor/dailyDebrief";
import { INSTRUCTOR_MEMORY_EVENT } from "@/lib/flightInstructor/memory";
import { useCallback, useEffect, useState } from "react";

export default function DailyDebriefPanel() {
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    window.addEventListener(INSTRUCTOR_MEMORY_EVENT, refresh);
    return () => window.removeEventListener(INSTRUCTOR_MEMORY_EVENT, refresh);
  }, [refresh]);

  const debrief = useMemo(() => buildLocalDailyDebrief(), [tick]);

  return (
    <section className="fi-daily-debrief" aria-label="Flight debrief">
      <header>
        <h3>✈ Flight Debrief</h3>
        <p className="fi-debrief-date">{debrief.date}</p>
      </header>

      <div className="fi-debrief-grid">
        <div>
          <h4>Strengths</h4>
          <ul>
            {debrief.strengths.map((s) => (
              <li key={s}>✔ {s}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Focus for next flight</h4>
          <ul>
            {debrief.focusNextFlight.map((s) => (
              <li key={s}>• {s}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="fi-debrief-mission">
        <strong>Mission</strong>
        <p className="fi-mission-label">Practice</p>
        <ul>
          {debrief.mission.practiceAreas.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>Estimated: {debrief.mission.estimatedMinutes} minutes</p>
      </div>
    </section>
  );
}
