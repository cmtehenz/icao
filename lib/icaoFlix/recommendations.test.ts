import { describe, expect, it } from "vitest";
import { ICAO_FLIX_VIDEOS, getVideosForPart1Card } from "@/data/icaoFlix/catalog";
import type { DifficultyInsight } from "@/lib/difficultyInsights";
import {
  buildIcaoFlixRecommendations,
  pinnedRecommendations,
} from "@/lib/icaoFlix/recommendations";
import type { IcaoFlixProgress } from "@/lib/icaoFlix/progress";

const emptyProgress: IcaoFlixProgress = { watchedVideoIds: [], lastWatchedAt: null };

describe("ICAOFlix catalog", () => {
  it("has curated videos from Part 1 briefs", () => {
    expect(ICAO_FLIX_VIDEOS.length).toBeGreaterThanOrEqual(30);
  });

  it("includes EuroSafety Training channel videos", () => {
    const euro = ICAO_FLIX_VIDEOS.filter((v) => v.source === "EuroSafety Training");
    expect(euro.length).toBeGreaterThanOrEqual(10);
    expect(euro.some((v) => v.youtubeId === "SznLydO9DTE")).toBe(true);
  });

  it("dedupes shared youtube ids across cards", () => {
    const phraseology = ICAO_FLIX_VIDEOS.find((v) => v.youtubeId === "1D8-_p4f34I");
    expect(phraseology?.links.part1Cards).toContain("05");
    expect(phraseology?.links.part1Cards).toContain("07");
  });

  it("returns videos for Part 1 card 01", () => {
    const videos = getVideosForPart1Card("01");
    expect(videos.length).toBeGreaterThanOrEqual(2);
    expect(videos.every((v) => v.links.part1Cards?.includes("01"))).toBe(true);
  });

  it("fills personal, airports, future and general categories", () => {
    for (const category of ["personal", "airports", "future", "general"] as const) {
      const count = ICAO_FLIX_VIDEOS.filter((v) => v.category === category).length;
      expect(count).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("buildIcaoFlixRecommendations", () => {
  it("recommends Part 1 card-linked videos for weak cards", () => {
    const insights: DifficultyInsight[] = [
      {
        area: "part1",
        label: "Part 1",
        score: 40,
        items: [{ id: "03", label: "Q03", score: 35 }],
      },
    ];

    const recs = buildIcaoFlixRecommendations(insights, emptyProgress, 6);
    expect(recs.length).toBeGreaterThan(0);
    expect(recs.some((r) => r.video.links.part1Cards?.includes("03"))).toBe(true);
    expect(recs.every((r) => r.pinned)).toBe(true);
  });

  it("unpins recommendations after video is watched", () => {
    const insights: DifficultyInsight[] = [
      {
        area: "part1",
        label: "Part 1",
        score: 40,
        items: [{ id: "01", label: "Q01", score: 30 }],
      },
    ];

    const first = buildIcaoFlixRecommendations(insights, emptyProgress, 3);
    expect(first.length).toBeGreaterThan(0);

    const watched: IcaoFlixProgress = {
      watchedVideoIds: first.map((r) => r.video.id),
      lastWatchedAt: null,
    };
    const second = buildIcaoFlixRecommendations(insights, watched, 3);
    expect(pinnedRecommendations(second)).toHaveLength(0);
  });

  it("recommends phraseology videos for weak Part 2", () => {
    const insights: DifficultyInsight[] = [
      {
        area: "part2",
        label: "Part 2",
        score: 35,
        items: [{ id: "23C-s2-int", label: "Interaction · Manaus", score: 30 }],
      },
    ];

    const recs = buildIcaoFlixRecommendations(insights, emptyProgress, 6);
    expect(recs.length).toBeGreaterThan(0);
    expect(
      recs.some(
        (r) =>
          r.video.tags.includes("phraseology") ||
          r.video.tags.includes("crm") ||
          r.video.links.difficultyAreas?.includes("part2"),
      ),
    ).toBe(true);
  });

  it("recommends vocabulary-tagged videos for weak vocabulary", () => {
    const insights: DifficultyInsight[] = [
      {
        area: "vocabulary",
        label: "Vocabulário",
        score: 30,
        items: [{ id: "term-1", label: "squawk", score: 25 }],
      },
    ];

    const recs = buildIcaoFlixRecommendations(insights, emptyProgress, 4);
    expect(recs.length).toBeGreaterThan(0);
    expect(recs.some((r) => r.video.links.difficultyAreas?.includes("vocabulary"))).toBe(true);
  });
});
