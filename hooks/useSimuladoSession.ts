"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SimuladoExamId } from "@/data/exams";
import { buildSimuladoSteps } from "@/lib/simulado/buildSteps";
import { buildSimulationReport } from "@/lib/simulado/aggregateReport";
import {
  clearSimuladoDraft,
  createDraftSnapshot,
  saveSimuladoDraft,
} from "@/lib/simulado/sessionDraft";
import type {
  SimuladoSessionConfig,
  SimuladoSessionSnapshot,
  SimuladoStep,
  SimuladoStepResult,
  SimulationReport,
} from "@/lib/simulado/types";

type Options = {
  examId: SimuladoExamId | null;
  resumeSnapshot?: SimuladoSessionSnapshot | null;
};

export function useSimuladoSession(config: SimuladoSessionConfig | null, options: Options) {
  const { examId, resumeSnapshot } = options;
  const steps = useMemo(
    () => (config ? buildSimuladoSteps(config) : []),
    [config],
  );

  const configKey = useMemo(() => {
    if (!config) return null;
    return JSON.stringify({
      examVersion: config.examVersion,
      mode: config.mode,
      customParts: config.customParts ?? [],
    });
  }, [config?.examVersion, config?.mode, config?.customParts]);

  const skipConfigResetRef = useRef(!!resumeSnapshot);

  const [stepIndex, setStepIndex] = useState(resumeSnapshot?.stepIndex ?? 0);
  const [stepReady, setStepReady] = useState(resumeSnapshot?.stepReady ?? false);
  const [notes, setNotes] = useState<Record<string, string>>(resumeSnapshot?.notes ?? {});
  const [results, setResults] = useState<SimuladoStepResult[]>(resumeSnapshot?.results ?? []);
  const [report, setReport] = useState<SimulationReport | null>(null);
  const [elapsedSec, setElapsedSec] = useState(resumeSnapshot?.elapsedSec ?? 0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notesDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentStep: SimuladoStep | null = steps[stepIndex] ?? null;

  useEffect(() => {
    if (!configKey) return;
    if (skipConfigResetRef.current) {
      skipConfigResetRef.current = false;
      return;
    }
    setStepIndex(0);
    setStepReady(false);
    setNotes({});
    setResults([]);
    setReport(null);
    setElapsedSec(0);
  }, [configKey]);

  useEffect(() => {
    if (!config || report) return;
    timerRef.current = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [config, report]);

  useEffect(() => {
    if (!currentStep) return;
    if (currentStep.kind === "instruction" || currentStep.kind === "notes") {
      setStepReady(true);
      return;
    }
    const hasResult = results.some((r) => r.stepId === currentStep.id);
    if (currentStep.kind === "record" && hasResult) {
      setStepReady(true);
    }
  }, [currentStep?.id, results]);

  const persistDraft = useCallback(() => {
    if (!config || !examId || report) return;
    saveSimuladoDraft(
      createDraftSnapshot({
        examId,
        config,
        stepIndex,
        stepReady,
        notes,
        results,
        elapsedSec,
      }),
    );
  }, [config, examId, stepIndex, stepReady, notes, results, elapsedSec, report]);

  useEffect(() => {
    if (!config || !examId || report) return;
    persistDraft();
  }, [config, examId, stepIndex, stepReady, results, elapsedSec, report, persistDraft]);

  useEffect(() => {
    if (!config || !examId || report) return;
    if (notesDebounceRef.current) clearTimeout(notesDebounceRef.current);
    notesDebounceRef.current = setTimeout(persistDraft, 400);
    return () => {
      if (notesDebounceRef.current) clearTimeout(notesDebounceRef.current);
    };
  }, [notes, config, examId, report, persistDraft]);

  useEffect(() => {
    if (!report) return;
    clearSimuladoDraft();
  }, [report]);

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") persistDraft();
    };
    const onUnload = () => persistDraft();
    window.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onUnload);
    return () => {
      window.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onUnload);
    };
  }, [persistDraft]);

  const markReady = useCallback(() => setStepReady(true), []);

  const addResult = useCallback((result: SimuladoStepResult) => {
    setResults((prev) => {
      const filtered = prev.filter((r) => r.stepId !== result.stepId);
      return [...filtered, result];
    });
    setStepReady(true);
  }, []);

  const next = useCallback(() => {
    if (!stepReady) return;
    const nextIndex = stepIndex + 1;
    if (nextIndex >= steps.length) {
      if (config) {
        setResults((prev) => {
          const finalReport = buildSimulationReport(config, prev);
          setReport(finalReport);
          return prev;
        });
      }
      return;
    }
    setStepIndex(nextIndex);
    setStepReady(false);
  }, [stepReady, stepIndex, steps.length, config]);

  const finish = useCallback(() => {
    if (!config) return;
    setResults((prev) => {
      const finalReport = buildSimulationReport(config, prev);
      setReport(finalReport);
      return prev;
    });
    if (timerRef.current) clearInterval(timerRef.current);
  }, [config]);

  const setNote = useCallback((stepId: string, value: string) => {
    setNotes((prev) => ({ ...prev, [stepId]: value }));
  }, []);

  const progressPct = steps.length ? Math.round((stepIndex / steps.length) * 100) : 0;

  return {
    steps,
    stepIndex,
    currentStep,
    stepReady,
    notes,
    setNote,
    results,
    addResult,
    next,
    finish,
    markReady,
    report,
    elapsedSec,
    progressPct,
    isComplete: !!report,
    recordingsCount: results.length,
  };
}
