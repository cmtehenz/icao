import type { CaptainDeltaMemoryStore } from "@/lib/captainDelta/memory/types";
import { loadCaptainDeltaMemory, saveCaptainDeltaMemory } from "@/lib/captainDelta/memory/store";
import { todayKey } from "@/lib/studyTime";
import type { AcademyStudyPlan } from "@/lib/captainDelta/infinity/academy/types";
import type { CaptainMentorProfile } from "@/lib/captainDelta/infinity/mentorProfile";
import { buildCareerFocus } from "@/lib/captainDelta/infinity/academy/careerMode";
import { pickDailyMission } from "@/lib/captainDelta/infinity/academy/missionGenerator";
import type { PilotProfile } from "@/lib/profile";
import type { CoachingFocusLike } from "@/lib/captainDelta/infinity/types";

function focusLabel(focus: CoachingFocusLike): string {
  if (focus === "fluency") return "Radio rhythm";
  if (focus === "prosody") return "Stress";
  if (focus === "accuracy") return "Word clarity";
  if (focus === "completeness") return "Full readback";
  return "Operational flow";
}

/** V6 — Captain silently updates today's and tomorrow's priorities. */
export function buildStudyPlan(
  mentor: CaptainMentorProfile,
  options?: {
    store?: CaptainDeltaMemoryStore;
    profile?: PilotProfile;
    lastWord?: string;
    lastFocus?: CoachingFocusLike;
    succeeded?: boolean;
  },
): AcademyStudyPlan {
  const store = options?.store ?? loadCaptainDeltaMemory();
  const career = buildCareerFocus(options?.profile, mentor);
  const today = todayKey();

  const weakTopics = [
    ...mentor.strugglingWords.slice(0, 2),
    ...(options?.lastFocus && !options?.succeeded ? [focusLabel(options.lastFocus)] : []),
  ].filter(Boolean);

  const todayPriorities = [
    mentor.smartReviewWord ? `Review "${mentor.smartReviewWord}"` : null,
    options?.lastWord && !options?.succeeded ? `Fix "${options.lastWord}"` : null,
    "Word Mission radio reps",
    mentor.examSimulation ? "Exam-style speaking" : null,
  ].filter(Boolean) as string[];

  const tomorrowPriorities = [
    weakTopics[0] ? `Tighten ${weakTopics[0].toLowerCase()}` : null,
    career.vocabularyBias[0] ? `Mission vocab: ${career.vocabularyBias[0]}` : null,
    mentor.examMode ? "Mock examiner pace" : "One emergency scenario",
  ].filter(Boolean) as string[];

  const reviewSchedule = [
    ...(mentor.smartReviewWord ? [mentor.smartReviewWord] : []),
    ...mentor.strugglingWords.slice(0, 3),
  ];

  return {
    date: today,
    todayPriorities,
    tomorrowPriorities,
    weakTopics,
    reviewSchedule,
    activeMission: pickDailyMission(options?.profile, mentor, today),
    careerFocus: career.label,
  };
}

export function persistStudyPlan(
  plan: AcademyStudyPlan,
  store?: CaptainDeltaMemoryStore,
): CaptainDeltaMemoryStore {
  const base = store ?? loadCaptainDeltaMemory();
  const next = { ...base, academyStudyPlan: plan };
  if (!store) saveCaptainDeltaMemory(next);
  return next;
}

export function loadStudyPlan(store?: CaptainDeltaMemoryStore): AcademyStudyPlan | null {
  const base = store ?? loadCaptainDeltaMemory();
  return base.academyStudyPlan ?? null;
}
