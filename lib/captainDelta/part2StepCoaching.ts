import type { EvaluateFeedback } from "@/lib/evaluate/types";
import { toSpeechText } from "@/lib/captainDelta/voiceText";

/** Short Captain line after a Part 2 simulation speak step — keeps Captain present mid-flight. */
export function buildPart2StepCoaching(
  feedback: EvaluateFeedback,
  stepLabel: string,
): { text: string; speechText: string } {
  const score = feedback.scores.overall;
  const level = feedback.icaoLevel?.overall;
  const levelBit = level != null ? ` ICAO ${level} on this response.` : "";

  if (score >= 75) {
    const text = `Good ${stepLabel.toLowerCase()}.${levelBit} Keep that operational rhythm on the next step.`;
    return { text, speechText: toSpeechText(text) };
  }

  if (score >= 50) {
    const hint = feedback.improvements[0] ?? "Tighten phraseology and keep it short.";
    const text = `${stepLabel} is on track.${levelBit} One fix: ${hint}`;
    return { text, speechText: toSpeechText(text) };
  }

  const focus = feedback.improvements[0] ?? feedback.summary;
  const text = `On ${stepLabel.toLowerCase()}, slow down.${levelBit} Focus: ${focus}`;
  return { text, speechText: toSpeechText(text) };
}
