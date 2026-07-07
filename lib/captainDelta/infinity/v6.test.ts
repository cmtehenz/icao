import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CaptainDeltaMemoryStore } from "@/lib/captainDelta/memory/types";
import { applyAdaptiveDebrief } from "@/lib/captainDelta/infinity/adaptiveDebrief";
import { applyAcademyMode } from "@/lib/captainDelta/infinity/academy/academy";
import { buildCareerFocus } from "@/lib/captainDelta/infinity/academy/careerMode";
import { pickChallenge } from "@/lib/captainDelta/infinity/academy/challengeEngine";
import { rejectGenericPraise, specificProgressPraise } from "@/lib/captainDelta/infinity/academy/confidenceEngine";
import { applyInstructorRole, pickInstructorRole } from "@/lib/captainDelta/infinity/academy/instructorRoles";
import { planLiveAdaptation } from "@/lib/captainDelta/infinity/academy/liveAdaptation";
import { buildMicroDebrief } from "@/lib/captainDelta/infinity/academy/microDebrief";
import { buildMissionContextBrief } from "@/lib/captainDelta/infinity/academy/missionBriefing";
import { buildMissionContext, pickDailyMission } from "@/lib/captainDelta/infinity/academy/missionGenerator";
import { buildStudyPlan, persistStudyPlan } from "@/lib/captainDelta/infinity/academy/studyPlan";
import { buildTrainingDayBriefing } from "@/lib/captainDelta/infinity/academy/trainingDay";
import { buildCaptainMentorProfile } from "@/lib/captainDelta/infinity/mentorProfile";
import { buildCaptainStudentModel } from "@/lib/captainDelta/infinity/studentModel";
import { getCaptainLessonMemory, patchCaptainLessonMemory, rememberCaptainLesson } from "@/lib/captainDelta/infinity/lessonMemory";
import { resetCaptainLessonMemoryForTests, respondAsCaptainInstructor } from "@/lib/captainDelta/infinity/respond";

vi.mock("@/lib/studyTime", () => ({
  todayKey: () => "2026-07-06",
  loadStudyPlanMode: () => "standard",
  STUDY_DAILY_GOAL_MINUTES: 18,
  STUDY_INTENSE_DAY_MINUTES: 45,
}));

vi.mock("@/lib/dailyMission", () => ({
  getDailyMissionSummary: () => ({
    examLabel: "23C",
    wordMission: { complete: false },
    part1: { complete: false },
    part2: { complete: false },
    recall: { complete: false },
    simulate: { complete: false },
    debrief: { complete: false },
    simulateRequired: false,
    complete: false,
    completedSections: 0,
    totalSections: 5,
  }),
  getNextMissionAction: () => null,
}));

function emptyStore(): CaptainDeltaMemoryStore {
  return {
    version: 1,
    questionHistory: {},
    confidenceLog: [],
    learningStyle: { speaking: 3, listening: 1, shadowing: 2, pictures: 0, keywords: 1 },
    preferredMode: "speaking",
    aviationStories: [],
    connectorUsage: {},
    vocabularyRepeats: {},
    grammarMistakes: {},
    wordJourney: {},
    flightLog: [],
    sessionDates: [],
    lastSessionCloseAt: null,
    lastWeeklyDebriefAt: null,
    bestAnswers: [],
    estimatedIcaoHistory: [],
  };
}

describe("Captain Delta V6 — Living Flight Academy", () => {
  beforeEach(() => resetCaptainLessonMemoryForTests());

  it("opens training day with blocks and estimated flight time", () => {
    const day = buildTrainingDayBriefing("Gustavo", { surface: "full" });
    expect(day.text).toMatch(/Gustavo/);
    expect(day.text).toMatch(/Word Mission/);
    expect(day.text).toMatch(/Estimated flight time: 18 minutes/);
    expect(day.text).toMatch(/Ready\?/);
  });

  it("mission briefing uses sortie context for heading", () => {
    const brief = buildMissionContextBrief("heading");
    expect(brief.message).toMatch(/Today we're flying/i);
    expect(brief.message).toMatch(/heading/i);
    expect(brief.message).not.toMatch(/Today's word is heading/i);
  });

  it("generates career-aligned missions", () => {
    const scenic = pickDailyMission({
      role: "tourism pilot",
      aircraft: "H130",
      hours: 2000,
      aircraftType: "helicopter",
      operationType: "scenic tourism",
    });
    expect(scenic).toBe("scenic");
  });

  it("live adaptation eases when student struggles", () => {
    rememberCaptainLesson({ currentWord: "heading" });
    patchCaptainLessonMemory({ consecutiveSameMistake: 2 });
    const memory = getCaptainLessonMemory()!;
    const model = buildCaptainStudentModel(memory, { consecutiveSameFocus: 2 });
    const plan = planLiveAdaptation(model, memory);
    expect(plan.state).toBe("ease");
    expect(plan.postponeHardContent).toBe(true);
  });

  it("ATC mode replaces instructor with Tower line", () => {
    const mentor = buildCaptainMentorProfile({ examDaysRemaining: 30 });
    const role = pickInstructorRole("atc", mentor);
    expect(role).toBe("atc");
    const line = applyInstructorRole("Say heading.", "Say heading.", "atc", "heading", "ABC123", "atc");
    expect(line.message).toContain("Tower:");
    expect(line.message).toMatch(/Your turn/i);
  });

  it("examiner mode under exam timeline", () => {
    const mentor = buildCaptainMentorProfile({ examDaysRemaining: 5 });
    expect(pickInstructorRole("icao_answer", mentor)).toBe("examiner");
    expect(pickInstructorRole("icao_answer", buildCaptainMentorProfile({ examDaysRemaining: 30 }))).toBe(
      "instructor",
    );
  });

  it("challenge engine pushes after success", () => {
    rememberCaptainLesson({ currentWord: "climb" });
    const memory = getCaptainLessonMemory()!;
    const model = buildCaptainStudentModel(memory, { lastAttemptSucceeded: true, wordMastered: true });
    const challenge = pickChallenge(model, "instructor", "push", "climb");
    expect(challenge).toMatch(/Challenge/);
  });

  it("career mode shifts HEMS focus", () => {
    const mentor = buildCaptainMentorProfile({});
    const focus = buildCareerFocus(
      {
        role: "HEMS pilot",
        aircraft: "EC135",
        hours: 3000,
        aircraftType: "helicopter",
        operationType: "HEMS",
      },
      mentor,
    );
    expect(focus.missionKind).toBe("ems");
    expect(focus.standardLevel).toBeGreaterThanOrEqual(5);
  });

  it("micro debrief stays short", () => {
    const mentor = buildCaptainMentorProfile({});
    const debrief = buildMicroDebrief({
      word: "heading",
      focus: "fluency",
      succeeded: true,
      mentorProfile: mentor,
    });
    expect(debrief.message.split(".").length).toBeLessThanOrEqual(4);
    expect(debrief.message).toMatch(/Tomorrow:/);
    expect(debrief.speechText.length).toBeLessThan(200);
  });

  it("persists silent study plan", () => {
    const mentor = buildCaptainMentorProfile({});
    const plan = buildStudyPlan(mentor, { lastWord: "engine", lastFocus: "prosody", succeeded: false });
    const store = persistStudyPlan(plan, emptyStore());
    expect(store.academyStudyPlan?.todayPriorities.length).toBeGreaterThan(0);
    expect(store.academyStudyPlan?.weakTopics.length).toBeGreaterThan(0);
  });

  it("rejects generic praise", () => {
    expect(rejectGenericPraise("Good job.")).toBe(true);
    expect(specificProgressPraise("heading", "radio rhythm")).toMatch(/much more naturally/);
  });

  it("adaptive debrief uses micro debrief", () => {
    const result = applyAdaptiveDebrief(
      { message: "Nice work.", speechText: "Nice work." },
      {
        targetWord: "heading",
        referenceText: "heading",
        practiceLevel: 1,
        focus: "strong",
        missionPass: true,
        mentorStore: emptyStore(),
      },
    );
    expect(result.message).toMatch(/Tomorrow:/);
    expect(result.message).not.toMatch(/Post-flight debrief/i);
  });

  it("Ask Captain uses academy ATC mode on phraseology", () => {
    rememberCaptainLesson({ currentWord: "heading", referenceText: "fly heading zero nine zero", practiceLevel: 2 });
    const response = respondAsCaptainInstructor({
      question: "How do I say this to Tower?",
      currentWord: "heading",
      referenceText: "fly heading zero nine zero",
      practiceLevel: 2,
      intent: "phraseology",
      studentHints: { examDaysRemaining: 30, callsign: "ABC123" },
    });
    expect(response.message).toMatch(/Tower:|Your turn/i);
  });

  it("applyAcademyMode eases on frustration without breaking coaching intents", () => {
    rememberCaptainLesson({ currentWord: "engine" });
    patchCaptainLessonMemory({ consecutiveSameMistake: 3 });
    const memory = getCaptainLessonMemory()!;
    const model = buildCaptainStudentModel(memory, { consecutiveSameFocus: 3 });
    const mentor = buildCaptainMentorProfile({});
    const result = applyAcademyMode(
      "Focus on EN-gine stress.",
      "Focus on EN-gine stress.",
      memory,
      "stress_help",
      model,
      mentor,
    );
    expect(result.message).toMatch(/pause|time|one word/i);
  });
});
