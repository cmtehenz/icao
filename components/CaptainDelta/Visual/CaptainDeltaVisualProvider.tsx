"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ActiveVisualHighlight, VisualCoachPlan, VisualHighlightStyle } from "@/lib/captainDelta/visual/types";
import { mergeSpeechSyncIntoPlan } from "@/lib/captainDelta/visual/speechSync";
import { CAPTAIN_DELTA_VISUAL_CLEAR, CAPTAIN_DELTA_VISUAL_PLAN } from "@/lib/captainDelta/visual/events";
import { findCaptainTarget } from "@/lib/captainDelta/visual/registry";

type VisualContextValue = {
  focusMode: boolean;
  collapsedTargets: Set<string>;
  missionTerms: string[] | null;
  activeHighlights: Record<string, ActiveVisualHighlight>;
  applyPlan: (plan: VisualCoachPlan, speechText?: string) => void;
  clearPlan: () => void;
  highlightClass: (targetId: string) => string;
  isCollapsed: (targetId: string) => boolean;
};

const VisualCtx = createContext<VisualContextValue | null>(null);

const STYLE_CLASS: Record<VisualHighlightStyle, string> = {
  glow: "cdv-hl-glow",
  underline: "cdv-hl-underline",
  circle: "cdv-hl-circle",
  pulse: "cdv-hl-pulse",
  spotlight: "cdv-hl-spotlight",
};

export function CaptainDeltaVisualProvider({ children }: { children: ReactNode }) {
  const [focusMode, setFocusMode] = useState(false);
  const [collapsedTargets, setCollapsedTargets] = useState<Set<string>>(new Set());
  const [missionTerms, setMissionTerms] = useState<string[] | null>(null);
  const [activeHighlights, setActiveHighlights] = useState<Record<string, ActiveVisualHighlight>>({});
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    for (const id of timersRef.current) window.clearTimeout(id);
    timersRef.current = [];
  }, []);

  const clearPlan = useCallback(() => {
    clearTimers();
    setFocusMode(false);
    setCollapsedTargets(new Set());
    setMissionTerms(null);
    setActiveHighlights({});
    document.querySelectorAll("[data-captain-target]").forEach((el) => {
      el.classList.remove(
        "cdv-hl-glow",
        "cdv-hl-underline",
        "cdv-hl-circle",
        "cdv-hl-pulse",
        "cdv-hl-spotlight",
      );
    });
  }, [clearTimers]);

  const applyPlan = useCallback(
    (plan: VisualCoachPlan, speechText?: string) => {
      clearPlan();
      const merged = speechText ? mergeSpeechSyncIntoPlan(plan, speechText) : plan;
      setFocusMode(!!merged.focusMode);
      setCollapsedTargets(new Set(merged.collapseTargets ?? []));
      setMissionTerms(merged.missionTerms ?? null);

      for (const step of merged.steps) {
        const startId = window.setTimeout(() => {
          const startedAt = Date.now();
          setActiveHighlights((prev) => ({
            ...prev,
            [step.targetId]: { ...step, startedAt },
          }));

          const endId = window.setTimeout(() => {
            setActiveHighlights((prev) => {
              const next = { ...prev };
              delete next[step.targetId];
              return next;
            });
            const el = findCaptainTarget(step.targetId);
            el?.classList.remove(STYLE_CLASS[step.style]);
          }, step.durationMs ?? 2200);
          timersRef.current.push(endId);
        }, step.delayMs ?? 0);
        timersRef.current.push(startId);
      }
    },
    [clearPlan],
  );

  useEffect(() => {
    for (const [targetId, step] of Object.entries(activeHighlights)) {
      const el = findCaptainTarget(targetId);
      if (!el) continue;
      const cls = STYLE_CLASS[step.style];
      el.classList.add(cls);
    }
  }, [activeHighlights]);

  useEffect(() => {
    document.body.classList.toggle("cdv-focus-active", focusMode);
    return () => document.body.classList.remove("cdv-focus-active");
  }, [focusMode]);

  useEffect(() => {
    const onPlan = (e: Event) => {
      const detail = (e as CustomEvent<VisualCoachPlan>).detail;
      if (detail) applyPlan(detail);
    };
    const onClear = () => clearPlan();
    window.addEventListener(CAPTAIN_DELTA_VISUAL_PLAN, onPlan);
    window.addEventListener(CAPTAIN_DELTA_VISUAL_CLEAR, onClear);
    return () => {
      window.removeEventListener(CAPTAIN_DELTA_VISUAL_PLAN, onPlan);
      window.removeEventListener(CAPTAIN_DELTA_VISUAL_CLEAR, onClear);
    };
  }, [applyPlan, clearPlan]);

  const highlightClass = useCallback(
    (targetId: string) => {
      const step = activeHighlights[targetId];
      return step ? STYLE_CLASS[step.style] : "";
    },
    [activeHighlights],
  );

  const isCollapsed = useCallback(
    (targetId: string) => collapsedTargets.has(targetId),
    [collapsedTargets],
  );

  const value = useMemo(
    () => ({
      focusMode,
      collapsedTargets,
      missionTerms,
      activeHighlights,
      applyPlan,
      clearPlan,
      highlightClass,
      isCollapsed,
    }),
    [
      focusMode,
      collapsedTargets,
      missionTerms,
      activeHighlights,
      applyPlan,
      clearPlan,
      highlightClass,
      isCollapsed,
    ],
  );

  return <VisualCtx.Provider value={value}>{children}</VisualCtx.Provider>;
}

export function useCaptainDeltaVisual(): VisualContextValue | null {
  return useContext(VisualCtx);
}
