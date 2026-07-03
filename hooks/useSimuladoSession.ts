"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildSimuladoSteps } from "@/lib/simulado/buildSteps";
import { buildSimulationReport } from "@/lib/simulado/aggregateReport";
import type {
  SimuladoSessionConfig,
  SimuladoStep,
  SimuladoStepResult,
  SimulationReport,
} from "@/lib/simulado/types";

export function useSimuladoSession(config: SimuladoSessionConfig | null) {
  const steps = useMemo(
    () => (config ? buildSimuladoSteps(config) : []),
    [config],
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [stepReady, setStepReady] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [results, setResults] = useState<SimuladoStepResult[]>([]);
  const [report, setReport] = useState<SimulationReport | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentStep: SimuladoStep | null = steps[stepIndex] ?? null;
  const isComplete = stepIndex >= steps.length && steps.length > 0;

  useEffect(() => {
    setStepIndex(0);
    setStepReady(false);
    setNotes({});
    setResults([]);
    setReport(null);
    setElapsedSec(0);
  }, [config]);

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
    } else {
      setStepReady(false);
    }
  }, [currentStep?.id]);

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
  };
}
