import type { SimuladoExamId } from "@/data/exams";
import { examIdFromVersion } from "@/data/exams";
import { buildSimuladoSteps } from "@/lib/simulado/buildSteps";
import type { SimuladoSessionConfig, SimuladoSessionSnapshot } from "@/lib/simulado/types";

const DRAFT_KEY = "icao-simulado-draft";
export const SIMULADO_DRAFT_CHANGE_EVENT = "icao-simulado-draft-change";

function configsMatch(a: SimuladoSessionConfig, b: SimuladoSessionConfig): boolean {
  return (
    a.examVersion === b.examVersion &&
    a.mode === b.mode &&
    JSON.stringify(a.customParts ?? []) === JSON.stringify(b.customParts ?? [])
  );
}

export function saveSimuladoDraft(snapshot: SimuladoSessionSnapshot): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(snapshot));
    window.dispatchEvent(new Event(SIMULADO_DRAFT_CHANGE_EVENT));
  } catch {
    /* quota or private mode */
  }
}

export function loadSimuladoDraft(): SimuladoSessionSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SimuladoSessionSnapshot;
    if (parsed.schemaVersion !== 1 || !parsed.config?.examVersion) return null;
    return normalizeDraft(parsed);
  } catch {
    return null;
  }
}

export function clearSimuladoDraft(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DRAFT_KEY);
  window.dispatchEvent(new Event(SIMULADO_DRAFT_CHANGE_EVENT));
}

export function hasSimuladoDraft(): boolean {
  return loadSimuladoDraft() != null;
}

function normalizeDraft(draft: SimuladoSessionSnapshot): SimuladoSessionSnapshot | null {
  const steps = buildSimuladoSteps(draft.config);
  if (!steps.length) return null;

  const stepIndex = Math.min(Math.max(0, draft.stepIndex), steps.length - 1);
  const step = steps[stepIndex];
  const hasResult = draft.results.some((r) => r.stepId === step?.id);

  let stepReady = draft.stepReady;
  if (step?.kind === "instruction" || step?.kind === "notes") {
    stepReady = true;
  } else if (step?.kind === "record" && hasResult) {
    stepReady = true;
  }

  return {
    ...draft,
    stepIndex,
    stepReady,
    examId: draft.examId || examIdFromVersion(draft.config.examVersion),
  };
}

export function createDraftSnapshot(input: {
  examId: SimuladoExamId;
  config: SimuladoSessionConfig;
  stepIndex: number;
  stepReady: boolean;
  notes: Record<string, string>;
  results: SimuladoSessionSnapshot["results"];
  elapsedSec: number;
}): SimuladoSessionSnapshot {
  return {
    schemaVersion: 1,
    savedAt: new Date().toISOString(),
    examId: input.examId,
    config: input.config,
    stepIndex: input.stepIndex,
    stepReady: input.stepReady,
    notes: input.notes,
    results: input.results,
    elapsedSec: input.elapsedSec,
  };
}

export function draftMatchesConfig(draft: SimuladoSessionSnapshot, config: SimuladoSessionConfig): boolean {
  return configsMatch(draft.config, config);
}

export function formatDraftSummary(draft: SimuladoSessionSnapshot): string {
  const steps = buildSimuladoSteps(draft.config);
  const total = steps.length;
  const current = draft.stepIndex + 1;
  const saved = new Date(draft.savedAt);
  const time = saved.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const recordings = draft.results.length;
  return `Prova ${draft.config.examVersion} · passo ${current}/${total} · ${recordings} gravações · salvo ${time}`;
}
