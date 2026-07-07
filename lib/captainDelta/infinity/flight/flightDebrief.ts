import type { CoachingFocusLike } from "@/lib/captainDelta/infinity/types";
import type { CaptainMentorProfile } from "@/lib/captainDelta/infinity/mentorProfile";
import { buildLessonClosingSummary } from "@/lib/captainDelta/infinity/learningJournal";
import { missionHistoryLine } from "@/lib/captainDelta/infinity/flight/flightLog";
import { clampSentences } from "@/lib/captainDelta/infinity/qualityGate";

function focusToImprovementLabel(focus: CoachingFocusLike): string {
  if (focus === "fluency") return "Radio rhythm";
  if (focus === "prosody") return "Stress";
  if (focus === "accuracy") return "Word clarity";
  if (focus === "completeness") return "Full readback";
  return "Operational flow";
}

function focusToNextWork(focus: CoachingFocusLike, succeeded: boolean): string {
  if (succeeded) return "Next word — same calm radio pace";
  if (focus === "fluency") return "Radio rhythm";
  if (focus === "prosody") return "Stress on key syllables";
  if (focus === "accuracy") return "One sound at a time";
  return "Full sentence in one breath";
}

export type PostFlightDebriefInput = {
  word: string;
  focus: CoachingFocusLike;
  succeeded: boolean;
  mentorProfile: CaptainMentorProfile;
  mentorStore?: import("@/lib/captainDelta/memory/types").CaptainDeltaMemoryStore;
  priorMessage: string;
};

/** Post-flight debrief — never scores alone; one improvement, one tomorrow objective. */
export function buildPostFlightDebrief(input: PostFlightDebriefInput): {
  message: string;
  speechText: string;
  improvement: string;
  nextFocus: string;
  recommendation: string;
} {
  const { word, focus, succeeded, mentorProfile, mentorStore, priorMessage } = input;
  const improvement = succeeded
    ? focus === "strong"
      ? "Clear operational readback"
      : focusToImprovementLabel(focus)
    : focusToImprovementLabel(focus);

  const stillNeeds = succeeded
    ? "Keep linking words smoothly on longer calls."
    : `Polish ${focusToImprovementLabel(focus).toLowerCase()} on "${word}".`;

  const recommendation = succeeded
    ? "One more full sentence at normal speed, then move on."
    : "Slow down — fix one sound, then rebuild the full line.";

  const nextFocus = focusToNextWork(focus, succeeded);
  const closing = buildLessonClosingSummary(mentorProfile, mentorStore);
  const history = missionHistoryLine(mentorStore);

  const improvedLine = succeeded
    ? `What improved: ${improvement} on "${word}".`
    : `What still needs work: ${stillNeeds}`;

  const parts = [
    history,
    improvedLine,
    `One recommendation: ${recommendation}`,
    closing.tomorrowLine.replace("Tomorrow we'll", "Tomorrow objective:"),
    "Keep practicing — you're training for real operations, not an exercise.",
  ].filter(Boolean);

  const debriefIntro = succeeded
    ? "Post-flight debrief — solid sortie."
    : "Post-flight debrief — good reps. One fix at a time.";

  const message = clampSentences(
    `${debriefIntro} ${parts.join(" ")} ${priorMessage.split(".").slice(0, 1).join(".")}.`.trim(),
    8,
  );

  return {
    message,
    speechText: clampSentences(`${debriefIntro} ${improvedLine} ${recommendation}`, 3),
    improvement,
    nextFocus,
    recommendation,
  };
}
