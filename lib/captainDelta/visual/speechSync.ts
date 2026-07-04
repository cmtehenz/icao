import type { VisualCoachPlan, VisualStep } from "@/lib/captainDelta/visual/types";

const MS_PER_WORD = 280;

/** Build highlight steps timed to when terms appear in spoken text. */
export function buildSpeechSyncedSteps(
  speechText: string,
  terms: { term: string; targetId: string }[],
): VisualStep[] {
  const lower = speechText.toLowerCase();
  const steps: VisualStep[] = [];

  for (const { term, targetId } of terms) {
    const idx = lower.indexOf(term.toLowerCase());
    if (idx < 0) continue;
    const wordsBefore = speechText.slice(0, idx).trim().split(/\s+/).filter(Boolean).length;
    steps.push({
      targetId,
      style: "glow",
      delayMs: wordsBefore * MS_PER_WORD,
      durationMs: 1400,
    });
  }

  return steps.sort((a, b) => (a.delayMs ?? 0) - (b.delayMs ?? 0));
}

export function mergeSpeechSyncIntoPlan(
  plan: VisualCoachPlan,
  speechText: string,
): VisualCoachPlan {
  if (!plan.speechTerms?.length) return plan;
  const synced = buildSpeechSyncedSteps(speechText, plan.speechTerms);
  const manual = plan.steps.filter(
    (s) => !synced.some((x) => x.targetId === s.targetId),
  );
  return {
    ...plan,
    steps: [...manual, ...synced].sort((a, b) => (a.delayMs ?? 0) - (b.delayMs ?? 0)),
  };
}
