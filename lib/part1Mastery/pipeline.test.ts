import { describe, expect, it } from "vitest";
import { resolvePart1PipelineStep } from "@/lib/part1Mastery/pipeline";

describe("resolvePart1PipelineStep", () => {
  it("starts at brief for a fresh card", () => {
    expect(
      resolvePart1PipelineStep({
        cardNum: "01",
        study: { briefSeen: false, anchorDone: false, keywordsDone: false },
        missionCard: { cardNum: "01", shadowDone: false, coachDone: false },
      }),
    ).toBe("brief");
  });

  it("honours mission deep links to shadow and coach", () => {
    expect(
      resolvePart1PipelineStep({
        cardNum: "01",
        forceShadow: true,
        study: { briefSeen: true, anchorDone: true, keywordsDone: false },
      }),
    ).toBe("shadow");

    expect(
      resolvePart1PipelineStep({
        cardNum: "01",
        forceCoach: true,
        study: { briefSeen: true, anchorDone: true, keywordsDone: true },
      }),
    ).toBe("coach");
  });

  it("moves to keywords after shadow objective met", () => {
    expect(
      resolvePart1PipelineStep({
        cardNum: "01",
        study: { briefSeen: true, anchorDone: true, keywordsDone: false },
        missionCard: { cardNum: "01", shadowDone: true, coachDone: false },
      }),
    ).toBe("keywords");
  });
});
