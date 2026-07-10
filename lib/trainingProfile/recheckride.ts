import { buildAllTrends, type TrendSummary } from "@/lib/scoreHistory";
import {
  getTrainingProfile,
  saveTrainingProfile,
} from "@/lib/trainingProfile/store";
import type { StudentTrainingProfile, TrainingPhase } from "@/lib/trainingProfile/types";

/** Calendar cadence after a completed checkride (RFC-004 Phase 4). */
export const RECHECKRIDE_DAYS = 21;

/** Sooner revisit after skip — Foundation needs a real speaking sample. */
export const RECHECKRIDE_DAYS_AFTER_SKIP = 14;

/** Don't pull checkride forward if already due within this window. */
const PLATEAU_LEAD_DAYS = 3;

export function daysFromNowIso(days: number, from = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function recheckrideDaysForPhase(phase: TrainingPhase): number {
  if (phase === "foundation") return 14;
  if (phase === "operational") return 21;
  return 28;
}

/**
 * Plateau = at least two speaking areas flat over ~14 days with real averages.
 * Mission Engine uses this to pull re-checkride forward (not Captain).
 */
export function isReadinessPlateau(trends: TrendSummary[] = buildAllTrends(14)): boolean {
  const areas = new Set(["part1", "pronunciation", "vocabulary"]);
  const flat = trends.filter(
    (t) =>
      areas.has(t.area) &&
      t.direction === "flat" &&
      t.recentAvg != null &&
      t.priorAvg != null &&
      Math.abs(t.delta ?? 0) < 5,
  );
  return flat.length >= 2;
}

function daysUntil(iso: string, now = Date.now()): number {
  return (new Date(iso).getTime() - now) / 86_400_000;
}

/**
 * If scores are flat, schedule re-checkride now so home gate surfaces it.
 * Returns updated profile, or null when no change.
 */
export function maybeScheduleRecheckrideFromPlateau(
  profile: StudentTrainingProfile = getTrainingProfile(),
  trends: TrendSummary[] = buildAllTrends(14),
  now = Date.now(),
): StudentTrainingProfile | null {
  if (profile.checkrideStatus === "pending") return null;
  if (!isReadinessPlateau(trends)) return null;

  if (profile.nextCheckrideAt) {
    const left = daysUntil(profile.nextCheckrideAt, now);
    if (left <= PLATEAU_LEAD_DAYS) return null;
  }

  const next: StudentTrainingProfile = {
    ...profile,
    nextCheckrideAt: new Date(now).toISOString(),
  };
  saveTrainingProfile(next);
  return next;
}
