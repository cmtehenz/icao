import type { TrainingPhase } from "@/lib/trainingProfile/types";
import { phaseLabel } from "@/lib/trainingProfile/types";

type Props = {
  phase: TrainingPhase;
  /** Compact label only — no "Phase ·" prefix */
  compact?: boolean;
};

/** Visual phase mark — single owner for Foundation / Operational / Exam Ready. */
export default function PhaseBadge({ phase, compact = false }: Props) {
  return (
    <span className="phase-badge" data-phase={phase}>
      {compact ? phaseLabel(phase) : `Phase · ${phaseLabel(phase)}`}
    </span>
  );
}
