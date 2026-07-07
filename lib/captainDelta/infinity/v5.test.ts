import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CaptainDeltaMemoryStore } from "@/lib/captainDelta/memory/types";
import { applyAdaptiveDebrief } from "@/lib/captainDelta/infinity/adaptiveDebrief";
import { buildPreflightBrief, buildMissionBrief } from "@/lib/captainDelta/infinity/flight/flightBriefing";
import { buildPostFlightDebrief } from "@/lib/captainDelta/infinity/flight/flightDebrief";
import {
  formatFlightLogEntry,
  missionHistoryLine,
  recordFlightLogEntry,
} from "@/lib/captainDelta/infinity/flight/flightLog";
import { getExamTrainingPhase } from "@/lib/captainDelta/infinity/flight/examPhase";
import { applyFlightInstructorMode } from "@/lib/captainDelta/infinity/flight/flightInstructor";
import { buildSituationalExercise } from "@/lib/captainDelta/infinity/flight/situationalTeaching";
import { buildCaptainMentorProfile } from "@/lib/captainDelta/infinity/mentorProfile";
import { getCaptainLessonMemory, rememberCaptainLesson } from "@/lib/captainDelta/infinity/lessonMemory";
import { resetCaptainLessonMemoryForTests, respondAsCaptainInstructor } from "@/lib/captainDelta/infinity/respond";

vi.mock("@/lib/studyTime", () => ({
  todayKey: () => "2026-07-06",
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

describe("Captain Delta V5 — flight instructor", () => {
  beforeEach(() => resetCaptainLessonMemoryForTests());

  it("opens with preflight brief", () => {
    const brief = buildPreflightBrief({ word: "climb" });
    expect(brief.message).toMatch(/Today's objective/i);
    expect(brief.message).toMatch(/Ready\?/);
    expect(brief.message).toMatch(/climb|radio communication/i);
  });

  it("mission brief explains why for heading", () => {
    const brief = buildMissionBrief("heading");
    expect(brief.message).toContain("heading changes");
    expect(brief.message).toContain("heading");
  });

  it("builds situational tower exercise", () => {
    const exercise = buildSituationalExercise("heading", "ABC123", "helicopter", "teaching");
    expect(exercise).toContain("Tower:");
    expect(exercise).toContain("zero nine zero");
    expect(exercise).toMatch(/read back|What would/i);
  });

  it("exam phases follow 30/15/7/2 timeline", () => {
    expect(getExamTrainingPhase(30)).toBe("teaching");
    expect(getExamTrainingPhase(15)).toBe("simulation");
    expect(getExamTrainingPhase(7)).toBe("exam");
    expect(getExamTrainingPhase(2)).toBe("confidence");
  });

  it("records flight log entries", () => {
    const store = recordFlightLogEntry(
      {
        missionWord: "heading",
        completed: true,
        difficulty: "medium",
        improvement: "Stress",
        nextFocus: "Radio rhythm",
      },
      emptyStore(),
    );
    expect(store.flightLog).toHaveLength(1);
    expect(store.flightLog![0].flightNumber).toBe(1);
    expect(formatFlightLogEntry(store.flightLog![0])).toContain("Flight 1");
    expect(formatFlightLogEntry(store.flightLog![0])).toContain("heading");
  });

  it("mission history references last sortie", () => {
    const store = recordFlightLogEntry(
      {
        missionWord: "emergency",
        completed: true,
        difficulty: "hard",
        improvement: "Confidence",
        nextFocus: "Radio rhythm",
      },
      emptyStore(),
    );
    expect(missionHistoryLine(store)).toMatch(/emergency/i);
  });

  it("post-flight debrief avoids score-only feedback", () => {
    const profile = buildCaptainMentorProfile({ examDaysRemaining: 20 });
    const debrief = buildPostFlightDebrief({
      word: "climb",
      focus: "fluency",
      succeeded: true,
      mentorProfile: profile,
      priorMessage: "Nice work on climb.",
    });
    expect(debrief.message).toMatch(/Post-flight debrief|What improved|recommendation/i);
    expect(debrief.message).not.toMatch(/Accuracy score|Azure/i);
    expect(debrief.recommendation.length).toBeGreaterThan(10);
  });

  it("applyFlightInstructorMode uses situational teaching for ATC intent", () => {
    rememberCaptainLesson({ currentWord: "heading", referenceText: "heading", practiceLevel: 1 });
    const memory = getCaptainLessonMemory()!;
    const profile = buildCaptainMentorProfile({});
    const result = applyFlightInstructorMode(
      "Say heading clearly.",
      "Say heading.",
      memory,
      "atc",
      profile,
      { callsign: "ABC123" },
    );
    expect(result.message).toContain("Tower:");
    expect(result.message).toContain("zero nine zero");
  });

  it("adaptive debrief includes post-flight debrief on sortie completion", () => {
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
    expect(result.message).toMatch(/Tomorrow:|improved/i);
    expect(result.speechText.length).toBeGreaterThan(5);
  });

  it("Ask Captain applies flight instructor mode on phraseology", () => {
    rememberCaptainLesson({
      currentWord: "heading",
      referenceText: "fly heading zero nine zero",
      practiceLevel: 2,
    });
    const response = respondAsCaptainInstructor({
      question: "How do I say this on radio?",
      currentWord: "heading",
      referenceText: "fly heading zero nine zero",
      practiceLevel: 2,
      intent: "phraseology",
      studentHints: { callsign: "ABC123", examDaysRemaining: 10 },
    });
    expect(response.message).toMatch(/Tower:|heading|radio/i);
  });
});
