import { beforeEach, describe, expect, it, vi } from "vitest";

type StudyMode = "standard" | "intense";

const state = {
  mode: "standard" as StudyMode,
  pronMission: {
    words: ["alpha", "bravo", "charlie", "delta", "echo"],
    completedWords: [] as string[],
  },
  pronProgress: { done: 0, total: 5, complete: false, currentWord: "alpha" as string | null },
  vocabMission: {
    termIds: ["t1", "t2", "t3"],
    completedIds: [] as string[],
  },
  vocabProgress: {
    done: 0,
    total: 20,
    complete: false,
    currentId: "t1" as string | null,
    examVersion: "23C" as const,
  },
  part1Mission: {
    cards: [
      { cardNum: "1", shadowDone: false, coachDone: false },
      { cardNum: "2", shadowDone: false, coachDone: false },
      { cardNum: "3", shadowDone: false, coachDone: false },
    ],
  },
  part1Progress: { complete: false, bothDone: 0, total: 3 },
  part2Mission: { simulationDone: false, examVersion: "23C" },
  part2Progress: { complete: false, done: 0, total: 1 },
  recall: { done: 0, total: 10, complete: false, confidenceStars: 0 },
  simulate: { done: 0, total: 1, complete: false },
  debrief: { done: 0, total: 1, complete: false },
};

vi.mock("@/lib/studyTime", () => ({
  loadStudyPlanMode: () => state.mode,
}));

vi.mock("@/lib/dailyExamRotation", () => ({
  todayExamLabel: () => "Prova 23C",
}));

vi.mock("@/lib/pronunciationDailyMission", () => ({
  getOrCreatePronunciationDailyMission: () => ({
    date: "2026-07-05",
    words: state.pronMission.words,
    completedWords: state.pronMission.completedWords,
  }),
  pronunciationDailyMissionProgress: () => state.pronProgress,
  pronunciationMissionLink: (word?: string) =>
    `/word-mission${word ? `?word=${encodeURIComponent(word)}` : ""}`,
}));

vi.mock("@/lib/wordMission/wordDailyMission", () => ({
  getOrCreateWordDailyMission: () => ({
    date: "2026-07-05",
    examVersion: "23C",
    termIds: state.vocabMission.termIds,
    completedIds: state.vocabMission.completedIds,
  }),
  wordDailyMissionProgress: () => state.vocabProgress,
  wordMissionLink: (id: string) => `/word-mission?term=${id}`,
}));

vi.mock("@/lib/vocabDailyMission", () => ({
  getOrCreateVocabDailyMission: () => ({
    date: "2026-07-05",
    examVersion: "23C",
    termIds: state.vocabMission.termIds,
    completedIds: state.vocabMission.completedIds,
  }),
  vocabDailyMissionProgress: () => state.vocabProgress,
  vocabMissionLink: (id: string) => `/word-mission?term=${id}`,
}));

vi.mock("@/lib/part1DailyMission", () => ({
  getOrCreatePart1DailyMission: () => ({
    date: "2026-07-05",
    examVersion: "23C",
    cards: state.part1Mission.cards,
  }),
  part1DailyMissionProgress: () => state.part1Progress,
  part1CardPeelProgress: () => ({ done: 0, total: 4 }),
  part1MissionLink: (num: string, mode: string) => `/part1?card=${num}&mode=${mode}`,
}));

vi.mock("@/lib/part2DailyMission", () => ({
  getOrCreatePart2DailyMission: () => ({
    date: "2026-07-05",
    examVersion: "23C",
    simulationDone: state.part2Mission.simulationDone,
  }),
  part2DailyMissionProgress: () => state.part2Progress,
  part2MissionLink: () => "/part2?mode=simulation",
}));

vi.mock("@/lib/simulateDailyMission", () => ({
  isSimulateMissionRequired: (mode?: StudyMode) => (mode ?? state.mode) === "intense",
  isSimulateMissionDone: () => state.simulate.complete,
  simulateMissionProgress: () => state.simulate,
  getSimuladoIcaoHref: () => "/simulado?exam=23c",
}));

vi.mock("@/lib/missionRecall/missionRecallProgress", () => ({
  isMissionRecallComplete: () => state.recall.complete,
  missionRecallProgress: () => state.recall,
  missionRecallLink: () => "/mission-recall",
}));

vi.mock("@/lib/flightDebrief/buildFlightDebrief", () => ({
  isFlightDebriefAvailable: () => {
    const base =
      state.vocabProgress.complete &&
      state.part1Progress.complete &&
      state.part2Progress.complete;
    if (!base || !state.recall.complete) return false;
    if (state.mode === "intense" && !state.simulate.complete) return false;
    return true;
  },
}));

vi.mock("@/lib/flightDebrief/flightDebriefProgress", () => ({
  isFlightDebriefComplete: () => state.debrief.complete,
  flightDebriefProgress: () => state.debrief,
  flightDebriefLink: () => "/flight-debrief",
}));

import {
  getDailyMissionSummary,
  getNextMissionAction,
  isDailyMissionComplete,
} from "@/lib/dailyMission";

function completeBaseLegs() {
  state.pronMission.completedWords = state.pronMission.words.map((w) => w.toLowerCase());
  state.pronProgress = { done: 5, total: 5, complete: true, currentWord: null };
  state.vocabMission.completedIds = [...state.vocabMission.termIds];
  state.vocabProgress = {
    done: 20,
    total: 20,
    complete: true,
    currentId: null,
    examVersion: "23C",
  };
  state.part1Progress = { complete: true, bothDone: 3, total: 3 };
  state.part2Progress = { complete: true, done: 1, total: 1 };
  state.part2Mission.simulationDone = true;
  state.part1Mission.cards = state.part1Mission.cards.map((c) => ({
    ...c,
    shadowDone: true,
    coachDone: true,
  }));
}

function resetState() {
  state.mode = "standard";
  state.pronMission.completedWords = [];
  state.pronProgress = { done: 0, total: 5, complete: false, currentWord: "alpha" };
  state.vocabMission.completedIds = [];
  state.vocabProgress = {
    done: 0,
    total: 20,
    complete: false,
    currentId: "t1",
    examVersion: "23C",
  };
  state.part1Mission.cards = [
    { cardNum: "1", shadowDone: false, coachDone: false },
    { cardNum: "2", shadowDone: false, coachDone: false },
    { cardNum: "3", shadowDone: false, coachDone: false },
  ];
  state.part1Progress = { complete: false, bothDone: 0, total: 3 };
  state.part2Mission.simulationDone = false;
  state.part2Progress = { complete: false, done: 0, total: 1 };
  state.recall = { done: 0, total: 10, complete: false, confidenceStars: 0 };
  state.simulate = { done: 0, total: 1, complete: false };
  state.debrief = { done: 0, total: 1, complete: false };
}

describe("getDailyMissionSummary", () => {
  beforeEach(resetState);

  it("standard mode counts five sections (word mission + recall + debrief, no simulate)", () => {
    const summary = getDailyMissionSummary();
    expect(summary.simulateRequired).toBe(false);
    expect(summary.totalSections).toBe(5);
    expect(summary.examLabel).toBe("Prova 23C");
    expect(summary.complete).toBe(false);
    expect(summary.wordMission).toEqual(state.vocabProgress);
  });

  it("intense mode includes simulate as sixth section before debrief", () => {
    state.mode = "intense";
    const summary = getDailyMissionSummary();
    expect(summary.simulateRequired).toBe(true);
    expect(summary.totalSections).toBe(6);
  });

  it("reports incomplete mission progress", () => {
    state.vocabProgress = {
      done: 2,
      total: 20,
      complete: false,
      currentId: "t2",
      examVersion: "23C",
    };
    const summary = getDailyMissionSummary();
    expect(summary.complete).toBe(false);
    expect(summary.completedSections).toBe(0);
  });

  it("reports completed mission when all legs and debrief are done (standard)", () => {
    completeBaseLegs();
    state.recall = { done: 10, total: 10, complete: true, confidenceStars: 4 };
    state.debrief = { done: 1, total: 1, complete: true };
    const summary = getDailyMissionSummary();
    expect(summary.complete).toBe(true);
    expect(summary.completedSections).toBe(5);
  });
});

describe("getNextMissionAction", () => {
  beforeEach(resetState);

  it("returns word mission as first leg", () => {
    const next = getNextMissionAction();
    expect(next).not.toBeNull();
    expect(next!.href).toContain("/word-mission");
    expect(next!.title).toContain("Word Mission");
  });

  it("returns mission recall after base legs are complete", () => {
    completeBaseLegs();
    const next = getNextMissionAction();
    expect(next!.href).toContain("/mission-recall");
    expect(next!.title).toContain("Mission Recall");
  });

  it("intense mode blocks mock until recall is complete", () => {
    state.mode = "intense";
    completeBaseLegs();
    const next = getNextMissionAction();
    expect(next!.href).toContain("/mission-recall");
    expect(next!.href).not.toContain("/simulado");
  });

  it("returns simulado in intense mode after recall is complete", () => {
    state.mode = "intense";
    completeBaseLegs();
    state.recall = { done: 10, total: 10, complete: true, confidenceStars: 4 };
    const next = getNextMissionAction();
    expect(next!.href).toContain("/simulado");
  });

  it("returns flight debrief after required legs in standard mode", () => {
    completeBaseLegs();
    state.recall = { done: 10, total: 10, complete: true, confidenceStars: 4 };
    const next = getNextMissionAction();
    expect(next!.href).toContain("/flight-debrief");
    expect(next!.title).toContain("Flight Debrief");
  });

  it("returns null only after debrief is complete", () => {
    completeBaseLegs();
    state.recall = { done: 10, total: 10, complete: true, confidenceStars: 4 };
    state.debrief = { done: 1, total: 1, complete: true };
    expect(getNextMissionAction()).toBeNull();
    expect(isDailyMissionComplete()).toBe(true);
  });

  it("mission is not complete without debrief", () => {
    completeBaseLegs();
    state.recall = { done: 10, total: 10, complete: true, confidenceStars: 4 };
    expect(isDailyMissionComplete()).toBe(false);
  });
});
