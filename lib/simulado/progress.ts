import type { SimulationReport, SimuladoDashboardStats } from "@/lib/simulado/types";
import { suggestedNextPractice } from "@/lib/simulado/aggregateReport";

const STORAGE_KEY = "icao-simulado-history";
const DIFFICULT_KEY = "icao-simulado-difficult";

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

export function saveSimuladoReport(report: SimulationReport): void {
  const history = loadSimuladoHistory();
  history.unshift(report);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 30)));
  if (report.difficultItems.length) {
    const existing = loadDifficultItems();
    const merged = [...new Set([...existing, ...report.difficultItems])];
    localStorage.setItem(DIFFICULT_KEY, JSON.stringify(merged.slice(0, 50)));
  }
  window.dispatchEvent(new Event("icao-simulado-change"));
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
  const scores = history.map((h) =>
    Math.round(
      (h.scores.pronunciation +
        h.scores.structure +
        h.scores.vocabulary +
        h.scores.fluency +
        h.scores.comprehension +
        h.scores.interactions) /
        6,
    ),
  );

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
    history: history.map((h) => ({
      id: h.id,
      date: h.date,
      mode: h.mode,
      examVersion: h.examVersion,
      estimatedLevel: h.estimatedLevel,
      overallScore: Math.round(
        (h.scores.pronunciation +
          h.scores.structure +
          h.scores.vocabulary +
          h.scores.fluency +
          h.scores.comprehension +
          h.scores.interactions) /
          6,
      ),
    })),
  };
}
