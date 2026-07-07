import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CaptainDeltaMemoryStore } from "@/lib/captainDelta/memory/types";
import { applyAdaptiveDebrief } from "@/lib/captainDelta/infinity/adaptiveDebrief";
import {
  buildLessonClosingSummary,
  recordSessionWin,
} from "@/lib/captainDelta/infinity/learningJournal";
import {
  applyMentorPersonalization,
  mentorJourneyOpener,
} from "@/lib/captainDelta/infinity/mentorEnhance";
import { buildCaptainMentorProfile, operationExamplePrefix } from "@/lib/captainDelta/infinity/mentorProfile";
import { respondAsCaptainInstructor, resetCaptainLessonMemoryForTests } from "@/lib/captainDelta/infinity/respond";
import {
  progressRecognitionLine,
  recordWordMentorOutcome,
  wordImprovedSinceYesterday,
} from "@/lib/captainDelta/infinity/wordJourney";
import { rememberCaptainLesson } from "@/lib/captainDelta/infinity/lessonMemory";

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
    vocabularyRepeats: { descend: 4 },
    grammarMistakes: {},
    wordJourney: {},
    sessionDates: ["2026-07-05", "2026-07-06"],
    lastSessionCloseAt: null,
    lastWeeklyDebriefAt: null,
    bestAnswers: [],
    estimatedIcaoHistory: [
      { date: "2026-07-04", level: 3.5 },
      { date: "2026-07-06", level: 4 },
    ],
  };
}

describe("Captain Delta V4 — word journey", () => {
  it("recognizes improvement since yesterday", () => {
    const store = recordWordMentorOutcome(
      "engine",
      "success",
      undefined,
      {
        ...emptyStore(),
        wordJourney: {
          engine: { lastStruggledDate: "2026-07-05", struggleCount: 2 },
        },
      },
    );
    expect(wordImprovedSinceYesterday("engine", store)).toBe(true);
    expect(progressRecognitionLine("engine", true, store)).toMatch(/Yesterday.*engine.*Today/i);
  });
});

describe("Captain Delta V4 — mentor profile", () => {
  it("detects EMS and offshore operation context", () => {
    const ems = buildCaptainMentorProfile({
      memoryStore: emptyStore(),
      pilotProfile: {
        role: "EMS pilot",
        aircraft: "H145",
        hours: 2000,
        aircraftType: "helicopter",
        operationType: "HEMS medevac",
      },
      examDaysRemaining: 10,
    });
    expect(ems.operationContext).toBe("ems");
    expect(ems.examSimulation).toBe(true);

    const offshore = buildCaptainMentorProfile({
      memoryStore: emptyStore(),
      pilotProfile: {
        role: "offshore pilot",
        aircraft: "S92",
        hours: 5000,
        aircraftType: "helicopter",
        operationType: "offshore oil rig",
      },
    });
    expect(offshore.operationContext).toBe("offshore");
    expect(operationExamplePrefix("offshore")).toMatch(/Offshore/i);
  });

  it("recommends smart review word from journey", () => {
    const store = {
      ...emptyStore(),
      wordJourney: {
        climb: { struggleCount: 3, lastStruggledDate: "2026-07-05" },
        engine: { struggleCount: 0, lastSuccessDate: "2026-07-06" },
      },
    };
    const profile = buildCaptainMentorProfile({
      memoryStore: store,
      vaultWords: [{ word: "engine", status: "graduated" } as import("@/lib/pronunciationVault").VaultWord],
      currentWord: "engine",
    });
    expect(profile.smartReviewWord).toBe("climb");
    expect(profile.masteredWords).toContain("engine");
  });
});

describe("Captain Delta V4 — mentor conversation", () => {
  beforeEach(() => resetCaptainLessonMemoryForTests());

  it("relates rhythm question to student journey", () => {
    const profile = buildCaptainMentorProfile({
      memoryStore: emptyStore(),
      currentWord: "engine",
    });
    profile.progressTrend = "up";
    const opener = mentorJourneyOpener(profile, "engine", "rhythm_help");
    expect(opener).toMatch(/rhythm.*improving/i);

    const memory = rememberCaptainLesson({
      currentWord: "engine",
      referenceText: "Check the engine before departure.",
    });
    const personalized = applyMentorPersonalization(
      "Try speaking the whole sentence in one breath.",
      "Try speaking the whole sentence in one breath.",
      profile,
      memory,
      "rhythm_help",
    );
    expect(personalized.message).toMatch(/rhythm.*improving/i);
  });

  it("Ask Captain includes mentor personalization", () => {
    const store = {
      ...emptyStore(),
      wordJourney: {
        engine: { lastStruggledDate: "2026-07-05", struggleCount: 2 },
      },
    };
    const response = respondAsCaptainInstructor({
      question: "How do I improve rhythm?",
      currentWord: "engine",
      referenceText: "Check the engine before departure.",
      studentHints: { mentorStore: store },
    });
    expect(response.message.toLowerCase()).toMatch(/rhythm|breath|engine/);
  });
});

describe("Captain Delta V4 — adaptive debrief mentor", () => {
  beforeEach(() => resetCaptainLessonMemoryForTests());

  it("celebrates real cross-session improvement", () => {
    const store = {
      ...emptyStore(),
      wordJourney: {
        engine: { lastStruggledDate: "2026-07-05", struggleCount: 2 },
      },
    };
    const result = applyAdaptiveDebrief(
      {
        message: "Nice work. Continue to the next word when you're ready.",
        speechText: "Nice work.",
      },
      {
        targetWord: "engine",
        referenceText: "Check the engine before departure.",
        practiceLevel: 3,
        focus: "strong",
        missionPass: true,
        mentorStore: store,
      },
    );
    expect(result.message).toMatch(/Yesterday.*engine|Excellent/i);
  });
});

describe("Captain Delta V4 — lesson closing", () => {
  it("never ends with generic lesson complete", () => {
    const store = recordSessionWin("rhythm on full sentences", {
      ...emptyStore(),
      sessionJournal: { date: "2026-07-06", wins: ["rhythm on full sentences"], struggles: [], reviewTopics: [] },
    });
    const profile = buildCaptainMentorProfile({ memoryStore: store, examDaysRemaining: 30 });
    const summary = buildLessonClosingSummary(profile, store);
    expect(summary.todayLine).toMatch(/Today you improved/i);
    expect(summary.tomorrowLine).toMatch(/Tomorrow we'll/i);
    expect(summary.practiceLine).not.toMatch(/Lesson complete/i);
  });
});
