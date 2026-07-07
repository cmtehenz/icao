import type { CoachingFocusLike } from "@/lib/captainDelta/infinity/types";
import type { CaptainMentorProfile } from "@/lib/captainDelta/infinity/mentorProfile";
import type { MicroDebriefResult } from "@/lib/captainDelta/infinity/academy/types";
import { buildStudyPlan } from "@/lib/captainDelta/infinity/academy/studyPlan";
import { clampSentences } from "@/lib/captainDelta/infinity/qualityGate";

function focusLabel(focus: CoachingFocusLike): string {
  if (focus === "fluency") return "Radio rhythm";
  if (focus === "prosody") return "Stress on departure";
  if (focus === "accuracy") return "Word clarity";
  if (focus === "completeness") return "Full readback";
  return "Operational flow";
}

function tomorrowFocus(
  mentor: CaptainMentorProfile,
  focus: CoachingFocusLike,
  succeeded: boolean,
): string {
  const plan = buildStudyPlan(mentor);
  if (plan.tomorrowPriorities[0]) return plan.tomorrowPriorities[0]!;
  if (!succeeded) return focusLabel(focus);
  if (mentor.examSimulation) return "Emergency communication";
  return "Next mission word — same calm pace";
}

/** V6 — micro debrief: 30 seconds max, three bullets. */
export function buildMicroDebrief(input: {
  word: string;
  focus: CoachingFocusLike;
  succeeded: boolean;
  mentorProfile: CaptainMentorProfile;
}): MicroDebriefResult {
  const { word, focus, succeeded, mentorProfile } = input;
  const improved = succeeded
    ? [focus === "strong" ? "Clear operational readback" : focusLabel(focus)]
    : [];
  const needsWork = succeeded
    ? focus === "prosody"
      ? ["Stress on longer calls"]
      : []
    : [focusLabel(focus) === "Radio rhythm" ? "Stress on departure" : focusLabel(focus)];

  const tomorrow = tomorrowFocus(mentorProfile, focus, succeeded);

  const lines = [
    improved.length ? `Today you improved: ${improved.join(", ")}.` : null,
    needsWork.length ? `Still needs work: ${needsWork.join(", ")}.` : null,
    `Tomorrow: ${tomorrow}.`,
  ].filter(Boolean);

  const message = clampSentences(lines.join(" "), 3);
  const speechText = clampSentences(message, 2);

  return { improved, needsWork, tomorrow, message, speechText };
}
