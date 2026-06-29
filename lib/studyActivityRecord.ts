import { VAULT_PASS_SCORE } from "@/lib/pronunciationVault";
import {
  recordStudyActivity,
  studyActivityPoints,
  STUDY_ACTIVITY_LABELS,
  type StudyActivity,
} from "@/lib/studyTime";

export const STUDY_ACTIVITY_RECORDED_EVENT = "icao-study-activity-recorded";

/** Mínimo para contar bloco Shadow PEEL. */
export const SHADOW_PEEL_PASS_SCORE = 70;

/** Mínimo para contar termo de vocabulário. */
export const VOCABULARY_PASS_SCORE = 50;

export type StudyActivityRecordContext = {
  accuracy?: number;
  recognizedText?: string;
};

export type StudyActivityRecordedDetail = {
  activity: StudyActivity;
  count: number;
  points: number;
  label: string;
};

export function canRecordStudyActivity(
  activity: StudyActivity,
  ctx: StudyActivityRecordContext,
): boolean {
  const accuracy = ctx.accuracy ?? 0;
  const heard = ctx.recognizedText?.trim() ?? "";

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

export function tryRecordStudyActivity(
  activity: StudyActivity,
  ctx: StudyActivityRecordContext,
  count = 1,
): boolean {
  if (typeof window === "undefined" || count <= 0) return false;
  if (!canRecordStudyActivity(activity, ctx)) return false;

  recordStudyActivity(activity, count);
  const points = studyActivityPoints(activity, count);
  const detail: StudyActivityRecordedDetail = {
    activity,
    count,
    points,
    label: STUDY_ACTIVITY_LABELS[activity],
  };
  window.dispatchEvent(new CustomEvent(STUDY_ACTIVITY_RECORDED_EVENT, { detail }));
  return true;
}
