import {
  classifyCaptainIntent,
  clarificationQuestion,
} from "@/lib/captainDelta/infinity/intentEngine";
import { planAdaptiveResponse } from "@/lib/captainDelta/infinity/adaptivePlan";
import { loadCaptainDeltaMemory } from "@/lib/captainDelta/memory/store";
import { buildCaptainMentorProfile } from "@/lib/captainDelta/infinity/mentorProfile";
import { applyMentorPersonalization, pickRecurringMistakeStrategy } from "@/lib/captainDelta/infinity/mentorEnhance";
import { applyFlightInstructorMode } from "@/lib/captainDelta/infinity/flight/flightInstructor";
import { applyAcademyMode } from "@/lib/captainDelta/infinity/academy/academy";
import {
  getCaptainLessonMemory,
  mergeLessonMemory,
  recordCoachingTurn,
  rememberCaptainLesson,
  saveCaptainLessonMemory,
  topicKeyForIntent,
} from "@/lib/captainDelta/infinity/lessonMemory";
import { captainSelfCheck } from "@/lib/captainDelta/infinity/selfCheck";
import { buildCaptainStudentModel } from "@/lib/captainDelta/infinity/studentModel";
import {
  buildCaptainTeachingResponse,
  pickTeachingStrategy,
} from "@/lib/captainDelta/infinity/teachingEngine";
import type {
  CaptainInstructorResponse,
  CaptainLessonContextInput,
  CaptainIntent,
} from "@/lib/captainDelta/infinity/types";
import { passesInstructorQualityGate } from "@/lib/captainDelta/infinity/qualityGate";

export type CaptainAskOptions = CaptainLessonContextInput & {
  question: string;
  intent?: CaptainIntent;
};

const FALLBACK =
  "Stay with operational language. Say the word slowly once, then the full sentence.";

/** V3 — classify intent, plan adaptively, teach one step, self-check, remember. */
export function respondAsCaptainInstructor(
  options: CaptainAskOptions,
): CaptainInstructorResponse {
  const { question, intent: forcedIntent, studentHints, ...ctx } = options;

  let memory = getCaptainLessonMemory() ?? rememberCaptainLesson(ctx);
  memory = mergeLessonMemory(memory, ctx);

  const classified = forcedIntent
    ? { intent: forcedIntent, confidence: "high" as const }
    : classifyCaptainIntent(question, memory);

  if (classified.intent === "unknown" && classified.confidence === "low") {
    const clarify = clarificationQuestion(memory);
    const checked = captainSelfCheck(clarify.message, clarify.speechText, clarify.message);
    return {
      message: checked.message,
      speechText: checked.speechText,
      intent: "unknown",
      strategy: "clarify",
      helpLevel: memory.helpLevel,
      needsClarification: true,
    };
  }

  const mentorProfile = buildCaptainMentorProfile({
    memoryStore:
      studentHints?.mentorStore ??
      (typeof window !== "undefined" ? loadCaptainDeltaMemory() : undefined),
    pilotProfile: studentHints?.pilotProfile,
    vaultWords: studentHints?.vaultWords,
    examDaysRemaining: studentHints?.examDaysRemaining,
    currentWord: memory.currentWord,
  });

  const model = buildCaptainStudentModel(
    memory,
    {
      ...studentHints,
      estimatedIcaoLevel: studentHints?.estimatedIcaoLevel ?? mentorProfile.icaoEstimate,
    },
    classified.intent,
  );
  const plan = planAdaptiveResponse(model, memory, classified.intent);
  let strategy = pickTeachingStrategy(classified.intent, memory, plan.teachingVariant);
  if (memory.consecutiveSameMistake >= 3) {
    strategy = pickRecurringMistakeStrategy(memory.consecutiveSameMistake);
  }

  let response = buildCaptainTeachingResponse(
    classified.intent,
    memory,
    strategy,
    question,
    plan,
  );

  const mentored = applyMentorPersonalization(
    response.message,
    response.speechText,
    mentorProfile,
    memory,
    classified.intent,
  );
  response = { ...response, message: mentored.message, speechText: mentored.speechText };

  const flight = applyFlightInstructorMode(
    response.message,
    response.speechText,
    memory,
    classified.intent,
    mentorProfile,
    { callsign: studentHints?.callsign ?? ctx.callsign },
  );
  response = { ...response, message: flight.message, speechText: flight.speechText };

  const academy = applyAcademyMode(
    response.message,
    response.speechText,
    memory,
    classified.intent,
    model,
    mentorProfile,
    { callsign: studentHints?.callsign ?? ctx.callsign, profile: studentHints?.pilotProfile },
  );
  response = { ...response, message: academy.message, speechText: academy.speechText };

  const checked = captainSelfCheck(response.message, response.speechText, FALLBACK);
  response = {
    ...response,
    message: checked.message,
    speechText: checked.speechText,
  };

  if (!passesInstructorQualityGate(response.message)) {
    response = { ...response, message: FALLBACK, speechText: FALLBACK };
  }

  const topicKey = topicKeyForIntent(classified.intent, memory.currentWord);
  saveCaptainLessonMemory(
    recordCoachingTurn(memory, classified.intent, response.message, topicKey),
  );

  return response;
}

export {
  classifyCaptainIntent,
  clarificationQuestion,
  isCaptainStudentQuestion,
} from "@/lib/captainDelta/infinity/intentEngine";
export {
  getCaptainLessonMemory,
  rememberCaptainLesson,
  resetCaptainLessonMemoryForTests,
  saveCaptainLessonMemory,
} from "@/lib/captainDelta/infinity/lessonMemory";
export { passesInstructorQualityGate, clampSentences } from "@/lib/captainDelta/infinity/qualityGate";
export { buildCaptainStudentModel } from "@/lib/captainDelta/infinity/studentModel";
export { planAdaptiveResponse } from "@/lib/captainDelta/infinity/adaptivePlan";
export { applyAdaptiveDebrief } from "@/lib/captainDelta/infinity/adaptiveDebrief";
export { buildCaptainMentorProfile } from "@/lib/captainDelta/infinity/mentorProfile";
export {
  buildLessonClosingSummary,
  lessonClosingToSpeech,
  recordSessionWin,
} from "@/lib/captainDelta/infinity/learningJournal";
export { progressRecognitionLine, recordWordMentorOutcome } from "@/lib/captainDelta/infinity/wordJourney";
export { buildPreflightBrief, buildMissionBrief } from "@/lib/captainDelta/infinity/flight/flightBriefing";
export { buildSituationalExercise } from "@/lib/captainDelta/infinity/flight/situationalTeaching";
export { buildPostFlightDebrief } from "@/lib/captainDelta/infinity/flight/flightDebrief";
export { formatFlightLogEntry, recordFlightLogEntry, missionHistoryLine } from "@/lib/captainDelta/infinity/flight/flightLog";
export { getExamTrainingPhase } from "@/lib/captainDelta/infinity/flight/examPhase";
export { buildTrainingDayBriefing } from "@/lib/captainDelta/infinity/academy/trainingDay";
export { buildMissionContextBrief } from "@/lib/captainDelta/infinity/academy/missionBriefing";
export { buildMicroDebrief } from "@/lib/captainDelta/infinity/academy/microDebrief";
export { buildStudyPlan, persistStudyPlan } from "@/lib/captainDelta/infinity/academy/studyPlan";
export { applyAcademyMode } from "@/lib/captainDelta/infinity/academy/academy";
export type { FlightLogEntry, FlightPhase, ExamTrainingPhase } from "@/lib/captainDelta/infinity/flight/types";
export type { AcademyMissionKind, AcademyStudyPlan, CaptainInstructorRole } from "@/lib/captainDelta/infinity/academy/types";
export type { CaptainIntent, CaptainInstructorResponse, CaptainLessonMemory } from "@/lib/captainDelta/infinity/types";
