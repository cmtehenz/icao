import { describe, expect, it, vi } from "vitest";
import { buildFlightDebrief } from "@/lib/flightDebrief/buildFlightDebrief";

vi.mock("@/lib/studyTime", () => ({
  todayKey: () => "2026-07-05",
  loadStudyPlanMode: () => "standard",
}));

vi.mock("@/lib/dailyExamRotation", () => ({
  todayExamLabel: () => "Prova 23C",
}));

vi.mock("@/lib/pronunciationDailyMission", () => ({
  getOrCreatePronunciationDailyMission: () => ({ words: [], completedWords: [], date: "2026-07-05" }),
  pronunciationDailyMissionProgress: () => ({ done: 5, total: 5, complete: true, currentWord: null }),
}));

vi.mock("@/lib/vocabDailyMission", () => ({
  getOrCreateVocabDailyMission: () => ({
    date: "2026-07-05",
    termIds: [],
    completedIds: [],
    examVersion: "23C",
  }),
  vocabDailyMissionProgress: () => ({ done: 20, total: 20, complete: true }),
}));

vi.mock("@/lib/part1DailyMission", () => ({
  getOrCreatePart1DailyMission: () => ({ date: "2026-07-05", cards: [], examVersion: "23C" }),
  part1DailyMissionProgress: () => ({ complete: true, bothDone: 3, total: 3 }),
}));

vi.mock("@/lib/part2DailyMission", () => ({
  getOrCreatePart2DailyMission: () => ({
    date: "2026-07-05",
    simulationDone: true,
    examVersion: "23C",
  }),
  part2DailyMissionProgress: () => ({ complete: true, done: 1, total: 1 }),
}));

vi.mock("@/lib/missionRecall/missionRecallProgress", () => ({
  missionRecallProgress: () => ({ done: 10, total: 10, complete: true, confidenceStars: 4 }),
  loadMissionRecallState: () => ({
    date: "2026-07-05",
    itemIds: ["a"],
    answeredIds: ["a"],
    answers: {
      a: {
        itemId: "a",
        transcript: "test answer",
        answeredAt: "2026-07-05T10:00:00Z",
        method: "speech",
        answered: true,
      },
    },
    complete: true,
    confidenceStars: 4,
  }),
}));

vi.mock("@/lib/simulateDailyMission", () => ({
  isSimulateMissionRequired: () => false,
  isSimulateMissionDone: () => false,
  simulateMissionProgress: () => ({ done: 0, total: 1, complete: false }),
}));

vi.mock("@/lib/difficultyInsights", () => ({
  buildDifficultyInsights: () => [
    {
      area: "part2",
      label: "Part 2",
      score: 62,
      hint: "Sharpen readback clarity on altitude assignments.",
      items: [{ id: "p2", label: "Readback altitude", score: 62 }],
    },
  ],
}));

vi.mock("@/lib/vocabMission", () => ({
  buildVocabMissionDebrief: () => ({
    completedTerms: 20,
    totalTerms: 20,
    weakTerms: ["turbulence"],
    strongTerms: ["engine failure"],
    averageBestScore: 82,
    nextFocus: "engine failure — VB 2/4 remaining today.",
  }),
}));

describe("buildFlightDebrief", () => {
  it("builds summary from daily mission state", () => {
    const debrief = buildFlightDebrief("2026-07-05");
    expect(debrief.examLabel).toBe("Prova 23C");
    expect(debrief.legs.length).toBeGreaterThanOrEqual(5);
    expect(debrief.legs.find((l) => l.id === "pronunciation")?.complete).toBe(true);
    expect(debrief.legs.find((l) => l.id === "recall")?.complete).toBe(true);
  });

  it("creates one priority recommendation", () => {
    const debrief = buildFlightDebrief("2026-07-05");
    expect(debrief.priorityImprovement.length).toBeGreaterThan(10);
    expect(debrief.nextAction.length).toBeGreaterThan(5);
    expect(debrief.tomorrowFocus).toContain("Tomorrow");
    expect(debrief.strongestArea.length).toBeGreaterThan(5);
    expect(debrief.weakestArea.length).toBeGreaterThan(5);
    expect(debrief.recallResult).toContain("10/10");
  });
});
