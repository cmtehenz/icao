import { recordScoreSnapshot } from "@/lib/scoreHistory";
import { loadSimuladoHistory } from "@/lib/simulado/progress";
import type { SimulationReport } from "@/lib/simulado/types";

const BACKFILL_KEY = "icao_score_history_backfill_v1";

function simuladoOverall(report: SimulationReport): number {
  const s = report.scores;
  return Math.round(
    (s.pronunciation + s.structure + s.vocabulary + s.fluency + s.comprehension + s.interactions) / 6,
  );
}

/** One-time import of past simulado scores into the trend chart. */
export function backfillScoreHistoryFromSimulado(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(BACKFILL_KEY)) return;

  const history = loadSimuladoHistory();
  localStorage.setItem(BACKFILL_KEY, "1");
  if (!history.length) return;

  for (const report of history) {
    const dateKey = report.date.slice(0, 10);
    recordScoreSnapshot("simulado", simuladoOverall(report), dateKey);
  }
}
