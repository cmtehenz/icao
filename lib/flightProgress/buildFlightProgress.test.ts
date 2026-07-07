import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DailyMissionSummary } from "@/lib/dailyMission";

type StudyMode = "standard" | "intense";

const mode = { value: "standard" as StudyMode };

vi.mock("@/lib/studyTime", () => ({
  loadStudyPlanMode: () => mode.value,
}));

import { buildFlightProgress } from "@/lib/flightProgress/buildFlightProgress";
import { detectCurrentPhaseId } from "@/lib/flightProgress/flightProgressStatus";

function baseSummary(overrides: Partial<DailyMissionSummary> = {}): DailyMissionSummary {
  return {
    examLabel: "Prova 23C",
    wordMission: { done: 0, total: 20, complete: false, currentId: "icao-01", examVersion: "23C" },
    part1: { complete: false, bothDone: 0, total: 3 },
    part2: { complete: false, done: 0, total: 1 },
    recall: { done: 0, total: 10, complete: false, confidenceStars: 0 },
    simulate: { done: 0, total: 1, complete: false },
    debrief: { done: 0, total: 1, complete: false },
    simulateRequired: mode.value === "intense",
    complete: false,
    completedSections: 0,
    totalSections: mode.value === "intense" ? 6 : 5,
    ...overrides,
  };
}

function completeBase(summary: DailyMissionSummary): DailyMissionSummary {
  return {
    ...summary,
    wordMission: { done: 20, total: 20, complete: true, currentId: null, examVersion: "23C" },
    part1: { complete: true, bothDone: 3, total: 3 },
    part2: { complete: true, done: 1, total: 1 },
  };
}

describe("buildFlightProgress", () => {
  beforeEach(() => {
    mode.value = "standard";
  });

  it("standard mode includes seven phases with mock marked optional", () => {
    const progress = buildFlightProgress(baseSummary());
    expect(progress.phases).toHaveLength(7);
    const mock = progress.phases.find((p) => p.id === "mock");
    expect(mock?.status).toBe("optional");
    expect(progress.mode).toBe("standard");
  });

  it("intense mode treats mock as required upcoming phase", () => {
    mode.value = "intense";
    const summary = completeBase(baseSummary({ simulateRequired: true }));
    summary.recall = { done: 10, total: 10, complete: true, confidenceStars: 4 };
    const progress = buildFlightProgress(summary);
    const mock = progress.phases.find((p) => p.id === "mock");
    expect(mock?.status).toBe("current");
    expect(progress.currentPhaseId).toBe("mock");
  });

  it("detects word mission as current at mission start", () => {
    const progress = buildFlightProgress(baseSummary());
    expect(detectCurrentPhaseId(baseSummary())).toBe("wordMission");
    expect(progress.currentPhaseId).toBe("wordMission");
    expect(progress.currentPhase.aviationLabel).toBe("ENGINE START");
    expect(progress.currentPhase.missionLabel).toBe("Word Mission");
    expect(progress.youAreHereLabel).toContain("ENGINE START");
  });

  it("detects recall phase after base legs complete", () => {
    const summary = completeBase(baseSummary());
    const progress = buildFlightProgress(summary);
    expect(progress.currentPhaseId).toBe("recall");
    expect(progress.currentPhase.aviationLabel).toBe("SYSTEMS CHECK");
  });

  it("detects debrief phase when recall is done (standard)", () => {
    const summary = completeBase(baseSummary());
    summary.recall = { done: 10, total: 10, complete: true, confidenceStars: 4 };
    const progress = buildFlightProgress(summary);
    expect(progress.currentPhaseId).toBe("debrief");
    expect(progress.currentPhase.aviationLabel).toBe("LANDING");
  });

  it("reports shutdown when mission is complete", () => {
    const summary = completeBase(
      baseSummary({
        recall: { done: 10, total: 10, complete: true, confidenceStars: 5 },
        debrief: { done: 1, total: 1, complete: true },
        complete: true,
        completedSections: 5,
      }),
    );
    const progress = buildFlightProgress(summary);
    expect(progress.missionComplete).toBe(true);
    expect(progress.currentPhaseId).toBe("shutdown");
    expect(progress.youAreHereLabel).toBe("Flight complete");
  });

  it("marks completed word mission before part1", () => {
    const summary = baseSummary({
      wordMission: { done: 20, total: 20, complete: true, currentId: null, examVersion: "23C" },
      part1: { complete: false, bothDone: 1, total: 3 },
    });
    const progress = buildFlightProgress(summary);
    expect(progress.phases.find((p) => p.id === "wordMission")?.status).toBe("completed");
    expect(progress.currentPhaseId).toBe("part1");
  });

  it("estimates remaining time when work remains", () => {
    const progress = buildFlightProgress(baseSummary());
    expect(progress.estimatedRemainingMinutes).not.toBeNull();
    expect(progress.estimatedRemainingMinutes!).toBeGreaterThan(0);
  });

  it("does not duplicate orchestration — uses summary flags only", () => {
    const summary = completeBase(baseSummary());
    summary.recall = { done: 10, total: 10, complete: true, confidenceStars: 4 };
    expect(detectCurrentPhaseId(summary)).toBe("debrief");
    expect(buildFlightProgress(summary).currentPhaseId).toBe("debrief");
  });
});
