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
    <section className="fi-daily-debrief" aria-label="Daily debrief">
      <header>
        <h3>✈ Daily Debrief</h3>
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
          <h4>Needs improvement</h4>
          {debrief.needsImprovement.length ? (
            <ul>
              {debrief.needsImprovement.map((s) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
          ) : (
            <p className="fi-debrief-empty">Practice more today to populate this section.</p>
          )}
        </div>
      </div>

      <div className="fi-debrief-achievement">
        <strong>Today&apos;s achievement</strong>
        <p>{debrief.achievement}</p>
      </div>

      <div className="fi-debrief-mission">
        <strong>Mission for tomorrow</strong>
        <ul>
          {debrief.tomorrowMission.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>Estimated: {debrief.tomorrowMission.estimatedMinutes} minutes</p>
      </div>
    </section>
  );
}
