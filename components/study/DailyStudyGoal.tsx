"use client";

import { useDailyStudyTime } from "@/hooks/useDailyStudyTime";
import {
  formatStudyClock,
  STUDY_GOAL_SECONDS,
  studyProgressPercent,
  studyStreak,
} from "@/lib/studyTime";

type Props = {
  highlight?: "part1" | "part2" | "both";
  compact?: boolean;
};

function GoalRow({
  label,
  elapsed,
  goal,
  done,
  highlight,
}: {
  label: string;
  elapsed: number;
  goal: number;
  done: boolean;
  highlight: boolean;
}) {
  const pct = studyProgressPercent(elapsed, goal);
  return (
    <div className={`daily-study-row ${highlight ? "highlight" : ""} ${done ? "done" : ""}`}>
      <div className="daily-study-row-head">
        <span className="daily-study-label">{label}</span>
        <span className="daily-study-clock">
          {formatStudyClock(elapsed)} / {formatStudyClock(goal)}
          {done && <span className="daily-study-check" aria-hidden> ✓</span>}
        </span>
      </div>
      <div className="daily-study-bar" aria-hidden>
        <div className="daily-study-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function DailyStudyGoal({ highlight = "both", compact = false }: Props) {
  const { part1, part2 } = useDailyStudyTime();
  const total = part1 + part2;
  const totalGoal = STUDY_GOAL_SECONDS * 2;
  const part1Done = part1 >= STUDY_GOAL_SECONDS;
  const part2Done = part2 >= STUDY_GOAL_SECONDS;
  const totalDone = total >= totalGoal;
  const streak = studyStreak();

  return (
    <section
      className={`daily-study-goal ${compact ? "compact sheet" : ""}`}
      aria-label="Meta diária de estudo"
    >
      {!compact && (
        <header className="daily-study-head">
          <div>
            <strong>Meta de hoje</strong>
            <span>1h Part 1 + 1h Part 2</span>
          </div>
          <div className="daily-study-head-side">
            {streak > 0 && (
              <span className="daily-study-streak">{streak} dia{streak > 1 ? "s" : ""} seguidos ✓</span>
            )}
            <span className={`daily-study-total ${totalDone ? "done" : ""}`}>
              {formatStudyClock(total)} / {formatStudyClock(totalGoal)}
            </span>
          </div>
        </header>
      )}

      {compact && (
        <p className="daily-study-sheet-total">
          Total: <strong className={totalDone ? "done" : ""}>{formatStudyClock(total)}</strong>
          <span> / {formatStudyClock(totalGoal)}</span>
        </p>
      )}

      <GoalRow
        label="Part 1"
        elapsed={part1}
        goal={STUDY_GOAL_SECONDS}
        done={part1Done}
        highlight={highlight === "part1" || highlight === "both"}
      />
      <GoalRow
        label="Part 2"
        elapsed={part2}
        goal={STUDY_GOAL_SECONDS}
        done={part2Done}
        highlight={highlight === "part2" || highlight === "both"}
      />

      {!compact && (
        <p className="daily-study-hint">
          O tempo conta automaticamente enquanto você estuda nesta página com o app aberto.
        </p>
      )}
    </section>
  );
}
