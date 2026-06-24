import type { CardProgressStatus } from "@/lib/progress";
import { PROGRESS_LABELS } from "@/lib/progress";

type Props = {
  status: CardProgressStatus;
  compact?: boolean;
};

export default function ProgressBadge({ status, compact }: Props) {
  return (
    <span className={`progress-badge status-${status} ${compact ? "compact" : ""}`}>
      {PROGRESS_LABELS[status]}
    </span>
  );
}
