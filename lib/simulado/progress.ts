import type {
  SimuladoDashboardStats,
  SimuladoHistoryPage,
  SimuladoHistorySummary,
  SimulationReport,
} from "@/lib/simulado/types";
import { suggestedNextPractice } from "@/lib/simulado/aggregateReport";
import { recordScoreSnapshot } from "@/lib/scoreHistory";

const STORAGE_KEY = "icao-simulado-history";
const DIFFICULT_KEY = "icao-simulado-difficult";

export const SIMULADO_HISTORY_PAGE_SIZE = 10;
export const SIMULADO_STORAGE_WARNING_EVENT = "icao-simulado-storage-warning";

function overallScore(report: SimulationReport): number {
  return Math.round(
    (report.scores.pronunciation +
      report.scores.structure +
      report.scores.vocabulary +
      report.scores.fluency +
      report.scores.comprehension +
      report.scores.interactions) /
      6,
  );
}

function toHistorySummary(report: SimulationReport): SimuladoHistorySummary {
  return {
    id: report.id,
    date: report.date,
    mode: report.mode,
    examVersion: report.examVersion,
    estimatedLevel: report.estimatedLevel,
    overallScore: overallScore(report),
  };
}

export function loadSimuladoHistory(): SimulationReport[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SimulationReport[];
  } catch {
    return [];
  }
}

export function getSimuladoReportById(id: string): SimulationReport | null {
  return loadSimuladoHistory().find((r) => r.id === id) ?? null;
}

function persistHistory(history: SimulationReport[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return true;
  } catch {
    let trimmed = [...history];
    while (trimmed.length > 1) {
      trimmed.pop();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
        window.dispatchEvent(
          new CustomEvent(SIMULADO_STORAGE_WARNING_EVENT, {
            detail: { kept: trimmed.length, dropped: history.length - trimmed.length },
          }),
        );
        return true;
      } catch {
        /* keep trimming */
      }
    }
    return false;
  }
}

export function saveSimuladoReport(report: SimulationReport): void {
  const history = loadSimuladoHistory();
  history.unshift(report);
  persistHistory(history);
  if (report.difficultItems.length) {
    const existing = loadDifficultItems();
    const merged = [...new Set([...existing, ...report.difficultItems])];
    localStorage.setItem(DIFFICULT_KEY, JSON.stringify(merged.slice(0, 50)));
  }
  recordScoreSnapshot("simulado", overallScore(report), report.date.slice(0, 10));
  window.dispatchEvent(new Event("icao-simulado-change"));
}

export function loadSimuladoHistoryPage(
  page = 1,
  pageSize = SIMULADO_HISTORY_PAGE_SIZE,
): SimuladoHistoryPage {
  const history = loadSimuladoHistory();
  const total = history.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = history.slice(start, start + pageSize).map(toHistorySummary);

  return { items, page: safePage, pageSize, total, totalPages };
}

export function loadDifficultItems(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DIFFICULT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function loadDashboardStats(): SimuladoDashboardStats {
  const history = loadSimuladoHistory();
  const scores = history.map(overallScore);

  const partAvgs = (part: 1 | 2 | 3 | 4) => {
    const vals = history
      .map((h) => h.partScores[`part${part}` as keyof typeof h.partScores])
      .filter((v): v is number => v != null);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  };

  const parts = ([1, 2, 3, 4] as const)
    .map((p) => ({ part: p, avg: partAvgs(p) }))
    .filter((e): e is { part: 1 | 2 | 3 | 4; avg: number } => e.avg != null);

  const weakestPart = parts.length ? parts.reduce((min, c) => (c.avg < min.avg ? c : min)).part : null;
  const strongestPart = parts.length ? parts.reduce((max, c) => (c.avg > max.avg ? c : max)).part : null;

  const latest = history[0];

  return {
    totalSimulations: history.length,
    averageScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
    bestScore: scores.length ? Math.max(...scores) : 0,
    weakestPart,
    strongestPart,
    suggestedNext: latest ? suggestedNextPractice(latest) : "Start your first ICAO simulation",
  };
}
