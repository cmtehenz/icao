type Props = {
  completed: number;
  total: number;
  hint: string;
  nextTitle?: string;
};

/**
 * Today's adaptive plan at a glance — progress segments + one hint line.
 * Mission Engine owns the numbers; this only displays them (RFC-004 Phase 3).
 */
export default function MissionPlanStrip({ completed, total, hint, nextTitle }: Props) {
  const safeTotal = Math.max(total, 1);
  const segments = Array.from({ length: safeTotal }, (_, i) => i < completed);

  return (
    <div className="mission-plan-strip" aria-label="Today's training plan">
      <div className="mission-plan-strip-meter" aria-hidden>
        {segments.map((done, i) => (
          <span key={i} className={done ? "is-done" : undefined} />
        ))}
      </div>
      <p className="mission-plan-strip-meta">
        <span className="mission-plan-strip-count">
          {completed}/{total} legs
        </span>
        {nextTitle ? <span className="mission-plan-strip-next">{nextTitle}</span> : null}
      </p>
      <p className="mission-plan-strip-hint">{hint}</p>
    </div>
  );
}
