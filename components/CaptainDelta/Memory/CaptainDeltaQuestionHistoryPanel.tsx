"use client";

import { useCallback, useEffect, useState } from "react";
import { getQuestionMemoryList } from "@/lib/captainDelta/memory/aggregate";
import { CAPTAIN_DELTA_MEMORY_EVENT } from "@/lib/captainDelta/memory/store";
import { NATURALNESS_LABELS } from "@/lib/flightInstructor/types";

export default function CaptainDeltaQuestionHistoryPanel() {
  const [items, setItems] = useState(() => getQuestionMemoryList(6));

  const refresh = useCallback(() => setItems(getQuestionMemoryList(6)), []);

  useEffect(() => {
    window.addEventListener(CAPTAIN_DELTA_MEMORY_EVENT, refresh);
    return () => window.removeEventListener(CAPTAIN_DELTA_MEMORY_EVENT, refresh);
  }, [refresh]);

  if (!items.length) return null;

  return (
    <section className="cdm-question-history" aria-label="Question memory">
      <h2>Captain remembers</h2>
      <ul className="cdm-question-list">
        {items.map((q) => (
          <li key={q.questionId}>
            <div className="cdm-question-top">
              <strong>{q.label}</strong>
              <span>{q.timesPracticed}× practiced</span>
            </div>
            <div className="cdm-question-meta">
              {q.averageSeconds != null && <span>Avg {q.averageSeconds}s</span>}
              {q.naturalness && (
                <span>{NATURALNESS_LABELS[q.naturalness]}</span>
              )}
              {q.confidenceAvg != null && <span>Confidence {q.confidenceAvg}%</span>}
              {q.nextReviewAt && <span>Review {q.nextReviewAt}</span>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
