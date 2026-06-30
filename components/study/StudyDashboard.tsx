import type { ProgressStore } from "@/lib/progress";
import { progressStats } from "@/lib/progress";

type Props = {
  progress: ProgressStore;
  total: number;
  /** compact: só dominadas e difíceis (hero de estudo) */
  variant?: "full" | "compact";
};

export default function StudyDashboard({ progress, total, variant = "compact" }: Props) {
  const stats = progressStats(progress, total);

  if (variant === "compact") {
    return (
      <div className="delta-dashboard delta-dashboard-compact" aria-label="Progresso">
        <div className="delta-stat mastered">
          <strong>{stats.mastered}</strong>
          <span>dominadas</span>
        </div>
        <div className="delta-stat difficult">
          <strong>{stats.difficult}</strong>
          <span>difíceis</span>
        </div>
      </div>
    );
  }

  return (
    <div className="delta-dashboard">
      <div className="delta-stat">
        <strong>{stats.total}</strong>
        <span>questions</span>
      </div>
      <div className="delta-stat mastered">
        <strong>{stats.mastered}</strong>
        <span>mastered</span>
      </div>
      <div className="delta-stat difficult">
        <strong>{stats.difficult}</strong>
        <span>difficult</span>
      </div>
      <div className="delta-stat learning">
        <strong>{stats.learning}</strong>
        <span>learning</span>
      </div>
      <div className="delta-stat daily">
        <strong>{stats.daily}</strong>
        <span>today</span>
      </div>
    </div>
  );
}
