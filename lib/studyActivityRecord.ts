import { VAULT_PASS_SCORE } from "@/lib/pronunciationVault";
import {
  hasShadowPeelScoredToday,
  markShadowPeelScored,
} from "@/lib/shadowPeelDedup";
import {
  hasShadowPart2ScoredToday,
  markShadowPart2Scored,
} from "@/lib/shadowPart2Dedup";
import { markPart1ShadowDone, isPart1CardInTodayMission, tryMarkPart1ShadowComplete } from "@/lib/part1DailyMission";
import type { Part2MissionKind } from "@/lib/part2DailyMission";
import { syncDailyMissionLog } from "@/lib/dailyMissionLog";
import {
  recordStudyActivity,
  studyActivityPoints,
  STUDY_ACTIVITY_LABELS,
  type StudyActivity,
} from "@/lib/studyTime";

export const STUDY_ACTIVITY_RECORDED_EVENT = "icao-study-activity-recorded";
export const STUDY_ACTIVITY_NEAR_MISS_EVENT = "icao-study-activity-near-miss";

/** Margem para toast "quase passou" (ex.: 68% com meta 70%). */
export const NEAR_MISS_MARGIN = 10;

/** Mínimo para contar bloco Shadow PEEL. */
export const SHADOW_PEEL_PASS_SCORE = 70;

/** Mínimo para contar termo de vocabulário. */
export const VOCABULARY_PASS_SCORE = 50;

export type StudyActivityRecordContext = {
  accuracy?: number;
  recognizedText?: string;
  /** Part 2 situation id — evita ponto duplo na mesma situação/dia. */
  situationId?: string;
  /** Part 1 PEEL block key (`cardNum:blockId`) — um ponto por bloco/dia. */
  peelBlockKey?: string;
  /** Part 1 card number — missão diária shadow/coach. */
  cardNum?: string;
  /** Vocabulário ICAO term id — missão diária de 20 palavras. */
  vocabTermId?: string;
  /** Part 2 mode for daily mission tracking. */
  part2MissionKind?: Part2MissionKind;
};

export type StudyActivityRecordedDetail = {
  activity: StudyActivity;
  count: number;
  points: number;
  label: string;
  situationId?: string;
};

export type StudyActivityNearMissDetail = {
  activity: StudyActivity;
  accuracy: number;
  threshold: number;
  label: string;
};

export function canRecordStudyActivity(
  activity: StudyActivity,
  ctx: StudyActivityRecordContext,
): boolean {
  const accuracy = ctx.accuracy ?? 0;
  const heard = ctx.recognizedText?.trim() ?? "";

  if (activity === "shadowPart2" && ctx.situationId && hasShadowPart2ScoredToday(ctx.situationId, ctx.part2MissionKind ?? "readback")) {
    return false;
  }
  if (activity === "shadow" && ctx.peelBlockKey && hasShadowPeelScoredToday(ctx.peelBlockKey)) {
    return false;
  }

  switch (activity) {
    case "shadow":
      return accuracy >= SHADOW_PEEL_PASS_SCORE;
    case "shadowPart2":
      return heard.length > 0 && accuracy > 0;
    case "pronunciation":
      return accuracy >= VAULT_PASS_SCORE;
    case "vocabulary":
      return heard.length > 0 && accuracy >= VOCABULARY_PASS_SCORE;
    case "simulate":
      return true;
    default:
      return false;
  }
}

export function studyActivityRejectReason(
  activity: StudyActivity,
  ctx: StudyActivityRecordContext,
): string | null {
  if (canRecordStudyActivity(activity, ctx)) return null;

  if (activity === "shadowPart2" && ctx.situationId && hasShadowPart2ScoredToday(ctx.situationId, ctx.part2MissionKind ?? "readback")) {
    return "Já contou ponto neste modo hoje — use outra situação ou treine sem meta.";
  }
  if (activity === "shadow" && ctx.peelBlockKey && hasShadowPeelScoredToday(ctx.peelBlockKey)) {
    return "Este bloco PEEL já contou na meta de hoje.";
  }

  switch (activity) {
    case "shadow":
      return `Precisa de pelo menos ${SHADOW_PEEL_PASS_SCORE}% de accuracy no bloco.`;
    case "shadowPart2":
      return heardRequired(ctx) ? "Fale o readback com mais clareza." : "Nenhuma fala detectada.";
    case "pronunciation":
      return `Precisa de pelo menos ${VAULT_PASS_SCORE}% para contar no dia.`;
    case "vocabulary":
      return heardRequired(ctx)
        ? `Precisa de pelo menos ${VOCABULARY_PASS_SCORE}% no termo.`
        : "Nenhuma fala detectada.";
    default:
      return "Prática não contou na meta de hoje.";
  }
}

function heardRequired(ctx: StudyActivityRecordContext): boolean {
  return !(ctx.recognizedText?.trim() ?? "");
}

export function getNearMissDetail(
  activity: StudyActivity,
  ctx: StudyActivityRecordContext,
): StudyActivityNearMissDetail | null {
  const accuracy = ctx.accuracy ?? 0;
  const heard = ctx.recognizedText?.trim() ?? "";

  let threshold: number | null = null;
  switch (activity) {
    case "shadow":
      threshold = SHADOW_PEEL_PASS_SCORE;
      break;
    case "pronunciation":
      threshold = VAULT_PASS_SCORE;
      break;
    case "vocabulary":
      threshold = VOCABULARY_PASS_SCORE;
      break;
    default:
      return null;
  }

  const minNear = threshold - NEAR_MISS_MARGIN;
  if (accuracy >= minNear && accuracy < threshold) {
    if (activity === "vocabulary" && !heard) return null;
    return {
      activity,
      accuracy,
      threshold,
      label: STUDY_ACTIVITY_LABELS[activity],
    };
  }
  return null;
}

function notifyNearMiss(activity: StudyActivity, ctx: StudyActivityRecordContext): void {
  const detail = getNearMissDetail(activity, ctx);
  if (!detail || typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(STUDY_ACTIVITY_NEAR_MISS_EVENT, { detail }));
}

export function tryRecordStudyActivity(
  activity: StudyActivity,
  ctx: StudyActivityRecordContext,
  count = 1,
): boolean {
  if (typeof window === "undefined" || count <= 0) return false;
  if (!canRecordStudyActivity(activity, ctx)) {
    notifyNearMiss(activity, ctx);
    return false;
  }

  recordStudyActivity(activity, count);
  if (activity === "shadow" && ctx.peelBlockKey) {
    markShadowPeelScored(ctx.peelBlockKey);
  }
  if (activity === "shadowPart2" && ctx.situationId) {
    markShadowPart2Scored(ctx.situationId, ctx.part2MissionKind ?? "readback");
  }
  if (activity === "shadow" && ctx.cardNum) {
    tryMarkPart1ShadowComplete(ctx.cardNum);
  }
  syncDailyMissionLog();
  const points = studyActivityPoints(activity, count);
  const detail: StudyActivityRecordedDetail = {
    activity,
    count,
    points,
    label: STUDY_ACTIVITY_LABELS[activity],
    situationId: ctx.situationId,
  };
  window.dispatchEvent(new CustomEvent(STUDY_ACTIVITY_RECORDED_EVENT, { detail }));
  return true;
}
