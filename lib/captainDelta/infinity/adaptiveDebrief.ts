import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import type { PracticeLevel } from "@/lib/pronunciationVault";
import { buildCaptainStudentModel } from "@/lib/captainDelta/infinity/studentModel";
import { planAdaptiveResponse } from "@/lib/captainDelta/infinity/adaptivePlan";
import {
  specificPraiseForPartial,
  specificPraiseForSuccess,
} from "@/lib/captainDelta/infinity/praise";
import { aviationHookForWord } from "@/lib/captainDelta/infinity/aviationCoach";
import { captainSelfCheck } from "@/lib/captainDelta/infinity/selfCheck";
import {
  getCaptainLessonMemory,
  patchCaptainLessonMemory,
  rememberCaptainLesson,
} from "@/lib/captainDelta/infinity/lessonMemory";
import type { CaptainDeltaMemoryStore } from "@/lib/captainDelta/memory/types";
import type { CaptainLessonMemory, CoachingFocusLike } from "@/lib/captainDelta/infinity/types";
import { spokenFeedbackExcludesRawScores } from "@/lib/captainDelta/infinity/qualityGate";
import {
  progressRecognitionLine,
  recordWordMentorOutcome,
} from "@/lib/captainDelta/infinity/wordJourney";
import { recordSessionStruggle, recordSessionWin } from "@/lib/captainDelta/infinity/learningJournal";
import { buildCaptainMentorProfile } from "@/lib/captainDelta/infinity/mentorProfile";
import { buildPostFlightDebrief } from "@/lib/captainDelta/infinity/flight/flightDebrief";
import { buildMicroDebrief } from "@/lib/captainDelta/infinity/academy/microDebrief";
import { buildStudyPlan, persistStudyPlan } from "@/lib/captainDelta/infinity/academy/studyPlan";
import { recordFlightLogEntry } from "@/lib/captainDelta/infinity/flight/flightLog";
import { clampSentences } from "@/lib/captainDelta/infinity/qualityGate";

export type AdaptiveDebriefContext = {
  targetWord: string;
  referenceText: string;
  practiceLevel: PracticeLevel;
  focus: CoachingFocusLike;
  missionPass?: boolean;
  assessment?: AzurePronunciationResult;
  mentorStore?: CaptainDeltaMemoryStore;
  examDaysRemaining?: number;
  callsign?: string;
};

function focusToPraiseContext(
  focus: CoachingFocusLike,
): "rhythm" | "stress" | "clarity" | "sentence" | "general" {
  if (focus === "fluency") return "rhythm";
  if (focus === "prosody") return "stress";
  if (focus === "accuracy") return "clarity";
  if (focus === "completeness") return "sentence";
  return "general";
}

function syncMemoryFromDebrief(ctx: AdaptiveDebriefContext, message: string): CaptainLessonMemory {
  const prev = getCaptainLessonMemory();
  const sameMistake =
    prev?.lastMistake === ctx.focus && ctx.focus !== "strong"
      ? (prev.consecutiveSameMistake ?? 0) + 1
      : ctx.focus === "strong"
        ? 0
        : 1;
  const succeeded = ctx.focus === "strong" || ctx.missionPass === true;

  rememberCaptainLesson({
    currentWord: ctx.targetWord,
    referenceText: ctx.referenceText,
    practiceLevel: ctx.practiceLevel,
    lastCoaching: message,
    lastMistake: ctx.focus === "strong" ? null : ctx.focus,
    lastSuccessfulAttempt: succeeded ? ctx.targetWord : prev?.lastSuccessfulAttempt ?? null,
  });

  return patchCaptainLessonMemory({
    consecutiveSameMistake: sameMistake,
    successesToday: (prev?.successesToday ?? 0) + (succeeded ? 1 : 0),
  })!;
}

/** V3 — personalize post-recording debrief: one correction, specific praise, aviation hook. */
export function applyAdaptiveDebrief(
  copy: { message: string; speechText: string },
  ctx: AdaptiveDebriefContext,
): { message: string; speechText: string } {
  const memory = syncMemoryFromDebrief(ctx, copy.message);
  const succeeded = ctx.focus === "strong" || ctx.missionPass === true;
  const model = buildCaptainStudentModel(memory, {
    lastAttemptSucceeded: succeeded,
    lastAttemptScore: ctx.assessment?.accuracyScore,
    consecutiveSameFocus: memory.consecutiveSameMistake,
  });

  let message = copy.message;
  let speechText = copy.speechText;

  const mentorStore = recordWordMentorOutcome(
    ctx.targetWord,
    succeeded ? "success" : "struggle",
    ctx.focus !== "strong" ? ctx.focus : undefined,
    ctx.mentorStore,
  );

  const progressLine = progressRecognitionLine(ctx.targetWord, succeeded, mentorStore);
  if (progressLine) {
    const tail = copy.message.includes(".")
      ? copy.message.split(".").slice(1).join(".").trim()
      : "";
    message = tail ? `${progressLine} ${tail}` : progressLine;
    speechText = progressLine;
    recordSessionWin(progressLine, mentorStore);
  } else if (succeeded) {
    recordSessionWin(`clear pronunciation on "${ctx.targetWord}"`, mentorStore);
  } else {
    recordSessionStruggle(ctx.targetWord, mentorStore);
  }

  if (succeeded && !progressLine) {
    const praise = specificPraiseForSuccess(model, ctx.targetWord, {
      focus: focusToPraiseContext(ctx.focus),
    });
    const tail = copy.message.includes(".")
      ? copy.message.split(".").slice(1).join(".").trim()
      : "";
    message = tail ? `${praise} ${tail}` : `${praise} Continue when ready.`;
    speechText = praise;
  } else if (memory.consecutiveSameMistake >= 2) {
    const interrupt = `Let's stop for a second. You're repeating the same pronunciation on "${ctx.targetWord}". Let's isolate just one sound.`;
    message = `${interrupt} ${copy.message}`;
    speechText = `${interrupt} ${copy.speechText}`;
  } else if (ctx.assessment && !message.toLowerCase().startsWith("good attempt")) {
    message = `${specificPraiseForPartial(ctx.targetWord, (ctx.assessment.fluencyScore ?? 0) >= 80)} ${message}`;
  }

  const hook = aviationHookForWord(ctx.targetWord);
  if (hook && (succeeded || model.primaryNeed === "challenge")) {
    message = `${message} ${hook}`.trim();
  }

  const plan = planAdaptiveResponse(
    model,
    memory,
    succeeded ? "pronunciation_question" : "stress_help",
  );
  if (plan.microChallenge && succeeded) {
    message = `${message} ${plan.microChallenge}`.trim();
  }

  const safeOriginal = spokenFeedbackExcludesRawScores(copy.message)
    ? copy.message
    : succeeded
      ? `Nice work on "${ctx.targetWord}". Continue when ready.`
      : `Stay with "${ctx.targetWord}" — one sound at a time, then the full sentence.`;

  const checked = captainSelfCheck(message, speechText, safeOriginal);

  const mentorProfile = buildCaptainMentorProfile({
    memoryStore: mentorStore,
    examDaysRemaining: ctx.examDaysRemaining,
    currentWord: ctx.targetWord,
  });

  const flightDebrief = buildPostFlightDebrief({
    word: ctx.targetWord,
    focus: ctx.focus,
    succeeded,
    mentorProfile,
    mentorStore,
    priorMessage: checked.message,
  });

  const micro = buildMicroDebrief({
    word: ctx.targetWord,
    focus: ctx.focus,
    succeeded,
    mentorProfile,
  });

  persistStudyPlan(
    buildStudyPlan(mentorProfile, {
      store: mentorStore,
      lastWord: ctx.targetWord,
      lastFocus: ctx.focus,
      succeeded,
    }),
    mentorStore,
  );

  recordFlightLogEntry(
    {
      missionWord: ctx.targetWord,
      completed: succeeded,
      difficulty: succeeded ? "medium" : "hard",
      improvement: flightDebrief.improvement,
      nextFocus: flightDebrief.nextFocus,
    },
    mentorStore,
  );

  const actionTail = succeeded ? "" : " Now say the full line again — slow and clear.";

  return {
    message: clampSentences(`${checked.message} ${micro.message}${actionTail}`, 7),
    speechText: succeeded
      ? clampSentences(`${checked.speechText} ${micro.speechText}`, 4)
      : clampSentences(checked.speechText, 3),
  };
}