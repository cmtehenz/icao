import type { ProgressStore } from "@/lib/progress";
import { progressStats } from "@/lib/progress";

type Props = {
  progress: ProgressStore;
  total: number;
};

export default function StudyDashboard({ progress, total }: Props) {
  const stats = progressStats(progress, total);
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
