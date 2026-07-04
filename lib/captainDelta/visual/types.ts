export type VisualHighlightStyle =
  | "glow"
  | "underline"
  | "circle"
  | "pulse"
  | "spotlight";

export type VisualStep = {
  targetId: string;
  style: VisualHighlightStyle;
  /** Delay before this step starts (ms) */
  delayMs?: number;
  /** How long the highlight stays active (ms) */
  durationMs?: number;
};

export type VisualCoachPlan = {
  id?: string;
  focusMode?: boolean;
  steps: VisualStep[];
  /** Target ids to collapse/hide during this plan */
  collapseTargets?: string[];
  /** Terms to highlight in sync with speech (maps to target ids) */
  speechTerms?: { term: string; targetId: string }[];
  missionTerms?: string[];
};

export type ActiveVisualHighlight = VisualStep & {
  startedAt: number;
};

export function keywordTargetId(term: string): string {
  return `keyword-${term.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export function connectorTargetId(connector: string): string {
  return `connector-${connector
    .toLowerCase()
    .replace(/[^a-z0-9\s-]+/g, "")
    .trim()
    .replace(/\s+/g, "-")}`;
}
