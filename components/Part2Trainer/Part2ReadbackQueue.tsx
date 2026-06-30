"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ExamSituation } from "@/lib/exams/types";
import type { Part2ProgressStore } from "@/lib/part2/progress";
import {
  getOrCreateReadbackQueue,
  markReadbackQueueComplete,
  readbackQueueProgress,
  READBACK_QUEUE_CHANGE_EVENT,
  type ReadbackQueueState,
} from "@/lib/part2ReadbackQueue";
import { STUDY_ACTIVITY_RECORDED_EVENT } from "@/lib/studyActivityRecord";

type Props = {
  scenarios: ExamSituation[];
  progress: Part2ProgressStore;
  currentScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
};

export default function Part2ReadbackQueue({
  scenarios,
  progress,
  currentScenarioId,
  onSelectScenario,
}: Props) {
  const [queue, setQueue] = useState<ReadbackQueueState | null>(null);
  const [queueExpanded, setQueueExpanded] = useState(false);

  const refresh = useCallback(() => {
    setQueue(getOrCreateReadbackQueue(progress, scenarios));
  }, [progress, scenarios]);

  useEffect(() => {
    refresh();
    window.addEventListener(READBACK_QUEUE_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(READBACK_QUEUE_CHANGE_EVENT, refresh);
  }, [refresh]);

  useEffect(() => {
    const onRecorded = (event: Event) => {
      const detail = (event as CustomEvent<{ activity?: string; situationId?: string }>).detail;
      if (detail?.activity !== "shadowPart2") return;
      const id = detail.situationId ?? currentScenarioId;
      const next = markReadbackQueueComplete(id);
      if (next) setQueue(next);
    };
    window.addEventListener(STUDY_ACTIVITY_RECORDED_EVENT, onRecorded);
    return () => window.removeEventListener(STUDY_ACTIVITY_RECORDED_EVENT, onRecorded);
  }, [currentScenarioId]);

  const stats = useMemo(() => (queue ? readbackQueueProgress(queue) : null), [queue]);

  const scenarioLabel = useCallback(
    (id: string) => {
      const s = scenarios.find((item) => item.id === id);
      if (!s) return id;
      return `${s.examVersion} Sit. ${s.situationNumber}`;
    },
    [scenarios],
  );

  if (!queue || !stats) return null;

  const goCurrent = () => {
    if (stats.currentId) onSelectScenario(stats.currentId);
  };

  return (
    <section className="part2-readback-queue" aria-label="Fila de readbacks de hoje">
      <div className="part2-readback-queue-head">
        <div>
          <strong>
            {stats.complete
              ? "Fila de hoje completa ✓"
              : `Fila de hoje — ${stats.done}/${stats.total}`}
          </strong>
          <span>
            {stats.complete
              ? "Readbacks da agenda concluídos"
              : stats.currentId
                ? `Próxima: ${scenarioLabel(stats.currentId)}`
                : "Abra a fila para escolher uma situação"}
          </span>
        </div>
        <div className="part2-queue-actions">
          {!stats.complete && stats.currentId && (
            <button type="button" className="btn purple btn-sm" onClick={goCurrent}>
              {currentScenarioId === stats.currentId ? "Na fila agora" : "Ir para próxima →"}
            </button>
          )}
          <button
            type="button"
            className="btn secondary btn-sm"
            onClick={() => setQueueExpanded((e) => !e)}
            aria-expanded={queueExpanded}
          >
            {queueExpanded ? "Ocultar fila" : "Ver fila"}
          </button>
        </div>
      </div>

      {queueExpanded && (
        <ol className="part2-readback-queue-list">
          {queue.scenarioIds.map((id) => {
            const done = queue.completedIds.includes(id);
            const current = id === stats.currentId && !done;
            return (
              <li
                key={id}
                className={`part2-readback-queue-item ${done ? "done" : ""} ${current ? "current" : ""}`}
              >
                <button type="button" onClick={() => onSelectScenario(id)} disabled={done}>
                  <span className="part2-readback-queue-check">{done ? "✓" : current ? "→" : "○"}</span>
                  <span>{scenarioLabel(id)}</span>
                </button>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
