"use client";

import { useEffect, useState, type ReactNode } from "react";

type Tab = "shadow" | "coach";

type Props = {
  shadow?: ReactNode;
  coach: ReactNode;
  beforeTabs?: ReactNode;
  initialOpen?: boolean;
  defaultTab?: Tab;
  preferredTab?: Tab;
  coachOnly?: boolean;
};

export default function VoicePracticePanel({
  shadow,
  coach,
  beforeTabs,
  initialOpen = false,
  defaultTab = "shadow",
  preferredTab,
  coachOnly = false,
}: Props) {
  const [open, setOpen] = useState(initialOpen);
  const [tab, setTab] = useState<Tab>(coachOnly ? "coach" : defaultTab);

  useEffect(() => {
    if (initialOpen) setOpen(true);
  }, [initialOpen]);

  useEffect(() => {
    if (!coachOnly && defaultTab) setTab(defaultTab);
  }, [coachOnly, defaultTab]);

  useEffect(() => {
    if (preferredTab) setTab(preferredTab);
  }, [preferredTab]);

  if (!open) {
    return (
      <button
        type="button"
        className="btn green voice-practice-toggle"
        onClick={() => setOpen(true)}
      >
        🎤 Praticar voz
      </button>
    );
  }

  const showTabs = !coachOnly && shadow != null;

  return (
    <div className="voice-practice-panel">
      <div className="voice-practice-head">
        <h3>🎤 Praticar voz</h3>
        <button type="button" className="btn secondary btn-sm" onClick={() => setOpen(false)}>
          Fechar
        </button>
      </div>

      {beforeTabs}

      {showTabs && (
        <div className="voice-practice-tabs" role="tablist" aria-label="Modo de prática">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "shadow"}
            className={`voice-practice-tab ${tab === "shadow" ? "active" : ""}`}
            onClick={() => setTab("shadow")}
          >
            Shadow
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "coach"}
            className={`voice-practice-tab ${tab === "coach" ? "active" : ""}`}
            onClick={() => setTab("coach")}
          >
            Coach
          </button>
        </div>
      )}

      <div className="voice-practice-content" role="tabpanel">
        {showTabs ? (tab === "shadow" ? shadow : coach) : coach}
      </div>
    </div>
  );
}
